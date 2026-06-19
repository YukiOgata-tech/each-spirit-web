import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/MainNav";
import { MobileHeaderMenu } from "@/components/layout/MobileHeaderMenu";
import { AuthButtonClient } from "@/components/auth/AuthButtonClient";
import { SearchForm } from "@/components/search/SearchForm";
import { getCategories, getSearchResults } from "@/lib/content";
import { routes } from "@/lib/routes";

export async function SiteHeader() {
  const categories = getCategories();
  const searchResults = await getSearchResults();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-[min(1360px,calc(100%-40px))] items-center justify-between gap-2 max-sm:w-[min(1360px,calc(100%-24px))] sm:h-16 sm:gap-3">
        <Link href={routes.home} className="group flex items-center gap-3 transition-opacity duration-150 hover:opacity-80" aria-label="Each Spirit トップへ">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-transform duration-150 group-hover:scale-105 sm:h-10 sm:w-10"><Image src="/brand/each-spirit-mark.png" alt="" width={36} height={36} className="h-8 w-8 object-contain sm:h-9 sm:w-9" priority /></span>
          <span className="min-w-0">
            <span className="block text-base font-bold tracking-normal text-slate-950 sm:text-lg">Each Spirit</span>
            <span className="hidden text-[11px] font-semibold text-slate-500 sm:block">比較と選び方の編集メディア</span>
          </span>
        </Link>
        <MainNav categories={categories} />
        <SearchForm size="compact" className="hidden min-w-[260px] max-w-md flex-1 xl:flex" placeholder="記事・店舗を検索" />
        <AuthButtonClient />
        <MobileHeaderMenu categories={categories} results={searchResults} />
      </div>
    </header>
  );
}
