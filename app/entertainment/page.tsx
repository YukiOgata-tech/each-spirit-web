import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { TitleCard } from "@/components/entertainment/TitleCard";
import { toCatalogTitle } from "@/components/entertainment/labels";
import { getContentSections, getGenericItemsBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "エンターテインメント作品ガイド｜アニメを原作・ジャンルから探す",
  description: "アニメをはじめとする作品を、原作タイプ・ジャンル・メディア展開から探せるカテゴリ。今後TV・ドラマなども追加予定です。",
  path: routes.entertainment,
  image: majorMetaImage("entertainment"),
});

export default async function EntertainmentPage() {
  const sections = await getContentSections("entertainment");

  // 各セクションの作品を集約して「注目の作品」に少しずつ出す（section 汎用）
  const lists = await Promise.all(sections.map((s) => getGenericItemsBySection("entertainment", s.sectionSlug)));
  const featured = sections
    .flatMap((s, i) => lists[i].slice(0, 8).map((item) => toCatalogTitle(item, item.canonicalPath ?? routes.entertainmentTitle(s.sectionSlug, item.slug))))
    .slice(0, 12);

  const primary = sections[0];

  return (
    <div className="entertainment-theme">
      <MajorCategoryHero
        major="entertainment"
        variant="collage"
        surfaceClass="bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_52%,#fdf2f8_100%)]"
        eyebrow="Entertainment Guide"
        title={<>原作とジャンルで選ぶ、<span className="text-[var(--primary)]">作品ガイド</span>。</>}
        description="アニメを原作タイプ・ジャンル・メディア展開から探せます。今後TV・ドラマなどのセクションも追加していきます。"
        actions={primary ? [{ label: `${primary.label}を見る`, href: routes.entertainmentSection(primary.sectionSlug), primary: true }, { label: "カテゴリ一覧", href: "#sections" }] : []}
      />

      <section id="sections" className="section-shell">
        <MajorSectionDirectory
          title="エンタメカテゴリ"
          description="アニメなど、エンターテインメント内の公開中カテゴリを横断できます。"
          sections={sections}
        />

        {featured.length > 0 && (
          <div className="mt-8">
            <div className="mb-4">
              <p className="section-kicker">Pickup</p>
              <h2 className="section-heading mt-2">注目の作品</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((t) => <TitleCard key={t.slug} title={t} />)}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
