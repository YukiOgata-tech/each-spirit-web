"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SearchForm({
  className,
  placeholder = "記事・店舗・ランキングを検索",
  size = "default",
}: {
  className?: string;
  placeholder?: string;
  size?: "default" | "compact";
}) {
  return (
    <form action={routes.search} className={cn("flex min-w-0 items-center gap-2", size === "default" && "max-sm:flex-col", className)}>
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">サイト内検索</span>
        <Search className={cn("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", size === "compact" ? "h-4 w-4" : "h-5 w-5")} />
        <input
          name="q"
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-slate-300 bg-white text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100",
            size === "compact" ? "h-10 pl-9 pr-3 text-sm" : "h-12 pl-11 pr-3 text-base shadow-sm",
          )}
        />
      </label>
      <Button type="submit" size={size === "compact" ? "sm" : "default"} className={cn("shrink-0", size === "default" && "max-sm:w-full")}>
        検索
      </Button>
    </form>
  );
}
