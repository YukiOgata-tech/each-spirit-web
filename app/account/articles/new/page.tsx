import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getCurrentAdminUser } from "@/lib/admin";
import { getArticleCategories } from "@/lib/content";
import { routes } from "@/lib/routes";
import { saveArticle } from "./actions";

export const metadata: Metadata = {
  title: "記事作成",
  robots: { index: false },
};

export default async function NewArticlePage() {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    redirect(`${routes.authLogin}?next=/account/articles/new`);
  }
  // 記事URLは /articles/[記事カテゴリ]/[slug]。記事カテゴリは独立した名前空間なので
  // 固定ページ（/about 等）とは衝突しない。既存カテゴリを候補として提示し、表記揺れを防ぐ。
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
              <h1 className="text-[1.75rem] font-black leading-[1.15] tracking-normal text-slate-950 sm:text-3xl">記事作成</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Markdownで記事を書き、PCでは右側に公開表示と同じプレビューを表示します。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/account/manage"
                className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-900 transition hover:border-orange-400 hover:bg-orange-50"
              >
                <Pencil className="h-3.5 w-3.5 text-orange-500" />
                既存を修正
              </Link>
              <p className="max-w-full truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                {admin.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-4 w-[min(1480px,calc(100%-24px))] sm:mt-6 sm:w-[min(1480px,calc(100%-32px))]">
        <ArticleEditor action={saveArticle} categoryOptions={categoryOptions} />
      </div>
    </main>
  );
}
