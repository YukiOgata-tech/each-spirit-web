import type { FortuneCategoryKey } from "@/lib/fortune";

export type CategoryTheme = {
  accent: string; // 主役色
  soft: string; // 淡い面色（rgba 文字列）
  vibe: string; // その運勢の気分ワード（短く個性的に）
  motif: MotifKey;
};

type MotifKey = "love" | "money" | "work" | "health" | "social" | "outing";

/** カテゴリごとの固有テーマ。色・気分・モチーフで一つひとつ別物に見せる。 */
export const CATEGORY_THEME: Record<Exclude<FortuneCategoryKey, "overall">, CategoryTheme> = {
  love: { accent: "#fb6f92", soft: "rgba(251,111,146,0.16)", vibe: "ときめき", motif: "love" },
  money: { accent: "#f4c25b", soft: "rgba(244,194,91,0.16)", vibe: "実り", motif: "money" },
  work: { accent: "#5bc0eb", soft: "rgba(91,192,235,0.16)", vibe: "集中", motif: "work" },
  health: { accent: "#57cc99", soft: "rgba(87,204,153,0.16)", vibe: "巡り", motif: "health" },
  social: { accent: "#b08bf5", soft: "rgba(176,139,245,0.16)", vibe: "ご縁", motif: "social" },
  outing: { accent: "#f4845f", soft: "rgba(244,132,95,0.16)", vibe: "冒険", motif: "outing" },
};

/** カードの背後に薄く敷く、カテゴリ固有のモチーフ模様。currentColor で着色する。 */
export function CategoryMotif({ motif, className = "" }: { motif: MotifKey; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {MOTIFS[motif]}
    </svg>
  );
}

const MOTIFS: Record<MotifKey, React.ReactNode> = {
  // 恋愛: 舞う花びら／ハート
  love: (
    <g>
      <path d="M30 34c-6-8 6-15 8-6 2-9 14-2 8 6-3 4-8 8-8 8s-5-4-8-8z" fill="currentColor" fillOpacity="0.5" stroke="none" />
      <path d="M86 70c-4-6 4-11 6-4 1-6 9-2 6 4-2 3-6 6-6 6s-4-3-6-6z" fill="currentColor" fillOpacity="0.35" stroke="none" />
      <path d="M70 24c4 3 4 9 0 12M44 86c-4-3-4-9 0-12" />
      <circle cx="100" cy="40" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="22" cy="74" r="2.2" fill="currentColor" stroke="none" />
    </g>
  ),
  // 金運: コイン／きらめき
  money: (
    <g>
      <circle cx="40" cy="42" r="16" />
      <circle cx="40" cy="42" r="9" />
      <circle cx="84" cy="78" r="11" />
      <path d="M84 71v14M77 78h14" />
      <path d="M96 28l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" stroke="none" fillOpacity="0.6" />
    </g>
  ),
  // 仕事・学業: 設計図グリッド／上昇バー
  work: (
    <g>
      <path d="M20 100V40M20 100h70" strokeOpacity="0.5" />
      <rect x="30" y="74" width="12" height="22" rx="2" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <rect x="48" y="60" width="12" height="36" rx="2" fill="currentColor" fillOpacity="0.45" stroke="none" />
      <rect x="66" y="44" width="12" height="52" rx="2" fill="currentColor" fillOpacity="0.5" stroke="none" />
      <path d="M28 56l16-14 12 8 22-22" />
      <path d="M84 28h8v8" />
    </g>
  ),
  // 健康: 鼓動の波形／若葉
  health: (
    <g>
      <path d="M12 64h22l8-22 12 44 9-30 7 8h28" />
      <path d="M96 86c-10 0-16-6-16-16 10 0 16 6 16 16z" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <path d="M96 86c0-10 6-16 16-16 0 10-6 16-16 16z" fill="currentColor" fillOpacity="0.3" stroke="none" />
    </g>
  ),
  // 対人: つながるノード（ネットワーク）
  social: (
    <g>
      <path d="M34 36L72 30M34 36L48 72M72 30L92 64M48 72L92 64M48 72L40 96" strokeOpacity="0.5" />
      <circle cx="34" cy="36" r="5" fill="currentColor" stroke="none" />
      <circle cx="72" cy="30" r="5" fill="currentColor" stroke="none" />
      <circle cx="92" cy="64" r="5" fill="currentColor" stroke="none" />
      <circle cx="48" cy="72" r="5" fill="currentColor" stroke="none" />
      <circle cx="40" cy="96" r="4" fill="currentColor" stroke="none" />
    </g>
  ),
  // おでかけ・グルメ: コンパスローズ／道のり
  outing: (
    <g>
      <circle cx="50" cy="50" r="26" strokeOpacity="0.5" />
      <path d="M50 28l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="currentColor" fillOpacity="0.45" stroke="none" />
      <path d="M78 84c8 0 8-10 16-10" strokeDasharray="3 5" />
      <path d="M98 70l2.5 6h-5z" fill="currentColor" stroke="none" />
    </g>
  ),
};
