import { fortuneExplanations } from "@/content/fortune/explanations";

// ── 型 ───────────────────────────────────────────────────────────────────────

export type FortuneCategoryKey =
  | "overall" | "love" | "money" | "work" | "health" | "social" | "outing";

export type FortuneBand = 1 | 2 | 3 | 4 | 5;
export type FortuneBandPool = Record<"1" | "2" | "3" | "4" | "5", string[]>;
export type FortuneExplanations = Record<FortuneCategoryKey, { label: string; bands: FortuneBandPool }>;

export type LuckyItem = { type: string; slug: string; name: string; href: string; image?: string };

/** 占いのパーソナライズ入力（誕生日・性別）。ゲストはフォーム、ログインユーザーは profiles から。 */
export type FortuneGender = "male" | "female" | "other";
export type FortuneInput = { birthday: string; gender: FortuneGender };

export const FORTUNE_GENDERS: FortuneGender[] = ["male", "female", "other"];
export const FORTUNE_GENDER_LABEL: Record<FortuneGender, string> = {
  male: "男性",
  female: "女性",
  other: "その他",
};

/**
 * 個人を表すシード断片（誕生日＋性別）。userId は含めない。
 * → 同じ誕生日・性別の人は同じ傾向・同じ日次ゆらぎになる（「誕生日が運勢を決める」設計）。
 */
export function personSeed(input: FortuneInput): string {
  return `b:${input.birthday}|g:${input.gender}`;
}

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
  outing: "おでかけ",
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

/** シード文字列 → 0〜1 の決定論的な一様値（rngFrom の初項） */
function hashUnit(seedStr: string): number {
  return rngFrom(seedStr)();
}

// ── スコア算出（バイオリズム ＋ 個人ベースライン ＋ 日替わりゆらぎ） ─────────────

const TAU = Math.PI * 2;

/** yyyy-mm-dd → UTC エポックミリ秒（時刻ゆらぎを排除して日付だけで比較） */
function dateUTC(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** 誕生日から date までの経過日数（暦日） */
export function daysSinceBirth(birthday: string, date: string): number {
  return Math.round((dateUTC(date) - dateUTC(birthday)) / 86400000);
}

/** バイオリズム3波（身体23日・感情28日・知性33日）。各 −1〜+1 */
function biorhythm(days: number): { p: number; e: number; i: number } {
  return {
    p: Math.sin((TAU * days) / 23),
    e: Math.sin((TAU * days) / 28),
    i: Math.sin((TAU * days) / 33),
  };
}

/** 各カテゴリの P/E/I 配合比（合計1.0）。バイオリズム → カテゴリ値(−1〜+1) */
const CATEGORY_BLEND: Record<Exclude<FortuneCategoryKey, "overall">, [p: number, e: number, i: number]> = {
  health: [0.7, 0.2, 0.1],
  love: [0.2, 0.7, 0.1],
  work: [0.1, 0.2, 0.7],
  money: [0.3, 0.2, 0.5],
  social: [0.2, 0.5, 0.3],
  outing: [0.5, 0.3, 0.2],
};

/** ロジスティック squash で raw(−∞〜+∞) を 0.0〜5.0 へ。raw=0 → 2.5 中央 */
function squashToScore(raw: number): number {
  const k = 1.6; // 傾き。raw≈±0.9 で band の端（絶好調/絶不調）に届く
  const s = 5 / (1 + Math.exp(-k * raw));
  return Math.round(s * 10) / 10; // 0.1 刻み
}

/**
 * 1カテゴリのスコアを (誕生日・性別・日付) から決定論的に算出する。
 *   raw = バイオリズム配合 + 個人ベースライン(±0.5・不変) + 日替わりゆらぎ(±0.4)
 */
function categoryScore(
  key: Exclude<FortuneCategoryKey, "overall">,
  person: string,
  date: string,
  bio: { p: number; e: number; i: number },
): number {
  const [wp, we, wi] = CATEGORY_BLEND[key];
  const blend = wp * bio.p + we * bio.e + wi * bio.i; // −1〜+1
  const baseline = (hashUnit(`${person}|${key}|base`) - 0.5) * 1.0; // −0.5〜+0.5（人ごと不変）
  const jitter = (hashUnit(`${person}|${date}|${key}|jit`) - 0.5) * 0.8; // −0.4〜+0.4（日替わり）
  return squashToScore(blend + baseline + jitter);
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
 *
 * 結果は (誕生日, 性別, 日付) の純関数。userId は使わないので、
 * 同じ誕生日・性別の人は同日に同じ結果になり、翌日にはバイオリズムの位相が
 * 進んで結果が変わる。当日・本人ぶんは es.daily_fortunes に保存して固定する運用。
 */
export function generateDailyFortune(opts: { input: FortuneInput; date: string; items: LuckyItem[] }): FortuneResult {
  const { input, date, items } = opts;
  const person = personSeed(input);
  const bio = biorhythm(daysSinceBirth(input.birthday, date));

  const categories: FortuneScore[] = SCORED_KEYS.map((key) => {
    const score = categoryScore(key, person, date, bio);
    const band = scoreToBand(score);
    const text = pickText(key, band, hashUnit(`${person}|${date}|${key}|text`));
    return { key, label: CATEGORY_LABEL[key], score, band, text };
  });

  const overallScore = Math.round((categories.reduce((s, c) => s + c.score, 0) / categories.length) * 10) / 10;
  const overallBand = scoreToBand(overallScore);
  const overallText = pickText("overall", overallBand, hashUnit(`${person}|${date}|overall|text`));

  const lr = rngFrom(`${person}|${date}|lucky`);
  const color = LUCKY_COLORS[Math.floor(lr() * LUCKY_COLORS.length)];
  const number = 1 + Math.floor(lr() * 9);
  const item = items.length > 0 ? items[Math.floor(lr() * items.length)] : null;

  return {
    date,
    version: 2,
    overall: { score: overallScore, band: overallBand, text: overallText },
    categories,
    lucky: { color, number, item },
  };
}
