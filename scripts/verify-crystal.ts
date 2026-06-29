import { scoreToBand, SCORED_KEYS, CATEGORY_LABEL, type FortuneResult } from "@/lib/fortune";
import { classifyCrystal, CRYSTAL_PERFECT_PURITY } from "@/lib/crystal-form";

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

// 2) ポイントは6本・各カテゴリ対応・長さはスコアに比例
check("6 points", a.points.length === 6);
check("points keyed by category", a.points.map((p) => p.key).join(",") === SCORED_KEYS.join(","));
const hi = classifyCrystal(makeResult([5, 0, 0, 0, 0, 0]));
check("higher score => longer point", hi.points[0].length > hi.points[1].length);

// 3) 整い具合 → 真正（歪みゼロ）/ ばらつき → いびつ
const even = classifyCrystal(makeResult([3, 3, 3, 3, 3, 3]));
check("even => purity ~1", Math.abs(even.purity - 1) < 1e-6);
check("even => lumpiness 0", even.lumpiness === 0);
check("even => isPerfect", even.isPerfect === true);
check("even => high resonance => coreDetail 2", even.coreDetail === 2);

const spread = classifyCrystal(makeResult([0, 5, 0, 5, 0, 5]));
check("spread => purity 0", spread.purity === 0);
check("spread => lumpiness > 0.3", spread.lumpiness > 0.3);
check("spread => not perfect", spread.isPerfect === false);
check("spread => fewer facets than even", spread.coreDetail < even.coreDetail);

// 4) 近さ(resonance) は揃うほど高い
check("resonance higher when closer", even.resonance > spread.resonance);

// 5) radius は総合平均で増える
check("radius grows with mean", classifyCrystal(makeResult([5, 5, 5, 5, 5, 5])).radius > classifyCrystal(makeResult([0, 0, 0, 0, 0, 0])).radius);

// 6) 同じ平均でも揃い具合が違えば別の形（平均だけでは決まらない）
const flatMean3 = classifyCrystal(makeResult([3, 3, 3, 3, 3, 3]));
const bumpyMean3 = classifyCrystal(makeResult([5, 1, 4, 2, 5, 1])); // mean=3 だが凸凹
check("same mean, different evenness => different form", flatMean3.lumpiness !== bumpyMean3.lumpiness || flatMean3.coreDetail !== bumpyMean3.coreDetail);

console.log("\n例:");
for (const [label, sc] of [
  ["完全均一(3,3,3,3,3,3)", [3, 3, 3, 3, 3, 3]],
  ["ほぼ均一", [3.0, 3.1, 2.9, 3.0, 3.2, 2.8]],
  ["凸凹(平均3)", [5, 1, 4, 2, 5, 1]],
  ["極端", [0, 5, 0, 5, 0, 5]],
] as [string, number[]][]) {
  const f = classifyCrystal(makeResult(sc));
  console.log(
    `  ${label}: purity=${f.purity.toFixed(2)} lumpiness=${f.lumpiness.toFixed(2)} coreDetail=${f.coreDetail} resonance=${f.resonance.toFixed(2)} perfect=${f.isPerfect} radius=${f.radius.toFixed(2)} pointLen=[${f.points.map((p) => p.length.toFixed(1)).join(",")}]`,
  );
}

console.log(fail === 0 ? "\nALL PASS" : `\n${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);
