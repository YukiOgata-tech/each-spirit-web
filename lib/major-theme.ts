/**
 * 大カテゴリ別の見た目トークン（詳細エンジン・汎用ページ共用）。pure モジュール。
 * 共通エンジンでも major ごとに色・グラデ・パネル質感を変えるための差し替え口。
 */
export type MajorTheme = {
  /** globals.css のテーマクラス（--primary/--accent/--muted/--border を供給） */
  themeClass: string;
  /** hero セクションの背景グラデーション */
  heroSurface: string;
  /** やわらかいパネル背景（基本情報・属性の枠） */
  soft: string;
  /** アクセントパネル（編集メモ等） */
  accentPanel: string;
  /** 画像が無いときのプレースホルダー背景 */
  imageFallback: string;
};

export const MAJOR_THEMES: Record<string, MajorTheme> = {
  food: {
    themeClass: "ramen-theme",
    heroSurface: "bg-[linear-gradient(135deg,#fff7eb_0%,#ffffff_48%,#f8e1c2_100%)]",
    soft: "bg-orange-50 text-orange-950",
    accentPanel: "border-orange-200 bg-orange-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#fff7eb,#fde9c9)]",
  },
  health: {
    themeClass: "protein-theme",
    heroSurface: "bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_50%,#fff7ed_100%)]",
    soft: "bg-blue-50 text-blue-950",
    accentPanel: "border-blue-200 bg-blue-50/75",
    imageFallback: "bg-[linear-gradient(135deg,#eff6ff,#dbeafe,#fff7ed)]",
  },
  beauty: {
    themeClass: "beauty-theme",
    heroSurface: "bg-[linear-gradient(135deg,#fff1f7_0%,#ffffff_48%,#f1efff_100%)]",
    soft: "bg-pink-50 text-pink-950",
    accentPanel: "border-pink-200 bg-pink-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#fff1f7,#f3e8ff)]",
  },
  travel: {
    themeClass: "travel-theme",
    heroSurface: "bg-[linear-gradient(135deg,#eef8f0_0%,#ffffff_48%,#f5ede0_100%)]",
    soft: "bg-emerald-50 text-emerald-950",
    accentPanel: "border-emerald-200 bg-emerald-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#e7f4ea,#f5ede0)]",
  },
  entertainment: {
    themeClass: "entertainment-theme",
    heroSurface: "bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_50%,#fdf2f8_100%)]",
    soft: "bg-violet-50 text-violet-950",
    accentPanel: "border-violet-200 bg-violet-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#f5f3ff,#fce7f3)]",
  },
  leisure: {
    themeClass: "leisure-theme",
    heroSurface: "bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_50%,#fff4e6_100%)]",
    soft: "bg-cyan-50 text-cyan-950",
    accentPanel: "border-cyan-200 bg-cyan-50/70",
    imageFallback: "bg-[linear-gradient(135deg,#ecfeff,#fff4e6)]",
  },
};

export function majorTheme(major: string | null | undefined): MajorTheme {
  return (major && MAJOR_THEMES[major]) || MAJOR_THEMES.food;
}
