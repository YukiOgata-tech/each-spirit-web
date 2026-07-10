import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { LeisureRankingCard } from "@/components/leisure/LeisureRankingCard";
import { NewsFeatureCard } from "@/components/cards/NewsArticleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { articleHref, getArticlesBySection, getCategory, getLeisureRankings, getLeisureRegions, getContentSections } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

export const metadata = pageMetadata({
  title: "レジャー・お出かけスポットおすすめ比較ガイド｜人気の遊び場ランキングと選び方",
  description: "新潟を中心に、アウトドア、インドア、雨の日、子連れ、車なしで選べるレジャースポットを整理するカテゴリページです。",
  path: routes.leisure,
  image: majorMetaImage("leisure"),
});

const regionNames: Record<string, string> = {
  niigata: "新潟",
};

const regionImages: Record<string, { src: string; alt: string }> = {
  niigata: {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    alt: "新潟レジャーを想起させる山と自然の風景",
  },
};

export default async function LeisurePage() {
  const category = getCategory("leisure");
  const [regions, sections, rankings, articles] = await Promise.all([
    getLeisureRegions(),
    getContentSections("leisure"),
    getLeisureRankings("niigata"),
    getArticlesBySection("leisure", "spots"),
  ]);

  return (
    <div className="leisure-theme">
      <MajorCategoryHero
        major="leisure"
        variant="scatter"
        surfaceClass="bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_52%,#fff4e6_100%)]"
        eyebrow="Leisure Guide"
        title={<>天候と同行者で選ぶ、<span className="text-[var(--primary)]">地域別レジャー</span>。</>}
        description="アウトドア、インドア、雨の日、子連れ、車なしなど、実際の予定に合わせて選べるようにスポット情報とランキングを整理します。"
        actions={[{ label: "新潟のレジャーを見る", href: routes.leisureRegion("niigata"), primary: true }, { label: "地域一覧", href: "#regions" }]}
      />

      <section id="regions" className="section-shell">
        <MajorSectionDirectory
          title="レジャーカテゴリ"
          description="スポットなど、レジャー内の公開中カテゴリを横断できます。"
          sections={sections}
        />

        {category?.searchFacets?.length ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {category.searchFacets.map((facet) => <Badge key={facet} className="bg-cyan-50 text-cyan-900">{facet}</Badge>)}
          </div>
        ) : null}

        <div className="mb-5">
          <p className="section-kicker">Regions</p>
          <h2 className="section-heading mt-2">公開中の地域</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {regions.map((region) => {
            const regionImage = regionImages[region] ?? regionImages.niigata;
            return (
            <Link key={region} href={routes.leisureRegion(region)} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative aspect-[16/9]">
                <Image
                  src={regionImage.src}
                  alt={regionImage.alt}
                  fill
                  unoptimized={shouldUnoptimizeImage(regionImage.src)}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 to-transparent" />
                <Badge className="absolute bottom-3 left-3 bg-white text-cyan-900">{regionNames[region] ?? region}</Badge>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-bold text-slate-950 sm:text-xl">{regionNames[region] ?? region}のおすすめレジャー</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">屋外・屋内・雨の日・子連れを分けて、公式情報ベースで比較します。</p>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      {rankings.length > 0 && (
        <section className="section-shell">
          <div className="mb-5 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">目的別の人気ランキング</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rankings.slice(0, 4).map((ranking) => (
              <LeisureRankingCard key={ranking.slug} region="niigata" ranking={ranking} />
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="section-shell">
          <div className="mb-5 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">読みもの・選び方ガイド</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <NewsFeatureCard key={article.slug} article={article} href={articleHref(article)} />
            ))}
          </div>
        </section>
      )}

      <section className="section-shell">
        <div className="overflow-hidden rounded-lg border border-cyan-200 bg-[linear-gradient(135deg,#e6fbff_0%,#fff_55%,#fff0d8_100%)] p-6 shadow-soft sm:p-9">
          <h2 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">行き先に迷ったら</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            天候・同行者・移動手段でレジャースポットを比較。まずは新潟のスポット一覧とランキングからチェックしてみてください。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={routes.leisureRegion("niigata")}>新潟のレジャーを見る<ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.sectionRankings("leisure", "spots")}>
                <Trophy className="h-4 w-4" />ランキング一覧
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
