import type { Ranking } from "@/lib/types";

const collectedAt = "2026-06-08";

export const yamagataRamenRankings: Ranking[] = [
  {
    slug: "yamagata-ramen-essential",
    title: "山形ラーメン 初回に選びたい8店",
    description:
      "消費量日本一・山形の多様なラーメン文化を代表する店を、地域代表性・スタイルの個性・情報の追跡しやすさで選出。からみそ・冷やし・酒田ラーメン・煮干し・地鶏と幅広く体験できる8店です。",
    conclusion:
      "からみそなら龍上海、冷やしラーメン発祥なら栄屋本店、酒田ラーメンなら満月、煮干し特化なら二代目高橋商店か幸めん、地鶏鶏白湯なら麺匠とぐろが優先候補です。",
    quickTableLabel: "山形ラーメン必食8店早見表",
    criteria: [
      "山形の地域ラーメン文化（からみそ・酒田・冷やし・煮干し・地鶏）を網羅できること",
      "創業年・住所・営業時間などの基本情報を公式・観光情報から追跡できること",
      "初訪問者にとってジャンルと特徴が分かりやすいこと",
      "複数エリアをカバーして旅行計画に組み込みやすいこと",
      "PR掲載ではなく編集部評価として紹介できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "yamagata-ryushanhai-akayu", score: 96, reason: "からみそラーメン発祥の全国区名店。辛みそを溶かしながら食べるスタイルで山形ラーメンの個性が最も伝わりやすい。", isPr: false },
      { rank: 2, itemSlug: "yamagata-mangetsu-sakata", score: 93, reason: "1948年創業・駐車場40台・定休日固定と訪問計画が立てやすく、酒田ラーメンの入口として最適。", isPr: false },
      { rank: 3, itemSlug: "yamagata-sakaiya-honten", score: 90, reason: "冷やしラーメン発祥の切り口が明確。夏期訪問なら外せない山形市の代表店。", isPr: false },
      { rank: 4, itemSlug: "yamagata-takahashi-shoten", score: 88, reason: "年4.5t煮干し・無化調という具体的な特徴があり、煮干し目的のファンに刺さる東根の名店。", isPr: false },
      { rank: 5, itemSlug: "yamagata-koumen-sagae", score: 86, reason: "天然かます煮干し100%という全国的に希少な食材を使う寒河江の個店。煮干し好きに強く刺さる。", isPr: false },
      { rank: 6, itemSlug: "yamagata-toguro-tendo", score: 84, reason: "山形地鶏だけを使った無化調鶏白湯で、煮干しが多い山形ランキングに幅を加えられる天童の一店。", isPr: false },
      { rank: 7, itemSlug: "yamagata-shogetsu-sakata", score: 82, reason: "朝7時から・年中無休・駐車場9台と訪問計画しやすい酒田の朝ラー代表。満月との比較候補にも。", isPr: false },
      { rank: 8, itemSlug: "yamagata-kumabun-yonezawa", score: 80, reason: "米沢エリアの醤油中華そばとして置賜地方の導線を作れる。上杉文化観光との組み合わせに向く。", isPr: false },
    ],
    sources: [
      { title: "龍上海 公式サイト", url: "https://ryushanhai.com/group/", sourceType: "official", collectedAt, note: "龍上海基本情報・からみそ発祥確認。" },
      { title: "ワンタンメンの満月 公式サイト", url: "https://www.sakata-mangetsu.com/sakata/", sourceType: "official", collectedAt, note: "満月基本情報確認。" },
      { title: "VISIT YAMAGATA 栄屋本店", url: "https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/", sourceType: "tourism", collectedAt, note: "栄屋本店・冷やしラーメン発祥確認。" },
      { title: "ヤマガタウェイ 山形ラーメン人気30選", url: "https://mag.yway.jp/pr/45200/", sourceType: "local-media", collectedAt, note: "山形市・村山エリア各店の特徴確認。" },
      { title: "山形市公式 ラーメン消費額日本一", url: "https://www.city.yamagata-yamagata.lg.jp/jigyosya/miryoku/brand/1017939.html", sourceType: "government", collectedAt, note: "山形ラーメンの背景確認。" },
    ],
    faqs: [
      { question: "このランキングは広告ですか？", answer: "全件PR掲載なしです。各ランキング項目にPRフラグを表示しています。" },
      { question: "営業時間は保証されていますか？", answer: "営業時間や定休日・季節限定情報は変更される可能性があります。各店舗ページの参照ソースを確認のうえ、訪問前に公式情報を確認してください。" },
    ],
  },

  {
    slug: "yamagata-niboshi-selection",
    title: "煮干しで選ぶ山形ラーメン",
    description: "ラーメン消費量日本一の山形は煮干し文化も豊か。天然かます煮干し・年4.5t使用の無化調・うまにぼし醤油・濃厚Wスープと個性の異なる4店で山形の煮干し層を整理します。",
    conclusion: "希少素材なら幸めんのかます煮干し、量と無化調なら二代目高橋商店、朝から食べるならこうじ屋、Wスープの濃厚感なら麺家林商店が候補です。",
    quickTableLabel: "山形煮干しラーメン早見表",
    criteria: [
      "煮干しを主体としたスープを提供していること",
      "使用素材・製法に明確な個性があること",
      "基本情報を参照元から確認できること",
      "山形内の複数エリアをカバーすること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "yamagata-takahashi-shoten", score: 92, reason: "年4.5tの煮干し使用・無化調という数値で説明できる東根の煮干し特化店。", isPr: false },
      { rank: 2, itemSlug: "yamagata-koumen-sagae", score: 90, reason: "天然かます煮干し100%という全国希少の素材が強い個性。炙りチャーシューとの組み合わせも分かりやすい。", isPr: false },
      { rank: 3, itemSlug: "yamagata-koujiya", score: 87, reason: "朝7時からのうまにぼし醤油。朝ラー×煮干しという利用シーンも明確で山形市でユニークな存在。", isPr: false },
      { rank: 4, itemSlug: "yamagata-hayashi-shoten", score: 85, reason: "数種の煮干しと動物系のWスープ・太麺細麺選択と特徴整理しやすい山形市の夜営業ある個店。", isPr: false },
    ],
    sources: [
      { title: "ヤマガタウェイ 山形ラーメン人気30選", url: "https://mag.yway.jp/pr/45200/", sourceType: "local-media", collectedAt, note: "高橋商店・こうじ屋・林商店の特徴確認。" },
      { title: "ヤマガタウェイ 幸めん かます煮干し", url: "https://mag.yway.jp/gourmet/21597/", sourceType: "local-media", collectedAt, note: "幸めんのかます煮干し100%確認。" },
    ],
    faqs: [
      { question: "山形は煮干しラーメンが多いのですか？", answer: "ラーメン消費量日本一の山形では多様なスタイルが発展しており、煮干し系も個性豊かな店が集まっています。使用素材・製法・濃度がそれぞれ異なる点が特徴です。" },
      { question: "煮干しが苦手でも食べられますか？", answer: "二代目高橋商店や麺家林商店のWスープ系は動物系も合わさるため、煮干しの独特な苦みが和らぐ場合があります。幸めんのかます煮干しは一般的なイワシ煮干しとは風味が異なります。" },
    ],
  },

  {
    slug: "yamagata-area-selection",
    title: "エリアで選ぶ山形ラーメン 8エリア代表選",
    description: "南陽・山形市・寒河江・東根・天童・酒田・鶴岡・米沢の8エリアから各1店を選び、山形ラーメンの地域的な多様性を整理します。旅行計画に合わせてエリアから選ぶ際に活用してください。",
    conclusion: "南陽は龍上海のからみそ、山形市は栄屋本店の冷やしラーメン（夏）、村山は幸めん・高橋商店の煮干し、天童は地鶏の麺匠とぐろ、酒田は満月・照月、鶴岡は琴平荘、米沢は熊文が各エリアの起点候補です。",
    quickTableLabel: "山形エリア別ラーメン早見表",
    criteria: [
      "南陽・山形市・寒河江または東根・天童・酒田・鶴岡・米沢の各エリアを代表すること",
      "ジャンル・味スタイルが各エリアの地域性を示すこと",
      "基本情報（住所・営業時間）を参照元から確認できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "yamagata-ryushanhai-akayu", score: 95, reason: "南陽市赤湯エリア代表。からみそという独自ジャンルで全国的知名度があり、エリア説明の起点になる。", isPr: false },
      { rank: 2, itemSlug: "yamagata-mangetsu-sakata", score: 93, reason: "酒田エリアの酒田ラーメン代表。1948年創業・駐車場40台と訪問計画しやすい老舗。", isPr: false },
      { rank: 3, itemSlug: "yamagata-sakaiya-honten", score: 90, reason: "山形市エリアで冷やしラーメン発祥を体験できる。夏期の観光定番として代表性が高い。", isPr: false },
      { rank: 4, itemSlug: "yamagata-konpirasou", score: 88, reason: "鶴岡エリアから全国区の知名度を持つ冬季限定店。営業時期に注意が必要だが個性が際立つ。", isPr: false },
      { rank: 5, itemSlug: "yamagata-takahashi-shoten", score: 86, reason: "東根エリアの煮干し無化調名店。年4.5t使用という特徴で村山エリアの導線を補強できる。", isPr: false },
      { rank: 6, itemSlug: "yamagata-toguro-tendo", score: 84, reason: "天童エリアの地鶏鶏白湯。さくらんぼ東根・天童温泉の観光と組み合わせやすい立地。", isPr: false },
      { rank: 7, itemSlug: "yamagata-kumabun-yonezawa", score: 82, reason: "米沢エリアの正統派醤油中華そば。置賜・上杉観光との組み合わせ記事に使いやすい。", isPr: false },
      { rank: 8, itemSlug: "yamagata-koumen-sagae", score: 80, reason: "寒河江エリアの希少かます煮干し店。村山エリアの多様性を示す個性的な一店として機能する。", isPr: false },
    ],
    sources: [
      { title: "龍上海 公式サイト", url: "https://ryushanhai.com/group/", sourceType: "official", collectedAt, note: "南陽エリア確認。" },
      { title: "酒田ラーメン Wikipedia", url: "https://ja.wikipedia.org/wiki/%E9%85%92%E7%94%B0%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3", sourceType: "editorial", collectedAt, note: "酒田ラーメンの地域特性確認。" },
      { title: "ヤマガタウェイ 山形ラーメン人気30選", url: "https://mag.yway.jp/pr/45200/", sourceType: "local-media", collectedAt, note: "村山・天童エリア各店の確認。" },
      { title: "まっぷる 支那そば熊文", url: "https://www.mapple.net/spot/6000397/", sourceType: "editorial", collectedAt, note: "米沢エリア熊文の確認。" },
    ],
    faqs: [
      { question: "山形の各エリアへのアクセスはどうですか？", answer: "南陽・山形市・天童・東根・寒河江はJR奥羽本線・仙山線でアクセス可能。酒田・鶴岡は庄内エリアで山形新幹線の停車駅がなく車か高速バスが便利です。米沢は山形新幹線停車駅があります。" },
      { question: "琴平荘は夏も営業していますか？", answer: "10月〜5月の冬季のみ営業です。6〜9月の訪問計画には向きません。" },
    ],
  },
];
