import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProteinHero } from "@/components/protein/ProteinHero";
import { ProductCard } from "@/components/protein/ProductCard";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getProteinProducts, getProteinRankings, getProteinTargets } from "@/lib/content";
import { GenericSectionIndex, genericSectionMetadata } from "@/components/generic/GenericSectionPages";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

type PageProps = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  if (section !== "protein") return genericSectionMetadata("health", section);
  return pageMetadata({
    title: "プロテインおすすめ比較完全ガイド｜目的別ランキングと選び方（ホエイ・ソイ）",
    description: "女性・男性・ダイエット・初心者・トレーナー・大学生など目的別に、タンパク質量・カロリー・価格の実データでプロテインを比較するガイドサイト。",
    path: routes.protein,
  });
}

const TARGET_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  women:   { bg: "#fdf2f8", text: "#be185d", border: "#fbcfe8" },
  men:     { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  trainer: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  student: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  diet:    { bg: "#faf5ff", text: "#7c3aed", border: "#ddd6fe" },
  beginner:{ bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc" },
};

export function generateStaticParams() {
  return [{ section: "protein" }];
}

export default async function ProteinIndexPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "protein") return <GenericSectionIndex majorCategory="health" sectionSlug={section} />;

  const targets = await getProteinTargets();
  const [products, rankings] = await Promise.all([getProteinProducts(), getProteinRankings()]);

  return (
    <div className="protein-theme">
      <ProteinHero productCount={products.length} rankingCount={rankings.length} />

      {/* Target category grid */}
      <section className="section-shell">
        <p className="section-kicker" style={{ color: "#1e3a5f" }}>CATEGORIES</p>
        <h2 className="section-heading mt-2">目的から選ぶ</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-500">
          目的に合ったランキングと商品カードで、あなたに最適なプロテインを見つけましょう。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {targets.map((target) => {
            const colors = TARGET_COLORS[target.slug] ?? { bg: "#f8fafc", text: "#1e293b", border: "#e2e8f0" };
            const targetRankings = rankings.filter((r) => r.target === target.slug);
            const targetProducts = products.filter((p) => p.targets.includes(target.slug));
            return (
              <Link
                key={target.slug}
                href={routes.proteinTarget(target.slug)}
                className="protein-card group overflow-hidden"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={target.imageUrl}
                    alt={target.name}
                    fill
                    unoptimized={shouldUnoptimizeImage(target.imageUrl)}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-lg font-black text-white">{target.name}</p>
                  </div>
                </div>
                <div className="p-4" style={{ backgroundColor: colors.bg, borderTop: `2px solid ${colors.border}` }}>
                  <p className="text-xs font-semibold" style={{ color: colors.text }}>{target.tagline}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{target.description}</p>
                  <div className="mt-3 flex gap-3">
                    {[
                      { num: targetRankings.length, label: "ランキング" },
                      { num: targetProducts.length, label: "対応商品" },
                    ].map(({ num, label }) => (
                      <div key={label} className="flex-1 rounded-lg bg-white/80 py-1.5 text-center">
                        <p className="text-base font-black" style={{ color: colors.text }}>{num}</p>
                        <p className="text-[9px] font-semibold text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-1 text-xs font-bold" style={{ color: colors.text }}>
                    ガイドを見る <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All products */}
      <section id="products" className="section-shell">
        <p className="section-kicker" style={{ color: "#1e3a5f" }}>PRODUCTS</p>
        <h2 className="section-heading mt-2">全商品一覧（実データ比較）</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          各商品の栄養成分は公式サイト・信頼できる情報源から確認した実データです。価格はセール・時期によって変動するため、
          購入前に公式サイトまたは各通販サイトで最新価格をご確認ください。
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Quick comparison table */}
      <section className="section-shell">
        <p className="section-kicker" style={{ color: "#1e3a5f" }}>COMPARE</p>
        <h2 className="section-heading mt-2">栄養成分・価格 一覧比較</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
          <table className="w-full min-w-175 text-sm">
            <thead>
              <tr className="border-b border-blue-100 bg-[#eff6ff] text-xs font-bold uppercase tracking-wide text-[#1e3a5f]">
                <th className="px-4 py-3 text-left">商品名</th>
                <th className="px-4 py-3 text-center">1食量(g)</th>
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
                    <p className="text-[11px] text-slate-400">{p.name.split("（")[0]}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{p.servingSize}g</td>
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
        <p className="mt-3 text-xs text-slate-400">※栄養成分は1食あたりの数値。価格は参考値で変動があります。最新情報は各公式サイトでご確認ください。</p>
      </section>
    </div>
  );
}
