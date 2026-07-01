"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { AffiliateTargetKind } from "@/lib/affiliate/types";

type Props = {
  href: string;
  rel: string;
  provider: string;
  label: string;
  targetKind: AffiliateTargetKind;
  targetSlug?: string;
  targetId?: string;
  query: string;
  variant?: "button" | "text";
};

export function AffiliateClickLink({
  href,
  rel,
  provider,
  label,
  targetKind,
  targetSlug,
  targetId,
  query,
  variant = "button",
}: Props) {
  const onClick = () => {
    trackEvent("affiliate_click", {
      platform: provider,
      target_kind: targetKind,
      target_slug: targetSlug,
      target_id: targetId,
      query,
    });
  };

  if (variant === "text") {
    return (
      <a
        href={href}
        target="_blank"
        rel={rel}
        onClick={onClick}
        className="inline-flex items-center gap-1 text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline"
      >
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:brightness-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      {label}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
