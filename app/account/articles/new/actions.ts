"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { createServerClient, ES_CONTENT_CACHE_TAG } from "@/lib/supabase-server";
import { routes } from "@/lib/routes";
import type { FAQ, RelatedLink, Source, SourceType } from "@/lib/types";

type ArticleStatus = "draft" | "published";

const majorCategories = new Set(["food", "health", "beauty", "travel", "leisure", "entertainment"]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string) {
  return text(formData, key)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function listAll(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => String(value ?? "").trim());
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function articlePath(category: string, slug: string) {
  return routes.articleByCategory(category, slug);
}

function listingPaths(category: string, placement: string, majorCategory: string | null, sectionSlug: string | null) {
  const paths = ["/", "/sitemap.xml", routes.articles, routes.articleCategory(category)];
  if (placement !== "independent" && majorCategory) {
    paths.push(routes.majorCategory(majorCategory));
    // 大カテゴリ配下に紐づく記事は section トップにインライン表示されるため、そのページも再生成
    if (sectionSlug) paths.push("/" + majorCategory + "/" + sectionSlug);
  }
  return paths;
}

function collectOfficialImageSources(markdown: string): Source[] {
  const blocks = markdown.match(/:::official-image[\s\S]*?:::/g) ?? [];
  return blocks.flatMap((block) => {
    const source = block.match(/\nsource:\s*(.+)/)?.[1]?.trim();
    const sourceUrl = block.match(/\nsourceUrl:\s*(.+)/)?.[1]?.trim();
    if (!source || !sourceUrl) return [];
    return [{
      title: source,
      url: sourceUrl,
      note: "記事作成UIで記事内画像の出典として登録。",
      sourceType: "official",
      collectedAt: new Date().toISOString().slice(0, 10),
    }];
  });
}

function collectManualSources(formData: FormData): Source[] {
  const titles = listAll(formData, "source_title");
  const urls = listAll(formData, "source_url");
  const sourceTypes = listAll(formData, "source_type");
  const collectedDates = listAll(formData, "source_collected_at");
  const notes = listAll(formData, "source_note");

  return titles.flatMap((title, index): Source[] => {
    const url = urls[index];
    if (!title || !url) return [];
    return [{
      title,
      url,
      sourceType: (sourceTypes[index] || "official") as SourceType,
      collectedAt: collectedDates[index] || new Date().toISOString().slice(0, 10),
      note: notes[index] || "記事作成UIで参照ソースとして登録。",
    }];
  });
}

function collectRelatedLinks(formData: FormData): RelatedLink[] {
  const titles = listAll(formData, "related_link_title");
  const urls = listAll(formData, "related_link_url");
  const types = listAll(formData, "related_link_type");
  const notes = listAll(formData, "related_link_note");

  return titles.flatMap((title, index): RelatedLink[] => {
    const url = urls[index];
    if (!title || !url) return [];
    return [{
      title,
      url,
      type: (types[index] || "article") as RelatedLink["type"],
      note: notes[index] || undefined,
    }];
  });
}

function collectFaqs(formData: FormData): FAQ[] {
  const questions = listAll(formData, "faq_question");
  const answers = listAll(formData, "faq_answer");

  return questions.flatMap((question, index): FAQ[] => {
    const answer = answers[index];
    if (!question || !answer) return [];
    return [{ question, answer }];
  });
}

export async function saveArticle(formData: FormData) {
  const admin = await requireAdminUser();
  const service = createServerClient();

  const id = text(formData, "id") || null;
  const placement = text(formData, "placement") === "independent" ? "independent" : "major";
  const majorCategoryInput = text(formData, "major_category").toLowerCase();
  const majorCategory = placement === "independent" ? null : slugify(majorCategoryInput);
  const sectionSlugInput = slugify(text(formData, "section_slug"));
  const sectionSlug = placement === "independent" ? null : sectionSlugInput;
  const category = slugify(text(formData, "article_category")) || sectionSlug || majorCategory || "general";
  const regionRaw = slugify(text(formData, "region"));
  const region = regionRaw || null;
  const slug = slugify(text(formData, "slug"));
  const title = text(formData, "title");
  const description = text(formData, "description");
  const bodyMd = text(formData, "body_md");
  const status = (text(formData, "status") === "published" ? "published" : "draft") as ArticleStatus;

  if (!slug || !title || !description || !bodyMd) {
    throw new Error("slug, title, description, body_md are required");
  }
  if (placement === "major" && (!majorCategory || !majorCategories.has(majorCategory))) {
    throw new Error("大カテゴリ配下の記事では food, health, beauty, travel, leisure のいずれかを選択してください");
  }
  if (majorCategoryInput.includes(".") || sectionSlugInput.includes(".") || category.includes(".")) {
    throw new Error("slugにドットは使えません");
  }

  if (placement === "major" && !sectionSlug) {
    throw new Error("大カテゴリ配下の記事では中カテゴリslugが必須です");
  }

  const path = articlePath(category, slug);
  const now = new Date().toISOString();

  // 編集時は既存の公開日時を保全（再公開で published_at が現在時刻に巻き戻り
  // 「最新記事」順が崩れるのを防ぐ）
  let publishedAt: string | null = null;
  if (status === "published") {
    if (id) {
      const { data: existing } = await service.from("articles").select("published_at").eq("id", id).maybeSingle();
      publishedAt = existing?.published_at ?? now;
    } else {
      publishedAt = now;
    }
  }
  const summary = list(formData, "summary");
  const whatYouLearn = list(formData, "what_you_learn");
  const tags = list(formData, "tags");
  const sources = [...collectManualSources(formData), ...collectOfficialImageSources(bodyMd)];
  const faqs = collectFaqs(formData);
  const metadata = {
    author: {
      name: text(formData, "author_name") || "Each Spirit 編集部",
      role: "editor",
      url: routes.about,
    },
    summary,
    what_you_learn: whatYouLearn,
    sources,
    faqs,
    related_slugs: list(formData, "related_slugs"),
    related_links: collectRelatedLinks(formData),
  };

  const payload = {
    slug,
    category,
    major_category: majorCategory,
    section_slug: sectionSlug,
    canonical_path: path,
    region,
    title,
    description,
    body_md: bodyMd,
    cover_image_url: text(formData, "cover_image_url") || null,
    tags,
    author_name: metadata.author.name,
    author_id: admin.id,
    status,
    published_at: publishedAt,
    seo_title: text(formData, "seo_title") || title,
    seo_description: text(formData, "seo_description") || description,
    seo_keywords: list(formData, "seo_keywords"),
    metadata,
  };

  // 編集（id あり）は id で更新。slug 変更時に別レコードが増えるのを防ぐ。
  // 新規は slug を一意キーに upsert。
  if (id) {
    const { error } = await service.from("articles").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await service.from("articles").upsert(payload, { onConflict: "slug" });
    if (error) throw error;
  }

  // 公開時は当然、編集時（下書き化を含む）も古い公開ページを更新するため再生成する。
  if (status === "published" || id) {
    // コンテンツの Data Cache（es-content タグ・1か月）も即時無効化し、
    // 公開ページ・管理一覧・編集フォームに変更を反映する。
    revalidateTag(ES_CONTENT_CACHE_TAG);
    revalidatePath(path);
    for (const listingPath of listingPaths(category, placement, majorCategory, sectionSlug || null)) {
      revalidatePath(listingPath);
    }
  }

  redirect(status === "published" ? path : routes.account);
}
