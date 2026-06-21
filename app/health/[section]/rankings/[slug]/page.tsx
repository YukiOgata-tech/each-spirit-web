import { notFound } from "next/navigation";
import ProteinRankingPage from "@/app/health/[section]/[segment]/rankings/[slug]/page";
import { GenericRankingDetailPage } from "@/components/generic/GenericSectionPages";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getProteinRanking, getProteinRankings } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const rankings = await getProteinRankings();
  return rankings.map((ranking) => ({ section: "protein", slug: ranking.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") return {};
  const ranking = await getProteinRanking(slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.sectionRanking("health", "protein", slug),
  });
}

export default async function HealthSectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") return <GenericRankingDetailPage majorCategory="health" sectionSlug={section} slug={slug} />;
  const ranking = await getProteinRanking(slug);
  if (!ranking) notFound();
  return <ProteinRankingPage params={Promise.resolve({ section, segment: ranking.target, slug })} />;
}
