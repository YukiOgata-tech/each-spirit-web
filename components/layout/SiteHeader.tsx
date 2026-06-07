import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { MainNav } from "@/components/layout/MainNav";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/content";
import { routes } from "@/lib/routes";

export function SiteHeader() {
  const categories = getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-[min(1360px,calc(100%-40px))] items-center justify-between gap-4 max-sm:w-[min(1360px,calc(100%-24px))]">
        <Link href={routes.home} className="flex items-center gap-3" aria-label="Each Spirit トップへ">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"><Image src="/brand/each-spirit-mark.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" priority /></span>
          <span>
            <span className="block text-base font-bold tracking-normal text-slate-950 sm:text-lg">Each Spirit</span>
            <span className="hidden text-[11px] font-semibold text-slate-500 sm:block">比較と選び方の編集メディア</span>
          </span>
        </Link>
        <MainNav categories={categories} />
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/#search">
            <Search className="h-4 w-4" />
            探す
          </Link>
        </Button>
      </div>
      <div className="border-t border-slate-100 lg:hidden">
        <div className="compact-scroll mx-auto w-[min(1360px,calc(100%-40px))] py-2 max-sm:w-[min(1360px,calc(100%-24px))]">
          {categories.map((category) => (
            <Link key={category.slug} href={category.href} className="min-w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
              {category.name}
            </Link>
          ))}
          <Link href="/#search" className="min-w-fit rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
            検索
          </Link>
        </div>
      </div>
    </header>
  );
}
