import LeisureRankingPage from "@/components/legacy-pages/leisure/spots/niigata/rankings/[slug]/page";
import { GenericRankingDetailPage } from "@/components/generic/GenericSectionPages";
import { getLeisureRankings } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

const region = "niigata";

export async function generateStaticParams() {
  const rankings = await getLeisureRankings(region);
  return rankings.map((ranking) => ({ section: "spots", slug: ranking.slug }));
}

export default async function LeisureSectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "spots") return <GenericRankingDetailPage majorCategory="leisure" sectionSlug={section} slug={slug} />;
  return <LeisureRankingPage params={Promise.resolve({ slug })} />;
}
