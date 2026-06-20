import "server-only";
import {
  getRamenRegions, getCafeRegions, getBeautyRegions,
  getTravelRegions, getTravelServiceRegions, getLeisureRegions,
} from "@/lib/content";

/** ItemEditor の region セレクト用。`${major}:${section}` をキーに地域候補を返す。 */
export async function buildRegionOptions() {
  const [ramen, cafe, beauty, stays, services, leisure] = await Promise.all([
    getRamenRegions(), getCafeRegions(), getBeautyRegions(),
    getTravelRegions(), getTravelServiceRegions(), getLeisureRegions(),
  ]);
  return [
    { key: "food:ramen", regions: ramen.map((r) => ({ slug: r.slug, name: r.name })) },
    { key: "food:cafe", regions: cafe.map((r) => ({ slug: r.slug, name: r.name })) },
    { key: "beauty:hair-salon", regions: beauty.map((r) => ({ slug: r.slug, name: r.name })) },
    { key: "travel:stays", regions: stays.map((r) => ({ slug: r.slug, name: r.name })) },
    { key: "travel:services", regions: services.map((r) => ({ slug: r.slug, name: r.name })) },
    { key: "leisure:spots", regions: leisure.map((s) => ({ slug: s, name: s })) },
  ];
}
