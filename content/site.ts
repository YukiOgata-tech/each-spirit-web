import type { Author } from "@/lib/types";

export const site = {
  name: "Each Spirit",
  japaneseName: "イーチスピリット",
  displayName: "Each Spirit（イーチスピリット）",
  alternateNames: ["イーチスピリット", "EachSpirit", "each-spirit.com"],
  title: "Each Spirit（イーチスピリット）｜グルメ・旅行・暮らしを比較とランキングで選ぶ情報メディア",
  // 各ページタイトルの末尾に付くブランド接尾辞（SEO 用にキーワードを含める）
  titleSuffix: "Each Spirit（イーチスピリット）｜比較・ランキング情報メディア",
  domain: "each-spirit.com",
  url: "https://each-spirit.com",
  tagline: "選ぶ前に、見比べる。暮らしのおすすめ情報メディア。",
  description:
    "Each Spirit（イーチスピリット）は、グルメ、旅行、ガジェット、暮らし、IT情報を比較・ランキング・地域情報で整理し、選ぶ前の判断材料を届ける総合情報メディアです。",
  shortDescription: "比較・ランキング・地域情報で、選ぶ前の判断材料を整理する情報メディア。",
  editor: "Each Spirit 編集部",
  keywords: [
    "Each Spirit",
    "イーチスピリット",
    "EachSpirit",
    "比較",
    "ランキング",
    "おすすめ",
    "選び方",
    "地域情報",
    "ラーメン",
    "旅行",
    "ガジェット",
    "暮らし",
    "ツール比較",
  ],
  ogImage: "/brand/each-spirit-mainmeta.jpg",
  icon: "/brand/each-spirit-mark.png",
  // SNS / external profiles for Organization.sameAs (E-E-A-T signal)
  sameAs: [] as string[],
};

export const editorAuthor: Author = {
  name: "Each Spirit 編集部",
  role: "編集部",
  url: "https://each-spirit.com/about",
};
