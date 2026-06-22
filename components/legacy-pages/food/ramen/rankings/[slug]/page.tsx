import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Trophy } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { ItemCard } from "@/components/cards/ItemCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { breadcrumbSchema, faqSchema, itemListSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { getRankingEntries, getRamenRanking, getRamenRankings } from "@/lib/content";
import { routes } from "@/lib/routes";
import { getRamenImageUrl } from "@/lib/ramen-images";
import { RamenImagePlaceholder } from "@/components/ramen/RamenImagePlaceholder";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const rankings = await getRamenRankings();
  return rankings.map((ranking) => ({ slug: ranking.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ranking = await getRamenRanking(slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.ramenRanking(ranking.slug),
    image: ranking.imageUrl,
  });
}

const medalConfig = {
  1: { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-gradient-to-br from-amber-300 to-amber-500", text: "text-amber-900", label: "🥇 1位", ring: "ring-2 ring-amber-300" },
  2: { bg: "bg-slate-50", border: "border-slate-300", badge: "bg-gradient-to-br from-slate-300 to-slate-400", text: "text-slate-700", label: "🥈 2位", ring: "ring-2 ring-slate-300" },
  3: { bg: "bg-orange-50", border: "border-orange-300", badge: "bg-gradient-to-br from-orange-300 to-orange-500", text: "text-orange-900", label: "🥉 3位", ring: "ring-2 ring-orange-300" },
} as const;

function getMedal(rank: number) {
  return medalConfig[rank as keyof typeof medalConfig] ?? {
    bg: "bg-white", border: "border-slate-200", badge: "bg-slate-700", text: "text-slate-800", label: `${rank}位`, ring: "",
  };
}

export default async function RankingPage({ params }: PageProps) {
  const { slug } = await params;
  const ranking = await getRamenRanking(slug);
  if (!ranking) notFound();
  const entries = await getRankingEntries(ranking.slug);

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "ラーメン", href: routes.ramen },
    { name: ranking.title, href: routes.ramenRanking(ranking.slug) },
  ];

  const top3 = entries.filter((e) => e.entry.rank <= 3);
  const rest = entries.filter((e) => e.entry.rank > 3);

  return (
    <div className="ramen-theme">
      <JsonLd data={itemListSchema(ranking, entries)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.ramenRanking(ranking.slug), ranking.title)} />

      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[linear-gradient(135deg,#3d1508_0%,#a64019_45%,#e5a126_100%)]">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-10 sm:py-14">
          <Breadcrumbs
            items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))}
            className="[&_a]:text-white/60 [&_li]:text-white/40 [&_svg]:text-white/30"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Trophy className="h-5 w-5 text-white" />
            </span>
            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-sm">Ranking</Badge>
          </div>
          <h1 data-speakable="title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {ranking.title}
          </h1>
          <p data-speakable="description" className="mt-4 max-w-3xl text-base leading-8 text-white/80">{ranking.description}</p>
          <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:max-w-xl">
            <p className="text-sm font-bold text-white/70">編集部の結論</p>
            <p className="mt-1 text-sm leading-7 font-semibold text-white">{ranking.conclusion}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
            <span>掲載 {entries.length} 店舗</span>
            <span>最終更新: {ranking.lastUpdatedAt}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-10 space-y-10">

        {/* Top 3 podium */}
        {top3.length > 0 && (
          <section>
            <p className="section-kicker">TOP PICKS</p>
            <h2 className="section-heading mt-1">上位ランキング</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {top3.map(({ entry, item }) => {
                const medal = getMedal(entry.rank);
                const imageUrl = getRamenImageUrl(item);
                return (
                  <Link
                    key={item.slug}
                    href={routes.ramenItem(item.slug)}
                    className={`group relative overflow-hidden rounded-2xl border-2 ${medal.border} ${medal.bg} ${medal.ring} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2`}
                  >
                    <div className="relative h-40 bg-orange-100">
                      {imageUrl ? (
                        <>
                          <AttributedImage
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 768px) 33vw, 100vw"
                            credit={resolveCredit(imageUrl, item.name, item.officialUrl)}
                            variant="hover"
                            wrapperClassName="absolute inset-0"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        </>
                      ) : (
                        <RamenImagePlaceholder />
                      )}
                      <span className={`absolute left-4 top-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${medal.badge} text-lg font-black text-white shadow-md`}>
                        {entry.rank}
                      </span>
                      <div className="absolute right-4 top-4">
                        <ScoreCircle score={entry.score} size={72} />
                      </div>
                    </div>
                    <div className="p-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{item.area}</p>
                      <h3 className={`mt-0.5 text-lg font-black leading-snug ${medal.text} transition-colors group-hover:text-[var(--primary)]`}>
                        {item.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{entry.reason}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <Badge className="text-[11px]">{item.genre}</Badge>
                      {item.parking && <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">駐車場あり</Badge>}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[var(--primary)]">
                      店舗詳細 <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick table */}
        <section className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-soft">
          <div className="border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-base font-bold">{ranking.quickTableLabel}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-[var(--muted)] text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">順位</th>
                  <th className="p-4 font-semibold">店舗名</th>
                  <th className="p-4 font-semibold">ジャンル</th>
                  <th className="p-4 font-semibold">エリア</th>
                  <th className="p-4 font-semibold text-right">評価</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(({ entry, item }) => {
                  const medal = getMedal(entry.rank);
                  const imageUrl = getRamenImageUrl(item);
                  return (
                    <tr
                      key={item.slug}
                      className={`group border-t border-[var(--border)] transition-colors hover:bg-[var(--muted)] ${entry.rank <= 3 ? medal.bg : ""}`}
                    >
                      <td className="p-4">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${medal.badge} text-xs font-black text-white shadow-sm`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={routes.ramenItem(item.slug)}
                          className="flex items-center gap-3 font-bold text-slate-900 underline-offset-4 hover:text-[var(--primary)] hover:underline"
                        >
                          <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-orange-100">
                            {imageUrl ? (
                              <AttributedImage
                                src={imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <RamenImagePlaceholder />
                            )}
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      </td>
                      <td className="p-4 text-slate-500">{item.genre}</td>
                      <td className="p-4 text-slate-500">{item.area}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all"
                              style={{ width: `${entry.score}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-sm font-bold tabular-nums text-[var(--primary)]">{entry.score}<span className="text-[10px] font-normal text-slate-400">/100</span></span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4位以下 */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-slate-600">4位以下のランキング</h2>
            <div className="mt-4 space-y-3">
              {rest.map(({ entry, item }) => {
                const imageUrl = getRamenImageUrl(item);
                return (
                  <Link
                    key={item.slug}
                    href={routes.ramenItem(item.slug)}
                    className="group flex items-start gap-4 rounded-xl border border-[var(--border)] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600 transition-colors group-hover:bg-[var(--muted)] group-hover:text-[var(--primary)]">
                      {entry.rank}
                    </span>
                    <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-orange-100">
                      {imageUrl ? (
                        <AttributedImage
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="96px"
                        />
                      ) : (
                        <RamenImagePlaceholder />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 transition-colors group-hover:text-[var(--primary)]">{item.name}</h3>
                        <Badge className="text-[11px]">{item.genre}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.area} / {item.priceRange}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">{entry.reason}</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Store cards */}
        <section>
          <p className="section-kicker">STORES</p>
          <h2 className="section-heading mt-1">掲載店舗カード</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {entries.map(({ item }) => (
              <ItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        {/* Criteria */}
        <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <h2 className="font-bold">評価基準</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ranking.criteria.map((criterion) => (
              <li key={criterion} className="flex items-start gap-2 rounded-lg bg-[var(--muted)] p-3 text-sm leading-6">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                {criterion}
              </li>
            ))}
          </ul>
        </section>

        <FaqSection faqs={ranking.faqs} />
        <SourceList sources={ranking.sources} />

        <Button asChild variant="outline" size="sm">
          <Link href={routes.ramen}>← ラーメンガイドに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
