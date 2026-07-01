/**
 * 記事本文（Markdown）からおおよその読了時間（分）を見積もる純粋関数。
 * 日本語は約500文字/分、英単語は約300語/分として合算する（日英混在に対応）。
 * コードブロック・画像・記号などノイズを軽く除去してから計測し、最低1分を返す。
 */

const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ]/g;

const CHARS_PER_MIN_JA = 500;
const WORDS_PER_MIN_EN = 300;

export function readingTimeMinutes(markdown: string): number {
  if (!markdown) return 1;

  const text = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => m.replace(/\]\([^)]*\)/, "")) // links → keep text
    .replace(/[#>*_~`|]/g, " ");

  const cjkCount = (text.match(CJK) ?? []).length;
  const enWords = text
    .replace(CJK, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;

  const minutes = cjkCount / CHARS_PER_MIN_JA + enWords / WORDS_PER_MIN_EN;
  return Math.max(1, Math.round(minutes));
}
