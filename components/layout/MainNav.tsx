import Link from "next/link";
import { Fingerprint } from "lucide-react";
import type { Category } from "@/lib/types";
import { routes } from "@/lib/routes";

const utilityLinks = [
  { href: routes.home, label: "トップ" },
  { href: routes.search, label: "検索" },
];

export function MainNav({ categories }: { categories: Category[] }) {
  const liveCategories = categories.filter((category) => category.status === "live");

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="メインナビゲーション">
      {utilityLinks.map((link) => (
        <Link key={link.href} href={link.href} className="nav-link">
          {link.label}
        </Link>
      ))}
      <div className="group relative">
        <Link href="/#categories" className="nav-link">
          カテゴリ
        </Link>
        <div className="pointer-events-none fixed left-1/2 top-16 z-50 w-[min(680px,calc(100vw-32px))] -translate-x-1/2 translate-y-2 rounded-lg border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            {liveCategories.map((category) => (
              <Link key={category.slug} href={category.href} className="group rounded-md border border-slate-100 p-3 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]">
                <span className="text-sm font-bold text-slate-950 transition-colors duration-150 group-hover:text-[var(--primary)]">{category.name}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{category.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link
        href={routes.mystery}
        className="ml-1 inline-flex h-10 items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-stone-100 shadow-sm transition hover:-translate-y-0.5 hover:border-red-700 hover:bg-slate-900 active:translate-y-0"
      >
        <Fingerprint className="h-4 w-4 text-red-500" />
        謎解き局
      </Link>
      <Link
        href={routes.fortune}
        className="ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 px-4 text-sm font-black text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/35 active:translate-y-0"
      >
        デイリー占い
      </Link>
    </nav>
  );
}
