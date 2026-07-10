import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";
import { ProductCard } from "@/components/protein/ProductCard";
import { ProteinRankingCard } from "@/components/protein/ProteinRankingCard";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import {
  getProteinTarget, getProteinTargets,
  getProteinProductsByTarget, getProteinRankingsByTarget,
} from "@/lib/content";
import type { ProteinTarget } from "@/lib/types";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

type PageProps = { params: Promise<{ section: string; segment: string }> };

export async function generateStaticParams() {
  return (await getProteinTargets()).map((t) => ({ section: "protein", segment: t.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, segment } = await params;
  const target = segment;
  if (section !== "protein") return {};
  const info = await getProteinTarget(target as ProteinTarget);
  if (!info) return {};
  return pageMetadata({
    title: `${info.name}におすすめのプロテイン比較｜目的別ランキングと選び方`,
    description: info.description,
    path: routes.proteinTarget(target),
  });
}

export default async function ProteinTargetPage({ params }: PageProps) {
  const { section, segment } = await params;
  const target = segment;
  if (section !== "protein") notFound();
  const info = await getProteinTarget(target as ProteinTarget);
  if (!info) notFound();

  const [products, rankings] = await Promise.all([
    getProteinProductsByTarget(target as ProteinTarget),
    getProteinRankingsByTarget(target as ProteinTarget),
  ]);

  return (
    <div className="protein-theme">
      {/* Target hero */}
      <section className="relative h-72 w-full sm:h-96">
        <Image src={info.imageUrl} alt={info.name} fill unoptimized={shouldUnoptimizeImage(info.imageUrl)} className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10">
          <Link href={routes.protein} className="text-xs font-bold text-blue-300 hover:text-white">← 全目的一覧</Link>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-5xl">{info.name}プロテインガイド</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-200">{info.tagline}</p>
        </div>
      </section>

      <div className="section-shell mx-auto max-w-5xl">
        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="protein-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">1日の目安</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{info.proteinPerDay}</p>
          </div>
          <div className="protein-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">おすすめ種類</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {info.recommendedTypes.map((t) => (
                <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#1e3a5f]">{t}</span>
              ))}
            </div>
          </div>
          <div className="protein-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">この目的のニーズ</p>
            <p className="mt-2 text-sm font-bold text-slate-800">{info.keyNeeds[0]}</p>
          </div>
        </div>

        {/* Key needs */}
        <section className="mt-8 protein-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Target className="h-5 w-5 text-orange-500" />{info.name}が重視するポイント
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {info.keyNeeds.map((need) => (
              <li key={need} className="flex items-start gap-2 rounded-xl bg-[#eff6ff] p-3 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a5f]" />{need}
              </li>
            ))}
          </ul>
        </section>

        {/* Rankings */}
        {rankings.length > 0 && (
          <section className="mt-8">
            <p className="section-kicker" style={{ color: "#1e3a5f" }}>RANKING</p>
            <h2 className="section-heading mt-2">{info.name}向けランキング</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rankings.map((ranking, i) => (
                <ProteinRankingCard key={ranking.slug} ranking={ranking} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        <section id="products" className="mt-10">
          <p className="section-kicker" style={{ color: "#1e3a5f" }}>PRODUCTS</p>
          <h2 className="section-heading mt-2">{info.name}におすすめの商品（{products.length}種）</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            栄養成分は公式サイト・信頼できる情報源から確認した実データです。価格は変動するため購入前に最新情報をご確認ください。
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mt-10">
          <p className="section-kicker" style={{ color: "#1e3a5f" }}>COMPARE</p>
          <h2 className="section-heading mt-2">栄養成分・価格 比較</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
            <table className="w-full min-w-[660px] text-sm">
              <thead>
                <tr className="border-b border-blue-100 bg-[#eff6ff] text-xs font-bold uppercase tracking-wide text-[#1e3a5f]">
                  <th className="px-4 py-3 text-left">商品名</th>
                  <th className="px-4 py-3 text-center">タンパク質</th>
                  <th className="px-4 py-3 text-center">カロリー</th>
                  <th className="px-4 py-3 text-center">脂質</th>
                  <th className="px-4 py-3 text-center">炭水化物</th>
                  <th className="px-4 py-3 text-center">1kg換算</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.slug} className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                    <td className="px-4 py-3">
                      <Link href={routes.proteinProduct(p.slug)} className="font-bold text-slate-900 underline underline-offset-4 hover:text-[#1e3a5f]">
                        {p.brand}
                      </Link>
                      <p className="text-[10px] text-slate-400">{p.name.split("（")[0].slice(0, 20)}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-black text-[#1e3a5f]">{p.protein}g</td>
                    <td className="px-4 py-3 text-center font-bold text-orange-600">{p.calories}kcal</td>
                    <td className="px-4 py-3 text-center text-slate-600">{p.fat}g</td>
                    <td className="px-4 py-3 text-center text-slate-600">{p.carbs}g</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">¥{p.pricePerKg.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">※1食あたりの数値。価格は参考値です。</p>
        </section>

        <div className="mt-10 text-center">
          <Link href={routes.protein} className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-5 py-2.5 text-sm font-bold text-[#1e3a5f] hover:bg-blue-50 transition-colors">
            ← 他の目的を見る <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
