import { SCORED_KEYS, type FortuneBand, type FortuneResult } from "@/lib/fortune";

/**
 * 結晶の形状を、複数の数値特徴から決定論的に生成する（純関数・three非依存）。
 *
 * 「総合の平均」だけでなく、次の複数要素を別々のジオメトリ要素に割り当てて
 * "世界に一つ" の形を作る:
 *   - 各カテゴリのスコア → 6本の結晶ポイントの長さ・色（方向ごとの個性）
 *   - 揃い具合(purity/stdev) → 中心ジェムの歪み（いびつ ↔ 整った）
 *   - 数字同士の近さ(resonance) → 中心ジェムの面数（揃うほど多面で美しい）
 *   - 総合平均(mean) → 全体のサイズ
 *   - 完全に整う(purity高) → 歪みゼロ＝真正形にスナップ
 */
export type CrystalPoint = {
  key: string;
  dir: [number, number, number];
  length: number; // 0.45〜1.8
  band: FortuneBand; // 1〜5（色に使う）
};

export type CrystalForm = {
  purity: number; // 0..1 整い具合
  lumpiness: number; // 0..~0.34 中心ジェムの歪み（0=真正）
  isPerfect: boolean; // 完全に整った
  radius: number; // 中心ジェム半径（総合平均から）
  coreDetail: number; // 中心ジェムの面分割 0..2（共鳴＝近さから）
  resonance: number; // 0..1 数字同士の近さ
  points: CrystalPoint[]; // 6（カテゴリごと）
  seed: number;
};

/** 6カテゴリ（SCORED_KEYS順）を割り当てる方向。八面体的な6方向。 */
const AXES: [number, number, number][] = [
  [0, 1, 0], // 上
  [0.95, 0.15, 0], // 右
  [0.3, -0.2, 0.92], // 手前
  [-0.95, 0.15, 0], // 左
  [-0.3, -0.2, -0.92], // 奥
  [0, -1, 0], // 下
];

export const CRYSTAL_PERFECT_PURITY = 0.92;
const MAX_LUMPINESS = 0.34;

export function classifyCrystal(result: FortuneResult): CrystalForm {
  const byKey = new Map(result.categories.map((c) => [c.key, c]));
  const scores = SCORED_KEYS.map((k) => byKey.get(k)?.score ?? 0);
  const n = scores.length;
  const mean = scores.reduce((a, b) => a + b, 0) / n;

  // 揃い具合（standard deviation → purity）
  const variance = scores.reduce((a, s) => a + (s - mean) ** 2, 0) / n;
  const stdev = Math.sqrt(variance);
  const purity = clamp(1 - stdev / 2.5, 0, 1);
  const isPerfect = purity >= CRYSTAL_PERFECT_PURITY;
  const lumpiness = isPerfect ? 0 : (1 - purity) * MAX_LUMPINESS;

  // 数字同士の近さ（resonance）: 全ペアの近さの平均。揃うほど高い。
  let closeAcc = 0;
  let pairs = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      closeAcc += Math.max(0, 1 - Math.abs(scores[i] - scores[j]) / 2.5);
      pairs++;
    }
  }
  const resonance = pairs > 0 ? closeAcc / pairs : 1;
  const coreDetail = Math.round(resonance * 2); // 0..2（近いほど多面）

  const radius = 0.7 + (mean / 5) * 0.45; // 0.7〜1.15

  const points: CrystalPoint[] = SCORED_KEYS.map((key, i) => {
    const c = byKey.get(key);
    const score = c?.score ?? 0;
    return {
      key,
      dir: AXES[i],
      length: 0.45 + (score / 5) * 1.35, // 0.45〜1.8
      band: c?.band ?? (3 as FortuneBand),
    };
  });

  return {
    purity,
    lumpiness,
    isPerfect,
    radius,
    coreDetail,
    resonance,
    points,
    seed: hash(`${result.date}|${scores.map((s) => s.toFixed(1)).join(",")}`),
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function hash(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
