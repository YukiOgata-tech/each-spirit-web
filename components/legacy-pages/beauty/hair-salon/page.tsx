import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBeautyRegions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "美容室ガイド",
  description: "美容室を地域、施術、年代、目的別に探せる美容カテゴリ内の美容室ガイドです。",
  path: routes.beautyHairSalon,
});

export default async function HairSalonPage() {
  const regions = (await getBeautyRegions()).filter((region) => region.status === "live");
  return (
    <main className="section-shell">
      <section className="rounded-lg border border-pink-100 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-pink-700">Beauty / Hair salon</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">美容室ガイド</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">年代、施術、エリアで美容室を比較します。</p>
      </section>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <Link key={region.slug} href={routes.beautyRegion(region.slug)} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-bold text-pink-700">{region.shortName}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{region.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{region.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-700">見る<ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
