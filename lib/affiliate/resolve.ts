import "server-only";

import { createServerClient } from "@/lib/supabase-server";
import { getRakutenAffiliateSearchUrl, hasRakutenApiCredentials } from "@/lib/affiliate/rakuten";
import type {
  AffiliateContentRef,
  AffiliateLink,
  AffiliatePlacement,
  AffiliatePlatform,
  AffiliateSurfaceData,
  AffiliateTarget,
} from "@/lib/affiliate/types";

type PlatformRow = {
  id: string;
  provider: string;
  label: string;
  platform_type: AffiliatePlatform["platformType"];
  description: string | null;
  search_url_template: string;
  direct_url_template: string | null;
  default_cta_label: string;
  default_rel: string;
  tracking_config: Record<string, unknown> | null;
  disclosure_required: boolean;
  enabled: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
};

type TargetRow = {
  id: string;
  target_kind: AffiliateTarget["targetKind"];
  target_id: string | null;
  target_slug: string | null;
  major_category: string | null;
  section_slug: string | null;
  title: string;
  affiliate_query: string;
  disclosure_note: string;
  metadata: Record<string, unknown> | null;
};

type LinkRow = {
  id: string;
  affiliate_target_id: string;
  platform_id: string;
  label: string | null;
  cta_label: string | null;
  url: string | null;
  query: string | null;
  link_role: AffiliateLink["role"];
  placement: AffiliatePlacement;
  priority: number;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
};

function mapPlatform(row: PlatformRow): AffiliatePlatform {
  const trackingConfig = row.tracking_config ?? {};
  if (row.provider === "amazon" && process.env.AMAZON_ASSOCIATE_TAG) {
    trackingConfig.associate_tag = process.env.AMAZON_ASSOCIATE_TAG;
  }

  return {
    id: row.id,
    provider: row.provider,
    label: row.label,
    platformType: row.platform_type,
    description: row.description ?? "",
    searchUrlTemplate: row.search_url_template,
    directUrlTemplate: row.direct_url_template ?? undefined,
    defaultCtaLabel: row.default_cta_label,
    defaultRel: row.default_rel,
    trackingConfig,
    disclosureRequired: row.disclosure_required,
    enabled: row.enabled,
    sortOrder: row.sort_order,
    metadata: row.metadata ?? {},
  };
}

function mapTarget(row: TargetRow): AffiliateTarget {
  return {
    id: row.id,
    targetKind: row.target_kind,
    targetId: row.target_id ?? undefined,
    targetSlug: row.target_slug ?? undefined,
    majorCategory: row.major_category ?? undefined,
    sectionSlug: row.section_slug ?? undefined,
    title: row.title,
    affiliateQuery: row.affiliate_query,
    disclosureNote: row.disclosure_note,
    metadata: row.metadata ?? {},
  };
}

function fallbackPlatforms(): AffiliatePlatform[] {
  const platforms: AffiliatePlatform[] = [];

  if (hasRakutenApiCredentials()) {
    platforms.push({
      id: "fallback-rakuten",
      provider: "rakuten",
      label: "楽天市場",
      platformType: "shopping",
      description: "楽天市場の商品検索",
      searchUrlTemplate: "https://search.rakuten.co.jp/search/mall/{{query}}/",
      defaultCtaLabel: "楽天で探す",
      defaultRel: "sponsored nofollow noopener noreferrer",
      trackingConfig: {},
      disclosureRequired: true,
      enabled: true,
      sortOrder: 20,
      metadata: { source: "env_fallback" },
    });
  }

  const amazonAssociateTag = process.env.AMAZON_ASSOCIATE_TAG;
  if (amazonAssociateTag) {
    platforms.push({
      id: "fallback-amazon",
      provider: "amazon",
      label: "Amazon",
      platformType: "shopping",
      description: "Amazon.co.jp の商品検索",
      searchUrlTemplate: "https://www.amazon.co.jp/s?k={{query}}&tag={{associate_tag}}",
      defaultCtaLabel: "Amazonで探す",
      defaultRel: "sponsored nofollow noopener noreferrer",
      trackingConfig: { associate_tag: amazonAssociateTag },
      disclosureRequired: true,
      enabled: true,
      sortOrder: 30,
      metadata: { source: "env_fallback" },
    });
  }

  return platforms;
}

function replaceTemplate(template: string, query: string, platform: AffiliatePlatform) {
  const replacements = new Map<string, string>([
    ["query", encodeURIComponent(query)],
    ["query_raw", query],
  ]);

  for (const [key, value] of Object.entries(platform.trackingConfig)) {
    if (typeof value === "string" || typeof value === "number") {
      replacements.set(key, String(value));
    }
  }

  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => replacements.get(key) ?? "");
}

function inActiveWindow(link: LinkRow, now = Date.now()) {
  const starts = link.starts_at ? Date.parse(link.starts_at) : undefined;
  const ends = link.ends_at ? Date.parse(link.ends_at) : undefined;
  return (starts === undefined || starts <= now) && (ends === undefined || ends > now);
}

async function resolvePlatformUrl(platform: AffiliatePlatform, query: string, explicitUrl?: string) {
  if (explicitUrl) return replaceTemplate(explicitUrl, query, platform);
  if (platform.provider === "rakuten") {
    const rakutenUrl = await getRakutenAffiliateSearchUrl(query);
    if (rakutenUrl) return rakutenUrl;
  }
  return replaceTemplate(platform.searchUrlTemplate, query, platform);
}

async function findAffiliateTarget(ref: AffiliateContentRef): Promise<AffiliateTarget | undefined> {
  const sb = createServerClient();

  if (ref.targetId) {
    const { data } = await sb
      .from("affiliate_targets")
      .select("*")
      .eq("target_kind", ref.kind)
      .eq("target_id", ref.targetId)
      .eq("status", "active")
      .maybeSingle();
    if (data) return mapTarget(data as TargetRow);
  }

  if (!ref.targetSlug) return undefined;
  let query = sb
    .from("affiliate_targets")
    .select("*")
    .eq("target_kind", ref.kind)
    .eq("target_slug", ref.targetSlug)
    .eq("status", "active");

  if (ref.majorCategory) query = query.eq("major_category", ref.majorCategory);
  if (ref.sectionSlug) query = query.eq("section_slug", ref.sectionSlug);

  const { data } = await query.order("updated_at", { ascending: false }).limit(1).maybeSingle();
  return data ? mapTarget(data as TargetRow) : undefined;
}

export async function getAffiliateSurface(
  ref: AffiliateContentRef,
  options: { placement?: AffiliatePlacement; maxLinks?: number } = {},
): Promise<AffiliateSurfaceData | undefined> {
  const placement = options.placement ?? "default";
  const target = await findAffiliateTarget(ref);
  if (!target) return undefined;

  const sb = createServerClient();
  const [{ data: platformRows }, { data: linkRows }] = await Promise.all([
    sb
      .from("affiliate_platforms")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true })
      .order("provider", { ascending: true }),
    sb
      .from("affiliate_links")
      .select("*")
      .eq("affiliate_target_id", target.id)
      .eq("status", "active")
      .order("priority", { ascending: true }),
  ]);

  const platforms = ((platformRows ?? []) as PlatformRow[]).map(mapPlatform);
  if (platforms.length === 0) platforms.push(...fallbackPlatforms());
  if (platforms.length === 0) return undefined;

  const platformById = new Map(platforms.map((platform) => [platform.id, platform]));
  const activeLinks = ((linkRows ?? []) as LinkRow[])
    .filter((link) => inActiveWindow(link))
    .filter((link) => link.placement === placement || link.placement === "default");
  const configuredProvider = new Set(activeLinks.map((link) => platformById.get(link.platform_id)?.provider).filter(Boolean));

  const explicitLinks = await Promise.all(
    activeLinks.map(async (link): Promise<AffiliateLink | undefined> => {
      const platform = platformById.get(link.platform_id);
      if (!platform) return undefined;
      const query = (link.query ?? target.affiliateQuery).trim();
      if (!query) return undefined;
      const url = await resolvePlatformUrl(platform, query, link.url ?? undefined);
      return {
        provider: platform.provider,
        platformLabel: platform.label,
        label: link.label ?? platform.label,
        ctaLabel: link.cta_label ?? platform.defaultCtaLabel,
        url,
        rel: platform.defaultRel,
        role: link.link_role,
        placement: link.placement,
        priority: link.priority,
        query,
      };
    }),
  );

  const generatedLinks = await Promise.all(
    platforms
      .filter((platform) => !configuredProvider.has(platform.provider))
      .map(async (platform): Promise<AffiliateLink> => {
        const url = await resolvePlatformUrl(platform, target.affiliateQuery);
        return {
          provider: platform.provider,
          platformLabel: platform.label,
          label: platform.label,
          ctaLabel: platform.defaultCtaLabel,
          url,
          rel: platform.defaultRel,
          role: "search",
          placement,
          priority: 1000 + platform.sortOrder,
          query: target.affiliateQuery,
        };
      }),
  );

  const links = [...explicitLinks.filter((link): link is AffiliateLink => Boolean(link)), ...generatedLinks]
    .sort((a, b) => a.priority - b.priority || a.platformLabel.localeCompare(b.platformLabel, "ja"))
    .slice(0, options.maxLinks ?? 4);

  if (links.length === 0) return undefined;

  return {
    target,
    links,
    disclosureRequired: platforms.some((platform) => platform.disclosureRequired),
  };
}
