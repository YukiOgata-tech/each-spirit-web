import { NextResponse, type NextRequest } from "next/server";
import { searchContent } from "@/lib/content";
import type { SearchResult } from "@/lib/types";

const TYPES: SearchResult["type"][] = ["article", "ranking", "item", "category"];
const MIN_QUERY_LENGTH = 2;

/** 横断検索 API。?q= 必須、?type=（任意: article/ranking/item/category）、?limit=（既定48・最大100）。
 *  空クエリは即 [] を返し、DB は叩かない。pgroonga RPC を1回呼ぶだけ。 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").trim();
  if (q.length < MIN_QUERY_LENGTH) return NextResponse.json({ results: [] });

  const typeParam = sp.get("type");
  const type = TYPES.includes(typeParam as SearchResult["type"]) ? (typeParam as SearchResult["type"]) : undefined;
  const limitRaw = Number(sp.get("limit"));
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.trunc(limitRaw), 1), 100) : undefined;

  const results = await searchContent(q, { type, limit });
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=300, stale-while-revalidate=60" } },
  );
}
