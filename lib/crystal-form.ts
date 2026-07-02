import { SCORED_KEYS, type FortuneBand, type FortuneResult } from "@/lib/fortune";

/**
 * 結晶の形状を、複数の数値特徴から決定論的に生成する（純関数・three非依存）。
 *
 * v2: 「スコアのかたち」から 8 種の結晶ファミリー（形状アーキタイプ）を選び、
 * さらにスコアで各部を連続的にパラメータ化する。同じ日に占ったユーザー同士で
 * 見比べたとき、まず“属する形”が違い、次に細部が違う、二段階の個性が出る。
 *
 *   - 完全に調和（purity 高）      → 単晶柱 / （かつ高運勢なら）光輪を纏う宝珠
 *   - ひとつの運勢が突出           → 一極の尖塔
 *   - ふたつの運勢が並び立つ       → 双晶の塔
 *   - 複数の運勢が強い             → 星芒晶（放射）
 *   - 穏やかに共鳴                 → 晶洞の花（花弁）
 *   - 激しく乱高下                 → 乱髄の群晶
 *   - 全体が低調                   → 遺魂の欠片
 *
 * 各カテゴリ（6軸）は必ず 1 つの結晶要素（尖晶・柱・花弁・衛星…）に対応し、
 * スコアが長さ・大きさ、band が色になる。hover でのカテゴリ強調は全ファミリー共通。
 */

const TAU = Math.PI * 2;

export type CrystalFamilyKey =
  | "celestial-orb"
  | "prism-monolith"
  | "solar-obelisk"
  | "twin-spires"
  | "stellate-burst"
  | "geode-bloom"
  | "wild-cluster"
  | "shard-relic";

export const CRYSTAL_FAMILY_META: Record<CrystalFamilyKey, { label: string; description: string }> = {
  "celestial-orb": {
    label: "天環の宝珠",
    description: "すべての運勢が高く完全に調和した日にだけ結ばれる、光輪を纏う真球。最も稀少な形。",
  },
  "prism-monolith": {
    label: "調和の単晶柱",
    description: "運勢が完全に揃った日に現れる、澄みきった六角の単晶。静かな均衡の証。",
  },
  "solar-obelisk": {
    label: "一極の尖塔",
    description: "ひとつの運勢が突出した日に天へ伸びる大尖晶。今日はその一点に懸けるべき日。",
  },
  "twin-spires": {
    label: "双晶の塔",
    description: "ふたつの運勢が並び立つ日に結ばれる、寄り添う二本の柱。",
  },
  "stellate-burst": {
    label: "星芒晶",
    description: "複数の運勢が強く輝く日に放射する星形の結晶。エネルギーが外へ向かう形。",
  },
  "geode-bloom": {
    label: "晶洞の花",
    description: "運勢が穏やかに共鳴する日に開く、花弁のような結晶。内に光を抱く。",
  },
  "wild-cluster": {
    label: "乱髄の群晶",
    description: "運勢が激しく揺れ動く日に乱立する野生の結晶群。荒々しくも力強い。",
  },
  "shard-relic": {
    label: "遺魂の欠片",
    description: "低調な日にだけ残る、欠けた古の結晶片。静かに次の力を蓄えている。",
  },
};

/** カテゴリ要素の見た目スタイル */
export type CrystalElementStyle = "spike" | "blade" | "pillar" | "petal" | "satellite" | "shard";

export type CrystalPoint = {
  key: string;
  /** 単位方向。satellite の場合は軌道面上の初期方向 */
  dir: [number, number, number];
  /** spike/pillar等: 長さ / satellite: 軌道半径 */
  length: number;
  /** 太さ・大きさ係数（satellite は半径そのもの） */
  size: number;
  band: FortuneBand;
  style: CrystalElementStyle;
  /** shard の傾き（rad） */
  tilt: number;
  /** satellite の軌道位相 0..1 */
  phase: number;
};

export type CrystalCore =
  | { kind: "gem"; radius: number; detail: number; lumpiness: number }
  | { kind: "prism"; radius: number; height: number; capHeight: number }
  | { kind: "orb"; radius: number; rings: { radius: number; tilt: number }[] }
  | { kind: "cluster"; nodes: { pos: [number, number, number]; radius: number; detail: number; lumpiness: number }[] };

export type CrystalForm = {
  family: CrystalFamilyKey;
  label: string;
  description: string;
  core: CrystalCore;
  points: CrystalPoint[];
  purity: number; // 0..1 整い具合
  resonance: number; // 0..1 数字同士の近さ
  isPerfect: boolean; // 完全に整った
  radius: number; // 基本半径（総合平均から）
  glow: number; // 0..1 コア発光の強さ（平均から）
  seed: number;
};

export const CRYSTAL_PERFECT_PURITY = 0.92;

/** 結晶の練成演出（形成アニメーション）の長さ。scene と UI オーバーレイで共有する */
export const CRYSTAL_FORMATION_MS = 3200;

/** 星芒晶が使う 6 方向（八面体的） */
const AXES: [number, number, number][] = [
  [0, 1, 0], // 上
  [0.95, 0.15, 0], // 右
  [0.3, -0.2, 0.92], // 手前
  [-0.95, 0.15, 0], // 左
  [-0.3, -0.2, -0.92], // 奥
  [0, -1, 0], // 下
];

export function classifyCrystal(result: FortuneResult): CrystalForm {
  const byKey = new Map(result.categories.map((c) => [c.key, c]));
  const cats = SCORED_KEYS.map((key) => ({
    key,
    score: byKey.get(key)?.score ?? 0,
    band: (byKey.get(key)?.band ?? 3) as FortuneBand,
  }));
  const scores = cats.map((c) => c.score);
  const n = scores.length;
  const mean = scores.reduce((a, b) => a + b, 0) / n;

  // 揃い具合（standard deviation → purity）
  const variance = scores.reduce((a, s) => a + (s - mean) ** 2, 0) / n;
  const stdev = Math.sqrt(variance);
  const purity = clamp(1 - stdev / 2.5, 0, 1);
  const isPerfect = purity >= CRYSTAL_PERFECT_PURITY;

  // 数字同士の近さ（resonance）: 全ペアの近さの平均
  let closeAcc = 0;
  let pairs = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      closeAcc += Math.max(0, 1 - Math.abs(scores[i] - scores[j]) / 2.5);
      pairs++;
    }
  }
  const resonance = pairs > 0 ? closeAcc / pairs : 1;

  // スコアの序列（同点は SCORED_KEYS 順で安定）
  const sorted = [...cats].sort((a, b) => b.score - a.score);
  const dominance = sorted[0].score - sorted[1].score; // 一強度
  const twinGap = sorted[1].score - sorted[2].score; // 双璧度
  const highCount = scores.filter((s) => s >= 3.8).length;

  const radius = 0.7 + (mean / 5) * 0.45; // 0.7〜1.15
  const glow = 0.35 + (mean / 5) * 0.65;
  const seed = hash(`${result.date}|${scores.map((s) => s.toFixed(1)).join(",")}`);
  const rng = rngFrom(seed);

  // ── ファミリー判定（上から順に評価） ──────────────────────────────────────
  let family: CrystalFamilyKey;
  if (isPerfect) family = mean >= 3.8 ? "celestial-orb" : "prism-monolith";
  else if (mean < 1.9) family = "shard-relic";
  else if (stdev >= 1.15) family = "wild-cluster";
  else if (dominance >= 1.05) family = "solar-obelisk";
  else if (dominance <= 0.45 && twinGap >= 0.8) family = "twin-spires";
  else if (highCount >= 3) family = "stellate-burst";
  else if (resonance >= 0.78) family = "geode-bloom";
  else family = mean >= 2.9 ? "stellate-burst" : "geode-bloom";

  const lumpiness = isPerfect ? 0 : (1 - purity) * 0.34;

  // ── コア形状 ─────────────────────────────────────────────────────────────
  let core: CrystalCore;
  switch (family) {
    case "celestial-orb":
      core = {
        kind: "orb",
        radius: radius * 0.9,
        rings: [
          { radius: radius * 1.35, tilt: 0.5 },
          { radius: radius * 1.62, tilt: -0.25 },
        ],
      };
      break;
    case "prism-monolith":
      core = { kind: "prism", radius: radius * 0.5, height: radius * 1.9, capHeight: radius * 0.65 };
      break;
    case "solar-obelisk":
      core = { kind: "gem", radius: radius * 0.72, detail: 1, lumpiness: 0.07 };
      break;
    case "twin-spires":
      core = { kind: "gem", radius: radius * 0.68, detail: 1, lumpiness: 0.06 };
      break;
    case "stellate-burst":
      core = { kind: "gem", radius, detail: Math.round(resonance * 2), lumpiness };
      break;
    case "geode-bloom":
      core = { kind: "gem", radius: radius * 0.88, detail: 2, lumpiness: 0.03 };
      break;
    case "wild-cluster": {
      const extraCount = 4 + Math.floor(rng() * 3); // 4..6
      const nodes: { pos: [number, number, number]; radius: number; detail: number; lumpiness: number }[] = [
        { pos: [0, 0, 0], radius: radius * 0.62, detail: 1, lumpiness: 0.16 },
      ];
      for (let i = 0; i < extraCount; i++) {
        const a = rng() * TAU;
        const r = radius * (0.45 + rng() * 0.4);
        const y = (rng() * 2 - 1) * radius * 0.55;
        nodes.push({
          pos: [Math.cos(a) * r, y, Math.sin(a) * r],
          radius: radius * (0.28 + rng() * 0.22),
          detail: rng() < 0.5 ? 0 : 1,
          lumpiness: 0.12 + rng() * 0.14,
        });
      }
      core = { kind: "cluster", nodes };
      break;
    }
    case "shard-relic":
      core = { kind: "gem", radius: radius * 0.72, detail: 0, lumpiness: 0.3 };
      break;
  }

  // ── カテゴリ要素（6つ・SCORED_KEYS 順を維持して hover 対応を保つ） ─────────
  let points: CrystalPoint[];
  switch (family) {
    case "celestial-orb":
      points = cats.map((c, i) => {
        const a = (i / 6) * TAU;
        return {
          key: c.key,
          dir: [Math.cos(a), 0, Math.sin(a)] as [number, number, number],
          length: radius * 1.45 + (c.score / 5) * 0.65, // 軌道半径
          size: 0.12 + (c.score / 5) * 0.16, // 衛星の半径
          band: c.band,
          style: "satellite" as const,
          tilt: 0,
          phase: i / 6 + rng() * 0.04,
        };
      });
      break;
    case "prism-monolith":
      points = cats.map((c, i) => {
        const a = (i / 6) * TAU;
        return {
          key: c.key,
          dir: norm([Math.cos(a), 0.22, Math.sin(a)]),
          length: 0.35 + (c.score / 5) * 0.85,
          size: 0.75,
          band: c.band,
          style: "blade" as const,
          tilt: 0,
          phase: 0,
        };
      });
      break;
    case "solar-obelisk": {
      const domKey = sorted[0].key;
      let j = 0;
      points = cats.map((c) => {
        if (c.key === domKey) {
          return {
            key: c.key,
            dir: [0, 1, 0] as [number, number, number],
            length: radius * 1.2 + (c.score / 5) * 1.0,
            size: 1.5,
            band: c.band,
            style: "pillar" as const,
            tilt: 0,
            phase: 0,
          };
        }
        const a = (j++ / 5) * TAU + 0.4;
        return {
          key: c.key,
          dir: norm([Math.cos(a), -0.08 + rng() * 0.2, Math.sin(a)]),
          length: 0.3 + (c.score / 5) * 0.75,
          size: 0.7,
          band: c.band,
          style: "shard" as const,
          tilt: (rng() - 0.5) * 0.9,
          phase: 0,
        };
      });
      break;
    }
    case "twin-spires": {
      const t0 = sorted[0].key;
      const t1 = sorted[1].key;
      let spireIdx = 0;
      let j = 0;
      points = cats.map((c) => {
        if (c.key === t0 || c.key === t1) {
          const side = spireIdx++ === 0 ? 1 : -1;
          return {
            key: c.key,
            dir: norm([0.3 * side, 0.95, 0.08 * side]),
            length: radius * 0.95 + (c.score / 5) * 1.05,
            size: 1.25,
            band: c.band,
            style: "pillar" as const,
            tilt: 0,
            phase: 0,
          };
        }
        const a = (j++ / 4) * TAU + 0.5;
        return {
          key: c.key,
          dir: norm([Math.cos(a), -0.12 + rng() * 0.24, Math.sin(a)]),
          length: 0.3 + (c.score / 5) * 0.7,
          size: 0.7,
          band: c.band,
          style: "shard" as const,
          tilt: (rng() - 0.5) * 0.9,
          phase: 0,
        };
      });
      break;
    }
    case "geode-bloom":
      points = cats.map((c, i) => {
        const a = (i / 6) * TAU;
        return {
          key: c.key,
          dir: norm([Math.cos(a) * 0.8, 0.62, Math.sin(a) * 0.8]),
          length: 0.5 + (c.score / 5) * 1.0,
          size: 1.0,
          band: c.band,
          style: "petal" as const,
          tilt: 0,
          phase: 0,
        };
      });
      break;
    case "wild-cluster":
      points = cats.map((c, i) => {
        const a = (i / 6) * TAU + rng() * 0.9;
        const y = (rng() * 2 - 1) * 0.75;
        return {
          key: c.key,
          dir: norm([Math.cos(a), y, Math.sin(a)]),
          length: 0.4 + (c.score / 5) * 1.1,
          size: 0.85,
          band: c.band,
          style: "shard" as const,
          tilt: (rng() - 0.5) * 1.4,
          phase: 0,
        };
      });
      break;
    case "shard-relic":
      points = cats.map((c, i) => {
        const base = AXES[i];
        return {
          key: c.key,
          dir: norm([
            base[0] + (rng() - 0.5) * 0.6,
            base[1] + (rng() - 0.5) * 0.6,
            base[2] + (rng() - 0.5) * 0.6,
          ]),
          length: 0.35 + (c.score / 5) * 0.8,
          size: 0.65,
          band: c.band,
          style: "shard" as const,
          tilt: (rng() - 0.5) * 1.2,
          phase: 0,
        };
      });
      break;
    case "stellate-burst":
    default:
      points = cats.map((c, i) => ({
        key: c.key,
        dir: AXES[i],
        length: 0.45 + (c.score / 5) * 1.35,
        size: 0.9 + (c.score / 5) * 0.35,
        band: c.band,
        style: "spike" as const,
        tilt: 0,
        phase: 0,
      }));
      break;
  }

  const meta = CRYSTAL_FAMILY_META[family];
  return {
    family,
    label: meta.label,
    description: meta.description,
    core,
    points,
    purity,
    resonance,
    isPerfect,
    radius,
    glow,
    seed,
  };
}

// ── ヘルパー ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function norm(v: [number, number, number]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function hash(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32。同じシードなら必ず同じ列（決定論） */
function rngFrom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
