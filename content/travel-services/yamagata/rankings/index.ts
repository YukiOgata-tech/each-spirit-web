import type { Ranking } from "@/lib/types";

export const yamagataTravelAgencyRankings: Ranking[] = [
  {
    slug: "yamagata-local-travel-agencies",
    title: "山形県の地域密着型旅行会社・旅行相談先おすすめ7選",
    description: "庄内、山形市・蔵王、天童、上山、置賜、最上で、地元発着ツアー、体験旅行、団体移動、貸切バス、現地観光に強い旅行会社・交通/観光事業者を7件に絞って比較します。",
    criteria: [
      "山形県内の拠点・発着導線・地域観光との結びつき",
      "公式サイトで確認できる旅行商品・体験プラン・予約導線",
      "旅行業登録、約款、会社情報、問い合わせ先の明確さ",
      "団体旅行・貸切バス・現地体験・宿泊連携への使いやすさ",
      "庄内、蔵王、天童、上山、置賜、最上など地域特性との相性",
    ],
    conclusion: "山形県で総合的な旅行会社を探すなら庄交トラベル、庄内の団体移動なら庄内交通、体験型ならTENDODAYSとやまがたアルカディア観光局、温泉地滞在なら上山ラプソディ、最上川や蔵王の現地観光なら最上峡芭蕉ライン観光と蔵王ロープウェイを確認したい。",
    quickTableLabel: "山形県 地域密着型旅行会社・旅行相談先 7選",
    lastUpdatedAt: "2026-06-14",
    items: [
      { rank: 1, itemSlug: "shoko-travel", score: 92, reason: "観光庁長官登録旅行業、JATA会員、庄交ミリオンツアー、山旅、飛行機旅、団体旅行導線が公式情報で明確。山形県内では総合旅行会社として最も使いやすい。", isPr: false },
      { rank: 2, itemSlug: "tendodays-dmc-tendo", score: 87, reason: "天童温泉を起点に、羽黒山、さくらんぼ、食、歩く、学ぶ体験を商品化。地域連携型の着地型旅行として山形らしさが強い。", isPr: false },
      { rank: 3, itemSlug: "arcadia-tourism-bureau", score: 85, reason: "長井・南陽・白鷹・飯豊・小国の広域観光局として、体験ツアーや視察プランを企画販売。置賜南部の旅行相談先として有用。", isPr: false },
      { rank: 4, itemSlug: "shonai-kotsu", score: 83, reason: "旅行手配は庄交トラベルが中心だが、庄内の貸切バス、空港連絡、高速バス、観光アクセスを確認でき、団体移動で実用性が高い。", isPr: false },
      { rank: 5, itemSlug: "kaminoyama-rhapsody", score: 81, reason: "上山市観光物産協会の公式観光サイトとして、観光プラン、宿泊予約、旅行業登録票・約款導線があり、かみのやま温泉滞在と相性がよい。", isPr: false },
      { rank: 6, itemSlug: "mogami-basho-line", score: 78, reason: "旅行会社ではないが、最上川舟下り、貸切船、食事、戻りの移動まで公式に確認でき、最上エリアの旅程づくりで核になる。", isPr: false },
      { rank: 7, itemSlug: "zao-ropeway", score: 75, reason: "現地交通・観光事業者として、蔵王温泉のロープウェイ、トレッキング、ナイトクルージング、運行情報を確認できる。蔵王旅行では必須の公式情報源。", isPr: false },
    ],
    sources: [
      { title: "庄交トラベル", url: "https://www.shoko-travel.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "ツアー、旅行業登録、JATA会員、庄内発着旅行導線を確認。" },
      { title: "庄内交通", url: "https://www.shonaikotsu.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "貸切バス、庄内観光、高速バス、空港連絡バスを確認。" },
      { title: "TENDODAYS", url: "https://www.tendodays.com/", sourceType: "official", collectedAt: "2026-06-14", note: "体験ツアー、DMC天童温泉、会社概要・標識導線を確認。" },
      { title: "やまがたアルカディア観光局", url: "https://arcadia-kanko.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "置賜地域の体験ツアー、旅プラン、ショップ導線を確認。" },
      { title: "上山ラプソディ", url: "https://kaminoyama-spa.com/", sourceType: "official", collectedAt: "2026-06-14", note: "観光プラン、宿泊予約、旅行業登録票・約款導線を確認。" },
      { title: "最上峡芭蕉ライン観光", url: "https://www.blf.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "舟下り、貸切船、食事予約、料金、営業時間を確認。" },
      { title: "蔵王ロープウェイ", url: "https://zaoropeway.co.jp/", sourceType: "official", collectedAt: "2026-06-14", note: "ロープウェイ、蔵王ガイド、運行情報、山岳観光導線を確認。" },
    ],
    faqs: [
      { question: "山形県の旅行会社はどの地域で分けて見るべきですか？", answer: "庄内、山形市・蔵王、天童、上山、置賜、最上で旅行導線が分かれます。出発地と目的地、体験型か団体移動かを先に決めると選びやすいです。" },
      { question: "純粋な旅行会社以外も含めていますか？", answer: "含めています。山形県では地域発着ツアーや団体移動、現地体験の公式導線が交通会社・観光局・現地事業者に分散しているため、旅行相談先として実用性の高い事業者も掲載しています。" },
      { question: "大手旅行会社は含めていますか？", answer: "県別調査では全国大手やOTAよりも、地元発着、地域体験、団体旅行、貸切バス、現地観光に強い地域事業者を優先しています。" },
    ],
  },
];
