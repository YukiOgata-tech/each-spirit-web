import {
  generateDailyFortune,
  daysSinceBirth,
  scoreToBand,
  SCORED_KEYS,
  type FortuneInput,
} from "@/lib/fortune";

const items = [
  { type: "ramen_item", slug: "a", name: "A", href: "/a" },
  { type: "ramen_item", slug: "b", name: "B", href: "/b" },
];
const gen = (input: FortuneInput, date: string) => generateDailyFortune({ input, date, items });

let fail = 0;
const check = (name: string, ok: boolean) => {
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
};

const A: FortuneInput = { birthday: "1990-05-12", gender: "female" };
const B: FortuneInput = { birthday: "1985-11-03", gender: "male" };

// 1) 決定性: 同じ入力・同じ日付なら完全一致
check("determinism (same input+date => identical)",
  JSON.stringify(gen(A, "2026-06-27")) === JSON.stringify(gen(A, "2026-06-27")));

// 2) 同じ誕生日・性別の他人は完全一致（被りOK設計）
const A2: FortuneInput = { birthday: "1990-05-12", gender: "female" };
check("same birthday+gender => identical (collision OK)",
  JSON.stringify(gen(A, "2026-06-27")) === JSON.stringify(gen(A2, "2026-06-27")));

// 3) 日替わり: 翌日には結果が変わる
check("next day differs",
  JSON.stringify(gen(A, "2026-06-27")) !== JSON.stringify(gen(A, "2026-06-28")));

// 4) 誕生日が効く: 別の誕生日は別結果
check("different birthday => different result",
  JSON.stringify(gen(A, "2026-06-27")) !== JSON.stringify(gen(B, "2026-06-27")));

// 5) 性別が効く
check("different gender => different result",
  JSON.stringify(gen(A, "2026-06-27")) !==
    JSON.stringify(gen({ ...A, gender: "male" }, "2026-06-27")));

// 6) スコア範囲・刻み・band 整合（1年ぶん全日 × 複数誕生日でスイープ）
let rangeOk = true, stepOk = true, bandOk = true;
const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
const birthdays = ["1990-05-12", "1985-11-03", "2001-01-01", "1972-09-30", "2010-12-25"];
for (const bd of birthdays) {
  for (let d = 0; d < 365; d++) {
    const date = new Date(Date.UTC(2026, 0, 1 + d)).toISOString().slice(0, 10);
    const r = gen({ birthday: bd, gender: "other" }, date);
    for (const c of r.categories) {
      if (c.score < 0 || c.score > 5) rangeOk = false;
      if (Math.round(c.score * 10) !== c.score * 10) stepOk = false;
      if (scoreToBand(c.score) !== c.band) bandOk = false;
      dist[c.band]++;
    }
  }
}
check("scores within 0.0–5.0", rangeOk);
check("scores are 0.1-step", stepOk);
check("band matches scoreToBand", bandOk);

// 7) band 境界
check("scoreToBand(0.0)=1", scoreToBand(0.0) === 1);
check("scoreToBand(2.5)=3", scoreToBand(2.5) === 3);
check("scoreToBand(4.9)=5", scoreToBand(4.9) === 5);
check("scoreToBand(5.0)=5", scoreToBand(5.0) === 5);

// 8) 経過日数
check("daysSinceBirth basic", daysSinceBirth("1990-05-12", "1990-05-13") === 1);

console.log("\nband 分布（", birthdays.length * 365 * SCORED_KEYS.length, "サンプル）:");
const total = Object.values(dist).reduce((a, b) => a + b, 0);
for (const b of [1, 2, 3, 4, 5]) {
  console.log(`  band${b}: ${(100 * dist[b] / total).toFixed(1)}%`);
}

console.log("\n例: A 1990-05-12 female / 2026-06-27");
const sample = gen(A, "2026-06-27");
console.log("  総合", sample.overall.score, "band", sample.overall.band);
for (const c of sample.categories) console.log(`  ${c.label}: ${c.score} (band${c.band})`);

console.log(fail === 0 ? "\nALL PASS" : `\n${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);
