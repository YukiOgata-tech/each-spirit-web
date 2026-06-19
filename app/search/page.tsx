import { DiscoverySearch } from "@/components/search/DiscoverySearch";
import { SearchForm } from "@/components/search/SearchForm";
import { Badge } from "@/components/ui/badge";
import { getCategories, getSearchResults } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata = pageMetadata({
  title: "サイト内検索",
  description: "Each Spiritの記事、ランキング、店舗・商品カード、カテゴリを横断検索できます。地域、ジャンル、目的、タグから探せます。",
  path: routes.search,
});

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q : "";
  const categories = getCategories();
  const results = await getSearchResults();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-8 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-12">
          <Badge className="border-slate-300 bg-slate-50 text-slate-700">Search</Badge>
          <div className="mt-4 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">記事・店舗・ランキングを横断検索</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                地域名、店名、ジャンル、目的、タグをまとめて検索できます。カテゴリやコンテンツ種別で絞り込みながら、目的のページへ移動できます。
              </p>
            </div>
            <SearchForm className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm" placeholder="例: 新潟 ラーメン 駐車場 / 食堂 / カフェ" />
          </div>
        </div>
      </section>

      <section className="section-shell">
        <DiscoverySearch categories={categories} results={results} initialQuery={initialQuery} maxResults={48} expanded />
      </section>
    </main>
  );
}
