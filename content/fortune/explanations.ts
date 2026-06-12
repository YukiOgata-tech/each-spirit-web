import type { FortuneExplanations, FortuneBandPool, FortuneCategoryKey } from "@/lib/fortune";
import overallData from "./data/overall.json";
import loveData from "./data/love.json";
import moneyData from "./data/money.json";
import workData from "./data/work.json";
import healthData from "./data/health.json";
import socialData from "./data/social.json";
import outingData from "./data/outing.json";

/**
 * 運勢カテゴリ × スコア帯(band) ごとの解説文プール。
 *
 * 本番データは `content/fortune/data/<category>.json`（別AIで生成。各バンド100本）。
 * 出力フォーマットは docs/fortune-explanation-prompt.md を参照。
 * 受領済みカテゴリは本番 JSON を使い、未受領カテゴリは下の dummy にフォールバックする。
 * → 新カテゴリを追加するには JSON を data/ に置き、下の REAL に1行足すだけ。
 */

type RawCategory = { category?: string; label?: string; bands: Record<string, string[]> };

// ▼ 受領済みカテゴリをここに登録（届いたら import + 1行追加）
const REAL: Partial<Record<FortuneCategoryKey, RawCategory>> = {
  overall: overallData as RawCategory,
  love: loveData as RawCategory,
  money: moneyData as RawCategory,
  work: workData as RawCategory,
  health: healthData as RawCategory,
  social: socialData as RawCategory,
  outing: outingData as RawCategory,
};

const LABEL: Record<FortuneCategoryKey, string> = {
  overall: "総合運",
  love: "恋愛運",
  money: "金運",
  work: "仕事・学業運",
  health: "健康運",
  social: "対人運",
  outing: "おでかけ・グルメ運",
};

// ── ダミー（未受領カテゴリ用フォールバック） ────────────────────────────────
function dummy(label: string): FortuneBandPool {
  return {
    "1": [
      `${label}は少し重め。今日は無理をせず、足元を整えることに集中して。`,
      `${label}に逆風が吹きやすい日。焦らず、一歩引いて様子を見るのが吉。`,
      `${label}は控えめ。うまくいかなくても自分を責めず、休む勇気を持って。`,
    ],
    "2": [
      `${label}はやや低調。小さなことを丁寧に積み重ねると流れが変わります。`,
      `${label}は準備の日。動くより整えるほうが、後々の追い風になりそう。`,
      `${label}は静かな滑り出し。期待しすぎず淡々と進めるとちょうどいい。`,
    ],
    "3": [
      `${label}は平穏。可もなく不可もなく、いつも通りが一番うまくいきます。`,
      `${label}は安定した一日。大きな波はない分、基本を大切にして。`,
      `${label}はニュートラル。気負わず自然体でいることが好結果に。`,
    ],
    "4": [
      `${label}は好調。背中を押される追い風を感じたら、素直に乗ってみて。`,
      `${label}に明るい兆し。動けば動くほど良い反応が返ってきそうです。`,
      `${label}は上向き。ひとつ勇気を出すと、嬉しい展開につながります。`,
    ],
    "5": [
      `${label}は絶好調。思い切った一歩が、想像以上の結果を呼び込みます。`,
      `${label}が最高潮。今日のあなたは輝いて見えるはず、自信を持って。`,
      `${label}は文句なし。チャンスを逃さず、やりたいことに全力を。`,
    ],
  };
}

// 本番 JSON を FortuneBandPool に正規化（欠けたバンドは dummy で補完）
function resolve(key: FortuneCategoryKey): FortuneBandPool {
  const label = LABEL[key];
  const real = REAL[key];
  if (!real?.bands) return dummy(label);
  const fallback = dummy(label);
  const out = {} as FortuneBandPool;
  for (const b of ["1", "2", "3", "4", "5"] as const) {
    const arr = real.bands[b];
    out[b] = Array.isArray(arr) && arr.length > 0 ? arr : fallback[b];
  }
  return out;
}

export const fortuneExplanations: FortuneExplanations = {
  overall: { label: LABEL.overall, bands: resolve("overall") },
  love: { label: LABEL.love, bands: resolve("love") },
  money: { label: LABEL.money, bands: resolve("money") },
  work: { label: LABEL.work, bands: resolve("work") },
  health: { label: LABEL.health, bands: resolve("health") },
  social: { label: LABEL.social, bands: resolve("social") },
  outing: { label: LABEL.outing, bands: resolve("outing") },
};
