import { scoreToBand, SCORED_KEYS, CATEGORY_LABEL, type FortuneResult } from "@/lib/fortune";
import { classifyCrystal, CRYSTAL_FAMILY_META, type CrystalFamilyKey } from "@/lib/crystal-form";

/** 6スコアから検証用の FortuneResult を組み立てる。 */
function makeResult(scores: number[], date = "2026-06-30"): FortuneResult {
  const categories = SCORED_KEYS.map((key, i) => {
    const score = scores[i];
    return { key, label: CATEGORY_LABEL[key], score, band: scoreToBand(score), text: "" };
  });
  const overallScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  return {
    date,
    version: 2,
    overall: { score: overallScore, band: scoreToBand(overallScore), text: "" },
    categories,
    lucky: { color: { name: "", hex: "#fff" }, number: 1, item: null },
  };
}

let fail = 0;
const check = (name: string, ok: boolean) => {
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
};

// 1) 決定性
const a = classifyCrystal(makeResult([2.4, 3.1, 1.8, 4.2, 0.9, 3.6]));
const b = classifyCrystal(makeResult([2.4, 3.1, 1.8, 4.2, 0.9, 3.6]));
check("determinism", JSON.stringify(a) === JSON.stringify(b));

// 2) ポイントは6本・各カテゴリ対応（SCORED_KEYS順を維持）
check("6 points", a.points.length === 6);
check("points keyed by category", a.points.map((p) => p.key).join(",") === SCORED_KEYS.join(","));

// 3) ファミリー判定
const cases: [string, number[], CrystalFamilyKey][] = [
  ["完全均一・中庸 → 単晶柱", [3, 3, 3, 3, 3, 3], "prism-monolith"],
  ["完全均一・高運勢 → 宝珠", [4.3, 4.3, 4.3, 4.3, 4.3, 4.3], "celestial-orb"],
  ["極端な乱高下 → 群晶", [0, 5, 0, 5, 0, 5], "wild-cluster"],
  ["全体が低調 → 欠片", [1.4, 0.8, 1.6, 1.1, 0.6, 1.2], "shard-relic"],
  ["一強 → 尖塔", [4.8, 2.6, 2.7, 2.5, 2.6, 2.8], "solar-obelisk"],
  ["双璧 → 双晶", [4.6, 4.5, 2.8, 2.7, 2.9, 2.6], "twin-spires"],
  ["複数好調 → 星芒", [4.0, 3.9, 4.1, 2.5, 2.6, 2.4], "stellate-burst"],
  ["穏やかな共鳴 → 晶洞", [2.6, 3.1, 2.4, 3.3, 2.7, 3.0], "geode-bloom"],
];
const seen = new Set<CrystalFamilyKey>();
for (const [name, scores, expected] of cases) {
  const f = classifyCrystal(makeResult(scores));
  seen.add(f.family);
  check(`family: ${name}`, f.family === expected);
}
check("all 8 families reachable", seen.size === 8);

// 4) 主役カテゴリの対応（尖塔・双晶の pillar は上位カテゴリに割り当たる）
const obelisk = classifyCrystal(makeResult([4.8, 2.6, 2.7, 2.5, 2.6, 2.8]));
check(
  "obelisk pillar = dominant category",
  obelisk.points.find((p) => p.style === "pillar")?.key === "love",
);
const twins = classifyCrystal(makeResult([4.6, 4.5, 2.8, 2.7, 2.9, 2.6]));
check(
  "twin pillars = top-2 categories",
  twins.points.filter((p) => p.style === "pillar").map((p) => p.key).sort().join(",") === "love,money",
);

// 5) スコアが高いほど要素は長い（同一フォーム内で単調）
const grad = classifyCrystal(makeResult([4.5, 1.0, 3.0, 3.1, 2.9, 3.0]));
const lenOf = (key: string) => grad.points.find((p) => p.key === key)!.length;
check("higher score => longer element", lenOf("love") > lenOf("money"));

// 6) 完全に揃うと真正（isPerfect）
const even = classifyCrystal(makeResult([3, 3, 3, 3, 3, 3]));
check("even => purity ~1", Math.abs(even.purity - 1) < 1e-6);
check("even => isPerfect", even.isPerfect === true);

// 7) radius は総合平均で増える
check(
  "radius grows with mean",
  classifyCrystal(makeResult([5, 5, 5, 5, 5, 5])).radius > classifyCrystal(makeResult([0, 0, 0, 0, 0, 0])).radius,
);

// 8) 同じ平均でも揃い具合が違えば別の形（平均だけでは決まらない）
const flatMean3 = classifyCrystal(makeResult([3, 3, 3, 3, 3, 3]));
const bumpyMean3 = classifyCrystal(makeResult([5, 1, 4, 2, 5, 1])); // mean=3 だが凸凹
check("same mean, different evenness => different family", flatMean3.family !== bumpyMean3.family);

console.log("\n例:");
for (const [label, sc] of cases.map(([n, s]) => [n, s] as [string, number[]])) {
  const f = classifyCrystal(makeResult(sc));
  console.log(
    `  ${label}: family=${f.family}「${CRYSTAL_FAMILY_META[f.family].label}」 purity=${f.purity.toFixed(2)} resonance=${f.resonance.toFixed(2)} perfect=${f.isPerfect} radius=${f.radius.toFixed(2)} core=${f.core.kind} styles=[${[...new Set(f.points.map((p) => p.style))].join(",")}]`,
  );
}

console.log(fail === 0 ? "\nALL PASS" : `\n${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);
