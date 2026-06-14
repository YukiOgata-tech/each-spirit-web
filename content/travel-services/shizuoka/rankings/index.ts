import type { Ranking } from "@/lib/types";

export const shizuokaTravelAgencyRankings: Ranking[] = [
  {
    slug: "shizuoka-local-travel-agencies",
    title: "静岡県の地域密着型旅行会社おすすめ7選",
    description: "静岡市・浜松・伊豆・三島・富士山周辺で、地元発着ツアー、団体旅行、貸切バス、着地型旅行に強い旅行会社・交通会社を7件に絞って比較します。",
    criteria: [
      "静岡県内または静岡県旅行と相性の高い拠点・発着導線",
      "公式サイトで確認できる旅行商品・相談内容",
      "旅行業登録や会社情報の明確さ",
      "団体旅行・貸切バス・地元発着ツアーへの強さ",
      "伊豆・富士山・浜松など地域特性との相性",
    ],
    conclusion: "静岡市周辺の団体旅行なら静岡鉄道ツーリズム課、浜松・遠州の団体旅行なら遠鉄トラベル、募集型バスツアーならバンビツアー、伊豆旅行なら東海バストラベルと伊豆箱根トラベルが使いやすい。",
    quickTableLabel: "静岡県 地域密着型旅行会社 7選",
    lastUpdatedAt: "2026-06-14",
    items: [
      { rank: 1, itemSlug: "shizutetsu-tourism", score: 91, reason: "旅行業登録、団体旅行相談、FDAフリープラン、マイカープランの導線が公式情報で明確。静岡市・中部の総合相談先として安定している。", isPr: false },
      { rank: 2, itemSlug: "entetsu-travel", score: 88, reason: "浜松・遠州発の団体旅行と貸切バス相談に強い。個人旅行受付停止を明記しており、団体向けとして役割が分かりやすい。", isPr: false },
      { rank: 3, itemSlug: "bambi-tour", score: 86, reason: "浜松・磐田・掛川発着の募集型バスツアーを検索しやすい。日帰り・宿泊・テーマ別の導線が整っている。", isPr: false },
      { rank: 4, itemSlug: "tokai-bus-travel", score: 85, reason: "伊豆から出発するツアーと伊豆で巡る着地型ツアーを持ち、伊豆旅行との相性が高い交通会社系の旅行導線。", isPr: false },
      { rank: 5, itemSlug: "izuhakone-travel", score: 83, reason: "三島を拠点にグループ旅行、バス送迎、企画旅行を確認できる。伊豆箱根エリアの交通導線と組み合わせやすい。", isPr: false },
      { rank: 6, itemSlug: "shizutetsu-joystep-bus", score: 79, reason: "旅行会社というより貸切・観光バス会社だが、静岡県中部の団体移動や観光バス相談では実用性が高い。", isPr: false },
      { rank: 7, itemSlug: "fujikyu-travel", score: 77, reason: "県内企業ではないが、富士山周辺・静岡東部の旅行導線として実用性がある。富士急グループ施設を絡める旅行で候補になる。", isPr: false },
    ],
    sources: [
      { title: "静岡鉄道 ツーリズム課", url: "https://www.shizutetsu.co.jp/tourism/", sourceType: "official", collectedAt: "2026-06-14", note: "旅行商品、団体旅行相談、旅行業登録票を確認。" },
      { title: "遠鉄トラベル", url: "https://www.e-trip.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "団体旅行、貸切バス、問い合わせ先を確認。" },
      { title: "バンビツアー", url: "https://bambi.entetsu.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "日帰り・宿泊コース、乗り場、予約センターを確認。" },
      { title: "東海バストラベル", url: "https://www.tokaibus.jp/travel/", sourceType: "official", collectedAt: "2026-06-14", note: "伊豆発ツアー、着地型、問い合わせ先を確認。" },
      { title: "伊豆箱根トラベル", url: "https://www.izuhakone.co.jp/travel/index.html", sourceType: "official", collectedAt: "2026-06-14", note: "グループ旅行、バス送迎、企画旅行、本社旅行センターを確認。" },
      { title: "静鉄ジョイステップバス", url: "https://www.joystep.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "貸切・観光バス、バスツアー、見積り導線を確認。" },
      { title: "富士急トラベル", url: "https://www.fujikyu-travel.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "公式旅行会社サイトと問い合わせ導線を確認。" },
    ],
    faqs: [
      { question: "静岡県の旅行会社はどの地域で分けて見るべきですか？", answer: "静岡市・中部、浜松・遠州、伊豆・三島、富士山周辺で旅行導線が分かれます。出発地と目的地を先に決めると相談先を選びやすいです。" },
      { question: "大手旅行会社は含めていますか？", answer: "県別調査では全国大手よりも、地域交通会社系や地元発着ツアー、団体旅行相談に強い会社を優先しています。" },
      { question: "富士急トラベルは静岡県外ですが、なぜ掲載していますか？", answer: "富士山周辺・静岡東部の旅行と相性が高く、富士急グループの交通・レジャー導線が実用的なため、県境エリア枠として掲載しています。" },
    ],
  },
];
