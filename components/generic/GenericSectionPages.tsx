import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, MapPin, Trophy } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MajorSectionDirectory, SectionActionNav } from "@/components/generic/SectionNavigation";
import {
  articleHref,
  getArticlesBySection,
  getContentSections,
  getContentSection,
  getGenericItemBySection,
  getGenericItemsBySection,
  getRankingBySection,
  getRankingsBySection,
  rankingHref,
} from "@/lib/content";
import { breadcrumbSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";
import type { ContentSection, GenericItem } from "@/lib/types";

export const majorCategoryLabels: Record<string, string> = {
  food: "グルメ",
  health: "健康",
  beauty: "美容",
  travel: "旅行",
  leisure: "レジャー",
};

export const dedicatedSections: Record<string, Set<string>> = {
  food: new Set(["ramen", "cafe"]),
  health: new Set(["protein"]),
  beauty: new Set(["hair-salon"]),
  travel: new Set(["stays", "services"]),
  leisure: new Set(["spots"]),
};

export function isDedicatedSection(majorCategory: string, sectionSlug: string) {
  return dedicatedSections[majorCategory]?.has(sectionSlug) ?? false;
}

export async function getGenericSectionConfig(majorCategory: string, sectionSlug: string) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section) return undefined;
  return {
    majorCategory,
    sectionSlug,
    majorLabel: majorCategoryLabels[majorCategory] ?? majorCategory,
    sectionLabel: section.label,
    sectionHref: section.href || `/${majorCategory}/${sectionSlug}`,
  };
}

export async function genericSectionMetadata(majorCategory: string, sectionSlug: string) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section) return {};
  const seoTitle = typeof section.seoConfig.title === "string" ? section.seoConfig.title : section.label;
  const seoDescription = typeof section.seoConfig.description === "string" ? section.seoConfig.description : section.description || `${section.label}の掲載情報をまとめています。`;
  return pageMetadata({ title: seoTitle, description: seoDescription, path: section.href || `/${majorCategory}/${sectionSlug}` });
}

export async function genericItemMetadata(majorCategory: string, sectionSlug: string, itemPathSegment: string, slug: string) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section || (section.itemPathSegment ?? "items") !== itemPathSegment) return {};
  const item = await getGenericItemBySection(majorCategory, sectionSlug, slug);
  if (!item) return {};
  return pageMetadata({
    title: item.name,
    description: item.description,
    path: itemHref(section, item),
    image: item.imageUrl,
  });
}

export async function genericRankingMetadata(majorCategory: string, sectionSlug: string, slug: string) {
  const ranking = await getRankingBySection(majorCategory, sectionSlug, slug);
  if (!ranking) return {};
  return pageMetadata({ title: ranking.title, description: ranking.description, path: rankingHref(ranking) });
}

function itemHref(section: ContentSection, item: GenericItem) {
  return item.canonicalPath ?? routes.sectionItem(section.majorCategory, section.sectionSlug, section.itemPathSegment ?? "items", item.slug);
}

function GenericItemCard({ section, item }: { section: ContentSection; item: GenericItem }) {
  return (
    <Link
      href={itemHref(section, item)}
      className="group block h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <div className="flex h-full flex-col gap-4">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {item.region && <Badge>{item.region}</Badge>}
            {item.area && <Badge>{item.area}</Badge>}
            {item.tags.slice(0, 2).map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <h3 className="text-lg font-bold tracking-normal text-slate-950 transition group-hover:text-[var(--primary)]">{item.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{item.description}</p>
        </div>
        <div className="mt-auto space-y-3 text-sm text-slate-500">
          {(item.area || item.address) && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
              <span>{item.area || item.address}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
            詳しく見る
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function metadataEntries(metadata: Record<string, unknown>) {
  return Object.entries(metadata)
    .filter(([key, value]) => !["sources", "faqs", "official_links", "related_ranking_slugs"].includes(key) && value !== "" && value != null)
    .slice(0, 12)
    .map(([key, value]) => ({ key, value: Array.isArray(value) ? value.join(", ") : String(value) }));
}

export async function GenericSectionIndex({ majorCategory, sectionSlug }: { majorCategory: string; sectionSlug: string }) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section) notFound();

  const [items, rankings, articles] = await Promise.all([
    getGenericItemsBySection(majorCategory, sectionSlug),
    getRankingsBySection(majorCategory, sectionSlug),
    getArticlesBySection(majorCategory, sectionSlug),
  ]);
  const sections = await getContentSections(majorCategory);
  const majorLabel = majorCategoryLabels[majorCategory] ?? majorCategory;
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: majorLabel, href: routes.majorCategory(majorCategory) },
    { name: section.label, href: section.href || `/${majorCategory}/${sectionSlug}` },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={speakableWebPageSchema(section.href || `/${majorCategory}/${sectionSlug}`, section.label)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-[var(--primary)]">{majorLabel}</p>
        <h1 data-speakable="title" className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">{section.label}</h1>
        <p data-speakable="description" className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{section.description || `${section.label}の店舗・商品・記事を整理しています。`}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge>{items.length}件</Badge>
          <Badge>{rankings.length}ランキング</Badge>
          <Badge>{articles.length}記事</Badge>
        </div>
        <SectionActionNav majorCategory={majorCategory} sectionSlug={sectionSlug} itemCount={items.length} rankingCount={rankings.length} articleCount={articles.length} />
      </section>

      <section id="items" className="mt-8 scroll-mt-24">
        <div className="mb-4">
          <div>
            <p className="text-sm font-semibold text-[var(--primary)]">Items</p>
            <h2 className="text-2xl font-bold tracking-normal text-slate-950">掲載一覧</h2>
          </div>
        </div>
        {items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => <GenericItemCard key={item.id ?? item.slug} section={section} item={item} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">このカテゴリの公開 item はまだありません。</div>
        )}
      </section>

      {rankings.length > 0 && (
        <section className="mt-10">
          <p className="text-sm font-semibold text-[var(--primary)]">Rankings</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">ランキング</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {rankings.map((ranking) => <RankingCard key={ranking.slug} ranking={ranking} href={rankingHref(ranking)} />)}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mt-10">
          <p className="text-sm font-semibold text-[var(--primary)]">Articles</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">記事</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => <ArticleCard key={article.slug} article={article} href={articleHref(article)} />)}
          </div>
        </section>
      )}

      <MajorSectionDirectory
        title={`${majorLabel}の他カテゴリ`}
        description="同じ大カテゴリ内の公開中 section へ移動できます。"
        sections={sections}
        activeSectionSlug={sectionSlug}
      />
    </main>
  );
}

export async function GenericItemDetailPage({
  majorCategory,
  sectionSlug,
  itemPathSegment,
  slug,
}: {
  majorCategory: string;
  sectionSlug: string;
  itemPathSegment: string;
  slug: string;
}) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section || (section.itemPathSegment ?? "items") !== itemPathSegment) notFound();
  const item = await getGenericItemBySection(majorCategory, sectionSlug, slug);
  if (!item) notFound();

  const majorLabel = majorCategoryLabels[majorCategory] ?? majorCategory;
  const path = itemHref(section, item);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: majorLabel, href: routes.majorCategory(majorCategory) },
    { name: section.label, href: section.href || `/${majorCategory}/${sectionSlug}` },
    { name: item.name, href: path },
  ];
  const details = metadataEntries(item.metadata);

  return (
    <main className="section-shell max-w-5xl">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={speakableWebPageSchema(path, item.name)} />
      <Breadcrumbs items={breadcrumbs.map((entry, index) => ({ label: entry.name, href: index === breadcrumbs.length - 1 ? undefined : entry.href }))} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-[var(--primary)]">{majorLabel} / {section.label}</p>
        <h1 data-speakable="title" className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">{item.name}</h1>
        <p data-speakable="description" className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{item.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.region && <Badge>{item.region}</Badge>}
          {item.area && <Badge>{item.area}</Badge>}
          {item.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold tracking-normal text-slate-950">基本情報</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            {[
              ["エリア", item.area],
              ["住所", item.address],
              ["電話", item.phone],
              ["価格帯", item.priceRange],
              ["最終確認日", item.lastVerifiedAt],
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label} className="rounded-md bg-slate-50 p-3">
                <dt className="text-xs font-bold text-slate-500">{label}</dt>
                <dd className="mt-1 text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          {details.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold tracking-normal text-slate-950">詳細</h2>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                {details.map((entry) => (
                  <div key={entry.key} className="rounded-md bg-slate-50 p-3">
                    <dt className="text-xs font-bold text-slate-500">{entry.key}</dt>
                    <dd className="mt-1 text-slate-900">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {item.editorComment && (
            <div className="mt-8 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
              <h2 className="text-base font-bold text-slate-950">編集部コメント</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.editorComment}</p>
            </div>
          )}
        </section>

        <aside className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Explore</p>
            <div className="mt-3 space-y-2">
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={section.href || `/${majorCategory}/${sectionSlug}`}>カテゴリトップ<ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={routes.sectionRankings(majorCategory, sectionSlug)}>ランキング<Trophy className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={routes.sectionArticles(majorCategory, sectionSlug)}>記事<ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={routes.majorCategory(majorCategory)}>{majorLabel}トップ<ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          {item.officialUrl && (
            <Button asChild className="w-full justify-between">
              <Link href={item.officialUrl} target="_blank" rel="noreferrer">公式サイト<ExternalLink className="h-4 w-4" /></Link>
            </Button>
          )}
          {item.mapUrl && (
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href={item.mapUrl} target="_blank" rel="noreferrer">地図を見る<MapPin className="h-4 w-4" /></Link>
            </Button>
          )}
        </aside>
      </div>
    </main>
  );
}

export async function GenericRankingDetailPage({ majorCategory, sectionSlug, slug }: { majorCategory: string; sectionSlug: string; slug: string }) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section) notFound();
  const ranking = await getRankingBySection(majorCategory, sectionSlug, slug);
  if (!ranking) notFound();

  const majorLabel = majorCategoryLabels[majorCategory] ?? majorCategory;
  const path = rankingHref(ranking);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: majorLabel, href: routes.majorCategory(majorCategory) },
    { name: section.label, href: section.href || `/${majorCategory}/${sectionSlug}` },
    { name: ranking.title, href: path },
  ];

  return (
    <main className="section-shell max-w-5xl">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs.map((entry, index) => ({ label: entry.name, href: index === breadcrumbs.length - 1 ? undefined : entry.href }))} />
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--primary)]"><Trophy className="h-4 w-4" />Ranking</div>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">{ranking.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{ranking.description}</p>
      </section>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold tracking-normal text-slate-950">ランキング項目</h2>
        <div className="mt-4 space-y-3">
          {ranking.items.map((item) => (
            <div key={`${item.rank}-${item.itemSlug}`} className="rounded-md border border-slate-200 p-4">
              <p className="text-sm font-bold text-[var(--primary)]">#{item.rank} {item.itemSlug}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.reason}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 grid gap-2 sm:grid-cols-3">
        <Button asChild variant="outline" className="justify-between">
          <Link href={section.href || `/${majorCategory}/${sectionSlug}`}>カテゴリトップ<ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="justify-between">
          <Link href={routes.sectionRankings(majorCategory, sectionSlug)}>ランキング一覧<Trophy className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="justify-between">
          <Link href={routes.sectionArticles(majorCategory, sectionSlug)}>記事一覧<ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>
    </main>
  );
}
