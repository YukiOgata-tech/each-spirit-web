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
      revalidate: 3600,
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
