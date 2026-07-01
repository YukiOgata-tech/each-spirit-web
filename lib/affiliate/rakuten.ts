import "server-only";

const RAKUTEN_ITEM_SEARCH_ENDPOINT = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601";

type RakutenItemSearchResponse = {
  Items?: Array<{
    Item?: {
      affiliateUrl?: string;
      itemUrl?: string;
    };
  }>;
};

export function hasRakutenApiCredentials() {
  return Boolean(process.env.RAKUTEN_APPLICATION_ID && process.env.RAKUTEN_AFFILIATE_ID);
}

export async function getRakutenAffiliateSearchUrl(query: string): Promise<string | undefined> {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (!applicationId || !affiliateId || query.trim() === "") return undefined;

  const url = new URL(RAKUTEN_ITEM_SEARCH_ENDPOINT);
  url.searchParams.set("applicationId", applicationId);
  url.searchParams.set("affiliateId", affiliateId);
  if (accessKey) url.searchParams.set("accessKey", accessKey);
  url.searchParams.set("keyword", query);
  url.searchParams.set("hits", "1");
  url.searchParams.set("sort", "standard");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { accept: "application/json" },
    });
    if (!res.ok) return undefined;
    const json = (await res.json()) as RakutenItemSearchResponse;
    return json.Items?.[0]?.Item?.affiliateUrl ?? json.Items?.[0]?.Item?.itemUrl;
  } catch {
    return undefined;
  }
}
