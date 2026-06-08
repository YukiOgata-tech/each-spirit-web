import type { Ranking, Source } from "@/lib/types";

const collectedAt = "2026-06-08";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string): Source => ({
  title, url, sourceType, collectedAt, note,
});

export const beautyRankings: Ranking[] = [
  {
    slug: "niigata-beauty-by-age",
    title: "【年代別】新潟おすすめ美容室ランキング",
    description: "10代〜50代の年代ごとに、ニーズ・施術内容・価格帯・利便性を軸に評価した新潟県美容室ランキング。実在するサロンの公開情報をもとに編集部が整理しています。",
    criteria: [
      "年代別ニーズへの対応力（白髪ケア・トレンド・子連れ対応など）",
      "スタイリストのカウンセリング体制",
      "価格帯と年代のマッチング",
      "アクセス・駐車場などの利便性",
      "公開されている口コミ・予約サイト掲載情報",
    ],
    conclusion: "10〜20代の駅前アクセス重視ならCLOE新潟駅前店、カラー品質重視の20〜30代にはSea by LUVISM万代店、髪質改善・ヘッドスパを重視する30〜50代にはUrsus HEADLIGHT坂井東店、長岡市のファミリー層にはCLOE長岡古正寺店が最有力。",
    quickTableLabel: "年代別おすすめ美容室 早見表（新潟）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "ursus-headlight-sakaihi",
        score: 91,
        reason: "髪質改善・ヘッドスパ・縮毛矯正・デジタルパーマと幅広いメニューで30〜50代のケア重視層のニーズを最も総合的に満たす。専用駐車場5台で車移動派にも対応、年中無休で夜21時まで営業と利便性も高い。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "sea-luvism-bandai",
        score: 86,
        reason: "イルミナカラー・ダブルカラーのクオリティで20〜30代カラー層のニーズに的確に応える。LUVISMグループのプレミアムラインとして万代エリアで高い評価を得ており、年中無休夜22時まで営業と使いやすい。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "cloe-luvism-nagaoka",
        score: 83,
        reason: "キッズスペースあり・駐車場15台完備で、長岡市内で子連れファミリーとカラー品質を両立できる。10〜40代の幅広い年代に対応しており、長岡エリアでの年代別総合評価は最高水準。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "cloe-luvism-niigataeki",
        score: 80,
        reason: "新潟駅徒歩2分という立地と¥2,400〜の入りやすい価格帯が10〜20代に最適。年中無休夜22時まで営業で通勤・通学のついでに利用しやすく、初めてのデザインカラーや縮毛矯正の入門として最適。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "cloe-luvism-furumachi",
        score: 75,
        reason: "古町エリアでオーガニックカラーを得意とし、20〜40代の幅広い層に対応。¥2,500〜のカット料金と年中無休夜22時まで営業が評価ポイント。",
        isPr: false,
      },
    ],
    sources: [
      src("Sea by LUVISM 万代店 ホットペッパービューティー", "https://beauty.hotpepper.jp/slnH000624907/", "local-media", "料金・口コミ確認。"),
      src("Ursus hair Design by HEADLIGHT 坂井東店 ホットペッパービューティー", "https://beauty.hotpepper.jp/slnH000362060/", "local-media", "メニュー・口コミ確認。"),
      src("CLOE by LUVISM 長岡古正寺店 ホットペッパービューティー", "https://beauty.hotpepper.jp/slnH000375435/", "local-media", "メニュー・子連れ対応・口コミ確認。"),
    ],
    faqs: [
      { question: "このランキングはどのような基準で選んでいますか？", answer: "ホットペッパービューティー・各公式サイト・楽天ビューティーなどに公開されている情報（メニュー・料金・口コミ・設備）をもとに編集部が整理しています。実際の施術品質は訪問前に口コミや予約サイトで最新情報をご確認ください。" },
      { question: "子連れで行けるサロンはどこですか？", answer: "CLOE by LUVISM 長岡古正寺店がキッズスペースあり・駐車場15台完備で子連れ対応が確認されています。電話0258-86-8755です。" },
    ],
  },
  {
    slug: "niigata-beauty-color",
    title: "【カラー・髪質改善】新潟おすすめ美容室ランキング",
    description: "イルミナカラー・オーガニックカラー・ダブルカラー・ハイライト・髪質改善トリートメントを得意とするサロンを、公開情報をもとに評価した新潟版ランキング。",
    criteria: [
      "カラー薬剤の種類と対応メニューの幅",
      "髪質改善メニューの有無",
      "カラー+トリートメントのセットコスト",
      "口コミ・予約サイトでの評価",
      "アクセス・利便性",
    ],
    conclusion: "イルミナカラー・ダブルカラーはSea by LUVISM万代店、オーガニックカラーはCLOE古町・CLOE駅前、髪質改善も含めた総合力はUrsus HEADLIGHT坂井東店が充実。",
    quickTableLabel: "カラー・髪質改善 早見表（新潟）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "sea-luvism-bandai",
        score: 94,
        reason: "LUVISMグループのプレミアムラインとしてイルミナカラー・ブリーチ・ダブルカラーへの対応が充実。万代エリアでカラーを重視する20〜30代への最有力候補。年中無休で夜22時まで営業。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "cloe-luvism-nagaoka",
        score: 87,
        reason: "イルミナフルカラー+カット¥7,400〜・インナーカラー・ハイライトと充実したカラーメニューに加え、15台の駐車場と子連れ対応も備える長岡エリアの総合力トップ。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "cloe-luvism-furumachi",
        score: 82,
        reason: "カット+オーガニックフルカラー¥5,400〜と古町エリアでのコスパが評価される。オーガニックカラー対応が特徴で、頭皮が気になる層への提案として有効。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "cloe-luvism-niigataeki",
        score: 79,
        reason: "カット+オーガニックフルカラー¥4,900〜と新潟駅前エリアで最も入りやすい価格帯のカラーメニュー。縮毛矯正も得意で10〜30代からの支持が厚い。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "ursus-headlight-sakaihi",
        score: 74,
        reason: "カラーに加えてTOKIO系の髪質改善・ヘッドスパも組み合わせられる点で他店と差別化。「カラーとケアを同時にしたい」30〜50代の読者向けの総合力評価で上位。",
        isPr: false,
      },
    ],
    sources: [
      src("Sea by LUVISM 万代店 公式サイト", "https://seabyluvism.jp/salon/sea-by-luvism-%E4%B8%87%E4%BB%A3%E5%BA%97/", "official", "得意施術確認。"),
      src("CLOE by LUVISM 長岡古正寺店 公式サイト", "https://cloebyluvism.jp/salon/kosyoji/", "official", "料金・メニュー確認。"),
      src("CLOE by LUVISM 古町6番店 公式サイト", "https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/", "official", "オーガニックカラー料金確認。"),
    ],
    faqs: [
      { question: "イルミナカラーとオーガニックカラーはどう違いますか？", answer: "イルミナカラーはWELLA製でツヤと透明感に強く、オーガニックカラーは天然由来成分配合で頭皮への刺激が少ない薬剤です。髪質と目的に合わせてサロンでご相談ください。" },
      { question: "カラーと髪質改善を同日にできるサロンはどこですか？", answer: "Ursus hair Design by HEADLIGHT 坂井東店はカラー・髪質改善・ヘッドスパを組み合わせたメニューに対応しています。予約時に確認してください。" },
    ],
  },
  {
    slug: "niigata-beauty-headspa",
    title: "【ヘッドスパ・トリートメント】新潟おすすめ美容室ランキング",
    description: "ヘッドスパ・髪質改善トリートメント・縮毛矯正などケア系施術を得意とするサロンを、公開情報をもとに評価した新潟版ランキング。",
    criteria: [
      "ヘッドスパ・トリートメントメニューの充実度",
      "髪質改善の対応施術の幅",
      "口コミ・予約サイトでの評価",
      "駐車場・アクセスなどの利便性",
      "価格帯の適正感",
    ],
    conclusion: "ヘッドスパ・髪質改善・縮毛矯正が一店で揃うUrsus HEADLIGHT坂井東店が最有力。オーガニック系ケアはCLOE古町6番店が対応。",
    quickTableLabel: "ヘッドスパ・トリートメント 早見表（新潟）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "ursus-headlight-sakaihi",
        score: 96,
        reason: "髪質改善・ヘッドスパ・縮毛矯正・デジタルパーマ・トリートメントとケア系メニューが最も充実。専用駐車場5台完備で車移動派も通いやすく、年中無休夜21時まで営業。西区在住の30〜50代のケア重視層への最有力候補。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "cloe-luvism-furumachi",
        score: 78,
        reason: "オーガニックカラーを得意とし、頭皮に優しい施術へのこだわりがトリートメント系ニーズとも親和性が高い。古町エリアで化学薬剤を避けたいケア重視の読者への提案として有効。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "sea-luvism-bandai",
        score: 72,
        reason: "カラー施術後の髪質改善ケアのセットメニューが充実。カラーダメージを補いながらケアを継続したい20〜30代の読者への提案として活用できる。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "cloe-luvism-nagaoka",
        score: 68,
        reason: "長岡エリアでカラーとトリートメントをセットで利用できる環境が整っている。子連れでも通えるため、産後の髪ケアを始めたい読者への提案としても機能する。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "delight-designers-works",
        score: 60,
        reason: "メンズ専門サロンとしてメンズ向けのヘアケアメニューに対応。男性でトリートメントや頭皮ケアを始めたい読者への新潟駅前エリアの提案先として機能する。",
        isPr: false,
      },
    ],
    sources: [
      src("Ursus hair Design by HEADLIGHT 坂井東店 HEADLIGHT公式", "https://headlight-inc.com/salon/area04/nigata/ursus-hair-design-niigatasakaihigashi/", "official", "メニュー・施術内容確認。"),
      src("CLOE by LUVISM 古町6番店 公式サイト", "https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/", "official", "オーガニックカラー確認。"),
    ],
    faqs: [
      { question: "新潟でヘッドスパを体験できるサロンはどこですか？", answer: "Ursus hair Design by HEADLIGHT 坂井東店がヘッドスパを含むケア系メニューが最も充実しています。新潟市西区坂井東1-3-15、電話025-378-3447です。" },
      { question: "ヘッドスパとカラーは同日にできますか？", answer: "多くのサロンで対応していますが施術時間が長くなります。予約時に希望メニューをお伝えください。" },
    ],
  },
];
