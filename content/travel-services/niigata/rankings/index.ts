import type { Ranking } from "@/lib/types";

export const niigataTravelAgencyRankings: Ranking[] = [
  {
    slug: "niigata-local-travel-agencies",
    title: "新潟県の地域密着型旅行会社おすすめ7選",
    description: "新潟県内発着の旅行、団体手配、バスツアー、佐渡旅行に強い地域密着型の旅行会社・交通会社を7件に絞って比較します。",
    criteria: [
      "新潟県内の拠点・発着導線",
      "公式サイトで確認できる旅行商品・相談内容",
      "旅行業登録や会社情報の明確さ",
      "団体旅行・貸切バス・地元発着ツアーへの強さ",
      "大手予約サイトでは拾いにくい地域性",
    ],
    conclusion: "総合相談なら新潟トラベル、テーマ型ツアーならハミングツアー、団体・貸切バスなら中越トラベルや頸城自動車、佐渡旅行なら佐渡汽船が使いやすい。",
    quickTableLabel: "新潟県 地域密着型旅行会社 7選",
    lastUpdatedAt: "2026-06-14",
    items: [
      { rank: 1, itemSlug: "niigata-travel", score: 92, reason: "県内複数拠点、観光庁長官登録旅行業、個人から団体までの守備範囲が広く、初回相談先として最も安定している。", isPr: false },
      { rank: 2, itemSlug: "humming-tour", score: 88, reason: "花旅・山旅・クルーズなどテーマ型ツアーが見つけやすく、新潟発着の企画旅行を探す入口として強い。", isPr: false },
      { rank: 3, itemSlug: "chuetsu-travel", score: 86, reason: "燕市発のオーダーメイド旅行と貸切バス連携が明確。地域団体や職場旅行の相談で使いやすい。", isPr: false },
      { rank: 4, itemSlug: "sado-kisen", score: 84, reason: "佐渡旅行では船・現地移動・滞在を同時に考える必要があり、公式導線としての実用性が高い。", isPr: false },
      { rank: 5, itemSlug: "kubiki-motor-green-tour", score: 82, reason: "上越発のバス旅行・団体旅行に強い地域交通会社系。ホテル・旅館手配も含めて相談しやすい。", isPr: false },
      { rank: 6, itemSlug: "echigo-kotsu-golden-tour", score: 80, reason: "長岡・中越発着のゴールデンツアーを公式サイトで確認でき、日帰り・季節ツアー探しに向く。", isPr: false },
      { rank: 7, itemSlug: "niigata-kotsu-travel", score: 78, reason: "新潟市発着の交通情報と旅行情報をまとめて確認できる。交通会社グループの入口として実用性がある。", isPr: false },
    ],
    sources: [
      { title: "新潟トラベル 公式サイト", url: "https://www.nts-kij.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "会社概要・店舗・旅行商品を確認。" },
      { title: "ハミングツアー 公式サイト", url: "https://www.humming-tour.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "テーマ型ツアーと営業所導線を確認。" },
      { title: "中越トラベル 公式サイト", url: "https://chuetsu-travel.com/", sourceType: "official", collectedAt: "2026-06-14", note: "旅行業登録、所在地、貸切バス連携を確認。" },
      { title: "佐渡汽船 旅行・ツアー", url: "https://www.sadokisen.co.jp/trip-top/", sourceType: "official", collectedAt: "2026-06-14", note: "佐渡旅行の導線を確認。" },
      { title: "頸城自動車 団体・個人旅行", url: "https://www.marukei-g.com/pages/199/", sourceType: "official", collectedAt: "2026-06-14", note: "マルケーグリーンツアー、旅行相談を確認。" },
      { title: "越後交通 ゴールデンツアー", url: "https://www.echigo-kotsu.co.jp/gt/", sourceType: "official", collectedAt: "2026-06-14", note: "ツアー一覧・Web申込導線を確認。" },
      { title: "新潟交通 公式サイト", url: "https://www.niigata-kotsu.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "旅行情報・交通導線を確認。" },
    ],
    faqs: [
      { question: "このランキングは大手旅行会社も含めていますか？", answer: "県別調査では、大手全国チェーンよりも新潟県内に拠点や発着導線がある地域密着型の旅行会社・交通会社を優先しています。" },
      { question: "旅行業登録はすべて確認していますか？", answer: "公式サイトで登録情報が確認できるものは掲載しています。登録番号が見つからない場合は、公式情報で旅行商品・相談導線が明確な交通会社系として扱い、詳細確認を促しています。" },
      { question: "料金は比較できますか？", answer: "旅行会社は相談内容、人数、日程、交通手段で見積もりが変わるため、固定料金比較ではなく相談しやすさ・得意分野・地域性を中心に評価しています。" },
    ],
  },
];
