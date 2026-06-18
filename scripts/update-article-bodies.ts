import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

dotenv.config({ path: ".env.local" });

const articles = [
  { slug: "niigata-ramen-first-guide", category: "ramen", region: "niigata", file: "content/ramen/articles/niigata-ramen-first-guide.md" },
  { slug: "niigata-five-ramen-guide", category: "ramen", region: "niigata", file: "content/ramen/articles/niigata-five-ramen-guide.md" },
  { slug: "niigata-ramen-car-access", category: "ramen", region: "niigata", file: "content/ramen/articles/niigata-ramen-car-access.md" },
  { slug: "yamagata-ramen-first-guide", category: "ramen", region: "yamagata", file: "content/ramen/articles/yamagata-ramen-first-guide.md" },
  { slug: "niigata-beauty-salon-guide", category: "beauty", region: "niigata", file: "content/beauty/niigata/articles/niigata-beauty-salon-guide.md" },
  { slug: "niigata-hair-color-guide", category: "beauty", region: "niigata", file: "content/beauty/niigata/articles/niigata-hair-color-guide.md" },
  { slug: "yamagata-beauty-salon-guide", category: "beauty", region: "yamagata", file: "content/beauty/yamagata/articles/yamagata-beauty-salon-guide.md" },
  { slug: "yamagata-hair-color-guide", category: "beauty", region: "yamagata", file: "content/beauty/yamagata/articles/yamagata-hair-color-guide.md" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const es = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: "es" },
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

async function main() {
  const results = [];

  for (const article of articles) {
    const body = fs.readFileSync(path.resolve(article.file), "utf8");
    const { error } = await es
      .from("articles")
      .update({ body_md: body })
      .eq("slug", article.slug)
      .eq("category", article.category)
      .eq("region", article.region);

    if (error) throw new Error(article.slug + ": " + error.message);
    results.push({ slug: article.slug, chars: body.length });
  }

  const { data, error } = await es
    .from("articles")
    .select("slug, body_md")
    .in("slug", articles.map((article) => article.slug));

  if (error) throw error;

  const verified = (data ?? []).map((row) => ({
    slug: row.slug,
    chars: String(row.body_md ?? "").length,
  }));

  console.log(JSON.stringify({ updated: results, verified }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
