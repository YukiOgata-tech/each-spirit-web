import "server-only";
import { getItemOptionsBySection } from "@/lib/content";
import { RANKING_SECTIONS } from "@/lib/admin-ranking-schema";

export type ItemsBySection = { key: string; items: { slug: string; name: string }[] };

/** 各 ranking section の item 候補（ranking_items の item セレクト用）。 */
export async function buildItemsBySection(): Promise<ItemsBySection[]> {
  return Promise.all(
    RANKING_SECTIONS.map(async (s) => ({
      key: s.key,
      items: await getItemOptionsBySection(s.majorCategory, s.sectionSlug),
    })),
  );
}
