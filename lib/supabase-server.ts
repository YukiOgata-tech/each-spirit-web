import "server-only";
import { createClient } from "@supabase/supabase-js";

export const ES_CONTENT_CACHE_TAG = "es-content";
export const ES_ARTICLES_CACHE_TAG = "es-articles";
export const ES_ITEMS_CACHE_TAG = "es-items";
export const ES_RANKINGS_CACHE_TAG = "es-rankings";

function cacheTagsForInput(input: Parameters<typeof fetch>[0]) {
  const tags = [ES_CONTENT_CACHE_TAG];
  const url = typeof input === "string"
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url;

  try {
    const table = new URL(url).pathname.split("/").filter(Boolean).at(-1);
    if (table === "articles") tags.push(ES_ARTICLES_CACHE_TAG);
    if (table === "items") tags.push(ES_ITEMS_CACHE_TAG);
    if (table === "rankings") tags.push(ES_RANKINGS_CACHE_TAG);
  } catch {
    // Non-URL inputs still share the global content tag.
  }

  return tags;
}

const esContentFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  headers.set("x-each-spirit-cache-version", "2026-07-14-content-v2");

  return fetch(input, {
    ...init,
    headers,
    next: {
      ...(init as (RequestInit & { next?: { revalidate?: number; tags?: string[] } }) | undefined)?.next,
      // ページISR（app/layout.tsx = 2592000）と揃えて1か月。コンテンツ更新は
      // table別タグの on-demand revalidation で即時反映するため、これはフォールバック。
      revalidate: 2592000,
      tags: cacheTagsForInput(input),
    },
  } as RequestInit & { next: { revalidate: number; tags: string[] } });
};

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "es" },
      global: { fetch: esContentFetch },
    }
  );
}

/**
 * キャッシュを挟まない service-role クライアント。
 * ISR データキャッシュ（esContentFetch は revalidate=1か月）を経由すると古い行を
 * 読んでしまうため、差分 revalidate の判定など「常に最新を読む」用途で使う。
 */
export function createUncachedServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "es" },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    }
  );
}
