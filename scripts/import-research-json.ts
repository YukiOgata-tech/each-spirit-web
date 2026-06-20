import { config } from "dotenv";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import {
  ITEM_CONTENT_TYPE_TO_SECTION,
  RANKING_CONTENT_TYPE_TO_SECTION,
  itemCanonicalPath,
  rankingCanonicalPath,
} from "@/lib/section-map";

config({ path: ".env.local" });

type ResearchJson = {
  schema_version: string;
  research: { category: string; region: string; collected_at: string };
  items: ResearchItem[];
  rankings: ResearchRanking[];
};

type ResearchItem = {
  slug: string;
  content_type: string;
  region: string | null;
  name: string;
  description: string;
  image_url: string | null;
  address?: string;
  area?: string;
  phone?: string | null;
  price_range?: string;
  official_url?: string;
  map_url?: string;
  tags: string[];
  last_verified_at: string;
  editor_comment: string;
  metadata: Record<string, unknown> & {
    related_ranking_slugs?: string[];
    sources?: unknown[];
    faqs?: unknown[];
  };
};

type ResearchRanking = {
  slug: string;
  content_type: string;
  region: string | null;
  title: string;
  description: string;
  conclusion: string;
  quick_table_label: string;
  criteria: string[];
  tags: string[];
  status: string;
  last_updated_at: string;
  metadata: Record<string, unknown> & {
    sources?: unknown[];
    faqs?: unknown[];
  };
  items: Array<{
    rank: number;
    item_content_type: string;
    item_slug: string;
    score: number;
    reason: string;
    is_pr: boolean;
    metadata?: Record<string, unknown>;
  }>;
};

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error("Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/import-research-json.ts <json-path>");
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

function withRegionPrefix(slug: string, region: string) {
  return slug.startsWith(`${region}-`) ? slug : `${region}-${slug}`;
}

function supplementMiyagiBest(ranking: ResearchRanking) {
  if (ranking.slug !== "miyagi-ramen-best") return ranking;

  ranking.description =
    "宮城県で初めてラーメン店を選ぶ人向けに、仙台中心部の行きやすい名店、地元支持の強い中華そば、車で訪れたい郊外店、味噌・辛味噌・煮干し・清湯まで幅広く比較しました。仙台駅周辺だけに偏らず、岩沼・名取・富谷・大衡まで含め、観光・出張・地元利用のどの導線でも候補を選びやすい総合ランキングです。";
  ranking.conclusion =
    "中心部で外しにくい一杯なら、だしの個性とアクセスを両立するだし廊、仙台中華そばの代表性なら嘉一、地元定番の中華そばならみずさわ屋が優先候補です。車移動で宮城らしい幅を楽しむなら本竈・麺組・こもれ美、駅近や夜利用を重視するなら仙臺くろく・麺屋政宗を選ぶと計画に組み込みやすいです。";
  ranking.criteria = [
    "味の個性と看板メニューの分かりやすさ",
    "宮城・仙台らしさや地域ラーメン文脈へのつながり",
    "仙台駅・中心部・郊外ドライブなどアクセス導線の使いやすさ",
    "公式サイト・公式SNS・観光/地域情報で営業情報を追いやすいこと",
    "仙台市内だけに偏らず、名取・岩沼・富谷・大衡まで地域分散できること",
    "初訪問者にも説明しやすく、ランキングから店舗詳細へ自然に回遊できること",
  ];
  ranking.metadata = {
    ...ranking.metadata,
    summary: [
      "仙台中心部、駅近、郊外ドライブ、味噌・辛味噌、中華そば、煮干し系まで宮城ラーメンを横断して比較できます。",
      "公式情報・SNS・地域メディアを組み合わせ、営業時間や定休日が変わりやすい店舗は来店前確認を前提に整理しています。",
      "総合ランキングは初回訪問の入口として使い、目的が決まっている場合は駅近・駐車場・味噌・醤油系ランキングへ分岐できます。",
    ],
    what_you_learn: [
      "宮城ラーメンで初回に選びやすい代表候補",
      "仙台中心部と郊外店の使い分け",
      "味噌・中華そば・煮干し・清湯などジャンル別の見方",
    ],
    selection_note:
      "掲載順位は味の個性、地域性、アクセス、公式情報の追跡性、観光/車利用との相性を総合して編集部基準で整理したものです。",
  };

  const reasonBySlug: Record<string, string> = {
    "dashiro-sendai-minamimachi":
      "だしを軸にしたコンセプトが明確で、仙台中心部からアクセスしやすく、公式情報も追いやすい。初めて宮城ラーメンを選ぶ読者に説明しやすい総合力があります。",
    "sendai-chukasoba-kaichi-kokubuncho":
      "鶏の旨味を生かした仙台中華そばの代表候補。国分町・勾当台公園周辺で訪問しやすく、宮城の中華そば文脈を伝える軸になります。",
    "mizusawaya-sendai-kuryu":
      "中心部からは少し離れるものの、地元支持の強いクラシックな中華そばとして存在感があります。観光向けだけでない宮城ラーメンの厚みを出せます。",
    "sendai-quroku":
      "仙台駅東口から近く、清湯や限定麺など駅近でも個性を出せる一軒。出張・観光の移動導線に組み込みやすい点も評価できます。",
    "ramen-honkamado-iwakiri":
      "郊外型ながら上品な一杯と駐車場利用のしやすさがあり、車で宮城ラーメンを巡る読者に向きます。仙台中心部以外の有力候補として入れたい店舗です。",
  };

  ranking.items = ranking.items.map((item) => ({
    ...item,
    reason: reasonBySlug[item.item_slug] ?? item.reason,
  }));

  return ranking;
}

function normalize(data: ResearchJson) {
  const region = data.research.region;
  const slugMap = new Map<string, string>();

  const items = data.items.map((item) => {
    const normalizedSlug = withRegionPrefix(item.slug, region);
    slugMap.set(item.slug, normalizedSlug);
    return {
      ...item,
      slug: normalizedSlug,
      metadata: {
        ...item.metadata,
        original_slug: item.slug,
      },
    };
  });

  const rankings = data.rankings.map((ranking) =>
    supplementMiyagiBest({
      ...ranking,
      items: ranking.items.map((item) => ({
        ...item,
        item_slug: slugMap.get(item.item_slug) ?? item.item_slug,
        metadata: {
          ...(item.metadata ?? {}),
          original_item_slug: item.item_slug,
        },
      })),
    })
  );

  const itemSlugs = new Set(items.map((item) => item.slug));
  const missingRefs = rankings.flatMap((ranking) =>
    ranking.items
      .filter((item) => !itemSlugs.has(item.item_slug))
      .map((item) => `${ranking.slug}:${item.item_slug}`)
  );
  if (missingRefs.length) {
    throw new Error(`Ranking item references missing items: ${missingRefs.join(", ")}`);
  }

  return { items, rankings, slugMap };
}

async function main() {
  const data = JSON.parse(readFileSync(inputPath, "utf8")) as ResearchJson;

  const { items, rankings, slugMap } = normalize(data);

  const itemRows = items.map((item) => {
    const meta = ITEM_CONTENT_TYPE_TO_SECTION[item.content_type];
    if (!meta) throw new Error(`未知の item content_type: ${item.content_type}（${item.slug}）`);
    return {
      slug: item.slug,
      content_type: item.content_type,
      major_category: meta.majorCategory,
      section_slug: meta.sectionSlug,
      item_kind: meta.itemKind,
      canonical_path: itemCanonicalPath(item.content_type, item.slug),
      region: item.region,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      address: item.address ?? null,
      area: item.area ?? null,
      phone: item.phone ?? null,
      price_range: item.price_range ?? null,
      official_url: item.official_url ?? null,
      map_url: item.map_url ?? null,
      tags: item.tags,
      last_verified_at: item.last_verified_at,
      editor_comment: item.editor_comment,
      metadata: item.metadata,
    };
  });

  const { error: itemError, count: itemCount } = await es
    .from("items")
    .upsert(itemRows, { onConflict: "major_category,section_slug,slug", count: "exact" });
  if (itemError) throw itemError;

  // ranking_items の item_id 解決用に slug→id を取得
  const { data: itemIdRows } = await es
    .from("items")
    .select("id, slug")
    .in("slug", itemRows.length ? itemRows.map((r) => r.slug) : ["__none__"]);
  const itemIdBySlug = new Map((itemIdRows ?? []).map((r: { id: string; slug: string }) => [r.slug, r.id]));

  let rankingItemCount = 0;
  for (const ranking of rankings) {
    const { data: rankingRow, error: rankingError } = await es
      .from("rankings")
      .upsert(
        {
          slug: ranking.slug,
          content_type: ranking.content_type,
          major_category: RANKING_CONTENT_TYPE_TO_SECTION[ranking.content_type]?.majorCategory ?? null,
          section_slug: RANKING_CONTENT_TYPE_TO_SECTION[ranking.content_type]?.sectionSlug ?? null,
          canonical_path: rankingCanonicalPath(ranking.content_type, ranking.slug),
          region: ranking.region,
          title: ranking.title,
          description: ranking.description,
          conclusion: ranking.conclusion,
          quick_table_label: ranking.quick_table_label,
          criteria: ranking.criteria,
          last_updated_at: ranking.last_updated_at,
          status: ranking.status,
          metadata: ranking.metadata,
        },
        { onConflict: "major_category,section_slug,slug" }
      )
      .select("id")
      .single();
    if (rankingError || !rankingRow) throw rankingError ?? new Error(`Ranking ${ranking.slug} was not returned`);

    const { error: deleteError } = await es.from("ranking_items").delete().eq("ranking_id", rankingRow.id);
    if (deleteError) throw deleteError;

    const rows = ranking.items.map((item) => ({
      ranking_id: rankingRow.id,
      rank: item.rank,
      item_content_type: item.item_content_type,
      item_slug: item.item_slug,
      item_id: itemIdBySlug.get(item.item_slug) ?? null,
      score: item.score,
      reason: item.reason,
      is_pr: item.is_pr,
      metadata: item.metadata ?? {},
    }));

    const { error: rankingItemsError } = await es.from("ranking_items").insert(rows);
    if (rankingItemsError) throw rankingItemsError;
    rankingItemCount += rows.length;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        normalized_slugs: slugMap.size,
        items_upserted: itemCount ?? itemRows.length,
        rankings_upserted: rankings.length,
        ranking_items_inserted: rankingItemCount,
        supplemented_ranking: "miyagi-ramen-best",
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
