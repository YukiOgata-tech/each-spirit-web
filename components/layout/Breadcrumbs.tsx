import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="パンくずリスト" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1">
          {item.href ? <Link className="hover:text-slate-900" href={item.href}>{item.label}</Link> : <span className="text-slate-800">{item.label}</span>}
          {index < items.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
        </span>
      ))}
    </nav>
  );
}
