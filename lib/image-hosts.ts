/**
 * next/image で描画を許可する外部ホスト一覧（remotePatterns の単一ソース）。
 * next.config.ts がこの配列から remotePatterns を生成する。
 *
 * 併せて、データ由来の不正URL（期限切れのSNS CDN など）でページ全体がクラッシュしないよう、
 * 実行時に「描画可能な src か」を判定するヘルパーを提供する。許可外なら呼び出し側が
 * フォールバック画像へ落とせる。
 */
export const ALLOWED_IMAGE_HOSTS = [
  // Supabase Storage（each-spirit-images / article-assets バケットの公開URL）。
  // NEXT_PUBLIC_SUPABASE_URL からも自動付与されるが、env 非依存で確実に許可するため明示。
  "ctwpnaizwsrffrkkbuig.supabase.co",
  // メディア作品のポスター取得元（安定CDN・帰属表示付きで利用）。
  // anime → AniList、drama → theTVDB（無料枠）/ Wikimedia Commons。作品が増えてもこのホスト群のまま。
  "s4.anilist.co",
  "artworks.thetvdb.com",
  "commons.wikimedia.org",
  "upload.wikimedia.org",
  // 書籍ランキング用の書影。ISBN ベースで保存し、表示時は DB の固定URLを使う。
  "www.hanmoto.com",
  "thumbnail.image.rakuten.co.jp",
  "m.media-amazon.com",
  "images.unsplash.com", "make-it-tech.com",
  "www.tomita-cocoro.jp",
  "sugitaya.com",
  "static.wixstatic.com",
  "niigatacity-ramen.jp",
  "naoji.jp",
  "www.visityamagata.jp",
  "www.sakata-mangetsu.com",
  "hayashishoten.online",
  "www.bannaisyokudou.jp",
  "uende.jp",
  "delightdesignersworks.com",
  "seabyluvism.jp",
  "agu-hair.com",
  "management.adhpublic.com",
] as const;

function supabaseHost(): string | null {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
}

/** next/image で安全に描画できる src か（ローカルパス or 許可ホストの https のみ） */
export function isAllowedImageSrc(src: string | null | undefined): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true; // ローカル（public 配下）
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    return url.hostname === supabaseHost() || (ALLOWED_IMAGE_HOSTS as readonly string[]).includes(url.hostname);
  } catch {
    return false;
  }
}

/** 許可された src ならそのまま、許可外（不正・期限切れSNS URL等）なら fallback を返す */
export function safeImageSrc(src: string | null | undefined, fallback: string): string {
  return isAllowedImageSrc(src) ? (src as string) : fallback;
}
