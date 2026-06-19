import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

config({ path: ".env.local" });

type ArticleInput = {
  slug: string;
  category: string;
  region?: string | null;
  title: string;
  description: string;
  body_md: string;
  cover_image_url?: string | null;
  author_name?: string;
  tags?: string[];
  status?: "draft" | "published";
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  metadata?: Record<string, unknown>;
};

type ArticleImport = {
  articles: ArticleInput[];
};

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error("Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/import-articles-json.ts <json-path>");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local");
}

const db = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
});
const es = db.schema("es");

function readBody(input: ArticleInput, baseDir: string) {
  if (!input.body_md.endsWith(".md")) return input.body_md;
  const mdPath = join(baseDir, input.body_md);
  if (!existsSync(mdPath)) {
    throw new Error(`Markdown file not found: ${mdPath}`);
  }
  return readFileSync(mdPath, "utf8");
}

async function main() {
  const baseDir = dirname(inputPath);
  const data = JSON.parse(readFileSync(inputPath, "utf8")) as ArticleImport;
  if (!Array.isArray(data.articles) || data.articles.length === 0) {
    throw new Error("articles must contain at least one article");
  }

  const rows = data.articles.map((article) => ({
    slug: article.slug,
    category: article.category,
    region: article.region ?? null,
    title: article.title,
    description: article.description,
    body_md: readBody(article, baseDir),
    cover_image_url: article.cover_image_url ?? null,
    tags: article.tags ?? [],
    author_name: article.author_name ?? "Each Spirit 編集部",
    status: article.status ?? "published",
    published_at: article.published_at ?? new Date().toISOString().slice(0, 10),
    seo_title: article.seo_title ?? article.title,
    seo_description: article.seo_description ?? article.description,
    seo_keywords: article.seo_keywords ?? article.tags ?? [],
    metadata: article.metadata ?? {},
  }));

  const { error, count } = await es.from("articles").upsert(rows, { onConflict: "slug", count: "exact" });
  if (error) throw error;

  console.log(JSON.stringify({ ok: true, articles_upserted: count ?? rows.length, slugs: rows.map((row) => row.slug) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
