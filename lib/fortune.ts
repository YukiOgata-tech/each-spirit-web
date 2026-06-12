import { fortuneExplanations } from "@/content/fortune/explanations";

// ── 型 ───────────────────────────────────────────────────────────────────────

export type FortuneCategoryKey =
  | "overall" | "love" | "money" | "work" | "health" | "social" | "outing";

export type FortuneBand = 1 | 2 | 3 | 4 | 5;
export type FortuneBandPool = Record<"1" | "2" | "3" | "4" | "5", string[]>;
export type FortuneExplanations = Record<FortuneCategoryKey, { label: string; bands: FortuneBandPool }>;

export type LuckyItem = { type: string; slug: string; name: string; href: string };

export type FortuneScore = {
  key: FortuneCategoryKey;
  label: string;
  score: number;   // 0.0–5.0 (0.1 刻み)
  band: FortuneBand;
  text: string;
};

export type FortuneResult = {
  date: string;    // JST yyyy-mm-dd
  version: number;
  overall: { score: number; band: FortuneBand; text: string };
  categories: FortuneScore[];   // 6 カテゴリ（overall を除く）
  lucky: {
    color: { name: string; hex: string };
    number: number;
    item: LuckyItem | null;
  };
};

// ── 定数 ─────────────────────────────────────────────────────────────────────

/** 総合運を除いた採点対象カテゴリ（総合運はこれらの平均） */
export const SCORED_KEYS: Exclude<FortuneCategoryKey, "overall">[] = [
  "love", "money", "work", "health", "social", "outing",
];

export const CATEGORY_LABEL: Record<FortuneCategoryKey, string> = {
  overall: "総合運",
  love: "恋愛運",
  money: "金運",
  work: "仕事・学業運",
  health: "健康運",
  social: "対人運",
  outing: "おでかけ・グルメ運",
};

/** band(1–5) → レベル表記と表示色 */
export const LEVEL: Record<FortuneBand, { label: string; color: string }> = {
  1: { label: "絶不調", color: "#dc2626" },
  2: { label: "低調", color: "#f59e0b" },
  3: { label: "平穏", color: "#64748b" },
  4: { label: "好調", color: "#3b82f6" },
  5: { label: "絶好調", color: "#16a34a" },
};

const LUCKY_COLORS: { name: string; hex: string }[] = [
  { name: "ラッキーレッド", hex: "#ef4444" },
  { name: "サニーオレンジ", hex: "#f97316" },
  { name: "ゴールドイエロー", hex: "#eab308" },
  { name: "フォレストグリーン", hex: "#22c55e" },
  { name: "スカイブルー", hex: "#0ea5e9" },
  { name: "ロイヤルブルー", hex: "#3b82f6" },
  { name: "ミスティックパープル", hex: "#8b5cf6" },
  { name: "ローズピンク", hex: "#ec4899" },
  { name: "パールホワイト", hex: "#e2e8f0" },
  { name: "シックブラック", hex: "#334155" },
];

// ── 乱数（決定論シード） ──────────────────────────────────────────────────────

function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG。同じシードなら必ず同じ列を返す */
function rngFrom(seedStr: string): () => number {
  let a = hashSeed(seedStr);
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── ヘルパー ──────────────────────────────────────────────────────────────────

/** Asia/Tokyo の今日（yyyy-mm-dd） */
export function jstToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

/** score(0.0–5.0) → band(1–5)。1区切り。5.0 は band5 に丸め */
export function scoreToBand(score: number): FortuneBand {
  return Math.min(5, Math.max(1, Math.floor(score) + 1)) as FortuneBand;
}

function pickText(key: FortuneCategoryKey, band: FortuneBand, rnd: number): string {
  const pool = fortuneExplanations[key]?.bands?.[String(band) as "1"] ?? [];
  if (pool.length === 0) return `${CATEGORY_LABEL[key]}の解説文（準備中）。`;
  return pool[Math.floor(rnd * pool.length)] ?? pool[0];
}

// ── 占い生成 ──────────────────────────────────────────────────────────────────

/**
 * 決定論的にデイリー運勢を生成する。
 * 同じ seed（= ユーザーID + 日付）なら必ず同じ結果になる。
 * 初回生成時に es.daily_fortunes へ保存し、当日はそれを読み出す運用。
 */
export function generateDailyFortune(opts: { seed: string; date: string; items: LuckyItem[] }): FortuneResult {
  const { seed, date, items } = opts;

  const categories: FortuneScore[] = SCORED_KEYS.map((key) => {
    const score = Math.round(rngFrom(`${seed}|${key}|score`)() * 50) / 10; // 0.0–5.0 step .1
    const band = scoreToBand(score);
    const text = pickText(key, band, rngFrom(`${seed}|${key}|text`)());
    return { key, label: CATEGORY_LABEL[key], score, band, text };
  });

  const overallScore = Math.round((categories.reduce((s, c) => s + c.score, 0) / categories.length) * 10) / 10;
  const overallBand = scoreToBand(overallScore);
  const overallText = pickText("overall", overallBand, rngFrom(`${seed}|overall|text`)());

  const lr = rngFrom(`${seed}|lucky`);
  const color = LUCKY_COLORS[Math.floor(lr() * LUCKY_COLORS.length)];
  const number = 1 + Math.floor(lr() * 9);
  const item = items.length > 0 ? items[Math.floor(lr() * items.length)] : null;

  return {
    date,
    version: 1,
    overall: { score: overallScore, band: overallBand, text: overallText },
    categories,
    lucky: { color, number, item },
  };
}
