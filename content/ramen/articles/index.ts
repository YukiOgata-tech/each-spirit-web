import { editorAuthor } from "@/content/site";
import type { Article } from "@/lib/types";

const collectedAt = "2026-06-07";
const collectedAtYamagata = "2026-06-08";

export const ramenArticles: Article[] = [
  {
    slug: "niigata-ramen-first-guide",
    title: "新潟ラーメンを初めて選ぶ人のための見方",
    description:
      "新潟5大ラーメン、エリア、ジャンル、駐車場、営業時間の見方を整理し、初めての新潟ラーメン巡りで失敗しにくい選び方をまとめます。",
    category: "ラーメン",
    tags: ["新潟", "ラーメン", "選び方", "初心者", "新潟5大ラーメン"],
    publishedAt: "2026-06-01",
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "新潟ラーメンは、新潟あっさり醤油、新潟濃厚味噌、燕背脂、長岡生姜醤油、三条カレーなど地域性で整理すると選びやすいです。",
      "初回は三吉屋、東横、杭州飯店のように特徴が分かりやすい店を軸にすると比較しやすいです。",
      "営業時間や定休日は変わるため、Each Spiritでは店舗ごとに参照ソースと確認日を残します。",
    ],
    whatYouLearn: [
      "新潟5大ラーメンの基本",
      "エリア別・ジャンル別の選び方",
      "店舗詳細で確認すべき営業時間・駐車場・公式情報",
    ],
    sources: [
      { title: "新潟市ラーメンガイド", url: "https://niigatacity-ramen.jp/", sourceType: "official", collectedAt, note: "新潟市内の店舗情報とカテゴリ文脈の確認。" },
      { title: "新潟市ラーメンガイドブック", url: "https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf", sourceType: "government", collectedAt, note: "新潟5大ラーメンと掲載店舗の確認。" },
      { title: "燕背脂ラーメンMAP", url: "https://ra-men.tsubame-kankou.jp/", sourceType: "tourism", collectedAt, note: "燕背脂ラーメンの地域情報確認。" },
    ],
    faqs: [
      { question: "新潟ラーメン初心者は何から選ぶべきですか？", answer: "まずは新潟5大ラーメンのうち、あっさり醤油、濃厚味噌、燕背脂のように特徴が分かりやすいジャンルから選ぶと比較しやすいです。" },
      { question: "営業時間はこのサイトだけ見れば十分ですか？", answer: "営業時間は変更される可能性があります。Each Spiritでは確認元を掲載しますが、訪問前に公式サイトや店舗SNSも確認してください。" },
    ],
    relatedSlugs: ["niigata-five-ramen-guide", "niigata-ramen-car-access"],
  },
  {
    slug: "niigata-five-ramen-guide",
    title: "新潟5大ラーメンとは？代表ジャンルと選び方",
    description:
      "新潟あっさり醤油、新潟濃厚味噌、燕背脂、長岡生姜醤油、三条カレーラーメンの違いと、Each Spiritでの店舗選定方針を整理します。",
    category: "ラーメン",
    tags: ["新潟5大ラーメン", "濃厚味噌", "燕背脂", "あっさり醤油", "地域グルメ"],
    publishedAt: collectedAt,
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "新潟5大ラーメンは味の濃淡、麺、地域背景が異なるため、旅行計画ではジャンルから選ぶと失敗しにくいです。",
      "新潟市内なら三吉屋、東横、こまどり、新潟市外なら杭州飯店のように代表性が分かりやすい店を起点にできます。",
      "Each Spiritでは店舗ごとの公式・観光・地域メディア情報をSourceとして残します。",
    ],
    whatYouLearn: [
      "新潟5大ラーメンの違い",
      "代表店の選び方",
      "県内ページを拡張する時の情報整理方針",
    ],
    sources: [
      { title: "新潟市ラーメンガイドブック", url: "https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf", sourceType: "government", collectedAt, note: "新潟5大ラーメンの分類と掲載店舗確認。" },
      { title: "燕背脂ラーメンMAP", url: "https://ra-men.tsubame-kankou.jp/", sourceType: "tourism", collectedAt, note: "燕背脂ラーメンの地域文脈確認。" },
      { title: "東横 公式サイト", url: "https://www.touyoko.jp/stores", sourceType: "official", collectedAt, note: "新潟濃厚味噌の代表店として確認。" },
    ],
    faqs: [
      { question: "新潟5大ラーメンは全部同じ市内で食べられますか？", answer: "一部は新潟市内で食べやすい一方、燕背脂は燕市、長岡生姜醤油は長岡市など地域性があります。旅程に合わせて選ぶのがおすすめです。" },
      { question: "代表店だけを掲載する方針ですか？", answer: "初期は代表性と情報の追跡しやすさを重視し、今後はエリア別、ジャンル別、営業時間別に広げます。" },
    ],
    relatedSlugs: ["niigata-ramen-first-guide"],
  },
  {
    slug: "niigata-ramen-car-access",
    title: "車で行きやすい新潟ラーメン店の選び方",
    description:
      "駐車場あり、郊外型、営業時間の追跡しやすさを軸に、車移動で新潟ラーメンを選ぶ時のポイントをまとめます。",
    category: "ラーメン",
    tags: ["駐車場あり", "車移動", "新潟市", "燕市", "営業時間"],
    publishedAt: collectedAt,
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "車移動なら、駐車場の有無だけでなく台数、ピーク時間、郊外導線を確認すると選びやすいです。",
      "いっとうや、麺や真玄、麺や来味、杭州飯店は駐車場情報を追跡しやすい候補です。",
      "人気店は駐車場ありでも満車になるため、開店直後やピークを外した訪問が現実的です。",
    ],
    whatYouLearn: [
      "車移動向けの店舗選定軸",
      "駐車場情報の読み方",
      "県内ラーメン巡りの注意点",
    ],
    sources: [
      { title: "新潟市ラーメンガイド", url: "https://niigatacity-ramen.jp/", sourceType: "official", collectedAt, note: "駐車場掲載のある新潟市内店舗確認。" },
      { title: "燕背脂ラーメンMAP 杭州飯店", url: "https://ra-men.tsubame-kankou.jp/stores/entry-27.html", sourceType: "tourism", collectedAt, note: "杭州飯店の駐車場有と営業時間確認。" },
    ],
    faqs: [
      { question: "駐車場ありならいつでも停められますか？", answer: "人気店は駐車場ありでも満車になることがあります。開店直後、昼ピーク後、夜営業開始直後などを検討してください。" },
      { question: "車移動で避けたい条件はありますか？", answer: "営業時間が短い店、売り切れ終了がある店、専用駐車場がない中心部店舗は事前確認が重要です。" },
    ],
    relatedSlugs: ["niigata-ramen-first-guide"],
  },
  {
    slug: "yamagata-ramen-first-guide",
    title: "山形ラーメンを初めて選ぶ人のための見方",
    description:
      "ラーメン消費量日本一の背景、からみそ・冷やしラーメン・酒田ラーメンのエリア別スタイル、各エリアの代表店を整理します。",
    category: "ラーメン",
    tags: ["山形", "ラーメン", "選び方", "からみそ", "酒田ラーメン", "冷やしラーメン", "エリア別"],
    publishedAt: collectedAtYamagata,
    updatedAt: collectedAtYamagata,
    author: editorAuthor,
    summary: [
      "山形ラーメンは南陽のからみそ、山形市の冷やしラーメン、酒田の魚介ワンタン、鶴岡の手揉み麺とエリアごとにジャンルが異なります。",
      "消費量日本一の背景には、日常食としてのラーメン文化が地域に深く根付いていることがあります。",
      "琴平荘のような冬季限定店もあるため、営業時期の確認が訪問計画では重要です。",
    ],
    whatYouLearn: [
      "山形4エリア（南陽・山形市・酒田・鶴岡）のラーメンスタイルの違い",
      "からみそ・冷やしラーメン発祥・酒田ラーメンの背景",
      "訪問前に確認すべき営業時期・時間・駐車場",
    ],
    sources: [
      { title: "山形市公式 ラーメン消費額日本一", url: "https://www.city.yamagata-yamagata.lg.jp/jigyosya/miryoku/brand/1017939.html", sourceType: "government", collectedAt: collectedAtYamagata, note: "山形市のラーメン消費額日本一の確認。" },
      { title: "龍上海 公式サイト", url: "https://ryushanhai.com/group/", sourceType: "official", collectedAt: collectedAtYamagata, note: "からみそラーメン発祥・龍上海の店舗情報確認。" },
      { title: "VISIT YAMAGATA 栄屋本店", url: "https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/", sourceType: "tourism", collectedAt: collectedAtYamagata, note: "冷やしラーメン発祥・栄屋本店の情報確認。" },
      { title: "酒田ラーメン完全ガイド マルメン製麺所", url: "https://shop.onlyone-marumen.com/%E9%85%92%E7%94%B0%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E5%AE%8C%E5%85%A8%E3%82%AC%E3%82%A4%E3%83%89/", sourceType: "editorial", collectedAt: collectedAtYamagata, note: "酒田ラーメンの特徴・自家製麺率・地域背景確認。" },
    ],
    faqs: [
      { question: "山形ラーメン初心者は何から選ぶべきですか？", answer: "からみそ（龍上海）・冷やしラーメン（栄屋本店・夏期）・酒田ラーメン（満月）のように、エリアとジャンルをセットで選ぶと選択しやすいです。" },
      { question: "冬季限定の店があると聞きましたが？", answer: "鶴岡市の琴平荘は10〜5月の冬季のみ営業しています。夏に訪問する場合は他のエリアを中心に計画してください。" },
    ],
    relatedSlugs: ["niigata-ramen-first-guide"],
  },
];
