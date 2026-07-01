import { BadgeCheck, ShoppingBag, Sparkles } from "lucide-react";
import { AffiliateClickLink } from "@/components/affiliate/AffiliateClickLink";
import { getAffiliateSurface } from "@/lib/affiliate/resolve";
import type { AffiliateContentRef, AffiliatePlacement } from "@/lib/affiliate/types";

type Props = {
  content: AffiliateContentRef;
  placement?: AffiliatePlacement;
  variant?: "standard" | "compact";
  className?: string;
};

function titleFor(kind: AffiliateContentRef["kind"]) {
  if (kind === "ranking") return "ランキングの商品を探す";
  if (kind === "item") return "関連する商品・サービスを探す";
  if (kind === "article") return "記事に関連する商品を探す";
  return "関連リンク";
}

export async function AffiliateSurface({ content, placement = "default", variant = "standard", className = "" }: Props) {
  const surface = await getAffiliateSurface(content, {
    placement,
    maxLinks: variant === "compact" ? 3 : 4,
  });
  if (!surface) return null;

  if (variant === "compact") {
    return (
      <div className={`rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm ${className}`}>
        {surface.disclosureRequired && (
          <p className="mb-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" />
            {surface.target.disclosureNote}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {surface.links.map((link) => (
            <AffiliateClickLink
              key={`${link.provider}-${link.url}`}
              href={link.url}
              rel={link.rel}
              provider={link.provider}
              label={link.ctaLabel}
              targetKind={surface.target.targetKind}
              targetSlug={surface.target.targetSlug}
              targetId={surface.target.targetId}
              query={link.query}
              variant="text"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className={`overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-soft ${className}`}>
      <div className="border-b border-[var(--border)] bg-[linear-gradient(135deg,var(--muted),#ffffff)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)] text-white">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--primary)]">
              Affiliate
              <Sparkles className="h-3.5 w-3.5" />
            </p>
            <h2 className="text-lg font-bold tracking-normal text-slate-950">{titleFor(content.kind)}</h2>
          </div>
        </div>
        {surface.disclosureRequired && (
          <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-slate-500">
            <BadgeCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" />
            {surface.target.disclosureNote}
          </p>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-sm leading-7 text-slate-600">
          「{surface.target.affiliateQuery}」に関連する商品・サービスを、提携先の検索結果で確認できます。
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {surface.links.map((link) => (
            <AffiliateClickLink
              key={`${link.provider}-${link.url}`}
              href={link.url}
              rel={link.rel}
              provider={link.provider}
              label={link.ctaLabel}
              targetKind={surface.target.targetKind}
              targetSlug={surface.target.targetSlug}
              targetId={surface.target.targetId}
              query={link.query}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
