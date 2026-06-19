"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { routes } from "@/lib/routes";

type ArticleStatus = "draft" | "published";

const regionRequiredCategories = new Set(["beauty", "cafe"]);
const unavailableCategorySlugs = new Set([
  "about",
  "account",
  "api",
  "apple-icon.png",
  "articles",
  "auth",
  "contact",
  "disclaimer",
  "fortune",
  "icon.png",
  "leisure",
  "llms.txt",
  "opengraph-image",
  "privacy",
  "protein",
  "robots.txt",
  "sitemap.xml",
  "travel",
  "travel-services",
]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string) {
  return text(formData, key)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function articlePath(category: string, region: string | null, slug: string) {
  if (category === "ramen") return routes.ramenArticle(slug);
  if (category === "beauty") return routes.beautyArticle(region!, slug);
  if (category === "cafe") return routes.cafeArticle(region!, slug);
  return routes.genericArticle(category, slug);
}

function listingPaths(category: string, region: string | null) {
  const paths = ["/", "/sitemap.xml"];
  if (category === "ramen") paths.push(routes.ramen);
  if (category === "beauty") {
    paths.push(routes.beauty);
    if (region) paths.push(routes.beautyRegion(region));
  }
  if (category === "cafe") {
    paths.push(routes.cafe);
    if (region) paths.push(routes.cafeRegion(region));
  }
  if (!["ramen", "beauty", "cafe"].includes(category)) {
    paths.push(routes.genericCategory(category));
  }
  return paths;
}

function collectOfficialImageSources(markdown: string) {
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

export async function saveArticle(formData: FormData) {
  const admin = await requireAdminUser();
  const service = createServerClient();

  const categoryInput = text(formData, "category").toLowerCase();
  const category = slugify(categoryInput);
  const regionRaw = slugify(text(formData, "region"));
  const region = regionRaw || null;
  const slug = slugify(text(formData, "slug"));
  const title = text(formData, "title");
  const description = text(formData, "description");
  const bodyMd = text(formData, "body_md");
  const status = (text(formData, "status") === "published" ? "published" : "draft") as ArticleStatus;

  if (!category || !slug || !title || !description || !bodyMd) {
    throw new Error("category, slug, title, description, body_md are required");
  }
  if (unavailableCategorySlugs.has(category)) {
    throw new Error("このカテゴリslugは固定ページまたはシステムページと衝突するため使えません");
  }
  if (regionRequiredCategories.has(category) && !region) {
    throw new Error("beauty と cafe の記事は region が必須です");
  }
  if (categoryInput.includes(".")) {
    throw new Error("カテゴリslugにドットは使えません");
  }

  const path = articlePath(category, region, slug);
  const now = new Date().toISOString();
  const summary = list(formData, "summary");
  const whatYouLearn = list(formData, "what_you_learn");
  const tags = list(formData, "tags");
  const metadata = {
    author: {
      name: text(formData, "author_name") || "Each Spirit 編集部",
      role: "editor",
      url: routes.about,
    },
    summary,
    what_you_learn: whatYouLearn,
    sources: collectOfficialImageSources(bodyMd),
    faqs: [],
    related_slugs: list(formData, "related_slugs"),
  };

  const { error } = await service.from("articles").upsert({
    slug,
    category,
    region,
    title,
    description,
    body_md: bodyMd,
    cover_image_url: text(formData, "cover_image_url") || null,
    tags,
    author_name: metadata.author.name,
    author_id: admin.id,
    status,
    published_at: status === "published" ? now : null,
    seo_title: text(formData, "seo_title") || title,
    seo_description: text(formData, "seo_description") || description,
    seo_keywords: list(formData, "seo_keywords"),
    metadata,
  }, { onConflict: "slug" });

  if (error) throw error;

  if (status === "published") {
    revalidatePath(path);
    for (const listingPath of listingPaths(category, region)) {
      revalidatePath(listingPath);
    }
  }

  redirect(status === "published" ? path : routes.account);
}
