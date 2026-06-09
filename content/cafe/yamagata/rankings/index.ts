import type { CafeRanking, Source } from "@/lib/types";

const collectedAt = "2026-06-09";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string) => ({
  title, url, sourceType, collectedAt, note,
});

export const yamagataCafeRankings: CafeRanking[] = [
  {
    slug: "yamagata-cafe-best",
    title: "山形県のカフェ おすすめランキング",
    description: "スペシャルティコーヒー・蔵カフェ・フルーツスイーツカフェなど、山形県内の個性的なカフェを雰囲気・こだわり・アクセスで総合評価。米沢・上山・鶴岡・酒田・長井・南陽まで県内各エリアを網羅しました。",
    conclusion: "コーヒーのこだわりならBOTA coffeeまたは蔵王の森焙煎工房、空間の個性なら神社カフェかたばみか灯蔵オビハチ、フルーツスイーツなら天童のoh!show!cafe。米沢エリアなら鷹山堂・cafe gootが新たな選択肢です。",
    quickTableLabel: "山形カフェ総合評価早見表",
    criteria: [
      "コーヒー・ドリンクのクオリティと個性",
      "空間・雰囲気の魅力度",
      "アクセスと駐車場の利便性",
      "価格とコストパフォーマンス",
      "公式情報の追跡しやすさ",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1,  cafeSlug: "bota-coffee-yamagata",                   score: 94, reason: "深煎り特化・少量自家焙煎で鮮度にこだわる山形のコーヒー名店。山形市のコーヒー通が通う実力店。", isPr: false },
      { rank: 2,  cafeSlug: "katabami-jinja-cafe",                     score: 92, reason: "荘内神社境内という唯一無二のロケーション。庄内産おむすびと甘酒ラテが体験価値大。", isPr: false },
      { rank: 3,  cafeSlug: "ohshow-cafe-tendo",                       score: 91, reason: "果樹園直営の朝採りフルーツパフェは山形らしさ全開。季節ごとに変わる限定メニューが人気。", isPr: false },
      { rank: 4,  cafeSlug: "zaonomori-roasters",                      score: 90, reason: "20種超の自家焙煎豆を揃えるロースタリー。駐車場完備でアクセスも良好。", isPr: false },
      { rank: 5,  cafeSlug: "kura-obi-yamagata",                       score: 88, reason: "築90年超の蔵改装で昼カフェ・夜ライブバーの二面性。山形市の文化体験として別格。", isPr: false },
      { rank: 6,  cafeSlug: "paradiso-coffee-roasters-tsuruoka",       score: 87, reason: "庄内エリア唯一級の本格ロースタリー。鶴岡観光と合わせて訪れる価値がある実力店。", isPr: false },
      { rank: 7,  cafeSlug: "fujinoya-cafe-tsuruoka",                  score: 86, reason: "築130年の古民家で庄内食材ランチ。鶴岡観光とセットで訪れる価値大。", isPr: false },
      { rank: 8,  cafeSlug: "yozan-do-fabric-coffee-yonezawa",         score: 85, reason: "400年の米沢織文化と一杯のコーヒーが交わる体験型カフェ。上杉神社観光との相性が抜群。", isPr: false },
      { rank: 9,  cafeSlug: "cafe-gallery-tsuki-to-hoshi-kaminoyama",  score: 84, reason: "有機野菜ランチと庭の景色が融合する上山のガーデンカフェ。蔵王観光との組み合わせに最適。", isPr: false },
      { rank: 10, cafeSlug: "day-and-coffee-yamagata",                 score: 83, reason: "山形駅徒歩5分・朝8:30営業のスペシャルティスタンド。日常使いに最適。", isPr: false },
      { rank: 11, cafeSlug: "cafe-goot-yonezawa",                      score: 82, reason: "置賜エリアで唯一級のスペシャルティ自家焙煎。米沢コーヒーファンの聖地。", isPr: false },
      { rank: 12, cafeSlug: "fuwari-fu-cafe-nagai",                    score: 81, reason: "お麩スイーツというご当地の唯一無二コンセプトが長井市の観光価値を高める。", isPr: false },
      { rank: 13, cafeSlug: "nagomu-coffee-pottery-yonezawa",          score: 80, reason: "地元陶芸作家の器でコーヒーを楽しむ米沢のギャラリー。静かな滞在時間が魅力。", isPr: false },
      { rank: 14, cafeSlug: "soraniwa-cafe-tendo",                     score: 79, reason: "BBQ・ペット同伴可・半澤鶏卵プリンとファミリー・グループに対応する懐の広さ。", isPr: false },
      { rank: 15, cafeSlug: "kumakichi-farm-cafe-nanyo",               score: 78, reason: "南陽ぶどうの里の農園ガーデンカフェ。自家栽培野菜と旬フルーツで大地のエネルギーを感じる。", isPr: false },
      { rank: 16, cafeSlug: "coffee-sansho-koji-sakata",               score: 77, reason: "酒田の港町文化に根ざす自家焙煎店。山居倉庫観光の後に訪れたい一軒。", isPr: false },
    ],
    sources: [
      src("食べログ 山形カフェ特集", "https://tabelog.com/yamagata/", "user-review", "口コミ・評点参考"),
      src("VISIT YAMAGATA", "https://www.visityamagata.jp/", "tourism", "地元観光情報参考"),
      src("山形新聞", "https://yamagata.website/", "local-media", "地元カフェ情報参考"),
    ],
    faqs: [
      { question: "山形でフルーツを使ったカフェはどこがいいですか？", answer: "天童市の「oh!show!cafe（王将果樹園直営）」が最もおすすめです。朝採りさくらんぼ・もも・ぶどう・りんごを使ったシーズン限定のパフェが楽しめます。長井市の「麩和里」もご当地スイーツとして注目です。" },
      { question: "このランキングはPR広告ですか？", answer: "現時点ではすべてPR掲載なしです。各ランキング項目にPRフラグを表示しています。" },
    ],
  },
  {
    slug: "yamagata-specialty-coffee",
    title: "山形県 スペシャルティ・自家焙煎コーヒーのカフェ",
    description: "コーヒーの産地・焙煎・鮮度にこだわる山形県内の店舗を比較。山形市・米沢・鶴岡・天童と各エリアの自家焙煎カフェを整理しました。",
    conclusion: "深煎り特化のBOTA coffee、20種超の豆から選べる蔵王の森焙煎工房、庄内ロースタリーのPARADISO、米沢の隠れ家cafe gootと、エリアごとの個性ある一択が揃っています。",
    quickTableLabel: "スペシャルティ・自家焙煎カフェ早見表",
    criteria: [
      "豆の産地・焙煎のこだわりと鮮度",
      "バリエーションの豊富さ",
      "アクセスと通いやすさ",
      "テイクアウト・豆購入の対応",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "bota-coffee-yamagata",              score: 95, reason: "「鮮度のために大量販売しない」哲学が徹底。深煎り特化の一杯は山形トップクラス。", isPr: false },
      { rank: 2, cafeSlug: "zaonomori-roasters",                score: 92, reason: "ストレート15種・ブレンド6種の豊富さ。豆購入・テイクアウト対応で通いやすい。", isPr: false },
      { rank: 3, cafeSlug: "paradiso-coffee-roasters-tsuruoka", score: 88, reason: "庄内エリア唯一級のロースタリー。少量焙煎シングルオリジンが鶴岡観光に彩りを添える。", isPr: false },
      { rank: 4, cafeSlug: "cafe-goot-yonezawa",                score: 86, reason: "置賜エリアでスペシャルティを楽しめる数少ない一軒。米沢観光と組み合わせたい隠れ家。", isPr: false },
      { rank: 5, cafeSlug: "day-and-coffee-yamagata",           score: 84, reason: "朝8:30から営業するスタンドで日常使いしやすい。山形駅近のアクセスも大きな強み。", isPr: false },
    ],
    sources: [
      src("BOTA coffee 公式", "https://www.botacoffee.jp/", "official", "コンセプト・メニュー確認"),
      src("蔵王の森焙煎工房 公式", "https://zao-coffee.com/", "official", "メニュー・豆種類確認"),
      src("VISIT YAMAGATA 蔵王の森紹介", "https://www.visityamagata.jp/spot-zaonomori-caffee/", "tourism", "特徴確認"),
    ],
    faqs: [
      { question: "山形でコーヒー豆をお土産に買えますか？", answer: "蔵王の森焙煎工房では豊富な自家焙煎豆を購入できます。ジャガイモ品種にちなんだユニークなブレンド名は話題作りにも最適です。BOTA coffeeでも豆販売を行っています。" },
      { question: "朝早くから営業しているカフェはありますか？", answer: "Day & Coffeeは朝8:30から営業しています。山形駅から徒歩5分のため、観光・出張前の朝の一杯に最適です。" },
    ],
  },
  {
    slug: "yamagata-atmosphere-cafe",
    title: "山形県 雰囲気がおすすめのカフェ",
    description: "神社境内・蔵改装・米沢織の老舗など、山形ならではの特別な空間でコーヒーを楽しめるカフェを厳選。伝統・文化・自然が交わる山形固有の体験を求める人向けのランキングです。",
    conclusion: "山形らしい非日常体験なら荘内神社境内のかたばみ、蔵と文化の融合なら灯蔵オビハチ、米沢の伝統文化なら鷹山堂、上山の自然体験なら月と星、陶器×コーヒーはnagomuと目的別に選べます。",
    quickTableLabel: "雰囲気・空間カフェ早見表",
    criteria: [
      "空間の個性と山形らしさ",
      "建築・インテリアの魅力",
      "居心地と滞在しやすさ",
      "観光・旅行との相性",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "katabami-jinja-cafe",                    score: 95, reason: "神社境内でコーヒーという体験は全国的にも希少。荘内神社の格式ある空間が最高の舞台。", isPr: false },
      { rank: 2, cafeSlug: "kura-obi-yamagata",                      score: 91, reason: "築90年の蔵の圧倒的な空気感。昼は文化カフェ・夜はライブバーという二面性も面白い。", isPr: false },
      { rank: 3, cafeSlug: "yozan-do-fabric-coffee-yonezawa",        score: 88, reason: "400年の米沢織文化と共存する体験型空間。上杉神社参拝後の訪問が自然なルート。", isPr: false },
      { rank: 4, cafeSlug: "cafe-gallery-tsuki-to-hoshi-kaminoyama", score: 86, reason: "有機野菜と庭の景色が山形の自然を体感させる。蔵王・上山温泉観光との相性が良好。", isPr: false },
      { rank: 5, cafeSlug: "nagomu-coffee-pottery-yonezawa",         score: 83, reason: "地元陶芸作家の器でコーヒーを楽しむ、米沢の手仕事文化に触れるギャラリーカフェ。", isPr: false },
      { rank: 6, cafeSlug: "fujinoya-cafe-tsuruoka",                 score: 81, reason: "築130年古民家の庄内ランチ。鶴岡観光と合わせると満足度が倍増。", isPr: false },
    ],
    sources: [
      src("神社カフェかたばみ 公式", "https://katabami-cafe.jinjahan.com/", "official", "コンセプト確認"),
      src("灯蔵オビハチ 公式", "https://kuraobi.com/", "official", "施設情報確認"),
      src("VISIT YAMAGATA", "https://www.visityamagata.jp/", "tourism", "観光地情報参考"),
    ],
    faqs: [
      { question: "神社カフェかたばみに行くなら荘内神社参拝とセットがいいですか？", answer: "はい。神社の境内にあるため、参拝後に立ち寄るルートが自然です。荘内神社は庄内地方の総鎮守で歴史的な見どころも多く、合わせて楽しむことをおすすめします。" },
      { question: "米沢観光でカフェに立ち寄るなら？", answer: "鷹山堂 Fabric & Coffeeが上杉神社近くにあり、米沢織の文化体験と一杯のコーヒーを組み合わせられます。nagomuは陶器作家の器でコーヒーを楽しめるユニークな空間です。" },
    ],
  },
  {
    slug: "yamagata-fruits-sweets",
    title: "山形県 フルーツスイーツが楽しめるカフェ",
    description: "フルーツ王国・山形の旬果実とご当地素材を使ったスイーツカフェを厳選。さくらんぼ・もも・ぶどう・りんご・お麩など、山形ならではの食材が輝くカフェを整理しました。",
    conclusion: "朝採りフルーツ直営のoh!show!cafe、ご当地お麩スイーツの麩和里、農園直送くまきち農園と、それぞれに山形らしさが詰まっています。シーズンごとに違う顔を見せる天童のsoraniwaも外せません。",
    quickTableLabel: "フルーツスイーツカフェ早見表",
    criteria: [
      "フルーツ・食材の産地・鮮度と使い方",
      "シーズン限定メニューの魅力",
      "空間と居心地",
      "アクセスと家族・グループ対応",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "ohshow-cafe-tendo",        score: 95, reason: "県内最大級観光果樹園の直営カフェ。朝採りフルーツの鮮度と種類の豊富さが圧倒的。", isPr: false },
      { rank: 2, cafeSlug: "fuwari-fu-cafe-nagai",     score: 88, reason: "お麩スイーツという全国でも希少なコンセプト。長井市の手仕事文化が生んだご当地の逸品。", isPr: false },
      { rank: 3, cafeSlug: "kumakichi-farm-cafe-nanyo", score: 85, reason: "南陽の農園で自家栽培フルーツのスイーツを体験。大地と繋がる特別な一皿。", isPr: false },
      { rank: 4, cafeSlug: "soraniwa-cafe-tendo",      score: 82, reason: "半澤鶏卵の卵を使ったプリンと旬スイーツ。BBQ・ペット同伴可でグループにも最適。", isPr: false },
    ],
    sources: [
      src("oh!show!cafe 公式（王将果樹園）", "https://www.ohsyo.co.jp/cafe/", "official", "メニュー・シーズン情報確認"),
      src("VISIT YAMAGATA フルーツ特集", "https://www.visityamagata.jp/", "tourism", "フルーツ観光情報確認"),
    ],
    faqs: [
      { question: "フルーツパフェはいつのシーズンが一番充実していますか？", answer: "さくらんぼシーズン（6〜7月）が最も人気で、種類も多く限定感があります。ただし混雑も最大のため、早めの来店がおすすめです。もも（8月）もリッチな甘さで評判です。" },
      { question: "お麩スイーツが食べられるカフェはありますか？", answer: "長井市の「麩和里」が長井・置賜のお麩を使ったパフェやスイーツで知られています。フラワー長井線の観光と合わせて訪れることができます。" },
    ],
  },
];
