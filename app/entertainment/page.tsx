import Link from "next/link";
import { AppWindow, ArrowRight, CalendarDays, Clapperboard, Gamepad2, Sparkles, Tv } from "lucide-react";
import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { TitleCard } from "@/components/entertainment/TitleCard";
import { toCatalogTitle } from "@/components/entertainment/labels";
import { getContentSections, getGenericItemsBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";
import type { ContentSection } from "@/lib/types";

export const metadata = pageMetadata({
  title: "エンターテインメント比較ガイド｜アニメ・ドラマ・アプリ・ゲーム・イベント",
  description: "アニメ・ドラマ・アプリ・ゲーム・イベントなど、エンタメ全般をジャンル横断で整理する比較ガイド。気になるジャンルから作品やサービスを探せます。",
  path: routes.entertainment,
  image: majorMetaImage("entertainment"),
});

// セクション（ジャンル）ごとのアイコン。未知ジャンルは Sparkles にフォールバック。
const GENRE_ICONS: Record<string, typeof Tv> = {
  anime: Tv,
  drama: Clapperboard,
  apps: AppWindow,
  "game-apps": Gamepad2,
  events: CalendarDays,
};
function genreIcon(slug: string) {
  return GENRE_ICONS[slug] ?? Sparkles;
}

export default async function EntertainmentPage() {
  // 準備中（draft）も含めて取得し、sort_order 順にジャンル一覧として表示する
  const sections = await getContentSections("entertainment", { includeUnpublished: true });
  const published = sections.filter((s) => s.status === "published");

  // 公開ジャンルの作品数・注目作品
  const lists = await Promise.all(published.map((s) => getGenericItemsBySection("entertainment", s.sectionSlug)));
  const countBySlug = new Map(published.map((s, i) => [s.sectionSlug, lists[i].length]));
  const featured = published
    .flatMap((s, i) => lists[i].slice(0, 4).map((item) => toCatalogTitle(item, item.canonicalPath ?? routes.entertainmentTitle(s.sectionSlug, item.slug))))
    .slice(0, 8);

  const firstPublished = published[0];

  return (
    <div className="entertainment-theme">
      <MajorCategoryHero
        major="entertainment"
        variant="collage"
        surfaceClass="bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_52%,#fdf2f8_100%)]"
        eyebrow="Entertainment"
        title={<>観る・遊ぶ・体験するを、<span className="text-[var(--primary)]">ジャンルから探す</span>。</>}
        description="アニメ・ドラマ・アプリ・ゲーム・イベントなど、エンタメ全般をジャンル横断で整理。気になるジャンルから作品やサービスを比較できます。"
        actions={[
          ...(firstPublished ? [{ label: `${firstPublished.label}を見る`, href: routes.entertainmentSection(firstPublished.sectionSlug), primary: true }] : []),
          { label: "ジャンル一覧", href: "#genres" },
        ]}
      />

      {/* ジャンル一覧（主役）。今後追加するジャンルも content_sections に足すだけで順に並ぶ。 */}
      <section id="genres" className="section-shell">
        <div className="mb-5">
          <p className="section-kicker">Genres</p>
          <h2 className="section-heading mt-2">ジャンルから探す</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            エンタメのジャンルを順次追加していきます。公開済みはそのまま、準備中のジャンルも今後のラインナップとして掲載しています。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sections.map((section) => (
            <GenreCard key={section.sectionSlug} section={section} count={countBySlug.get(section.sectionSlug) ?? 0} />
          ))}
        </div>
      </section>

      {/* 注目の作品（公開ジャンル横断） */}
      {featured.length > 0 && (
        <section className="section-shell">
          <div className="mb-4">
            <p className="section-kicker">Pickup</p>
            <h2 className="section-heading mt-2">注目の作品</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((t) => <TitleCard key={t.slug} title={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function GenreCard({ section, count }: { section: ContentSection; count: number }) {
  const Icon = genreIcon(section.sectionSlug);
  const isLive = section.status === "published";

  if (!isLive) {
    return (
      <div className="flex h-full flex-col gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-400">
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-400">準備中</span>
        </div>
        <h3 className="mt-1 text-base font-bold text-slate-500">{section.label}</h3>
        <p className="line-clamp-2 text-xs leading-5 text-slate-400">{section.description}</p>
      </div>
    );
  }

  return (
    <Link
      href={section.href}
      className="group flex h-full flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-md sm:p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </span>
        {count > 0 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{count}作品</span>}
      </div>
      <h3 className="mt-1 text-base font-bold text-slate-950 transition-colors group-hover:text-[var(--primary)]">{section.label}</h3>
      <p className="line-clamp-2 text-xs leading-5 text-slate-600">{section.description}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-bold text-[var(--primary)]">
        見る <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
