import { notFound } from "next/navigation";
import LeisureRankingPage from "@/components/legacy-pages/leisure/spots/niigata/rankings/[slug]/page";
import { getLeisureRankings } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

const region = "niigata";

export async function generateStaticParams() {
  const rankings = await getLeisureRankings(region);
  return rankings.map((ranking) => ({ section: "spots", slug: ranking.slug }));
}

export default async function LeisureSectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "spots") notFound();
  return <LeisureRankingPage params={Promise.resolve({ slug })} />;
}
