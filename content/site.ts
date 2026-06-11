import type { Author } from "@/lib/types";

export const site = {
  name: "Each Spirit",
  title: "Each Spirit | 比較・ランキングで選ぶ情報メディア",
  domain: "each-spirit.com",
  url: "https://each-spirit.com",
  tagline: "選ぶ前に、見比べる。暮らしのおすすめ情報メディア。",
  description:
    "Each Spiritは、ラーメン、旅行、ガジェット、暮らし、業務ツールを比較・ランキング・地域情報で整理し、選ぶ前の判断材料を届ける情報メディアです。",
  shortDescription: "比較・ランキング・地域情報で、選ぶ前の判断材料を整理する情報メディア。",
  editor: "Each Spirit 編集部",
  keywords: [
    "Each Spirit",
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
  ogImage: "/opengraph-image",
  icon: "/brand/each-spirit-mark.png",
  // SNS / external profiles for Organization.sameAs (E-E-A-T signal)
  sameAs: [] as string[],
};

export const editorAuthor: Author = {
  name: "Each Spirit 編集部",
  role: "編集部",
  url: "https://each-spirit.com/about",
};
