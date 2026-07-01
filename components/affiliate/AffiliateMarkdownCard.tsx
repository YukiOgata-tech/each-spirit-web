import { BadgeCheck, ShoppingBag } from "lucide-react";
import { AffiliateClickLink } from "@/components/affiliate/AffiliateClickLink";
import { getAffiliateLinksForQuery } from "@/lib/affiliate/resolve";
import type { AffiliateContentRef } from "@/lib/affiliate/types";

type Props = {
  query: string;
  title?: string;
  description?: string;
  content?: Partial<AffiliateContentRef>;
};

export async function AffiliateMarkdownCard({ query, title, description, content }: Props) {
  const { links, disclosureRequired } = await getAffiliateLinksForQuery(query, { maxLinks: 4 });
  if (links.length === 0) return null;

  const targetKind = content?.kind ?? "custom";
  const heading = title?.trim() || "関連する商品を探す";

  return (
    <aside className="overflow-hidden rounded-xl border border-[var(--primary)]/20 bg-[linear-gradient(135deg,var(--primary)/5,#ffffff)] shadow-sm">
      <div className="border-b border-[var(--primary)]/10 bg-[var(--primary)]/5 px-4 py-3 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-white">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase text-[var(--primary)]">Affiliate</p>
            <h3 className="text-base font-bold tracking-normal text-slate-950">{heading}</h3>
            {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-5">
        {disclosureRequired ? (
          <p className="mb-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" />
            このカードには広告・アフィリエイトリンクを含みます。価格や在庫はリンク先で確認してください。
          </p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {links.map((link) => (
            <AffiliateClickLink
              key={`${link.provider}-${link.url}`}
              href={link.url}
              rel={link.rel}
              provider={link.provider}
              label={link.ctaLabel}
              targetKind={targetKind}
              targetSlug={content?.targetSlug}
              targetId={content?.targetId}
              query={link.query}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
