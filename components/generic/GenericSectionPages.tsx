import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, ImageOff, MapPin, Trophy } from "lucide-react";
import { NewsFeatureCard } from "@/components/cards/NewsArticleCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { TagList } from "@/components/cards/TagList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AffiliateSurface } from "@/components/affiliate/AffiliateSurface";
import { AffiliateClickLink } from "@/components/affiliate/AffiliateClickLink";
import { MajorSectionDirectory, SectionActionNav } from "@/components/generic/SectionNavigation";
import { ItemDetail } from "@/components/detail/ItemDetail";
import { getAffiliateLinksForQuery } from "@/lib/affiliate/resolve";
import {
  articleHref,
  getArticlesBySection,
  getContentSections,
  getContentSection,
  getGenericItemBySection,
  getGenericItemsBySection,
  getRankingBySection,
  getRankingEntriesBySection,
  getRankingsBySection,
  rankingHref,
} from "@/lib/content";
import { breadcrumbSchema, itemKeywords, ogItemImageUrl, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { ogRankingImage, routes } from "@/lib/routes";
import { majorMetaImage } from "@/lib/category-media";
import { safeImageSrc } from "@/lib/image-hosts";
import type { ContentSection, GenericItem } from "@/lib/types";

type GenericTheme = {
  className: string;
  hero: string;
  accentPanel: string;
  imageFallback: string;
  soft: string;
  label: string;
};

export const majorCategoryLabels: Record<string, string> = {
  food: "グルメ",
  health: "健康",
  beauty: "美容",
  travel: "旅行",
  leisure: "レジャー",
  entertainment: "エンターテインメント",
};

const genericThemes: Record<string, GenericTheme> = {
  food: {
    className: "ramen-theme",
    hero: "bg-[linear-gradient(135deg,#fff7eb_0%,#ffffff_48%,#f8e1c2_100%)]",
    accentPanel: "border-orange-200 bg-orange-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#fff7eb,#fde9c9)]",
    soft: "bg-orange-50 text-orange-950",
    label: "味・価格・エリアを比較",
  },
  health: {
    className: "protein-theme",
    hero: "bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_50%,#fff7ed_100%)]",
    accentPanel: "border-blue-200 bg-blue-50/75",
    imageFallback: "bg-[linear-gradient(135deg,#eff6ff,#dbeafe,#fff7ed)]",
    soft: "bg-blue-50 text-blue-950",
    label: "目的・成分・続けやすさで比較",
  },
  beauty: {
    className: "beauty-theme",
    hero: "bg-[linear-gradient(135deg,#fff1f7_0%,#ffffff_48%,#f1efff_100%)]",
    accentPanel: "border-pink-200 bg-pink-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#fff1f7,#f3e8ff)]",
    soft: "bg-pink-50 text-pink-950",
    label: "雰囲気・施術・通いやすさで比較",
  },
  travel: {
    className: "travel-theme",
    hero: "bg-[linear-gradient(135deg,#eef8f0_0%,#ffffff_48%,#f5ede0_100%)]",
    accentPanel: "border-emerald-200 bg-emerald-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#e7f4ea,#f5ede0)]",
    soft: "bg-emerald-50 text-emerald-950",
    label: "滞在・移動・相談しやすさで比較",
  },
  leisure: {
    className: "leisure-theme",
    hero: "bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_50%,#fff4e6_100%)]",
    accentPanel: "border-cyan-200 bg-cyan-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#ecfeff,#fff4e6)]",
    soft: "bg-cyan-50 text-cyan-950",
    label: "天候・同行者・移動手段で比較",
  },
  entertainment: {
    className: "entertainment-theme",
    hero: "bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_50%,#fdf2f8_100%)]",
    accentPanel: "border-violet-200 bg-violet-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#f5f3ff,#fce7f3)]",
    soft: "bg-violet-50 text-violet-950",
    label: "原作・ジャンル・メディア展開で比較",
  },
};

function genericTheme(majorCategory: string): GenericTheme {
  return genericThemes[majorCategory] ?? genericThemes.food;
}

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
  return pageMetadata({ title: seoTitle, description: seoDescription, path: section.href || `/${majorCategory}/${sectionSlug}`, image: majorMetaImage(majorCategory) });
}

export async function genericItemMetadata(majorCategory: string, sectionSlug: string, itemPathSegment: string, slug: string) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section || (section.itemPathSegment ?? "items") !== itemPathSegment) return {};
  const item = await getGenericItemBySection(majorCategory, sectionSlug, slug);
  if (!item) return {};
  return pageMetadata({
    title: item.seoTitle || item.name,
    description: item.seoDescription || item.description,
    path: itemHref(section, item),
    image: item.seoOgImage ?? ogItemImageUrl(majorCategory, sectionSlug, slug),
    keywords: itemKeywords(item, section.label, item.seoKeywords),
  });
}

export async function genericRankingMetadata(majorCategory: string, sectionSlug: string, slug: string) {
  const ranking = await getRankingBySection(majorCategory, sectionSlug, slug);
  if (!ranking) return {};
  return pageMetadata({ title: ranking.title, description: ranking.description, path: rankingHref(ranking), image: ranking.imageUrl });
}

function itemHref(section: ContentSection, item: GenericItem) {
  return item.canonicalPath ?? routes.sectionItem(section.majorCategory, section.sectionSlug, section.itemPathSegment ?? "items", item.slug);
}

function entryKey(entry: { rank: number; itemSlug: string }) {
  return `${entry.rank}-${entry.itemSlug}`;
}

function GenericItemCard({ section, item, theme }: { section: ContentSection; item: GenericItem; theme: GenericTheme }) {
  return (
    <Link
      href={itemHref(section, item)}
      className="group block h-full overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${theme.imageFallback}`}>
            <ImageOff className="h-8 w-8 text-[var(--primary)]/55" />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,23,42,0.64)_100%)]" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          {item.region && <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-slate-900">{item.region}</span>}
          {item.area && <span className="rounded-full bg-white/86 px-2.5 py-1 text-[11px] font-bold text-slate-900">{item.area}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-normal text-slate-950 transition group-hover:text-[var(--primary)]">{item.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{item.description}</p>
          <TagList tags={item.tags} className="mt-2.5" />
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
  const theme = genericTheme(majorCategory);
  const featured = items.find((item) => item.imageUrl) ?? items[0];
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: majorLabel, href: routes.majorCategory(majorCategory) },
    { name: section.label, href: section.href || `/${majorCategory}/${sectionSlug}` },
  ];

  return (
    <main className={`${theme.className} section-shell`}>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={speakableWebPageSchema(section.href || `/${majorCategory}/${sectionSlug}`, section.label)} />
      
      <section className={`overflow-hidden rounded-lg border border-[var(--border)] ${theme.hero} shadow-soft`}>
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-h-[360px] flex-col justify-between p-5 sm:p-8 lg:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{majorLabel}</Badge>
                <Badge>{theme.label}</Badge>
              </div>
              <h1 data-speakable="title" className="mt-5 max-w-3xl text-4xl font-black tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">{section.label}</h1>
              <p data-speakable="description" className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">{section.description || `${section.label}の店舗・商品・記事を整理しています。`}</p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["掲載", `${items.length}件`],
                ["ランキング", `${rankings.length}本`],
                ["記事", `${articles.length}本`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/70 bg-white/78 p-4 shadow-sm backdrop-blur">
                  <p className="text-[11px] font-bold uppercase text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden lg:min-h-[460px]">
            {featured?.imageUrl ? (
              <Image
                src={featured.imageUrl}
                alt={featured.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className={`h-full min-h-[280px] ${theme.imageFallback}`} />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.58)_100%)]" />
            {featured && (
              <Link href={itemHref(section, featured)} className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur transition hover:-translate-y-1 sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[11px] font-bold uppercase text-[var(--primary)]">Featured</p>
                <p className="mt-1 text-lg font-black text-slate-950">{featured.name}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{featured.description}</p>
              </Link>
            )}
          </div>
        </div>
        <div className="border-t border-white/65 bg-white/70 px-5 pb-5 backdrop-blur sm:px-8 sm:pb-8 lg:px-10">
          <SectionActionNav majorCategory={majorCategory} sectionSlug={sectionSlug} itemCount={items.length} rankingCount={rankings.length} articleCount={articles.length} />
        </div>
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
            {items.map((item) => <GenericItemCard key={item.id ?? item.slug} section={section} item={item} theme={theme} />)}
          </div>
        ) : (
          <div className={`rounded-lg border border-dashed p-6 text-sm text-slate-600 ${theme.accentPanel}`}>このカテゴリの公開 item はまだありません。</div>
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
        <section id="articles" className="mt-10 scroll-mt-24">
          <p className="text-sm font-semibold text-[var(--primary)]">Articles</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">記事</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => <NewsFeatureCard key={article.slug} article={article} href={articleHref(article)} />)}
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

  return <ItemDetail item={item} section={section} majorLabel={majorLabel} path={path} breadcrumbs={breadcrumbs} />;
}


export async function GenericRankingDetailPage({ majorCategory, sectionSlug, slug }: { majorCategory: string; sectionSlug: string; slug: string }) {
  const section = await getContentSection(majorCategory, sectionSlug);
  if (!section) notFound();
  const resolved = await getRankingEntriesBySection(majorCategory, sectionSlug, slug);
  if (!resolved) notFound();
  const { ranking, entries } = resolved;

  const majorLabel = majorCategoryLabels[majorCategory] ?? majorCategory;
  const theme = genericTheme(majorCategory);
  const path = rankingHref(ranking);
  const scoreLabel = ranking.quickTableLabel || "スコア";
  const sectionTop = section.href || `/${majorCategory}/${sectionSlug}`;
  const entryAffiliateRows = await Promise.all(
    entries.map(async ({ entry }) => {
      const query = entry.affiliateQuery?.trim();
      if (!query) return [entryKey(entry), undefined] as const;
      const result = await getAffiliateLinksForQuery(query, { maxLinks: 2 });
      return [entryKey(entry), result] as const;
    }),
  );
  const affiliateByEntry = new Map(entryAffiliateRows);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: majorLabel, href: routes.majorCategory(majorCategory) },
    { name: section.label, href: sectionTop },
    { name: ranking.title, href: path },
  ];

  return (
    <main className={`${theme.className} section-shell max-w-5xl`}>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={speakableWebPageSchema(path, ranking.title)} />
      
      {/* Hero */}
      <section className={`overflow-hidden rounded-lg border border-[var(--border)] shadow-soft ${theme.hero}`}>
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-h-[260px] flex-col justify-center p-5 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--primary)]"><Trophy className="h-4 w-4" />{majorLabel} / {section.label} ランキング</div>
            <h1 data-speakable="title" className="mt-3 text-[1.75rem] font-black leading-[1.12] tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">{ranking.title}</h1>
            <p data-speakable="description" className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">{ranking.description}</p>
            {ranking.criteria.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {ranking.criteria.map((c) => <Badge key={c}>{c}</Badge>)}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500 sm:text-xs">
              <span className="rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">{entries.length}項目</span>
              {ranking.region && <span className="rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">{ranking.region}</span>}
              {ranking.lastUpdatedAt && <span className="rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">更新 {ranking.lastUpdatedAt}</span>}
            </div>
          </div>
          <div className="relative min-h-[200px] overflow-hidden lg:min-h-[360px]">
            <Image src={safeImageSrc(ranking.imageUrl, ogRankingImage(ranking.title))} alt={ranking.title} fill priority sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.42)_100%)]" />
          </div>
        </div>
      </section>

      <AffiliateSurface
        content={{
          kind: "ranking",
          title: ranking.title,
          targetSlug: ranking.slug,
          majorCategory,
          sectionSlug,
        }}
        className="mt-8"
      />

      {/* Entries */}
      <section id="ranking" className="mt-8 scroll-mt-24 space-y-4">
        {entries.map(({ entry, item }) => {
          const key = entryKey(entry);
          const top = entry.rank <= 3;
          const href = item ? (item.canonicalPath ?? itemHref(section, item)) : entry.externalUrl;
          const isExternal = !item && Boolean(entry.externalUrl);
          const name = item?.name ?? entry.displayName ?? entry.itemSlug;
          const imageUrl = item?.imageUrl ?? entry.imageUrl;
          const description = entry.reason || entry.description;
          const tags = item?.tags?.length ? item.tags : (entry.tags ?? []);
          const areaText = [item?.region, item?.area ?? entry.area].filter(Boolean).join(" ・ ");
          const priceRange = item?.priceRange ?? entry.priceRange;
          const affiliate = affiliateByEntry.get(key);
          const body = (
            <div className="grid gap-4 p-4 sm:grid-cols-[8rem_1fr] sm:p-5 lg:grid-cols-[12rem_1fr]">
              <div className="group/image relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--muted)]">
                {imageUrl ? (
                  <Image src={safeImageSrc(imageUrl, ogRankingImage(name))} alt={entry.imageAlt || name} fill sizes="(min-width: 1024px) 192px, 40vw" className="object-cover transition-transform duration-500 group-hover/image:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center"><ImageOff className="h-7 w-7 text-[var(--primary)]/40" /></div>
                )}
                <span className={`absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow ${top ? "bg-[var(--primary)] text-white" : "bg-white/92 text-slate-700"}`}>{entry.rank}</span>
                {entry.isPr && <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">PR</span>}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold tracking-normal text-slate-950 transition-colors group-hover:text-[var(--primary)] sm:text-xl">{name}</h3>
                {areaText && (
                  <p className="mt-1 text-xs font-medium text-slate-400">{areaText}</p>
                )}
                {description && <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{description}</p>}
                <TagList tags={tags} max={3} className="mt-2" />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {entry.score > 0 && (
                    <span className="inline-flex items-baseline gap-1 rounded-md bg-[var(--muted)] px-2.5 py-1 text-sm font-black text-[var(--primary)]">
                      {entry.score}<span className="text-[10px] font-bold text-slate-500">{scoreLabel}</span>
                    </span>
                  )}
                  {priceRange && <span className="text-xs font-semibold text-slate-500">{priceRange}</span>}
                  {href && (
                    isExternal ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] underline-offset-4 hover:underline sm:text-sm">
                        公式・詳細を見る
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link href={href} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] underline-offset-4 hover:underline sm:text-sm">
                        詳しく見る
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )
                  )}
                </div>
                {affiliate && affiliate.links.length > 0 && (
                  <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/35 p-3">
                    {affiliate.disclosureRequired && (
                      <p className="mb-2 text-[11px] leading-5 text-slate-500">この項目には広告・アフィリエイトリンクを含みます。価格や在庫はリンク先で確認してください。</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {affiliate.links.map((link) => (
                        <AffiliateClickLink
                          key={`${link.provider}-${link.url}`}
                          href={link.url}
                          rel={link.rel}
                          provider={link.provider}
                          label={link.ctaLabel}
                          targetKind="ranking"
                          targetSlug={`${ranking.slug}:${entry.itemSlug}`}
                          query={link.query}
                          variant="text"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
          const cardClass = `overflow-hidden rounded-lg border bg-white shadow-sm transition ${top ? "border-[var(--primary)]/35" : "border-[var(--border)]"}`;
          return <div key={key} className={cardClass}>{body}</div>;
        })}
      </section>

      {ranking.conclusion && (
        <section className={`mt-8 rounded-lg border p-5 sm:p-6 ${theme.accentPanel}`}>
          <h2 className="text-lg font-bold tracking-normal text-slate-950">まとめ</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">{ranking.conclusion}</p>
        </section>
      )}

      <section className="mt-8 grid gap-2 sm:grid-cols-3">
        <Button asChild variant="outline" className="justify-between">
          <Link href={sectionTop}>カテゴリトップ<ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="justify-between">
          <Link href={routes.sectionRankings(majorCategory, sectionSlug)}>ランキング一覧<Trophy className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="justify-between">
          <Link href={`${sectionTop}#articles`}>記事一覧<ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>
    </main>
  );
}
