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
 * 本番データは `content/fortune/data/<category>.json`（各バンド100本以上）。
 * 出力フォーマットは docs/fortune-explanation-prompt.md を参照。
 * 新カテゴリを足す場合は data/ に JSON を置き、下の DATA に import + 1行追加するだけ。
 */
type RawCategory = { category?: string; label?: string; bands: Record<string, string[]> };

const DATA: Record<FortuneCategoryKey, RawCategory> = {
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

function toBands(raw: RawCategory): FortuneBandPool {
  const b = raw.bands ?? {};
  return {
    "1": b["1"] ?? [],
    "2": b["2"] ?? [],
    "3": b["3"] ?? [],
    "4": b["4"] ?? [],
    "5": b["5"] ?? [],
  };
}

export const fortuneExplanations = Object.fromEntries(
  (Object.keys(LABEL) as FortuneCategoryKey[]).map((k) => [k, { label: LABEL[k], bands: toBands(DATA[k]) }]),
) as FortuneExplanations;
