import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { MacroBars } from "@/components/protein/MacroBars";
import { NutritionTypeBadge, MacroChip } from "@/components/protein/NutritionBadge";
import { breadcrumbSchema, faqSchema, pageMetadata, productSchema, speakableWebPageSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getProteinProduct, getProteinProducts, getProteinRankings, getProteinTarget } from "@/lib/content";
import type { ProteinTarget } from "@/lib/types";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  return (await getProteinProducts()).map((p) => ({ section: "protein", slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") return {};
  const product = await getProteinProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.brand} ${product.name.split("（")[0]}`,
    description: product.description,
    path: routes.proteinProduct(slug),
    image: product.imageUrl,
  });
}

const TARGET_LABEL: Record<ProteinTarget, string> = {
  women: "女性向け", men: "男性向け", trainer: "トレーナー",
  student: "大学生", diet: "ダイエット", beginner: "初心者",
};

export default async function ProteinProductPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") notFound();
  const product = await getProteinProduct(slug);
  if (!product) notFound();

  const editorialScore = (await getProteinRankings())
    .flatMap((r) => r.items)
    .find((entry) => entry.productSlug === product.slug)
    ?.score;

  const breadcrumbs = [
    { name: "トップ",     href: routes.home },
    { name: "プロテイン", href: routes.protein },
    { name: product.brand, href: routes.proteinProduct(slug) },
  ];

  return (
    <div className="protein-theme">
      <JsonLd data={productSchema(product, editorialScore)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(product.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.proteinProduct(product.slug), `${product.brand} ${product.name}`)} />

      {/* hero image */}
      <div className="relative h-[300px] w-full sm:h-[380px]">
        <Image src={product.imageUrl} alt={product.brand} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10">
          <div className="flex flex-wrap gap-2">
            <NutritionTypeBadge type={product.proteinType} />
            {product.targets.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-orange-500/80 px-2.5 py-0.5 text-[10px] font-bold text-white">{TARGET_LABEL[t]}</span>
            ))}
          </div>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/60">{product.brand}</p>
          <h1 data-speakable="title" className="mt-1 text-2xl font-black text-white sm:text-4xl">{product.name}</h1>
        </div>
      </div>

      <div className="section-shell mx-auto max-w-4xl">
        <Breadcrumbs
          items={breadcrumbs.map((item, i) => ({
            label: item.name,
            href: i === breadcrumbs.length - 1 ? undefined : item.href,
          }))}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Description */}
            <div className="animate-rise rounded-2xl border border-blue-100 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">商品概要</h2>
              <p className="mt-3 text-sm leading-8 text-slate-600">{product.description}</p>
              <p className="mt-4 rounded-xl bg-[#eff6ff] p-4 text-sm font-semibold leading-7 text-[#1e3a5f]">
                編集部コメント: {product.editorNote}
              </p>
            </div>

            {/* Macro bars (client) */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">1食あたりの栄養成分（{product.servingSize}g）</h2>
              <div className="mt-4 grid grid-cols-4 gap-3">
                <MacroChip label="タンパク質" value={product.protein} color="#1e3a5f" />
                <MacroChip label="カロリー" value={product.calories} unit="kcal" color="#f97316" />
                <MacroChip label="炭水化物" value={product.carbs} color="#64748b" />
                <MacroChip label="脂質" value={product.fat} color="#94a3b8" />
              </div>
              <div className="mt-5">
                <MacroBars
                  protein={product.protein}
                  carbs={product.carbs}
                  fat={product.fat}
                  calories={product.calories}
                />
              </div>
              <p className="mt-3 text-[11px] text-slate-400">
                ※上記は公式サイト・信頼できる情報源から確認した実数値です。フレーバーにより若干異なる場合があります。
              </p>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">商品の特徴</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 rounded-xl bg-[#eff6ff] p-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a5f]" />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros / Cons */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">メリット・デメリット</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">メリット</p>
                  <ul className="space-y-2">
                    {product.pros.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-500">デメリット</p>
                  <ul className="space-y-2">
                    {product.cons.map((c) => (
                      <li key={c} className="flex items-start gap-1.5 text-sm text-slate-600">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Flavors */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">フレーバーラインナップ</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.flavors.map((f) => (
                  <span key={f} className="rounded-full border border-blue-100 bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1e3a5f]">{f}</span>
                ))}
              </div>
            </div>

            {/* Target suitability */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">こんな方におすすめ</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.targets.map((t) => {
                  const info = getProteinTarget(t);
                  return (
                    <Link key={t} href={routes.proteinTarget(t)} className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition-all hover:bg-orange-100">
                      {TARGET_LABEL[t]}
                      {info && <span className="text-[10px] text-orange-500">ガイドを見る →</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            <FaqSection faqs={product.faqs} />
            <SourceList sources={product.sources} />
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-800">価格・購入</h3>
                <div className="mt-4 rounded-xl bg-[#eff6ff] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e3a5f]">参考価格</p>
                  <p className="mt-1 text-xl font-black text-[#1e3a5f]">
                    ¥{product.packagePrice.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400"> / {product.packageWeight}g</span>
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    1kg換算 ¥{product.pricePerKg.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">※変動あり。購入前に最新価格を確認してください</p>
                </div>
                <a
                  href={product.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1e3a5f] py-3 text-sm font-bold text-white transition-all hover:bg-[#1d4ed8]"
                >
                  <ExternalLink className="h-4 w-4" /> 公式サイトで確認
                </a>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">1食の栄養成分</h3>
                <dl className="space-y-2 text-sm">
                  {[
                    { label: "1食量", value: `${product.servingSize}g` },
                    { label: "タンパク質", value: `${product.protein}g`, bold: true, color: "#1e3a5f" },
                    { label: "カロリー", value: `${product.calories}kcal`, bold: true, color: "#f97316" },
                    { label: "炭水化物", value: `${product.carbs}g` },
                    { label: "脂質", value: `${product.fat}g` },
                  ].map(({ label, value, bold, color }) => (
                    <div key={label} className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <dt className="text-slate-500 text-xs">{label}</dt>
                      <dd className={`text-xs font-${bold ? "black" : "semibold"}`} style={color ? { color } : {}}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[10px] text-slate-400">最終確認日: {product.lastVerifiedAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
