export type AffiliateTargetKind = "item" | "article" | "ranking" | "section" | "custom";

export type AffiliatePlacement = "default" | "article_body" | "item_detail" | "ranking_card" | "sidebar" | "footer";

export type AffiliatePlatform = {
  id: string;
  provider: string;
  label: string;
  platformType: "shopping" | "travel" | "service" | "official" | "asp" | "other";
  description: string;
  searchUrlTemplate: string;
  directUrlTemplate?: string;
  defaultCtaLabel: string;
  defaultRel: string;
  trackingConfig: Record<string, unknown>;
  disclosureRequired: boolean;
  enabled: boolean;
  sortOrder: number;
  metadata: Record<string, unknown>;
};

export type AffiliateTarget = {
  id: string;
  targetKind: AffiliateTargetKind;
  targetId?: string;
  targetSlug?: string;
  majorCategory?: string;
  sectionSlug?: string;
  title: string;
  affiliateQuery: string;
  disclosureNote: string;
  metadata: Record<string, unknown>;
};

export type AffiliateLink = {
  provider: string;
  platformLabel: string;
  label: string;
  ctaLabel: string;
  url: string;
  rel: string;
  role: "search" | "direct" | "banner" | "text";
  placement: AffiliatePlacement;
  priority: number;
  query: string;
};

export type AffiliateSurfaceData = {
  target: AffiliateTarget;
  links: AffiliateLink[];
  disclosureRequired: boolean;
};

export type AffiliateContentRef = {
  kind: AffiliateTargetKind;
  title: string;
  targetId?: string;
  targetSlug?: string;
  majorCategory?: string;
  sectionSlug?: string;
};
