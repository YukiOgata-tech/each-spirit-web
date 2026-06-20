import Link from "next/link";
import { ArrowRight, FileText, ListChecks, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { ContentSection } from "@/lib/types";

function regionLabel(mode: ContentSection["regionMode"]) {
  if (mode === "required") return "地域必須";
  if (mode === "optional") return "地域対応";
  return "地域なし";
}

export function MajorSectionDirectory({
  title = "カテゴリから探す",
  description,
  sections,
  activeSectionSlug,
}: {
  title?: string;
  description?: string;
  sections: ContentSection[];
  activeSectionSlug?: string;
}) {
  if (sections.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--primary)]">Sections</p>
        <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const active = section.sectionSlug === activeSectionSlug;
          return (
            <Link
              key={`${section.majorCategory}-${section.sectionSlug}`}
              href={section.href || `/${section.majorCategory}/${section.sectionSlug}`}
              aria-current={active ? "page" : undefined}
              className={`group flex min-h-36 flex-col rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 ${
                active ? "border-[var(--primary)]/50 ring-1 ring-[var(--primary)]/20" : "border-slate-200 hover:border-[var(--primary)]/35"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-normal text-slate-950 transition group-hover:text-[var(--primary)]">{section.label}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{section.description || `${section.label}の掲載情報をまとめています。`}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--primary)] transition group-hover:translate-x-1" />
              </div>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <Badge>{section.contentModel}</Badge>
                <Badge>{regionLabel(section.regionMode)}</Badge>
                {section.itemPathSegment && <Badge>{section.itemPathSegment}</Badge>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SectionActionNav({
  majorCategory,
  sectionSlug,
  itemCount,
  rankingCount,
  articleCount,
}: {
  majorCategory: string;
  sectionSlug: string;
  itemCount: number;
  rankingCount: number;
  articleCount: number;
}) {
  return (
    <div className="mt-6 grid gap-2 sm:grid-cols-3">
      <Button asChild variant="outline" className="h-auto justify-start gap-2 px-3 py-3 text-left">
        <Link href="#items"><ListChecks className="h-4 w-4 shrink-0" /><span className="min-w-0 truncate">掲載一覧 {itemCount}</span></Link>
      </Button>
      <Button asChild variant="outline" className="h-auto justify-start gap-2 px-3 py-3 text-left">
        <Link href={routes.sectionRankings(majorCategory, sectionSlug)}><Trophy className="h-4 w-4 shrink-0" /><span className="min-w-0 truncate">ランキング {rankingCount}</span></Link>
      </Button>
      <Button asChild variant="outline" className="h-auto justify-start gap-2 px-3 py-3 text-left">
        <Link href={routes.sectionArticles(majorCategory, sectionSlug)}><FileText className="h-4 w-4 shrink-0" /><span className="min-w-0 truncate">記事 {articleCount}</span></Link>
      </Button>
    </div>
  );
}
