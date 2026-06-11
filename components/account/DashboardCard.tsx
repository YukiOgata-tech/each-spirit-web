import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  badge?: string | number;
  action?: { label: string; href: string };
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({ title, badge, action, className, children }: DashboardCardProps) {
  return (
    <div className={cn("flex flex-col rounded-xl border border-[var(--border)] bg-white/90 p-4 sm:p-5", className)}>
      <div className="flex min-h-[28px] items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[0.875rem] font-bold tracking-wide text-slate-700">{title}</h2>
          {badge !== undefined && badge !== null && (
            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[11px] font-bold tabular-nums text-white">
              {badge}
            </span>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            {action.label} →
          </Link>
        )}
      </div>
      <div className="mt-3 flex-1">{children}</div>
    </div>
  );
}

export function DashboardCardEmpty({ message, cta }: { message: string; cta?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
      <p className="text-sm leading-relaxed text-slate-400">{message}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
