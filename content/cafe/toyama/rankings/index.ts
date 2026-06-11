import type { CafeRanking, Source } from "@/lib/types";

const collectedAt = "2026-06-11";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string) => ({
  title, url, sourceType, collectedAt, note,
});

export const toyamaCafeRankings: CafeRanking[] = [
  {
    slug: "toyama-cafe-best",
    title: "富山県のカフェ おすすめランキング",
    description: "世界遺産・五箇山の合掌造りカフェ、高岡金屋町の古民家ロースタリー、立山の伏流水コーヒーなど、富山県内の個性的なカフェを雰囲気・こだわり・アクセスで総合評価。富山市・高岡・黒部・砺波・射水・氷見・南砺まで県内各エリアを網羅し、編集部が整理しました。",
    conclusion: "体験の唯一性では五箇山合掌カフェが別格。スペシャルティならAMBER COFFEE、雰囲気重視なら晴耕庵コーヒーか宇奈月蔵カフェ、本格焙煎ならKUREYON ROASTERSが最有力候補。立山・砺波など遠出する価値のある一軒も揃っています。",
    quickTableLabel: "富山カフェ総合評価早見表",
    criteria: [
      "コーヒー・ドリンクのクオリティと個性",
      "空間・雰囲気の魅力度",
      "アクセスと駐車場の利便性",
      "価格とコストパフォーマンス",
      "公式情報の追跡しやすさ",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1,  cafeSlug: "gassho-cafe-nanto",             score: 94, reason: "世界遺産の合掌造りの中で囲炉裏コーヒーを飲む唯一無二の体験。旅の目的地になる一軒。", isPr: false },
      { rank: 2,  cafeSlug: "amber-coffee-toyama",           score: 92, reason: "富山市内屈指のスペシャルティ専門店。シングルオリジンの豊富なラインナップと洗練された空間。", isPr: false },
      { rank: 3,  cafeSlug: "kureyon-roasters-toyama",       score: 91, reason: "大型焙煎機を間近に見ながら飲む焙煎したて。富山では珍しい本格ロースタリー体験。", isPr: false },
      { rank: 4,  cafeSlug: "seikoan-coffee-takaoka",        score: 90, reason: "日本遺産・金屋町の古民家で高岡銅器の器で飲む一杯。観光との組み合わせが完璧。", isPr: false },
      { rank: 5,  cafeSlug: "unazuki-kura-cafe-kurobe",      score: 89, reason: "黒部峡谷トロッコ旅の拠点。宇奈月温泉の蔵カフェで飲む水出しコーヒーが旅の締め。", isPr: false },
      { rank: 6,  cafeSlug: "glass-roast-coffee-toyama",    score: 88, reason: "ゲストロースター豆を常時展開。富山市でコーヒー文化の最先端を体験できる。", isPr: false },
      { rank: 7,  cafeSlug: "maison-blanc-toyama",           score: 87, reason: "フランス修業パティシエの本格スイーツ。週末に行列ができる富山市の実力派パティスリーカフェ。", isPr: false },
      { rank: 8,  cafeSlug: "tsugimichi-coffee-toyama",      score: 86, reason: "路地裏のネルドリップ自家焙煎。知る人ぞ知る隠れ家感と、柔らかな一杯が忘れられない。", isPr: false },
      { rank: 9,  cafeSlug: "kanayamachi-roastery-takaoka",  score: 85, reason: "金屋町の職人文化と重なる少量焙煎のアプローチ。高岡観光のしめくくりに最適。", isPr: false },
      { rank: 10, cafeSlug: "tulip-garden-cafe-tonami",      score: 84, reason: "チューリップ畑を一望する窓席が絶景。砺波の四季を感じる唯一のガーデンカフェ。", isPr: false },
      { rank: 11, cafeSlug: "tateyama-alpine-coffee",        score: 83, reason: "立山の伏流水で淹れる自家焙煎。アルペンルート観光と組み合わせる富山らしいコーヒー体験。", isPr: false },
      { rank: 12, cafeSlug: "minatomachi-cafe-himi",         score: 82, reason: "氷見の漁師町古民家で縁側から富山湾を眺める。地元食材を生かした料理も魅力。", isPr: false },
      { rank: 13, cafeSlug: "forest-sweets-cafe-oyabe",      score: 81, reason: "里山の農家直送フルーツスイーツが絶品。小矢部の隠れた名パティスリーカフェ。", isPr: false },
      { rank: 14, cafeSlug: "jinzu-books-cafe-toyama",       score: 80, reason: "Wi-Fi・電源完備のブックカフェ。富山市でワーケーション・読書に最適な滞在型カフェ。", isPr: false },
      { rank: 15, cafeSlug: "stand-c-iwase-toyama",          score: 79, reason: "岩瀬の古い港町散策に合う一杯。テイクアウトして運河沿いを歩くのが地元スタイル。", isPr: false },
      { rank: 16, cafeSlug: "umimachi-stand-imizu",          score: 77, reason: "富山湾を正面に望む早朝スタンド。海景色のカフェが少ない富山で貴重なロケーション。", isPr: false },
    ],
    sources: [
      src("食べログ 富山カフェ特集", "https://tabelog.com/toyama/", "user-review", "口コミ・評点参考"),
      src("富山観光ナビ", "https://www.toyama-kanko.jp/", "local-media", "地元観光情報参考"),
      src("てくてくとやま", "https://tekutekutoyama.jp/", "local-media", "富山市周辺カフェ情報参考"),
    ],
    faqs: [
      { question: "富山県内で最も特別な体験ができるカフェはどこですか？", answer: "ユネスコ世界遺産・五箇山の合掌造りの中で囲炉裏コーヒーを飲める「五箇山合掌カフェ」は他では絶対に味わえない体験です。次点で、日本遺産の金屋町古民家で高岡銅器の器のコーヒーが飲める「晴耕庵コーヒー」もおすすめです。" },
      { question: "このランキングはPR広告ですか？", answer: "現時点ではすべてPR掲載なしです。各ランキング項目にPRフラグを表示しています。" },
    ],
  },
  {
    slug: "toyama-specialty-coffee",
    title: "富山県 スペシャルティ・自家焙煎コーヒーのカフェ",
    description: "コーヒーの産地・焙煎・抽出にこだわる富山県内の店舗を比較。富山市のスペシャルティ専門店から、高岡の職人ロースタリー、立山の伏流水自家焙煎まで、富山各地のこだわりカフェを一挙紹介します。",
    conclusion: "シングルオリジン体験ならAMBER COFFEE、本格ロースタリーはKUREYON ROASTERS、ゲスト豆の多様性はGLASS ROAST COFFEEが最有力。山麓の伏流水コーヒーという唯一の体験を求めるなら立山高原コーヒーへ。",
    quickTableLabel: "スペシャルティ・自家焙煎カフェ早見表",
    criteria: [
      "豆の産地・焙煎のこだわり",
      "抽出技術と提供スタイル",
      "バリエーションの豊富さ",
      "価格帯と通いやすさ",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "amber-coffee-toyama",          score: 95, reason: "シングルオリジン専門で産地・季節ごとのラインナップが豊富。富山市内でスペシャルティを語るならここ。", isPr: false },
      { rank: 2, cafeSlug: "kureyon-roasters-toyama",      score: 92, reason: "大型焙煎機での自家焙煎を目の前で見ながら飲める。焙煎の香りと臨場感が他にない。", isPr: false },
      { rank: 3, cafeSlug: "glass-roast-coffee-toyama",   score: 89, reason: "国内外のゲストロースター豆を季節ごとに展開。コーヒー文化の最新トレンドを富山で体験。", isPr: false },
      { rank: 4, cafeSlug: "kanayamachi-roastery-takaoka", score: 87, reason: "少量焙煎の職人スタイルが金屋町の文化と共鳴。高岡観光のついでに必ず立ち寄りたい。", isPr: false },
      { rank: 5, cafeSlug: "tsugimichi-coffee-toyama",     score: 84, reason: "ネルドリップの柔らかな口当たりが魅力。路地裏の隠れ家感とともに深煎りブレンドを楽しむ。", isPr: false },
      { rank: 6, cafeSlug: "tateyama-alpine-coffee",       score: 81, reason: "立山の伏流水で淹れる自家焙煎は都市部では絶対再現不可能。立山観光と組み合わせたい。", isPr: false },
      { rank: 7, cafeSlug: "stand-c-iwase-toyama",         score: 78, reason: "岩瀬の地元焙煎豆を使ったスタンドコーヒー。テイクアウトで港町散策のお供に。", isPr: false },
    ],
    sources: [
      src("食べログ 富山コーヒー特集", "https://tabelog.com/toyama/", "user-review", "口コミ・評点参考"),
      src("富山コーヒー同好会ブログ", "https://toyama-coffee.jp/", "local-media", "自家焙煎情報参考"),
    ],
    faqs: [
      { question: "富山市内でスペシャルティコーヒーが飲めるカフェはどこがいいですか？", answer: "AMBER COFFEE TOYAMAとGLASS ROAST COFFEEがともに総曲輪エリアにあり、どちらも高品質なスペシャルティを提供しています。自家焙煎体験を重視するならKUREYON ROASTERSがおすすめです。" },
    ],
  },
  {
    slug: "toyama-atmosphere-cafe",
    title: "富山県 雰囲気・空間が素晴らしいカフェ",
    description: "世界遺産の合掌造り、金屋町の石畳の古民家、宇奈月温泉の蔵、富山湾を眺めるスタンドまで。「場所そのもの」が体験になる富山県内の個性的なカフェをセレクトしました。",
    conclusion: "旅の目的地になるレベルは五箇山合掌カフェが断トツ。高岡エリアなら晴耕庵コーヒー、黒部・宇奈月なら宇奈月蔵カフェ、沿岸エリアなら湊まちカフェと、エリアごとに個性的な空間があります。",
    quickTableLabel: "雰囲気・空間カフェ早見表",
    criteria: [
      "建物・空間の歴史的・文化的価値",
      "景色・ロケーションの魅力",
      "雰囲気の唯一性",
      "アクセスのしやすさ",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "gassho-cafe-nanto",        score: 96, reason: "ユネスコ世界遺産・合掌造りの中で囲炉裏コーヒー。雰囲気の唯一性では国内トップクラス。", isPr: false },
      { rank: 2, cafeSlug: "seikoan-coffee-takaoka",   score: 92, reason: "日本遺産・金屋町の石畳古民家。高岡銅器の器でコーヒーを飲む文化体験が深い。", isPr: false },
      { rank: 3, cafeSlug: "unazuki-kura-cafe-kurobe", score: 89, reason: "黒部峡谷の玄関口・宇奈月温泉の蔵カフェ。温泉街の情緒と清流コーヒーの組み合わせが最高。", isPr: false },
      { rank: 4, cafeSlug: "minatomachi-cafe-himi",    score: 86, reason: "氷見の漁師町の明治建築。縁側から富山湾を眺める縁側席は旅の思い出になる。", isPr: false },
      { rank: 5, cafeSlug: "tulip-garden-cafe-tonami", score: 83, reason: "春はチューリップ畑が窓一面に広がる。砺波らしい圧巻のガーデン景色が魅力。", isPr: false },
      { rank: 6, cafeSlug: "umimachi-stand-imizu",     score: 79, reason: "富山湾を正面に見るコーヒースタンド。早朝の海景色と一杯の組み合わせが唯一無二。", isPr: false },
    ],
    sources: [
      src("食べログ 富山雰囲気カフェ特集", "https://tabelog.com/toyama/", "user-review", "口コミ・評点参考"),
      src("富山観光ナビ", "https://www.toyama-kanko.jp/", "local-media", "観光スポット情報参考"),
    ],
    faqs: [
      { question: "子ども連れでも入りやすい雰囲気カフェはどこですか？", answer: "チューリップの杜カフェ（砺波）は大型駐車場完備でファミリー向け。海まちスタンド（射水）はテイクアウト形式なので小さなお子さんとも気軽に利用できます。" },
    ],
  },
  {
    slug: "toyama-sweets-cafe",
    title: "富山県 スイーツ・パティスリーカフェ",
    description: "富山の地元食材を使った季節のスイーツ、フランス菓子の本格パティスリーから、里山フルーツのパフェまで。富山県内でスイーツを楽しむならこの一覧をチェックしてください。",
    conclusion: "フランス菓子の本格度ならMAISON BLANC、里山フルーツスイーツなら森のスイーツカフェ、季節の花と一緒に楽しむならチューリップの杜カフェがそれぞれ最有力。",
    quickTableLabel: "スイーツ・パティスリーカフェ早見表",
    criteria: [
      "スイーツのクオリティと独自性",
      "地元食材の活用度",
      "季節感と変化の豊富さ",
      "カフェとしての居心地",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, cafeSlug: "maison-blanc-toyama",       score: 94, reason: "フランス修業パティシエの本格生菓子・焼き菓子。富山市内で最高水準のスイーツクオリティ。", isPr: false },
      { rank: 2, cafeSlug: "forest-sweets-cafe-oyabe",  score: 89, reason: "農家直送の季節フルーツを使ったパフェとケーキが絶品。里山の立地込みで体験価値が高い。", isPr: false },
      { rank: 3, cafeSlug: "tulip-garden-cafe-tonami",  score: 82, reason: "チューリップソフトクリームと地元野菜ランチ。砺波の四季を楽しみながら食べる価値あり。", isPr: false },
      { rank: 4, cafeSlug: "jinzu-books-cafe-toyama",   score: 78, reason: "自家製スコーンとコーヒーのペアが丁寧。ブックカフェとしての居心地の良さも加点。", isPr: false },
    ],
    sources: [
      src("食べログ 富山スイーツ特集", "https://tabelog.com/toyama/", "user-review", "口コミ・評点参考"),
      src("てくてくとやま", "https://tekutekutoyama.jp/", "local-media", "富山スイーツ情報参考"),
    ],
    faqs: [
      { question: "富山でフルーツスイーツが楽しめるカフェはどこですか？", answer: "小矢部市の「森のスイーツカフェ」が農家直送フルーツのスイーツで最もおすすめです。春のいちご、秋の巨峰の時期が特に充実しています。砺波の「チューリップの杜カフェ」も地元野菜・果物を使ったメニューが揃っています。" },
    ],
  },
];
