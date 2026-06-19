import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getCurrentAdminUser } from "@/lib/admin";
import { getCategories, getGenericArticles } from "@/lib/content";
import { routes } from "@/lib/routes";
import { saveArticle } from "./actions";

export const metadata: Metadata = {
  title: "記事作成 | Each Spirit",
  robots: { index: false },
};

export default async function NewArticlePage() {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    redirect(`${routes.authLogin}?next=/account/articles/new`);
  }
  const [siteCategories, genericArticles] = await Promise.all([
    Promise.resolve(getCategories()),
    getGenericArticles(),
  ]);
  const genericCategories = Array.from(new Set(genericArticles.map((article) => article.category)));
  const articleSupportedDedicatedCategories = new Set(["ramen", "beauty", "cafe"]);
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
    "sitemap.xml",
  ];
  const reservedSlugSet = new Set(reservedSlugs);
  const categoryOptions = [
    ...siteCategories.map((category) => ({
      slug: category.slug,
      path: category.status === "planned"
        ? routes.genericCategory(category.slug)
        : category.href.startsWith("/")
          ? category.href
          : "/" + category.slug,
      label: category.name,
      kind: articleSupportedDedicatedCategories.has(category.slug)
        ? "記事対応専用カテゴリ"
        : category.status === "live"
          ? "既存カテゴリ"
          : "予定カテゴリ",
      available: articleSupportedDedicatedCategories.has(category.slug) || category.status === "planned",
      note: articleSupportedDedicatedCategories.has(category.slug)
        ? "専用の記事URL構成を使用します。beauty/cafeはregion必須です。"
        : category.status === "live"
          ? "既存固定ページと衝突するため、記事カテゴリslugとしては使えません。"
          : "自由カテゴリとして使用できます。公開URLは /" + category.slug + "/[slug] です。",
    })),
    ...genericCategories
      .filter((slug) => !siteCategories.some((category) => category.slug === slug) && !reservedSlugSet.has(slug))
      .map((slug) => ({
        slug,
        path: routes.genericCategory(slug),
        label: slug,
        kind: "自由カテゴリ",
        available: true,
        note: "既存の自由カテゴリです。",
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
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1480px,calc(100%-32px))] py-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Admin editor</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-normal text-slate-950">記事作成</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Markdownで記事を書き、PCでは右側に公開表示と同じプレビューを表示します。
              </p>
            </div>
            <p className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              {admin.email}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 w-[min(1480px,calc(100%-32px))]">
        <ArticleEditor action={saveArticle} categoryOptions={categoryOptions} />
      </div>
    </main>
  );
}
