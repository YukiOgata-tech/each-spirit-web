import "server-only";
import { absoluteUrl, siteUrl } from "@/lib/routes";

const DEFAULT_INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const DEFAULT_INDEXNOW_KEY = "fb03dba18173b405decf141e25a0c52e";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY;
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || DEFAULT_INDEXNOW_ENDPOINT;

type IndexNowResult =
  | { enabled: false; submittedCount: 0; reason: "missing-key" | "empty-urls" }
  | { enabled: true; submittedCount: number; status: number; ok: boolean; error?: string };

function isIndexablePath(path: string) {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("/api/")) return false;
  if (path.startsWith("/_next/")) return false;
  if (path === "/sitemap.xml" || path === "/robots.txt") return false;
  if (/\.(?:xml|txt|json|png|jpe?g|gif|webp|svg|ico|css|js|map|pdf)$/i.test(path)) return false;
  return true;
}

export function indexableAbsoluteUrls(paths: Iterable<string>) {
  return [...new Set([...paths].filter(isIndexablePath).map((path) => absoluteUrl(path)))];
}

export async function submitIndexNow(paths: Iterable<string>): Promise<IndexNowResult> {
  if (!INDEXNOW_KEY) return { enabled: false, submittedCount: 0, reason: "missing-key" };

  const urlList = indexableAbsoluteUrls(paths).slice(0, 10000);
  if (urlList.length === 0) return { enabled: false, submittedCount: 0, reason: "empty-urls" };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key: INDEXNOW_KEY,
        urlList,
      }),
    });

    return { enabled: true, submittedCount: urlList.length, status: response.status, ok: response.ok };
  } catch (error) {
    return {
      enabled: true,
      submittedCount: urlList.length,
      status: 0,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown IndexNow error",
    };
  }
}
