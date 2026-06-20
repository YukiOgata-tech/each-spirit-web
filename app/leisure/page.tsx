import Link from "next/link";
import Image from "next/image";
import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { Badge } from "@/components/ui/badge";
import { getCategory, getLeisureRegions, getContentSections } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";

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
  const [regions, sections] = await Promise.all([getLeisureRegions(), getContentSections("leisure")]);

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
          {regions.map((region) => (
            <Link key={region} href={routes.leisureRegion(region)} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative aspect-[16/9]">
                <Image
                  src={regionImages[region]?.src ?? regionImages.niigata.src}
                  alt={regionImages[region]?.alt ?? regionImages.niigata.alt}
                  fill
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
          ))}
        </div>
      </section>
    </div>
  );
}
