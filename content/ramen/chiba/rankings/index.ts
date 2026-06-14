import type { Ranking } from "@/lib/types";

const collectedAt = "2026-06-15";

export const chibaRamenRankings: Ranking[] = [
  {
    slug: "chiba-ramen-essential",
    title: "千葉ラーメン 初回に選びたい10店",
    description:
      "松戸の濃厚つけ麺、千葉市の家系、富津の竹岡式、勝浦タンタンメン、市川の淡麗系まで、千葉県の幅を初回で把握しやすい10店に整理しました。",
    conclusion:
      "全国区のつけ麺ならとみ田、松戸で油そばまで見るなら兎に角、千葉市の家系なら杉田家、地域性なら梅乃家と江ざわ、淡麗なら支那ソバ小むろが入口になります。",
    quickTableLabel: "千葉ラーメン初回10店早見表",
    criteria: [
      "千葉県ならではの地域性（竹岡式・勝浦タンタンメン）を含むこと",
      "松戸・柏・市川・千葉市・内房・外房・成田方面の導線を作れること",
      "公式または専門媒体・地図情報で基本情報を追跡できること",
      "初訪問者に味の方向性が伝わりやすいこと",
      "PR掲載ではなく編集部評価として紹介できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-tomita-matsudo", score: 97, reason: "松戸を代表する全国区の濃厚豚骨魚介つけ麺。千葉ラーメンの入口として最も説明しやすい。", isPr: false },
      { rank: 2, itemSlug: "chiba-sugitaya-yukou", score: 94, reason: "朝5時営業・駐車場情報あり・吉村家直系という実用性と知名度が強い千葉市の家系候補。", isPr: false },
      { rank: 3, itemSlug: "chiba-umenoya-takeoka", score: 92, reason: "竹岡式ラーメンの代表候補。富津・内房の地域性を最も伝えやすい。", isPr: false },
      { rank: 4, itemSlug: "chiba-ezawa-katsuura", score: 91, reason: "勝浦タンタンメンの代表格。外房のご当地ラーメン導線を作るうえで必須。", isPr: false },
      { rank: 5, itemSlug: "chiba-tonikaku-matsudo", score: 89, reason: "松戸駅近で魚介豚骨・油そば・つけ麺を比較できる。とみ田とは別の使いやすさがある。", isPr: false },
      { rank: 6, itemSlug: "chiba-komuro-ichikawa", score: 88, reason: "行徳の淡麗支那そば・ワンタン麺。濃厚系に偏らない千葉の選択肢として重要。", isPr: false },
      { rank: 7, itemSlug: "chiba-akebi-kashiwa", score: 86, reason: "柏エリアの淡麗・つけ麺候補。松戸だけでなく常磐線沿線の幅を出せる。", isPr: false },
      { rank: 8, itemSlug: "chiba-kaminari-chibaekimae", score: 84, reason: "千葉駅前で夜まで使えるとみ田グループのガッツリ系。都市部導線を補強できる。", isPr: false },
      { rank: 9, itemSlug: "chiba-menyaaoyama-narita", score: 82, reason: "成田方面の濃厚系候補。空港・成田山方面の旅行導線を作れる。", isPr: false },
      { rank: 10, itemSlug: "chiba-gouramen-togane", score: 80, reason: "東金・九十九里方面のローカル候補。湾岸や内房外房だけに偏らない構成にできる。", isPr: false },
    ],
    sources: [
      { title: "中華蕎麦とみ田 公式 店舗案内", url: "https://www.tomita-cocoro.jp/store/", sourceType: "official", collectedAt, note: "とみ田・雷各店の基本情報確認。" },
      { title: "ラーメン杉田家 公式 店舗案内", url: "https://sugitaya.com/shop/", sourceType: "official", collectedAt, note: "千葉祐光店・千葉駅前店の基本情報確認。" },
      { title: "勝浦タンタンメン企業組合", url: "https://katsuura-tantanmen.com/pages/about", sourceType: "official", collectedAt, note: "勝浦タンタンメンの基本スタイル確認。" },
      { title: "Tokyo Ramen of the Year 支那ソバ 小むろ", url: "https://tokyoramenoftheyear.com/ja/shop/shop-00056", sourceType: "editorial", collectedAt, note: "小むろの店舗情報確認。" },
    ],
    faqs: [
      { question: "千葉ラーメンはどの地域から回るべきですか？", answer: "電車なら松戸・柏・市川・千葉駅前、車なら富津の竹岡式、勝浦タンタンメン、東金・成田方面が組みやすいです。" },
      { question: "掲載店は広告ですか？", answer: "全件PR掲載なしです。公式・専門媒体・地図情報をもとに編集部で整理しています。" },
    ],
  },
  {
    slug: "chiba-local-style",
    title: "ご当地ラーメンで選ぶ千葉 竹岡式・勝浦タンタンメン",
    description:
      "千葉らしさを強く感じたい読者向けに、富津の竹岡式、勝浦タンタンメン、東金方面の醤油系まで、ドライブで組みやすいご当地感のある店を整理します。",
    conclusion:
      "竹岡式なら梅乃家と鈴屋、辛いご当地なら江ざわとてっぱつ屋、九十九里方面を入れるならぐうらーめんが候補です。",
    quickTableLabel: "千葉ご当地ラーメン早見表",
    criteria: [
      "地域名と味のスタイルが結びついていること",
      "内房・外房・九十九里方面の旅行導線を作れること",
      "車移動で訪問計画を立てやすいこと",
      "公式・地図・専門媒体で店舗存在を追跡できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-umenoya-takeoka", score: 94, reason: "竹岡式の代表候補として最も検索意図が明確。内房ドライブの目的地にしやすい。", isPr: false },
      { rank: 2, itemSlug: "chiba-ezawa-katsuura", score: 92, reason: "勝浦タンタンメンの代表格。ラー油系ご当地ラーメンの入口として強い。", isPr: false },
      { rank: 3, itemSlug: "chiba-suzuya-takeoka", score: 88, reason: "竹岡式を比較したい時の候補。梅乃家だけに偏らない富津の導線を作れる。", isPr: false },
      { rank: 4, itemSlug: "chiba-teppatsuya-katsuura", score: 86, reason: "勝浦市街地・観光導線で勝浦タンタンメンを組みやすい候補。", isPr: false },
      { rank: 5, itemSlug: "chiba-gouramen-togane", score: 82, reason: "東金・九十九里方面のローカル醤油候補として、千葉東部の厚みを出せる。", isPr: false },
    ],
    sources: [
      { title: "勝浦タンタンメン企業組合", url: "https://katsuura-tantanmen.com/pages/about", sourceType: "official", collectedAt, note: "勝浦タンタンメンの特徴確認。" },
      { title: "Google Maps 梅乃家", url: "https://maps.google.com/?q=%E6%A2%85%E4%B9%83%E5%AE%B6%20%E5%8D%83%E8%91%89%E7%9C%8C%E5%AF%8C%E6%B4%A5%E5%B8%82%E7%AB%B9%E5%B2%A1410", sourceType: "map", collectedAt, note: "梅乃家所在地確認の補助。" },
      { title: "Google Maps 江ざわ", url: "https://maps.google.com/?q=%E5%85%83%E7%A5%96%E5%8B%9D%E6%B5%A6%E5%BC%8F%E6%8B%85%E3%80%85%E9%BA%BA%20%E6%B1%9F%E3%81%96%E3%82%8F", sourceType: "map", collectedAt, note: "江ざわ所在地確認の補助。" },
    ],
    faqs: [
      { question: "竹岡式と勝浦タンタンメンは同じ地域ですか？", answer: "竹岡式は富津・内房、勝浦タンタンメンは勝浦・外房の文脈です。車移動なら日程を分けると回りやすいです。" },
      { question: "辛いものが苦手でも勝浦タンタンメンは向きますか？", answer: "ラー油系で辛さが特徴です。辛さが不安な場合は店舗で辛さ調整の可否を確認してください。" },
    ],
  },
  {
    slug: "chiba-tsukemen-rich",
    title: "濃厚つけ麺・魚介豚骨で選ぶ千葉ラーメン",
    description:
      "松戸・柏・成田を中心に、濃厚豚骨魚介、太麺、つけ麺、油そばの検索意図に合う店舗を整理します。県外から濃厚系を目当てに来る読者にも向けたランキングです。",
    conclusion:
      "濃厚つけ麺の本命はとみ田、松戸で油そばまで含めるなら兎に角、柏なら麺屋こうじとAKEBI、成田方面なら麺屋青山が候補です。",
    quickTableLabel: "千葉濃厚つけ麺・魚介豚骨早見表",
    criteria: [
      "つけ麺または魚介豚骨・太麺系の検索意図に合うこと",
      "松戸・柏・成田の複数エリアをカバーすること",
      "公式サイトまたは公式SNS・専門媒体で情報を追跡できること",
      "初訪問者に代表メニューを説明しやすいこと",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-tomita-matsudo", score: 98, reason: "濃厚豚骨魚介つけ麺の全国区。千葉のつけ麺目的なら最優先候補。", isPr: false },
      { rank: 2, itemSlug: "chiba-tonikaku-matsudo", score: 90, reason: "魚介豚骨と自家製太麺で、油そば・つけ麺・ラーメンを選べる松戸駅近の候補。", isPr: false },
      { rank: 3, itemSlug: "chiba-menya-kouji-kashiwa", score: 88, reason: "柏で濃厚豚骨魚介を探すときの代表候補。昼夜営業の情報も公式SNSで追いやすい。", isPr: false },
      { rank: 4, itemSlug: "chiba-akebi-kashiwa", score: 85, reason: "柏エリアで淡麗とつけ麺の幅を持つ候補。公式Xで最新案内を追える。", isPr: false },
      { rank: 5, itemSlug: "chiba-menyaaoyama-narita", score: 82, reason: "成田方面で濃厚魚介・鶏白湯の導線を作れる。車移動の候補として有効。", isPr: false },
    ],
    sources: [
      { title: "中華蕎麦とみ田 公式 店舗案内", url: "https://www.tomita-cocoro.jp/store/", sourceType: "official", collectedAt, note: "とみ田の基本情報確認。" },
      { title: "兎に角 公式 店舗一覧", url: "https://www.tonikaku.co.jp/shop", sourceType: "official", collectedAt, note: "兎に角 松戸店の基本情報確認。" },
      { title: "麺屋こうじ 公式X", url: "https://x.com/ko_ji_official", sourceType: "sns", collectedAt, note: "麺屋こうじの営業時間案内確認。" },
    ],
    faqs: [
      { question: "とみ田以外で松戸の候補はありますか？", answer: "兎に角は魚介豚骨のラーメン・つけ麺・油そばを選べる駅近候補です。" },
      { question: "柏で濃厚系を探すならどこですか？", answer: "麺屋こうじを濃厚豚骨魚介の候補に、AKEBIを淡麗・つけ麺の比較候補にできます。" },
    ],
  },
  {
    slug: "chiba-car-friendly",
    title: "車移動で選ぶ千葉ラーメン",
    description:
      "内房・外房・千葉市郊外・成田・東金など、電車より車で計画しやすい店舗を中心に整理します。観光やドライブと合わせる読者向けです。",
    conclusion:
      "駐車場情報が公式で明確な杉田家祐光店、内房の梅乃家・鈴屋、外房の江ざわ・てっぱつ屋、成田の麺屋青山、東金のぐうらーめんが車移動向けの候補です。",
    quickTableLabel: "千葉 車移動向けラーメン早見表",
    criteria: [
      "駅前より車移動で計画しやすいエリアであること",
      "観光・ドライブ導線に組み込みやすいこと",
      "駐車場または周辺駐車場の確認を前提にできること",
      "エリアが千葉市・内房・外房・北総・九十九里に分散していること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-sugitaya-yukou", score: 94, reason: "公式で第2駐車場6台まで掲載。朝5時営業もあり車移動の実用性が高い。", isPr: false },
      { rank: 2, itemSlug: "chiba-umenoya-takeoka", score: 91, reason: "富津・内房ドライブの目的地になる竹岡式代表候補。", isPr: false },
      { rank: 3, itemSlug: "chiba-ezawa-katsuura", score: 90, reason: "勝浦タンタンメン目的の外房ドライブで最も説明しやすい候補。", isPr: false },
      { rank: 4, itemSlug: "chiba-menyaaoyama-narita", score: 86, reason: "成田方面の郊外型候補。空港・成田山方面の移動と合わせやすい。", isPr: false },
      { rank: 5, itemSlug: "chiba-fukutake-sakuragi", score: 84, reason: "千葉市若葉区の郊外型背脂煮干し候補。市街地から車で使いやすい。", isPr: false },
      { rank: 6, itemSlug: "chiba-suzuya-takeoka", score: 83, reason: "竹岡式を比較したい時の富津候補。梅乃家とセットで検討しやすい。", isPr: false },
      { rank: 7, itemSlug: "chiba-teppatsuya-katsuura", score: 82, reason: "勝浦市街地側で勝浦タンタンメンを選べる候補。観光導線に入れやすい。", isPr: false },
      { rank: 8, itemSlug: "chiba-gouramen-togane", score: 80, reason: "東金・九十九里方面のローカル候補として車移動向け。", isPr: false },
    ],
    sources: [
      { title: "ラーメン杉田家 公式 店舗案内", url: "https://sugitaya.com/shop/", sourceType: "official", collectedAt, note: "駐車場情報確認。" },
      { title: "Google Maps 梅乃家", url: "https://maps.google.com/?q=%E6%A2%85%E4%B9%83%E5%AE%B6%20%E5%8D%83%E8%91%89%E7%9C%8C%E5%AF%8C%E6%B4%A5%E5%B8%82%E7%AB%B9%E5%B2%A1410", sourceType: "map", collectedAt, note: "所在地確認の補助。" },
      { title: "勝浦タンタンメン企業組合", url: "https://katsuura-tantanmen.com/pages/about", sourceType: "official", collectedAt, note: "勝浦タンタンメンの地域背景確認。" },
    ],
    faqs: [
      { question: "車移動ランキングは駐車場保証ですか？", answer: "駐車場の有無や台数は変わる場合があります。公式で明確な杉田家以外は、訪問前に地図・店舗情報で確認してください。" },
      { question: "千葉のご当地ラーメンは車が必要ですか？", answer: "富津・勝浦・東金方面は車の方が計画しやすいです。駅近中心なら松戸・柏・市川・千葉駅前を選ぶと回りやすいです。" },
    ],
  },
  {
    slug: "chiba-train-access",
    title: "駅近・電車で選ぶ千葉ラーメン",
    description:
      "松戸、柏、行徳、本八幡、千葉駅、船橋、稲毛など、公共交通で比較しやすい店舗を整理します。車なしで千葉ラーメンを回りたい読者向けです。",
    conclusion:
      "松戸ならとみ田と兎に角、柏ならAKEBIと麺屋こうじ、市川方面なら小むろと魂麺、千葉駅前なら杉田家千葉駅前店と雷、船橋なら雷船橋駅前店が候補です。",
    quickTableLabel: "千葉 駅近ラーメン早見表",
    criteria: [
      "駅または市街地からアクセスしやすいこと",
      "公共交通で複数店を比較しやすいこと",
      "松戸・柏・市川・千葉市・船橋をカバーすること",
      "夜利用または昼営業の情報を説明しやすいこと",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-tonikaku-matsudo", score: 92, reason: "松戸駅東口から近く、営業時間も長め。油そば・つけ麺・ラーメンを選べる。", isPr: false },
      { rank: 2, itemSlug: "chiba-tomita-matsudo", score: 91, reason: "松戸駅徒歩圏の全国区店。ただし売切・受付方式の事前確認が必須。", isPr: false },
      { rank: 3, itemSlug: "chiba-komuro-ichikawa", score: 88, reason: "行徳駅から徒歩圏。淡麗支那そば・ワンタン麺の駅近候補。", isPr: false },
      { rank: 4, itemSlug: "chiba-akebi-kashiwa", score: 86, reason: "柏駅周辺で淡麗・つけ麺を選べる候補。公式X確認前提で使いやすい。", isPr: false },
      { rank: 5, itemSlug: "chiba-sugitaya-chibaekimae", score: 85, reason: "千葉駅・千葉中央周辺から使いやすい家系候補。", isPr: false },
      { rank: 6, itemSlug: "chiba-kaminari-chibaekimae", score: 84, reason: "千葉駅前で夜まで使えるガッツリ系。公式情報で追いやすい。", isPr: false },
      { rank: 7, itemSlug: "chiba-kaminari-funabashi", score: 83, reason: "船橋駅から徒歩圏で、とみ田グループのガッツリ系を選べる。", isPr: false },
      { rank: 8, itemSlug: "chiba-yatai-ramen-iss-inage", score: 80, reason: "稲毛駅近くで塩・牛骨系を選べる。千葉市内の駅近候補を広げる。", isPr: false },
    ],
    sources: [
      { title: "兎に角 公式 店舗一覧", url: "https://www.tonikaku.co.jp/shop", sourceType: "official", collectedAt, note: "松戸店の駅近・営業時間確認。" },
      { title: "中華蕎麦とみ田 公式 店舗案内", url: "https://www.tomita-cocoro.jp/store/", sourceType: "official", collectedAt, note: "とみ田・雷各店のアクセス確認。" },
      { title: "ラーメン杉田家 公式 店舗案内", url: "https://sugitaya.com/shop/", sourceType: "official", collectedAt, note: "千葉駅前店の基本情報確認。" },
    ],
    faqs: [
      { question: "車なしで千葉ラーメンを回るならどこが効率的ですか？", answer: "松戸・柏・市川・千葉駅前・船橋の駅近店を組むと回りやすいです。富津や勝浦は車移動向きです。" },
      { question: "駅近でも事前確認は必要ですか？", answer: "必要です。特に人気店は売切終了、臨時休業、受付方式の変更があるため、直前確認をおすすめします。" },
    ],
  },
  {
    slug: "chiba-light-shoyu",
    title: "淡麗・醤油・塩で選ぶ千葉ラーメン",
    description:
      "濃厚豚骨魚介、家系、背脂、辛いご当地に寄りすぎないよう、淡麗醤油・支那そば・塩・牛骨系の候補を整理します。",
    conclusion:
      "ワンタン麺なら支那ソバ小むろ、本八幡の創作系なら魂麺、稲毛の塩・牛骨なら一's、船橋周辺の淡麗候補なら麺処ゆきち、柏ならAKEBIが候補です。",
    quickTableLabel: "千葉 淡麗・醤油・塩 早見表",
    criteria: [
      "濃厚系・背脂系・辛い系以外の選択肢であること",
      "醤油・塩・支那そば・ワンタン麺など味の方向性が分かりやすいこと",
      "市川・千葉市・船橋・柏の都市部をカバーすること",
      "軽めの一杯や連食向けの検索意図に合うこと",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-komuro-ichikawa", score: 92, reason: "淡麗支那そば・ワンタン麺の代表候補。TRYで基本情報も追いやすい。", isPr: false },
      { rank: 2, itemSlug: "chiba-akebi-kashiwa", score: 86, reason: "柏の淡麗醤油・つけ麺候補。濃厚系ランキングとの橋渡しもできる。", isPr: false },
      { rank: 3, itemSlug: "chiba-yatai-ramen-iss-inage", score: 84, reason: "稲毛の塩・牛骨系として、千葉市内で軽めの選択肢を作れる。", isPr: false },
      { rank: 4, itemSlug: "chiba-konmen-motoyawata", score: 82, reason: "本八幡の創作系候補。駅近で夜利用も検討しやすい。", isPr: false },
      { rank: 5, itemSlug: "chiba-yukichi-funabashi", score: 80, reason: "船橋周辺で淡麗寄りの候補を補う店舗。濃厚・ガッツリ以外の導線に使える。", isPr: false },
    ],
    sources: [
      { title: "Tokyo Ramen of the Year 支那ソバ 小むろ", url: "https://tokyoramenoftheyear.com/ja/shop/shop-00056", sourceType: "editorial", collectedAt, note: "小むろの基本情報確認。" },
      { title: "AKEBI 公式X", url: "https://x.com/akebimen", sourceType: "sns", collectedAt, note: "AKEBIの最新営業案内確認先。" },
      { title: "Google Maps 屋台拉麺一's 稲毛本店", url: "https://maps.google.com/?q=%E5%B1%8B%E5%8F%B0%E6%8B%89%E9%BA%BA%E4%B8%80%27s%20%E7%A8%B2%E6%AF%9B%E6%9C%AC%E5%BA%97", sourceType: "map", collectedAt, note: "所在地確認の補助。" },
    ],
    faqs: [
      { question: "千葉で軽めのラーメンを選ぶならどこですか？", answer: "支那ソバ小むろ、AKEBI、一's、麺処ゆきちを比較候補にすると、濃厚系とは違う方向で選べます。" },
      { question: "淡麗系は駐車場より電車向きですか？", answer: "今回の淡麗候補は市川・柏・稲毛・本八幡・船橋など駅近または市街地寄りが多く、公共交通で計画しやすいです。" },
    ],
  },
  {
    slug: "chiba-morning-night",
    title: "朝ラー・夜利用で選ぶ千葉ラーメン",
    description:
      "朝早くから使える店、夜まで使いやすい駅前店、仕事帰りや締めラーメンに向く候補を整理します。営業時間は変動しやすいため、公式確認を前提に扱います。",
    conclusion:
      "朝ラーなら杉田家千葉祐光店、千葉駅前の夜利用なら雷千葉駅前店と杉田家千葉駅前店、船橋なら雷船橋駅前店、津田沼の背脂ならなりたけが候補です。",
    quickTableLabel: "千葉 朝ラー・夜利用 早見表",
    criteria: [
      "朝営業または夜営業の検索意図に合うこと",
      "公式情報で営業時間を確認しやすい店舗を優先すること",
      "千葉駅・船橋・津田沼・松戸など都市部をカバーすること",
      "仕事前後や移動中に使いやすい立地であること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "chiba-sugitaya-yukou", score: 95, reason: "公式で5:00営業を確認できる朝ラー最有力候補。駐車場情報も強い。", isPr: false },
      { rank: 2, itemSlug: "chiba-kaminari-chibaekimae", score: 88, reason: "千葉駅前で23時までの公式掲載があり、夜利用に組み込みやすい。", isPr: false },
      { rank: 3, itemSlug: "chiba-sugitaya-chibaekimae", score: 86, reason: "千葉駅前で23時までの公式掲載。家系を駅近で食べたい時に向く。", isPr: false },
      { rank: 4, itemSlug: "chiba-kaminari-funabashi", score: 84, reason: "船橋駅前で22時までの公式掲載があり、仕事帰りの候補になる。", isPr: false },
      { rank: 5, itemSlug: "chiba-tonikaku-matsudo", score: 83, reason: "松戸駅近で22時までの公式掲載。油そば・つけ麺の夜利用候補。", isPr: false },
      { rank: 6, itemSlug: "chiba-naritake-tsudanuma", score: 80, reason: "津田沼のこってり背脂系として夜利用の検索意図に合うが、最新営業時間の確認が必要。", isPr: false },
    ],
    sources: [
      { title: "ラーメン杉田家 公式 店舗案内", url: "https://sugitaya.com/shop/", sourceType: "official", collectedAt, note: "杉田家各店の営業時間確認。" },
      { title: "中華蕎麦とみ田 公式 店舗案内", url: "https://www.tomita-cocoro.jp/store/", sourceType: "official", collectedAt, note: "雷各店の営業時間確認。" },
      { title: "兎に角 公式 店舗一覧", url: "https://www.tonikaku.co.jp/shop", sourceType: "official", collectedAt, note: "兎に角松戸店の営業時間確認。" },
    ],
    faqs: [
      { question: "朝ラーで一番分かりやすい店はどこですか？", answer: "公式で5:00営業を確認できるラーメン杉田家 千葉祐光店が最も分かりやすい候補です。" },
      { question: "夜営業は保証されていますか？", answer: "営業時間は変更される可能性があります。特に夜利用は、公式サイト・公式SNS・地図情報で直前確認してください。" },
    ],
  },
];
