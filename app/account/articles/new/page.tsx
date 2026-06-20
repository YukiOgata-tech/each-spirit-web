import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getCurrentAdminUser } from "@/lib/admin";
import { getCategories } from "@/lib/content";
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
  const siteCategories = getCategories();
  const reservedSlugs = [
    "about",
    "account",
    "api",
    "apple-icon.png",
    "articles",
    "auth",
    "contact",
    "disclaimer",
    "fortune",
    "icon.png",
    "llms.txt",
    "opengraph-image",
    "privacy",
    "robots.txt",
    "search",
    "sitemap.xml",
  ];
  const categoryOptions = [
    ...siteCategories.map((category) => ({
      slug: category.slug,
      path: category.href.startsWith("/") ? category.href : "/" + category.slug,
      label: category.name,
      kind: "大カテゴリ",
      available: category.status === "live",
      note: "記事URLは /" + category.slug + "/[中カテゴリ]/articles/[slug] です。",
    })),
    ...reservedSlugs.map((slug) => ({
      slug,
      path: "/" + slug,
      label: slug,
      kind: "予約済み",
      available: false,
      note: "システム/固定ページのためカテゴリslugには使えません。",
    })),
  ];

  return (
    <main className="min-h-screen bg-slate-100 pb-8 sm:pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1480px,calc(100%-24px))] py-5 sm:w-[min(1480px,calc(100%-32px))] sm:py-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Admin editor</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[1.75rem] font-black leading-[1.15] tracking-normal text-slate-950 sm:text-3xl">記事作成</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Markdownで記事を書き、PCでは右側に公開表示と同じプレビューを表示します。
              </p>
            </div>
            <p className="max-w-full truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              {admin.email}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-4 w-[min(1480px,calc(100%-24px))] sm:mt-6 sm:w-[min(1480px,calc(100%-32px))]">
        <ArticleEditor action={saveArticle} categoryOptions={categoryOptions} />
      </div>
    </main>
  );
}
