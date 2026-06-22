import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EntertainmentCatalog } from "@/components/entertainment/EntertainmentCatalog";
import { toCatalogTitle } from "@/components/entertainment/labels";
import {
  articleHref,
  getArticlesBySection,
  getContentSection,
  getContentSections,
  getGenericItemsBySection,
} from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };

export async function generateStaticParams() {
  const sections = await getContentSections("entertainment");
  return sections.map((s) => ({ section: s.sectionSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section } = await params;
  const s = await getContentSection("entertainment", section);
  if (!s) return {};
  return pageMetadata({
    title: `${s.label}作品一覧｜原作・ジャンルから探す`,
    description: s.description || `${s.label}の作品を原作タイプ・ジャンル・メディア展開から探せます。`,
    path: routes.entertainmentSection(section),
    image: majorMetaImage("entertainment"),
  });
}

export default async function EntertainmentSectionPage({ params }: PageProps) {
  const { section } = await params;
  const s = await getContentSection("entertainment", section);
  if (!s) notFound();

  const [items, articles] = await Promise.all([
    getGenericItemsBySection("entertainment", section),
    getArticlesBySection("entertainment", section),
  ]);
  const titles = items.map((it) => toCatalogTitle(it, it.canonicalPath ?? routes.entertainmentTitle(section, it.slug)));

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "エンターテインメント", href: routes.entertainment },
    { name: s.label, href: routes.entertainmentSection(section) },
  ];

  return (
    <div className="entertainment-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-[var(--border)] bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_55%,#fdf2f8_100%)]">
        <div className="section-shell">
          <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
          <p className="section-kicker mt-3">Entertainment / {s.label}</p>
          <h1 className="section-heading mt-2">{s.label}の作品を探す</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{s.description}</p>
        </div>
      </section>

      <section className="section-shell">
        <EntertainmentCatalog titles={titles} />
      </section>

      {articles.length > 0 && (
        <section className="section-shell">
          <h2 className="section-heading mb-4">{s.label}の記事</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} href={articleHref(article)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
