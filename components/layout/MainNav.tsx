import Link from "next/link";
import type { Category } from "@/lib/types";
import { routes } from "@/lib/routes";

const utilityLinks = [
  { href: routes.home, label: "トップ" },
  { href: "/#search", label: "検索" },
  { href: routes.about, label: "方針" },
];

export function MainNav({ categories }: { categories: Category[] }) {
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
        <div className="pointer-events-none absolute right-0 top-full w-[520px] translate-y-2 rounded-lg border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link key={category.slug} href={category.href} className="rounded-md border border-slate-100 p-3 transition hover:bg-slate-50">
                <span className="text-sm font-bold text-slate-950">{category.name}</span>
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {category.status === "live" ? "公開中" : "準備中"}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{category.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
