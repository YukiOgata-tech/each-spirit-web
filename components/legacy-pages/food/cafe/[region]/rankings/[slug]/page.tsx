import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { CafeCard } from "@/components/cafe/CafeCard";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, cafeRankingItemListSchema, faqSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { getCafeRanking, getCafeRankingEntries, getCafeRankingsByRegion, getCafeRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  return await Promise.all(
    (await getCafeRegions()).map(async (r) => {
      const rankings = await getCafeRankingsByRegion(r.slug);
      return rankings.map((ranking) => ({ region: r.slug, slug: ranking.slug }));
    })
  ).then((arr) => arr.flat());
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = await getCafeRanking(region, slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.cafeRanking(region, slug),
    image: ranking.imageUrl,
  });
}

const REGION_NAME: Record<string, string> = { niigata: "新潟県", yamagata: "山形県" };

const medalConfig: Record<number, { bg: string; border: string; text: string; badge: string }> = {
  1: { bg: "bg-amber-50",  border: "border-amber-300",  text: "text-amber-700",  badge: "bg-gradient-to-br from-yellow-400 to-amber-500" },
  2: { bg: "bg-slate-50",  border: "border-slate-300",  text: "text-slate-600",  badge: "bg-gradient-to-br from-slate-300 to-slate-400" },
  3: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-gradient-to-br from-orange-300 to-orange-500" },
};
const getMedal = (rank: number) => medalConfig[rank] ?? { bg: "bg-white", border: "border-[var(--border)]", text: "text-slate-600", badge: "bg-[var(--primary)]" };

export default async function CafeRankingPage({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = await getCafeRanking(region, slug);
  if (!ranking) notFound();

  const entries = await getCafeRankingEntries(region, slug);
  const regionName = REGION_NAME[region] ?? region;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "カフェガイド", href: routes.cafe },
    { name: regionName + "のカフェ", href: routes.cafeRegion(region) },
    { name: ranking.title, href: routes.cafeRanking(region, slug) },
  ];

  const top3 = entries.filter((e) => e.entry.rank <= 3);
  const rest = entries.filter((e) => e.entry.rank > 3);

  return (
    <div className="cafe-theme section-shell">
      <JsonLd data={cafeRankingItemListSchema(region, ranking, entries)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.cafeRanking(region, slug), ranking.title)} />

      
      {/* Hero */}
      <section className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--muted)] to-[#f0e4cc]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow">
              <Trophy className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">Ranking</span>
          </div>
          <h1 data-speakable="title" className="mt-4 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{ranking.title}</h1>
          <p data-speakable="description" className="mt-3 text-sm leading-7 text-slate-600">{ranking.description}</p>
          <div className="mt-5 rounded-lg bg-white/70 p-4 text-sm leading-7 text-[var(--primary)]">
            <strong>編集部まとめ:</strong> {ranking.conclusion}
          </div>
        </div>
      </section>

      {/* Top 3 podium */}
      {top3.length > 0 && (
        <section className="mt-8">
          <h2 className="section-heading">上位3カフェ</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {top3.map(({ entry, cafe }) => {
              const m = getMedal(entry.rank);
              return (
                <Link
                  key={cafe.slug}
                  href={routes.cafeItem(region, cafe.slug)}
                  className={`group overflow-hidden rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${m.bg} ${m.border}`}
                >
                  <div className="relative h-40 bg-[var(--muted)]">
                    {cafe.imageUrl ? (
                      <AttributedImage
                        src={cafe.imageUrl}
                        alt={cafe.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 768px) 33vw, 100vw"
                        credit={resolveCredit(cafe.imageUrl, cafe.name, cafe.officialUrl)}
                        variant="hover"
                        wrapperClassName="absolute inset-0"
                      />
                    ) : null}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className={`absolute left-4 top-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow ${m.badge}`}>
                      {entry.rank}
                    </span>
                    <div className="absolute right-4 top-4">
                      <ScoreCircle score={entry.score} size={72} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <div>
                      <p className={`text-xs font-bold ${m.text}`}>{cafe.style}</p>
                      <p className="text-sm font-black leading-snug text-slate-900">{cafe.name}</p>
                    </div>
                    <p className="text-xs leading-5 text-slate-600">{entry.reason}</p>
                    <span className={`text-xs font-bold ${m.text}`}>{cafe.area}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick table */}
      <section className="mt-8 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="border-b border-[var(--border)] px-5 py-3">
          <h2 className="font-bold">{ranking.quickTableLabel}</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {entries.map(({ entry, cafe }) => {
            const m = getMedal(entry.rank);
            return (
              <Link
                key={cafe.slug}
                href={routes.cafeItem(region, cafe.slug)}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--muted)] ${entry.rank <= 3 ? m.bg : ""}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${entry.rank <= 3 ? m.badge : "bg-slate-300"}`}>
                  {entry.rank}
                </span>
                {cafe.imageUrl ? (
                  <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]">
                    <AttributedImage
                      src={cafe.imageUrl}
                      alt={cafe.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{cafe.name}</p>
                  <p className="text-[11px] text-slate-500">{cafe.area} · {cafe.style}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all"
                      style={{ width: `${entry.score}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[11px] font-bold text-[var(--primary)]">{entry.score}点</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Rest */}
      {rest.length > 0 && (
        <section className="mt-8">
          <h2 className="section-heading">4位以下のカフェ</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(({ cafe }) => (
              <CafeCard key={cafe.slug} region={region} cafe={cafe} />
            ))}
          </div>
        </section>
      )}

      {/* Criteria */}
      {ranking.criteria.length > 0 && (
        <section className="mt-8 rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold">評価基準</h2>
          <ul className="mt-4 space-y-2">
            {ranking.criteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 grid gap-6">
        <FaqSection faqs={ranking.faqs} />
        <SourceList sources={ranking.sources} />
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.cafeRegion(region)}>← {regionName}のカフェ一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
