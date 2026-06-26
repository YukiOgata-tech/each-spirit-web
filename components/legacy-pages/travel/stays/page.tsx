import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTravelRegions } from "@/lib/content";
import { RegionlessItems } from "@/components/generic/RegionlessItems";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "宿・温泉ガイド",
  description: "温泉旅館や宿泊施設を地域、泉質、旅スタイルから探せる旅行カテゴリ内の宿・温泉ガイドです。",
  path: routes.travelStays,
});

export default async function TravelStaysPage() {
  const regions = (await getTravelRegions()).filter((region) => region.status === "live");
  return (
    <main className="section-shell">
      <section className="rounded-lg border border-emerald-100 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-emerald-700">Travel / Stays</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">宿・温泉ガイド</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">宿泊施設、温泉旅館、旅スタイル別のランキングを地域ごとに整理します。</p>
      </section>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <Link key={region.slug} href={routes.travelRegion(region.slug)} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-bold text-emerald-700">{region.shortName}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{region.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{region.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700">見る<ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>

      <RegionlessItems majorCategory="travel" sectionSlug="stays" itemPathSegment="hotels" className="mt-12" heading="エリアを問わず掲載の宿" />
    </main>
  );
}
