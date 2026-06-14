import type { TravelApp } from "@/lib/types";

export const travelApps: TravelApp[] = [
  {
    slug: "navitime",
    name: "NAVITIME",
    brand: "ナビタイムジャパン",
    description: "乗換、徒歩、車、バス、飛行機など複数の移動手段を横断して調べられる総合ナビアプリ。旅行中の移動計画と当日の経路確認に向きます。",
    useCase: "移動計画・乗換検索",
    platforms: ["iOS", "Android", "Web"],
    priceRange: "無料プランあり / 有料機能あり",
    features: ["乗換検索", "時刻表", "運行情報", "徒歩ルート", "交通横断検索"],
    bestFor: ["県外旅行で公共交通を使う", "バス・鉄道・徒歩をまとめて確認したい", "移動当日のリカバリーを重視する"],
    officialUrl: "https://www.navitime.co.jp/",
    imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
    editorComment: "地方旅行では鉄道だけでなくバス・徒歩・車の接続が重要。NAVITIMEは移動手段を横断して考えたいときの基礎アプリとして使いやすい。",
    lastVerifiedAt: "2026-06-14",
    sources: [
      { title: "NAVITIME 公式サイト", url: "https://www.navitime.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "乗換、時刻表、運行情報、旅行・予約導線を確認。" },
    ],
    faqs: [
      { question: "NAVITIMEは旅行計画にも使えますか？", answer: "移動時間や乗換、徒歩ルートを確認できるため、観光地を何件回れるかを考えるときに使いやすいです。" },
    ],
  },
  {
    slug: "jorudan-norikae",
    name: "乗換案内",
    brand: "ジョルダン",
    description: "鉄道・バスなどの乗換検索に強い定番アプリ。旅行中に出発・到着時刻からルートを素早く引く用途に向きます。",
    useCase: "乗換検索・時刻確認",
    platforms: ["iOS", "Android", "Web"],
    priceRange: "無料プランあり / 有料機能あり",
    features: ["乗換検索", "時刻表", "運行情報", "経路比較"],
    bestFor: ["電車移動が中心", "複数ルートを素早く比較したい", "旅行当日の時刻を確認したい"],
    officialUrl: "https://www.jorudan.co.jp/android/norikae/",
    imageUrl: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f",
    editorComment: "鉄道中心の旅程では今でも定番。移動計画の細部を詰める段階で、経路比較用に入れておくと便利。",
    lastVerifiedAt: "2026-06-14",
    sources: [
      { title: "ジョルダン 乗換案内", url: "https://www.jorudan.co.jp/android/norikae/", sourceType: "official", collectedAt: "2026-06-14", note: "アプリ概要と乗換検索機能を確認。" },
    ],
    faqs: [
      { question: "旅行アプリとして何に使うのがよいですか？", answer: "観光地間の移動や帰りの列車時刻など、当日の乗換確認に使うのが向いています。" },
    ],
  },
];
