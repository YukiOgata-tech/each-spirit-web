import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/cards/SourceList";
import { TagList } from "@/components/cards/TagList";
import { Badge } from "@/components/ui/badge";
import { mediaLabel, originLabel } from "@/components/entertainment/labels";
import {
  getContentSection,
  getContentSections,
  getGenericItemBySection,
  getGenericItemsBySection,
} from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { isAllowedImageSrc } from "@/lib/image-hosts";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

type OfficialLink = { url: string; type?: string; label?: string };

function officialLinks(metadata: Record<string, unknown>): OfficialLink[] {
  const raw = metadata.official_links;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((l) => {
    if (!l || typeof l !== "object") return [];
    const url = (l as Record<string, unknown>).url;
    if (typeof url !== "string") return [];
    return [{ url, type: String((l as Record<string, unknown>).type ?? ""), label: String((l as Record<string, unknown>).label ?? "公式サイト") }];
  });
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

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
    title: item.name,
    description: item.description,
    path: item.canonicalPath ?? routes.entertainmentTitle(section, slug),
    image: (item.imageUrl && isAllowedImageSrc(item.imageUrl) ? item.imageUrl : undefined) ?? majorMetaImage("entertainment"),
  });
}

export default async function EntertainmentTitlePage({ params }: PageProps) {
  const { section, slug } = await params;
  const [s, item] = await Promise.all([
    getContentSection("entertainment", section),
    getGenericItemBySection("entertainment", section, slug),
  ]);
  if (!s || !item) notFound();

  const metadata = item.metadata as Record<string, unknown>;
  const genres = stringArray(metadata.genres);
  const mediaTypes = stringArray(metadata.media_types);
  const links = officialLinks(metadata);
  const src = item.imageUrl && isAllowedImageSrc(item.imageUrl) ? item.imageUrl : null;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "エンターテインメント", href: routes.entertainment },
    { name: s.label, href: routes.entertainmentSection(section) },
    { name: item.name, href: item.canonicalPath ?? routes.entertainmentTitle(section, slug) },
  ];

  return (
    <div className="entertainment-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-[var(--border)] bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_55%,#fdf2f8_100%)]">
        <div className="section-shell">
          <Breadcrumbs items={breadcrumbs.map((b, i) => ({ label: b.name, href: i === breadcrumbs.length - 1 ? undefined : b.href }))} />
          <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            {src && (
              <div className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)] shadow-sm">
                <Image src={src} alt={item.name} fill sizes="(min-width:1024px) 300px, 70vw" className="object-cover" priority />
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-violet-100 text-violet-900">{originLabel(item.itemKind)}</Badge>
                <span className="text-xs font-bold text-[var(--primary)]">{s.label}</span>
              </div>
              <h1 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{item.name}</h1>
              {genres.length > 0 && (
                <p className="mt-2 text-sm font-semibold text-slate-500">{genres.join(" / ")}</p>
              )}
              <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">{item.description}</p>

              {mediaTypes.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-bold text-slate-500">メディア展開</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mediaTypes.map((m) => (
                      <span key={m} className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-slate-700">{mediaLabel(m)}</span>
                    ))}
                  </div>
                </div>
              )}

              {links.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-white px-3 py-2 text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--primary)]/5">
                      <ExternalLink className="h-4 w-4" />{l.label || "公式サイト"}
                    </a>
                  ))}
                </div>
              )}

              <TagList tags={item.tags} max={8} className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      <div className="section-shell space-y-6">
        {item.editorComment && (
          <section className="rounded-lg border border-[var(--border)] bg-white p-4 sm:p-5">
            <h2 className="text-base font-bold text-slate-900">編集メモ</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">{item.editorComment}</p>
          </section>
        )}
        {item.sources.length > 0 && <SourceList sources={item.sources} />}
      </div>
    </div>
  );
}
