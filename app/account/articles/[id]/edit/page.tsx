import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { getArticleCategories } from "@/lib/content";
import { ArticleEditor, type ArticleInitial } from "@/components/admin/ArticleEditor";
import { routes } from "@/lib/routes";
import { saveArticle } from "../../new/actions";

export const metadata: Metadata = { title: "記事の編集", robots: { index: false } };

type PageProps = { params: Promise<{ id: string }> };

// 本文内画像から自動収集される出典は保存時に body から再生成されるため、
// 編集フォームの手動ソース欄には載せない（重複を防ぐ）。
const OFFICIAL_IMAGE_SOURCE_NOTE = "記事作成UIで記事内画像の出典として登録。";

function rid() {
  return Math.random().toString(36).slice(2);
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/articles/${id}/edit`);

  const service = createServerClient();
  const { data: row } = await service.from("articles").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();

  const meta = (row.metadata as Record<string, unknown>) ?? {};
  const author = (meta.author as Record<string, unknown> | undefined) ?? {};
  const str = (v: unknown) => (v == null ? "" : String(v));

  const rawSources = Array.isArray(meta.sources) ? (meta.sources as Record<string, unknown>[]) : [];
  const sources = rawSources
    .filter((s) => str(s.note) !== OFFICIAL_IMAGE_SOURCE_NOTE)
    .map((s) => ({
      id: rid(),
      title: str(s.title),
      url: str(s.url),
      sourceType: str(s.sourceType) || "official",
      collectedAt: str(s.collectedAt) || new Date().toISOString().slice(0, 10),
      note: str(s.note),
    }));

  const rawLinks = Array.isArray(meta.related_links) ? (meta.related_links as Record<string, unknown>[]) : [];
  const relatedLinks = rawLinks.map((l) => ({
    id: rid(),
    title: str(l.title),
    url: str(l.url),
    type: str(l.type) || "article",
    note: str(l.note),
  }));

  const rawFaqs = Array.isArray(meta.faqs) ? (meta.faqs as Record<string, unknown>[]) : [];
  const faqs = rawFaqs.map((f) => ({ id: rid(), question: str(f.question), answer: str(f.answer) }));

  const initial: ArticleInitial = {
    id: row.id,
    placement: row.major_category ? "major" : "independent",
    majorCategory: str(row.major_category) || "food",
    sectionSlug: str(row.section_slug),
    articleCategory: str(row.category),
    slug: str(row.slug),
    title: str(row.title),
    description: str(row.description),
    coverImageUrl: str(row.cover_image_url),
    authorName: str(author.name) || str(row.author_name),
    region: str(row.region),
    body: str(row.body_md),
    tags: strArray(row.tags).join(", "),
    relatedSlugs: strArray(meta.related_slugs).join(", "),
    summary: strArray(meta.summary).join("\n"),
    whatYouLearn: strArray(meta.what_you_learn).join("\n"),
    seoTitle: str(row.seo_title),
    seoDescription: str(row.seo_description),
    seoKeywords: strArray(row.seo_keywords).join(", "),
    sources,
    relatedLinks,
    faqs,
  };

  const existingCategories = await getArticleCategories();
  const categoryOptions = existingCategories.map((category) => ({
    slug: category.category,
    path: routes.articleCategory(category.category),
    label: category.category,
    kind: "既存カテゴリ",
    available: true,
    note: `${category.count}件の記事。再利用すると一覧が整理されます。`,
  }));

  return (
    <main className="min-h-screen bg-slate-100 pb-8 sm:pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1480px,calc(100%-24px))] py-5 sm:w-[min(1480px,calc(100%-32px))] sm:py-6">
          <p className="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Admin only</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[1.75rem] font-black leading-[1.15] tracking-normal text-slate-950 sm:text-3xl">{row.title} を編集</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                既存記事の内容を更新します。公開すると記事ページと関連一覧のキャッシュを更新します。
              </p>
            </div>
            <p className="max-w-full truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              {admin.email}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-4 w-[min(1480px,calc(100%-24px))] sm:mt-6 sm:w-[min(1480px,calc(100%-32px))]">
        <ArticleEditor action={saveArticle} categoryOptions={categoryOptions} initial={initial} />
      </div>
    </main>
  );
}
