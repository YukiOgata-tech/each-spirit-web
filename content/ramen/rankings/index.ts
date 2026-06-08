import type { Ranking } from "@/lib/types";

const collectedAt = "2026-06-08";

export const ramenRankings: Ranking[] = [
  {
    slug: "niigata-ramen-essential",
    title: "新潟県内でまず候補に入れたいラーメン10店",
    description:
      "新潟5大ラーメンの代表性、アクセス、公式情報の追跡しやすさ、旅行者への説明しやすさを軸に、県内でまず比較したい店舗を整理しました。",
    conclusion:
      "初回の新潟ラーメン巡りなら、あっさり醤油は三吉屋、濃厚味噌は東横かこまどり、燕背脂は杭州飯店、総合満足度ならいっとうやを優先候補にすると選びやすいです。",
    quickTableLabel: "新潟ラーメン主要店早見表",
    criteria: [
      "新潟5大ラーメンや地域性を説明しやすいこと",
      "営業時間・住所・駐車場などの基本情報を追跡できること",
      "初訪問者にとって味の特徴が分かりやすいこと",
      "観光・地元利用のどちらにも導線を作りやすいこと",
      "PR掲載ではなく編集部評価として紹介できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "sankichiya-nishibori", score: 94, reason: "新潟あっさり醤油を説明する入口として強く、古町観光とも組み合わせやすい。", isPr: false },
      { rank: 2, itemSlug: "hangzhou-hanten", score: 93, reason: "燕背脂ラーメンを語る上で外しにくく、県内全域ページの核になる。", isPr: false },
      { rank: 3, itemSlug: "touyoko-shichikuyama", score: 91, reason: "新潟濃厚味噌と割りスープ体験を分かりやすく紹介できる。", isPr: false },
      { rank: 4, itemSlug: "ittoya-shichikuyama", score: 89, reason: "ご当地分類を超えて総合満足度で紹介しやすく、駐車場情報も明確。", isPr: false },
      { rank: 5, itemSlug: "komadori-maki", score: 88, reason: "濃厚味噌の代表格として東横と比較しやすく、巻方面の導線を作れる。", isPr: false },
      { rank: 6, itemSlug: "jikon-matsuzaki", score: 86, reason: "新潟市内で背脂・岩のり中華を扱う候補として個性が強い。", isPr: false },
      { rank: 7, itemSlug: "menya-shingen", score: 85, reason: "朝営業や煮干し系の切り口があり、利用シーン別に強い。", isPr: false },
      { rank: 8, itemSlug: "raimi-ogata", score: 84, reason: "淡麗から限定麺まで幅があり、東区の実力店として記事展開しやすい。", isPr: false },
      { rank: 9, itemSlug: "naoji-souhonten", score: 82, reason: "公式サイトで追跡しやすく、ガッツリ系・限定麺の導線を作りやすい。", isPr: false },
      { rank: 10, itemSlug: "menya-shinobu", score: 80, reason: "駅南で背脂系を探す読者に提案しやすいが、営業時間確認が重要。", isPr: false },
    ],
    sources: [
      { title: "新潟市ラーメンガイド", url: "https://niigatacity-ramen.jp/", sourceType: "official", collectedAt, note: "新潟市内の店舗基本情報と看板メニュー確認。" },
      { title: "新潟市ラーメンガイドブック", url: "https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf", sourceType: "government", collectedAt, note: "新潟5大ラーメンと掲載店舗の文脈確認。" },
      { title: "燕背脂ラーメンMAP", url: "https://ra-men.tsubame-kankou.jp/", sourceType: "tourism", collectedAt, note: "燕背脂ラーメンと杭州飯店の店舗情報確認。" },
    ],
    faqs: [
      { question: "このランキングは広告ですか？", answer: "現時点では全件PR掲載なしです。各ランキング項目にPRフラグを表示しています。" },
      { question: "営業時間は保証されていますか？", answer: "営業時間や定休日は変更される可能性があります。Each Spiritでは確認日と参照ソースを明示し、訪問前の公式確認を推奨します。" },
    ],
  },
  {
    slug: "niigata-miso",
    title: "新潟濃厚味噌ラーメンで比較したい店",
    description: "割りスープ付きの濃厚味噌、巻エリアの濃厚味噌など、味噌ラーメンを目的に新潟を巡る時の候補を整理します。",
    conclusion: "市内アクセスと分かりやすさなら東横、巻方面まで足を伸ばすならこまどりを候補にすると比較しやすいです。",
    quickTableLabel: "濃厚味噌ラーメン早見表",
    criteria: ["濃厚味噌としての代表性", "初訪問者への説明しやすさ", "アクセスと営業時間", "観光ルートへの組み込みやすさ"],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "touyoko-shichikuyama", score: 92, reason: "割りスープ付き濃厚味噌の体験が明確で、中心部からも比較的アクセスしやすい。", isPr: false },
      { rank: 2, itemSlug: "komadori-maki", score: 89, reason: "濃厚味噌の代表格として、巻・岩室方面の旅行導線に組み込みやすい。", isPr: false },
    ],
    sources: [
      { title: "東横 公式 店舗情報", url: "https://www.touyoko.jp/stores", sourceType: "official", collectedAt, note: "東横店舗情報確認。" },
      { title: "MEN LIFE ラーメン こまどり", url: "https://menlife.jp/shop/396", sourceType: "editorial", collectedAt, note: "こまどりの営業時間・濃厚味噌文脈確認。" },
    ],
    faqs: [
      { question: "新潟濃厚味噌は普通の味噌ラーメンと何が違いますか？", answer: "濃い味噌スープと太麺、場合によっては割りスープで調整する体験が特徴として紹介されます。" },
      { question: "車なしでも行けますか？", answer: "東横紫竹山本店は新潟駅からタクシー利用も検討できます。こまどりは車移動の方が計画しやすいです。" },
    ],
  },
  {
    slug: "niigata-assari-shoyu",
    title: "新潟あっさり醤油・淡麗系で選びたい店",
    description: "細麺と淡麗スープの老舗から煮干し香る中華そばまで、軽やかに食べたい人向けに整理します。",
    conclusion: "歴史と王道感なら三吉屋、煮干しの現代的な淡麗感まで見るなら麺や来味も候補です。",
    quickTableLabel: "あっさり・淡麗系早見表",
    criteria: ["スープの軽さ", "初訪問者への食べやすさ", "地域性", "情報の追跡しやすさ"],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "sankichiya-nishibori", score: 94, reason: "新潟あっさり醤油の入口として説明しやすく、古町での導線も強い。", isPr: false },
      { rank: 2, itemSlug: "raimi-ogata", score: 85, reason: "煮干し香る中華そばを軸に、淡麗系の比較対象として扱いやすい。", isPr: false },
    ],
    sources: [
      { title: "まいぷれ 三吉屋 西堀本店", url: "https://niigata.mypl.net/article/ramen_niigata/30547", sourceType: "local-media", collectedAt, note: "三吉屋基本情報確認。" },
      { title: "新潟市ラーメンガイド 麺や来味", url: "https://niigatacity-ramen.jp/ramen/raimi/", sourceType: "official", collectedAt, note: "麺や来味基本情報確認。" },
    ],
    faqs: [
      { question: "あっさり系は観光客にも向いていますか？", answer: "重すぎない味を探す人や、連食の1軒目として向いています。" },
      { question: "淡麗系でも煮干し感はありますか？", answer: "麺や来味のように、あっさりしながら煮干しのだしを感じる店舗もあります。" },
    ],
  },
  {
    slug: "niigata-parking",
    title: "駐車場ありで選びやすい新潟ラーメン店",
    description: "車移動が多い新潟県内で、駐車場情報を確認しやすい店舗を中心に比較します。",
    conclusion: "新潟市内ならいっとうや、真玄、来味、滋魂、県央まで含めるなら杭州飯店が車移動の候補です。",
    quickTableLabel: "車移動向け早見表",
    criteria: ["駐車場情報の明確さ", "エリアの使いやすさ", "営業時間の追跡しやすさ", "目的別の選びやすさ"],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "ittoya-shichikuyama", score: 90, reason: "駐車場22台の掲載があり、市内中心部からも使いやすい。", isPr: false },
      { rank: 2, itemSlug: "menya-shingen", score: 88, reason: "駐車場15台掲載、朝営業日もあり利用シーンが広い。", isPr: false },
      { rank: 3, itemSlug: "hangzhou-hanten", score: 87, reason: "燕市観光協会の店舗情報で駐車場有と掲載され、県央観光と組み合わせやすい。", isPr: false },
      { rank: 4, itemSlug: "raimi-ogata", score: 85, reason: "駐車場26台掲載で、東区方面の車移動に向く。", isPr: false },
      { rank: 5, itemSlug: "jikon-matsuzaki", score: 83, reason: "東区で背脂系を探す車移動の候補として扱いやすい。", isPr: false },
    ],
    sources: [
      { title: "新潟市ラーメンガイド", url: "https://niigatacity-ramen.jp/", sourceType: "official", collectedAt, note: "新潟市内店舗の駐車場情報確認。" },
      { title: "燕背脂ラーメンMAP 杭州飯店", url: "https://ra-men.tsubame-kankou.jp/stores/entry-27.html", sourceType: "tourism", collectedAt, note: "杭州飯店の駐車場有を確認。" },
    ],
    faqs: [
      { question: "駐車場ありでも満車になりますか？", answer: "人気店は満車になる可能性があります。ピーク時間を避ける、周辺駐車場を確認するなどの準備がおすすめです。" },
      { question: "このランキングは駐車台数だけで決めていますか？", answer: "駐車場情報の明確さに加え、エリア、営業時間、味の特徴も含めて整理しています。" },
    ],
  },
  {
    slug: "niigata-independent-selection",
    title: "チェーン店以外で選ぶ新潟市周辺の個性派ラーメン",
    description:
      "複数店舗展開のチェーン店を外し、新潟市ラーメンガイドで基本情報を確認できる個店を中心に、味の個性とエリアの広がりで整理しました。",
    conclusion:
      "濃厚煮干しなら石黒、味噌なら花咲・神田屋・八珍亭、夜の古町なら麺亭、貝だし塩なら貝晴を候補にすると目的別に選びやすいです。",
    quickTableLabel: "非チェーン個店早見表",
    criteria: [
      "チェーン店・大規模多店舗展開店を今回の追加対象から外すこと",
      "住所、営業時間、定休日、駐車場などの基本情報を参照元で確認できること",
      "煮干し、味噌、つけ麺、夜営業、貝だしなど味や利用シーンの違いが明確なこと",
      "中央区だけに偏らず、江南区、西蒲区、南区、西区まで広げられること",
      "PR掲載ではなく、参照情報に基づく編集整理であること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "ishiguro-bentenbashi", score: 90, reason: "3種の煮干しと動物系を重ねる極にぼが明確で、濃厚煮干し目的の入口にしやすい。", isPr: false },
      { rank: 2, itemSlug: "hanasaki-nuttari", score: 88, reason: "沼垂と発酵文化、峰村醸造の米こうじみそという文脈を作りやすい。", isPr: false },
      { rank: 3, itemSlug: "kaisei-kobari", score: 87, reason: "貝だし塩という軽い選択肢を追加でき、味噌・背脂中心の一覧に幅が出る。", isPr: false },
      { rank: 4, itemSlug: "ippongi-konan", score: 86, reason: "辛つけ麺とWスープの特徴があり、江南区の検索導線も補強できる。", isPr: false },
      { rank: 5, itemSlug: "mentei-furumachi", score: 85, reason: "古町で夜営業という利用シーンが明確で、締めラーメン需要を拾いやすい。", isPr: false },
      { rank: 6, itemSlug: "hachintei-nishikan", score: 84, reason: "西蒲区、特製みそ、駐車場60台掲載という車移動向けの情報価値がある。", isPr: false },
      { rank: 7, itemSlug: "kandaya-minami", score: 83, reason: "南区の味噌ラーメン候補として特徴があり、夜営業の情報も整理しやすい。", isPr: false },
      { rank: 8, itemSlug: "mentei-kogane", score: 82, reason: "3種チャーシューのこがねら〜めんが分かりやすく、南区の掲載厚みを作れる。", isPr: false },
    ],
    sources: [
      { title: "新潟市ラーメンガイド 中華そば 石黒", url: "https://niigatacity-ramen.jp/ramen/ishiguro/", sourceType: "official", collectedAt, note: "中華そば石黒の基本情報と極にぼの特徴確認。" },
      { title: "新潟市ラーメンガイド みそ蔵らーめん 花咲", url: "https://niigatacity-ramen.jp/ramen/%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93-%E8%8A%B1%E5%92%B2/", sourceType: "official", collectedAt, note: "花咲の基本情報と味噌の特徴確認。" },
      { title: "新潟市ラーメンガイド 麺屋 一本気", url: "https://niigatacity-ramen.jp/ramen/ippongi/", sourceType: "official", collectedAt, note: "一本気の基本情報と辛つけ麺の特徴確認。" },
      { title: "新潟市ラーメンガイド ラーメン 麺亭", url: "https://niigatacity-ramen.jp/ramen/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3-%E9%BA%BA%E4%BA%AD/", sourceType: "official", collectedAt, note: "麺亭の基本情報と夜営業、エビらーめん確認。" },
      { title: "新潟市ラーメンガイド らぁ麺 貝晴", url: "https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%81%81%E9%BA%BA-%E8%B2%9D%E6%99%B4/", sourceType: "official", collectedAt, note: "貝晴の基本情報と貝だし塩の特徴確認。" },
    ],
    faqs: [
      { question: "このランキングはチェーン店を含みますか？", answer: "今回の追加対象では、複数店舗展開のチェーン店を外し、個店として紹介しやすい店舗を中心に整理しています。" },
      { question: "掲載情報は実食レビューですか？", answer: "現時点では公式・地域ガイド等の公開情報に基づく編集整理です。営業時間や定休日は変更される可能性があるため、訪問前確認を推奨します。" },
    ],
  },
];
