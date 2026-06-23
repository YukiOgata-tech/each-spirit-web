import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ItemDetail } from "@/components/detail/ItemDetail";
import {
  getContentSection,
  getContentSections,
  getGenericItemBySection,
  getGenericItemsBySection,
} from "@/lib/content";
import { itemKeywords, ogItemImageUrl, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const sections = await getContentSections("entertainment");
  const lists = await Promise.all(sections.map((s) => getGenericItemsBySection("entertainment", s.sectionSlug)));
  return sections.flatMap((s, i) => lists[i].map((item) => ({ section: s.sectionSlug, slug: item.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const item = await getGenericItemBySection("entertainment", section, slug);
  if (!item) return {};
  return pageMetadata({
    title: item.seoTitle || item.name,
    description: item.seoDescription || item.description,
    path: item.canonicalPath ?? routes.entertainmentTitle(section, slug),
    image: item.seoOgImage ?? ogItemImageUrl("entertainment", section, slug),
    keywords: itemKeywords(item, item.sectionSlug === "anime" ? "アニメ" : item.sectionSlug === "drama" ? "ドラマ" : undefined, item.seoKeywords),
  });
}

export default async function EntertainmentTitlePage({ params }: PageProps) {
  const { section, slug } = await params;
  const [s, item] = await Promise.all([
    getContentSection("entertainment", section),
    getGenericItemBySection("entertainment", section, slug),
  ]);
  if (!s || !item) notFound();

  const path = item.canonicalPath ?? routes.entertainmentTitle(section, slug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "エンターテインメント", href: routes.entertainment },
    { name: s.label, href: routes.entertainmentSection(section) },
    { name: item.name, href: path },
  ];

  return <ItemDetail item={item} section={s} majorLabel="エンターテインメント" path={path} breadcrumbs={breadcrumbs} />;
}
