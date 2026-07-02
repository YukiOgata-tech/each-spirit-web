"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { createServerClient, ES_CONTENT_CACHE_TAG } from "@/lib/supabase-server";
import { routes } from "@/lib/routes";
import { getRankingSection, type RankingItemRow } from "@/lib/admin-ranking-schema";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function list(formData: FormData, key: string) {
  return text(formData, key).split(/[\n,]/).map((v) => v.trim()).filter(Boolean);
}
function listFromText(input: string | undefined) {
  return String(input ?? "").split(/[\n,]/).map((v) => v.trim()).filter(Boolean);
}
function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

export async function saveRanking(formData: FormData) {
  await requireAdminUser();
  const service = createServerClient();

  const section = getRankingSection(text(formData, "schema_key"));
  if (!section) throw new Error("不明な section です");

  const id = text(formData, "id") || null;
  const slug = slugify(text(formData, "slug"));
  const title = text(formData, "title");
  const status = text(formData, "status") === "draft" ? "draft" : "published";
  const region = section.regionMode === "none" ? null : slugify(text(formData, "region")) || null;

  if (!slug || !title) throw new Error("slug と title は必須です");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("slug は英小文字・数字・ハイフンのみです");
  if (section.regionMode === "required" && !region) throw new Error("この section では地域(region)が必須です");

  // metadata（編集時は既存をマージして sources/faqs 等を保全。target は protein のみ）
  let baseMetadata: Record<string, unknown> = {};
  let previousSlug = "";
  let previousTarget = "";
  if (id) {
    const { data: existing } = await service.from("rankings").select("metadata, slug").eq("id", id).maybeSingle();
    baseMetadata = (existing?.metadata as Record<string, unknown>) ?? {};
    previousSlug = typeof existing?.slug === "string" ? existing.slug : "";
    previousTarget = typeof baseMetadata.target === "string" ? slugify(baseMetadata.target) : "";
  }
  const metadata = { ...baseMetadata };
  let target = "";
  if (section.hasTarget) {
    target = slugify(text(formData, "target"));
    if (!target) throw new Error("この section では target が必須です");
    if (target) metadata.target = target;
  }

  // slug 重複チェック（同一 major+section 内、編集時は自分を除外）
  const { data: dup } = await service
    .from("rankings").select("id")
    .eq("major_category", section.majorCategory).eq("section_slug", section.sectionSlug).eq("slug", slug);
  if ((dup ?? []).some((row) => row.id !== id)) throw new Error("この section に同じ slug のランキングが既に存在します");

  const sectionCanonical = routes.sectionRanking(section.majorCategory, section.sectionSlug, slug);
  const canonical = section.majorCategory === "health" && section.sectionSlug === "protein" && target
    ? routes.proteinRanking(target, slug)
    : sectionCanonical;
  const payload = {
    slug,
    major_category: section.majorCategory,
    section_slug: section.sectionSlug,
    canonical_path: canonical,
    region,
    title,
    image_url: text(formData, "image_url") || null,
    description: text(formData, "description"),
    conclusion: text(formData, "conclusion"),
    quick_table_label: text(formData, "quick_table_label"),
    criteria: list(formData, "criteria"),
    tags: list(formData, "tags"),
    status,
    last_updated_at: text(formData, "last_updated_at") || null,
    metadata,
  };

  // ranking 本体を upsert し ranking_id を確定
  let rankingId: string;
  if (id) {
    const { error } = await service.from("rankings").update(payload).eq("id", id);
    if (error) throw error;
    rankingId = id;
  } else {
    const { data, error } = await service.from("rankings").insert(payload).select("id").single();
    if (error) throw error;
    rankingId = data.id as string;
  }

  // ranking_items を入れ替え
  let rows: RankingItemRow[] = [];
  try {
    rows = JSON.parse(text(formData, "ranking_items_json") || "[]");
  } catch {
    rows = [];
  }
  rows = rows
    .filter((r) => r && (r.itemSlug || r.displayName))
    .map((r) => {
      const entryKind = r.entryKind === "manual" ? "manual" : "item";
      const displayName = String(r.displayName ?? "").trim();
      const itemSlug = slugify(String(r.itemSlug ?? "") || displayName || `entry-${r.rank}`);
      return {
        ...r,
        entryKind,
        itemSlug,
        displayName,
        description: String(r.description ?? ""),
        externalUrl: String(r.externalUrl ?? ""),
        imageUrl: String(r.imageUrl ?? ""),
        imageAlt: String(r.imageAlt ?? ""),
        priceRange: String(r.priceRange ?? ""),
        area: String(r.area ?? ""),
        tags: String(r.tags ?? ""),
        affiliateQuery: String(r.affiliateQuery ?? ""),
        reason: String(r.reason ?? ""),
      };
    });

  const slugs = rows.filter((r) => r.entryKind === "item").map((r) => r.itemSlug);
  const { data: itemRows } = await service
    .from("items").select("id, slug")
    .eq("major_category", section.majorCategory).eq("section_slug", section.sectionSlug)
    .in("slug", slugs.length ? slugs : ["__none__"]);
  const bySlug = new Map((itemRows ?? []).map((r) => [r.slug as string, r.id as string]));

  const insertRows = rows
    .filter((r) => r.entryKind === "manual" || bySlug.has(r.itemSlug))
    .filter((r) => r.entryKind === "item" || r.displayName.trim())
    .map((r, index) => ({
      ranking_id: rankingId,
      rank: Number(r.rank) || index + 1,
      item_slug: r.itemSlug,
      entry_kind: r.entryKind,
      item_id: r.entryKind === "item" ? bySlug.get(r.itemSlug)! : null,
      display_name: r.entryKind === "manual" ? r.displayName.trim() : null,
      description: r.entryKind === "manual" ? r.description.trim() || null : null,
      external_url: r.entryKind === "manual" ? r.externalUrl.trim() || null : null,
      image_url: r.entryKind === "manual" ? r.imageUrl.trim() || null : null,
      image_alt: r.entryKind === "manual" ? r.imageAlt.trim() || null : null,
      price_range: r.entryKind === "manual" ? r.priceRange.trim() || null : null,
      area: r.entryKind === "manual" ? r.area.trim() || null : null,
      tags: r.entryKind === "manual" ? listFromText(r.tags) : [],
      metadata: r.affiliateQuery.trim() ? { affiliate_query: r.affiliateQuery.trim() } : {},
      score: r.score === null || r.score === undefined || Number.isNaN(Number(r.score)) ? null : Number(r.score),
      reason: r.reason ?? "",
      is_pr: !!r.isPr,
    }));

  await service.from("ranking_items").delete().eq("ranking_id", rankingId);
  if (insertRows.length > 0) {
    const { error } = await service.from("ranking_items").insert(insertRows);
    if (error) throw error;
  }

  // コンテンツの Data Cache（es-content タグ・1か月）を即時無効化し、
  // 公開ページ・管理一覧・編集フォームに変更を反映する。
  revalidateTag(ES_CONTENT_CACHE_TAG);
  revalidatePath(canonical);
  if (sectionCanonical !== canonical) revalidatePath(sectionCanonical);
  if (section.majorCategory === "health" && section.sectionSlug === "protein" && previousTarget && previousSlug) {
    const previousCanonical = routes.proteinRanking(previousTarget, previousSlug);
    if (previousCanonical !== canonical) revalidatePath(previousCanonical);
  }
  revalidatePath("/" + section.majorCategory + "/" + section.sectionSlug);
  revalidatePath(routes.sectionRankings(section.majorCategory, section.sectionSlug));
  if (region) revalidatePath(routes.sectionRegion(section.majorCategory, section.sectionSlug, region));
  revalidatePath("/sitemap.xml");

  redirect(status === "published" ? canonical : routes.account);
}
