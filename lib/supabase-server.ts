import "server-only";
import { createClient } from "@supabase/supabase-js";

export const ES_CONTENT_CACHE_TAG = "es-content";

const esContentFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  headers.set("x-each-spirit-cache-version", "2026-06-21-content-v1");

  return fetch(input, {
    ...init,
    headers,
    next: {
      ...(init as (RequestInit & { next?: { revalidate?: number; tags?: string[] } }) | undefined)?.next,
      // ページISR（app/layout.tsx = 2592000）と揃えて1か月。コンテンツ更新は es-content タグの
      // on-demand revalidation（/api/revalidate・seed/管理保存）で即時反映するため、これはフォールバック。
      revalidate: 2592000,
      tags: [ES_CONTENT_CACHE_TAG],
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
