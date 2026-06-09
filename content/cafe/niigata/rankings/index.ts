import type { CafeRanking, Source } from "@/lib/types";

const collectedAt = "2026-06-09";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string) => ({
  title, url, sourceType, collectedAt, note,
});

export const niigataCafeRankings: CafeRanking[] = [
  {
    slug: "niigata-cafe-best",
    title: "新潟県のカフェ おすすめランキング",
    description: "スペシャルティコーヒー・古民家カフェ・ブックカフェなど、新潟県内の個性的なカフェを雰囲気・こだわり・アクセスで総合評価。上越・妙高・燕三条・佐渡・村上まで県内各エリアを網羅し、編集部が整理しました。",
    conclusion: "古町で老舗の一杯を楽しむなら珈琲工房シャモニー、スペシャルティを体験したいならinnovative Co.、雰囲気重視なら澁いと水屋が最有力候補。村上・妙高・佐渡と遠出するならLINDBERGH・Rucchi・caMocoも外せません。",
    quickTableLabel: "新潟カフェ総合評価早見表",
    criteria: [
      "コーヒー・ドリンクのクオリティと個性",
      "空間・雰囲気の魅力度",
      "アクセスと駐車場の利便性",
      "価格とコストパフォーマンス",
      "公式情報の追跡しやすさ",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1,  cafeSlug: "chamonix-niigata",                  score: 93, reason: "50年超の老舗純喫茶で自家焙煎・サイフォン式の一杯。古町観光との組み合わせが最強。", isPr: false },
      { rank: 2,  cafeSlug: "harumachi-coffee",                   score: 91, reason: "木造り空間・プリン・フルーツパフェが人気。駐車場完備で車でも行きやすい。", isPr: false },
      { rank: 3,  cafeSlug: "mizuya-yuzawa",                      score: 90, reason: "温泉珈琲という唯一無二の体験。越後湯沢駅徒歩2分で旅行者にも強くおすすめ。", isPr: false },
      { rank: 4,  cafeSlug: "shibui-matsushiro",                  score: 89, reason: "大地の芸術祭エリアの築100年超古民家。アート観光との相性が抜群。", isPr: false },
      { rank: 5,  cafeSlug: "innovative-co-niigata",              score: 87, reason: "豆×抽出方法を選ぶ体験型スペシャルティ。コーヒー好きには特別な店。", isPr: false },
      { rank: 6,  cafeSlug: "lindbergh-coffee-roastery-murakami", score: 86, reason: "村上・北限のロースタリー。希少な立地と本格焙煎が組み合わさる一軒。", isPr: false },
      { rank: 7,  cafeSlug: "tsubame-coffee-tsubame",             score: 85, reason: "燕市内の自家焙煎。ものづくりの街の職人気質なコーヒーが光る。", isPr: false },
      { rank: 8,  cafeSlug: "book-cafe-antenna",                  score: 84, reason: "WiFi・電源完備のブックカフェ。本好き・ワーク利用に最適。", isPr: false },
      { rank: 9,  cafeSlug: "awayuki-coffee-joetsu",              score: 83, reason: "上越エリアで常時6種以上のスペシャルティ。バスクチーズケーキとのペアが最高。", isPr: false },
      { rank: 10, cafeSlug: "rucchi-coffee-roaster-myoko",        score: 82, reason: "妙高市の山麓ロースタリー。観光と一緒に立ち寄れる希少なコーヒー拠点。", isPr: false },
      { rank: 11, cafeSlug: "pepe-nagaoka",                       score: 81, reason: "長岡の昭和レトロ純喫茶。名物ナポリタンと夜22時まで営業が魅力。", isPr: false },
      { rank: 12, cafeSlug: "camoco-cafe-ko-asobi-sado",          score: 80, reason: "佐渡島の加茂湖を眺めるガーデンカフェ。島旅のハイライトになる絶景スポット。", isPr: false },
      { rank: 13, cafeSlug: "west-cafe-nagaoka",                  score: 79, reason: "アウトドアショップ直営のユニークな立地。山倉ブレンドの本格コーヒー。", isPr: false },
      { rank: 14, cafeSlug: "sekai-no-tonari-joetsu",             score: 78, reason: "築90年の町家とアンティーク家具が醸す高田レトロの雰囲気。", isPr: false },
      { rank: 15, cafeSlug: "cafe-hayashi-joetsu",                score: 77, reason: "古民家と発酵食の組み合わせが唯一無二。上越三和区の農村カフェ。", isPr: false },
      { rank: 16, cafeSlug: "mother-cafe-tsubame",                score: 76, reason: "燕市の緑に囲まれたガーデンカフェ。季節の野菜スイーツが癒しを与える。", isPr: false },
    ],
    sources: [
      src("食べログ 新潟カフェ特集", "https://tabelog.com/niigata/", "user-review", "口コミ・評点参考"),
      src("新潟おでかけメディア025", "https://025niigata.jp/", "local-media", "地元カフェ情報参考"),
      src("Things新潟", "https://things-niigata.jp/", "local-media", "長岡・上越エリアカフェ情報参考"),
    ],
    faqs: [
      { question: "新潟県内で特に空間にこだわりたい場合はどこがいいですか？", answer: "大地の芸術祭エリアの古民家「澁い -SHIBUI-」と越後湯沢の温泉旅館内カフェ「水屋」が空間の個性では群を抜きます。佐渡の加茂湖を望む「caMoco cafe 湖ASOBi」も旅先ならではの絶景カフェとしておすすめです。" },
      { question: "このランキングはPR広告ですか？", answer: "現時点ではすべてPR掲載なしです。各ランキング項目にPRフラグを表示しています。" },
    ],
  },
  {
    slug: "niigata-specialty-coffee",
    title: "新潟県 スペシャルティ・自家焙煎コーヒーのカフェ",
    description: "コーヒーの産地・焙煎・抽出にこだわる新潟県内の店舗を比較。上越・村上・妙高・燕など県内各エリアの自家焙煎カフェを一挙紹介します。",
    conclusion: "老舗自家焙煎の深みなら珈琲工房シャモニー、体験型スペシャルティはinnovative Co.、村上ならLINDBERGH、上越ならawayuki、妙高ならRucchiと、エリアで選ぶのも楽しい。",
    quickTableLabel: "スペシャルティ・自家焙煎カフェ早見表",
    criteria: [
      "豆の産地・焙煎のこだわり",
      "抽出技術と提供スタイル",
      "バリエーションの豊富さ",
      "価格帯と通いやすさ",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "chamonix-niigata",                   score: 95, reason: "ブレンド5種・ストレート7種を自家焙煎・サイフォン式で。コーヒーの種類と淹れ方の多様さが突出。", isPr: false },
      { rank: 2, cafeSlug: "innovative-co-niigata",              score: 91, reason: "豆→抽出方法の選択体験が他にない。スペシャルティの個性を最も教えてくれる一店。", isPr: false },
      { rank: 3, cafeSlug: "lindbergh-coffee-roastery-murakami", score: 88, reason: "村上市の本格ロースタリー。新潟県の北端で出会う高品質コーヒーは旅の特別な一杯。", isPr: false },
      { rank: 4, cafeSlug: "tsubame-coffee-tsubame",             score: 86, reason: "燕市のものづくり文化と共鳴する職人的自家焙煎。三条燕エリアで唯一に近い存在。", isPr: false },
      { rank: 5, cafeSlug: "awayuki-coffee-joetsu",              score: 84, reason: "上越で常時6種以上のスペシャルティ。バスクチーズケーキとの組み合わせが人気。", isPr: false },
      { rank: 6, cafeSlug: "rucchi-coffee-roaster-myoko",        score: 82, reason: "妙高エリア唯一のロースタリー。スキーリゾート帰りに立ち寄れるコーヒー拠点。", isPr: false },
      { rank: 7, cafeSlug: "west-cafe-nagaoka",                  score: 79, reason: "山倉オリジナルブレンド使用。長岡市内でスペシャルティを探している人の有力候補。", isPr: false },
    ],
    sources: [
      src("シャモニー公式", "https://chamonix-niigata.com/", "official", "焙煎スタイル・メニュー確認"),
      src("食べログ 新潟 コーヒー専門店", "https://tabelog.com/niigata/", "user-review", "口コミ参考"),
    ],
    faqs: [
      { question: "新潟でスペシャルティコーヒーを初めて飲むならどこがいいですか？", answer: "古町のinnovative Co.は豆と抽出方法を選ぶスタイルなので、スタッフが丁寧に説明してくれます。スペシャルティ初心者の入門に最適です。" },
      { question: "コーヒー豆を購入できる店はありますか？", answer: "珈琲工房シャモニーでは自家焙煎豆の購入が可能です。LINDBERGHやRucchi Coffee Roasterでも豆販売を行っています。お土産にも喜ばれます。" },
    ],
  },
  {
    slug: "niigata-atmosphere-cafe",
    title: "新潟県 雰囲気がおすすめのカフェ",
    description: "特別な空間体験ができる新潟県のカフェを厳選。古民家・温泉地・佐渡島のガーデンカフェなど、その場所にしかない雰囲気を楽しみたい人向けのランキングです。",
    conclusion: "旅行との組み合わせなら越後湯沢の水屋・十日町の澁い・佐渡のcaMoco、上越の古民家なら世界ノトナリ・cafe HAYASHI、市内で落ち着いた空間ならブックカフェアンテナが最有力です。",
    quickTableLabel: "雰囲気・空間カフェ早見表",
    criteria: [
      "空間の個性と唯一無二感",
      "インテリア・建築の魅力",
      "ゆっくり過ごせる居心地",
      "旅行・観光との相性",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "mizuya-yuzawa",            score: 94, reason: "温泉水で淹れるコーヒー＋足湯という体験は全国でも希少。旅情感が最高。", isPr: false },
      { rank: 2, cafeSlug: "shibui-matsushiro",         score: 93, reason: "築100年超の古民家とカール・ベンクスのデザインが圧倒的存在感。", isPr: false },
      { rank: 3, cafeSlug: "camoco-cafe-ko-asobi-sado", score: 88, reason: "佐渡・加茂湖を望む絶景ガーデンカフェ。島旅にしか体験できない非日常感。", isPr: false },
      { rank: 4, cafeSlug: "cafe-hayashi-joetsu",       score: 86, reason: "古民家で発酵食文化を体験できる上越三和区の隠れ家。農村の空気感が格別。", isPr: false },
      { rank: 5, cafeSlug: "sekai-no-tonari-joetsu",    score: 84, reason: "映画館隣の築90年町家。アンティーク家具と高田レトロの雰囲気が唯一無二。", isPr: false },
      { rank: 6, cafeSlug: "book-cafe-antenna",         score: 82, reason: "絵本・古書に囲まれた独特の空気感。本好きには別格の居心地。", isPr: false },
      { rank: 7, cafeSlug: "pepe-nagaoka",              score: 80, reason: "レンガ造り外観の昭和純喫茶は長岡市内で類のない存在。", isPr: false },
    ],
    sources: [
      src("食べログ 新潟 雰囲気重視カフェ", "https://tabelog.com/niigata/", "user-review", "雰囲気評価参考"),
      src("新潟おでかけメディア025", "https://025niigata.jp/", "local-media", "空間・雰囲気情報参考"),
    ],
    faqs: [
      { question: "佐渡でカフェに行くなら？", answer: "caMoco cafe 湖ASOBiが加茂湖の絶景を望むガーデンカフェとして圧倒的な体験価値を持ちます。佐渡観光のハイライトの一つとして訪れることをおすすめします。" },
      { question: "子供と一緒に雰囲気のいいカフェに行けますか？", answer: "HARUMACHI coffeeは木の温もりある空間で比較的ファミリー向けです。caMoco cafe 湖ASOBiの広いガーデンスペースも子連れに向いています。" },
    ],
  },
  {
    slug: "niigata-sweets-cafe",
    title: "新潟県 スイーツが人気のカフェ",
    description: "フルーツパフェ・手作りプリン・季節の焼き菓子など、スイーツを目当てに訪れたい新潟県内のカフェランキング。地元素材を使った手作りスイーツが楽しめる店を厳選しました。",
    conclusion: "週替わりフルーツパフェとHARUMACHIプリンなら断然HARUMACHI coffee、旅のお土産スイーツは水屋の湯澤るうろ、燕市の季節の野菜スイーツはMotherが狙い目です。",
    quickTableLabel: "スイーツカフェ早見表",
    criteria: [
      "スイーツのオリジナリティと完成度",
      "地元素材の使用",
      "コストパフォーマンス",
      "季節限定・数量限定の魅力",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "harumachi-coffee",    score: 92, reason: "HARUMACHIプリンと旬のフルーツパフェが週替わり。食材のこだわりが高い。", isPr: false },
      { rank: 2, cafeSlug: "mizuya-yuzawa",       score: 88, reason: "魚沼産コシヒカリ米粉ロールケーキ「湯澤るうろ」はお土産にも最適な逸品。", isPr: false },
      { rank: 3, cafeSlug: "mother-cafe-tsubame", score: 82, reason: "燕市の自家農園野菜・フルーツを使った季節スイーツ。地産地消の美味しさが際立つ。", isPr: false },
    ],
    sources: [
      src("HARUMACHI coffee 公式", "https://www.harumachi-coffee.com/", "official", "スイーツメニュー確認"),
      src("水屋 食べログ", "https://tabelog.com/niigata/A1504/A150404/15001180/", "user-review", "スイーツ情報確認"),
    ],
    faqs: [
      { question: "HARUMACHIのプリンはいつでも食べられますか？", answer: "週末・連休は午前中に売り切れることがあります。数量限定のため、早めの時間帯の来店をおすすめします。" },
      { question: "燕市でスイーツを楽しめるカフェはありますか？", answer: "Mother（ガーデンカフェ）が自家農園の野菜・フルーツを使ったスイーツを提供しています。燕三条エリア観光と合わせて立ち寄ることができます。" },
    ],
  },
];
