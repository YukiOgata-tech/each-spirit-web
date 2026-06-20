/**
 * es.content_regions / es.content_targets への seed。
 *
 * 静的な各カテゴリ regions.ts・protein/targets.ts を入力として DB へ upsert する。
 * 表示で使うリッチな構造はそのまま data(jsonb) に格納し、キー列で引けるようにする。
 *
 * 実行:
 *   npx tsx --tsconfig scripts/tsconfig.json scripts/seed-regions-targets.ts
 * 前提: .env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY。
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { ramenRegions } from "@/content/ramen/regions";
import { cafeRegions } from "@/content/cafe/regions";
import { beautyRegions } from "@/content/beauty/regions";
import { travelRegions } from "@/content/travel/regions";
import { travelServiceRegions } from "@/content/travel-services/regions";
import { proteinTargets } from "@/content/protein/targets";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が .env.local にありません。");
  process.exit(1);
}

const sb = createClient(url, key, {
  db: { schema: "es" },
  realtime: { transport: ws as unknown as typeof WebSocket },
});

type AnyRegion = { slug: string; status?: string };

function regionRows(major: string, section: string, regions: AnyRegion[]) {
  return regions.map((r, i) => ({
    major_category: major,
    section_slug: section,
    region_slug: r.slug,
    status: r.status === "planned" ? "planned" : "live",
    sort_order: (i + 1) * 10,
    data: r,
  }));
}

async function main() {
  const regionRowsAll = [
    ...regionRows("food", "ramen", ramenRegions),
    ...regionRows("food", "cafe", cafeRegions),
    ...regionRows("beauty", "hair-salon", beautyRegions),
    ...regionRows("travel", "stays", travelRegions),
    ...regionRows("travel", "services", travelServiceRegions),
    // leisure は静的なリッチ region 定義を持たないため最小エントリで登録
    {
      major_category: "leisure",
      section_slug: "spots",
      region_slug: "niigata",
      status: "live",
      sort_order: 10,
      data: { slug: "niigata", name: "新潟県", shortName: "新潟", status: "live" },
    },
  ];

  const { error: regErr } = await sb
    .from("content_regions")
    .upsert(regionRowsAll, { onConflict: "major_category,section_slug,region_slug" });
  if (regErr) {
    console.error("❌ content_regions upsert 失敗:", regErr.message);
    process.exit(1);
  }
  console.log(`✅ content_regions upsert: ${regionRowsAll.length} 行`);

  const targetRows = proteinTargets.map((t, i) => ({
    major_category: "health",
    section_slug: "protein",
    target_slug: t.slug,
    status: t.status === "planned" ? "planned" : "live",
    sort_order: (i + 1) * 10,
    data: t,
  }));

  const { error: tgtErr } = await sb
    .from("content_targets")
    .upsert(targetRows, { onConflict: "major_category,section_slug,target_slug" });
  if (tgtErr) {
    console.error("❌ content_targets upsert 失敗:", tgtErr.message);
    process.exit(1);
  }
  console.log(`✅ content_targets upsert: ${targetRows.length} 行`);
}

main().then(() => process.exit(0));
