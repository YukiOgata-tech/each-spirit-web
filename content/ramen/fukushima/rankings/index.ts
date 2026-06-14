import type { Ranking } from "@/lib/types";

const collectedAt = "2026-06-15";

export const fukushimaRamenRankings: Ranking[] = [
  {
    slug: "fukushima-ramen-essential",
    title: "福島ラーメン 初回に選びたい10店",
    description:
      "喜多方ラーメン、白河ラーメン、会津山塩、郡山ブラック、福島市の塩、二本松の鶏白湯まで、福島県の地域差を初回で把握しやすい10店に整理しました。",
    conclusion:
      "喜多方なら坂内食堂と食堂はせ川、白河ならとら食堂、会津ならうえんで、郡山ブラックならますや本店、福島市の塩なら伊達屋が入口です。",
    quickTableLabel: "福島ラーメン初回10店早見表",
    criteria: [
      "福島を代表する地域ラーメン（喜多方・白河・会津山塩・郡山ブラック）を含むこと",
      "県北・会津・中通り・浜通りまでエリアを広げること",
      "公式または地図・専門媒体で店舗情報を追跡できること",
      "初訪問者に味の方向性が伝わりやすいこと",
      "PR掲載ではなく編集部評価として紹介できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-bannai-kitakata", score: 96, reason: "喜多方ラーメンを代表する老舗。公式で営業時間・駐車場まで追え、初回候補として最も説明しやすい。", isPr: false },
      { rank: 2, itemSlug: "fukushima-torashokudo-shirakawa", score: 95, reason: "白河ラーメンの草分けとして全国的知名度が高い。手打ち中華の入口として外せない。", isPr: false },
      { rank: 3, itemSlug: "fukushima-uende-aizu", score: 91, reason: "公式情報が強く、会津山塩らぁ麺と会津の地域性を説明できる老舗。", isPr: false },
      { rank: 4, itemSlug: "fukushima-dateya-fukushima", score: 89, reason: "福島市の塩ラーメン代表候補。県北の淡麗・塩軸を作れる。", isPr: false },
      { rank: 5, itemSlug: "fukushima-hasegawa-kitakata", score: 88, reason: "坂内食堂とは違う現代的な喜多方人気店として、喜多方の厚みを出せる。", isPr: false },
      { rank: 6, itemSlug: "fukushima-masuya-koriyama", score: 86, reason: "郡山ブラックの検索意図に対応でき、福島ラーメンを喜多方・白河だけにしない核になる。", isPr: false },
      { rank: 7, itemSlug: "fukushima-kafuutei-shirakawa", score: 84, reason: "白河ラーメンの中でも個性ある手打ち麺とチャーシュー。公式Xで営業確認もしやすい。", isPr: false },
      { rank: 8, itemSlug: "fukushima-wakamusha-nihonmatsu", score: 82, reason: "二本松の鶏白湯・創作系候補として、中通りの現代的なラーメン導線を作れる。", isPr: false },
      { rank: 9, itemSlug: "fukushima-chinan-iwaki", score: 80, reason: "浜通り・小名浜の食堂系ラーメン候補。観光導線と合わせて紹介しやすい。", isPr: false },
      { rank: 10, itemSlug: "fukushima-koubou-sukagawa", score: 78, reason: "須賀川・県中エリアの車移動候補として、郡山と白河の間を補完できる。", isPr: false },
    ],
    sources: [
      { title: "坂内食堂 公式 店舗案内", url: "https://www.bannaisyokudou.jp/store/", sourceType: "official", collectedAt, note: "坂内食堂の基本情報確認。" },
      { title: "とら食堂 公式X", url: "https://x.com/torashokudo", sourceType: "sns", collectedAt, note: "とら食堂の基本情報・営業案内確認先。" },
      { title: "うえんで 公式サイト", url: "https://www.uende.jp/", sourceType: "official", collectedAt, note: "うえんで本店・会津山塩らぁ麺の確認。" },
      { title: "ラーメンデータベース 福島", url: "https://ramendb.supleks.jp/", sourceType: "user-review", collectedAt, note: "公式が弱い店舗の存在・ジャンル補助確認。" },
    ],
    faqs: [
      { question: "福島ラーメンはどの地域から選ぶべきですか？", answer: "初回なら喜多方と白河が分かりやすいです。会津山塩、郡山ブラック、福島市の塩、浜通りの食堂系まで広げると県全体の違いが見えます。" },
      { question: "営業時間は保証されていますか？", answer: "人気店は売切終了・臨時休業が多いため、公式サイト・公式SNS・地図情報で訪問前確認してください。" },
    ],
  },
  {
    slug: "fukushima-kitakata",
    title: "喜多方ラーメンで選ぶ福島",
    description:
      "平打ち熟成多加水麺と醤油・塩・背脂の違いを比較できるよう、坂内食堂、食堂はせ川、喜一、一平を整理します。朝ラーや車移動の計画にも向きます。",
    conclusion:
      "王道老舗なら坂内食堂、現代的な人気店なら食堂はせ川、塩なら喜一、背脂や朝ラーの違いを見たいなら一平が候補です。",
    quickTableLabel: "喜多方ラーメン早見表",
    criteria: [
      "喜多方市内または喜多方ラーメンの文脈で説明できること",
      "醤油・塩・背脂など味の違いを出せること",
      "朝ラーまたは昼営業の訪問計画に組み込みやすいこと",
      "地図・公式・専門媒体で基本情報を追跡できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-bannai-kitakata", score: 96, reason: "1958年創業の代表格。肉そばと公式情報の追跡性で初回候補に最適。", isPr: false },
      { rank: 2, itemSlug: "fukushima-hasegawa-kitakata", score: 90, reason: "現代的な人気店として、老舗系とは違う喜多方の魅力を補える。", isPr: false },
      { rank: 3, itemSlug: "fukushima-kiichi-kitakata", score: 86, reason: "塩ラーメンの候補として、醤油中心の喜多方ランキングに幅を加えられる。", isPr: false },
      { rank: 4, itemSlug: "fukushima-ippei-kitakata", score: 82, reason: "背脂・朝ラーの切り口を作れる。喜多方内で味の変化を出しやすい。", isPr: false },
    ],
    sources: [
      { title: "坂内食堂 公式 店舗案内", url: "https://www.bannaisyokudou.jp/store/", sourceType: "official", collectedAt, note: "坂内食堂の確認。" },
      { title: "まっぷる 食堂はせ川", url: "https://www.mapple.net/spot/7001335/", sourceType: "editorial", collectedAt, note: "食堂はせ川の確認。" },
      { title: "Google Maps 喜一", url: "https://maps.google.com/?q=%E5%96%9C%E4%B8%80%20%E7%A6%8F%E5%B3%B6%E7%9C%8C%E5%96%9C%E5%A4%9A%E6%96%B9%E5%B8%82%E9%96%A2%E6%9F%B4%E7%94%BA%E4%B8%8A%E9%AB%98%E9%A1%8D%E5%A2%83%E7%94%B0635-7", sourceType: "map", collectedAt, note: "喜一所在地確認の補助。" },
    ],
    faqs: [
      { question: "喜多方は朝から食べられますか？", answer: "朝営業する店が多い地域ですが、店舗ごとに営業時間や売切終了が異なります。訪問前に直近情報を確認してください。" },
    ],
  },
  {
    slug: "fukushima-shirakawa",
    title: "白河ラーメンで選ぶ福島",
    description:
      "手打ち中華、手揉み縮れ麺、醤油スープを軸に、とら食堂、手打中華すずき、火風鼎、あずま食堂を比較します。",
    conclusion:
      "白河ラーメンの入口はとら食堂、比較候補は手打中華すずき、個性ある手打ち麺なら火風鼎、エリア内で選択肢を増やすならあずま食堂です。",
    quickTableLabel: "白河ラーメン早見表",
    criteria: [
      "白河ラーメンの手打ち中華文脈で説明できること",
      "白河市内の複数候補を比較できること",
      "車移動・観光導線に組み込みやすいこと",
      "営業変更を追える公式SNSまたは地図情報があること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-torashokudo-shirakawa", score: 96, reason: "白河ラーメンの草分け。手打ち中華の入口として最優先候補。", isPr: false },
      { rank: 2, itemSlug: "fukushima-suzuki-shirakawa", score: 88, reason: "とら食堂以外で手打ち中華を比較したい時の有力候補。", isPr: false },
      { rank: 3, itemSlug: "fukushima-kafuutei-shirakawa", score: 86, reason: "独自の手打ち麺とチャーシューで白河内の個性を出せる。公式Xも確認導線になる。", isPr: false },
      { rank: 4, itemSlug: "fukushima-azuma-shirakawa", score: 80, reason: "鬼越周辺で白河ラーメンの候補を増やせる。車移動の比較に向く。", isPr: false },
    ],
    sources: [
      { title: "とら食堂 公式X", url: "https://x.com/torashokudo", sourceType: "sns", collectedAt, note: "とら食堂の基本情報確認先。" },
      { title: "火風鼎 公式X", url: "https://x.com/KaFuuTei_RaaMen", sourceType: "sns", collectedAt, note: "火風鼎の営業確認先。" },
      { title: "ふくラボ 火風鼎", url: "https://www.fukulabo.net/shop/shop.shtml?s=275", sourceType: "local-media", collectedAt, note: "火風鼎の特徴補助確認。" },
    ],
    faqs: [
      { question: "白河ラーメンは喜多方ラーメンと違いますか？", answer: "喜多方は平打ち多加水麺の地域性が強く、白河は手打ち・手揉みの縮れ麺と醤油スープの文脈で語られます。" },
    ],
  },
  {
    slug: "fukushima-aizu-koriyama",
    title: "会津・郡山で選ぶ福島ラーメン",
    description:
      "会津山塩、会津食堂系、郡山ブラック、郡山の魚介醤油を比較します。会津若松・郡山を軸に旅行計画を組む読者向けです。",
    conclusion:
      "会津山塩ならうえんで、会津観光と食堂利用なら牛乳屋食堂、郡山ブラックならますや本店、郡山の魚介醤油なら春木屋郡山分店が候補です。",
    quickTableLabel: "会津・郡山ラーメン早見表",
    criteria: [
      "会津または郡山の地域性を説明できること",
      "会津山塩・郡山ブラックなど明確な検索意図に合うこと",
      "観光・駅・車移動のいずれかに組み込みやすいこと",
      "公式または地図・専門媒体で基本情報を追えること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-uende-aizu", score: 92, reason: "会津山塩らぁ麺を公式情報で追える会津の代表候補。", isPr: false },
      { rank: 2, itemSlug: "fukushima-masuya-koriyama", score: 88, reason: "郡山ブラックの入口として、地域性を最も説明しやすい。", isPr: false },
      { rank: 3, itemSlug: "fukushima-harukiya-koriyama", score: 84, reason: "郡山でブラック以外の魚介醤油中華そばを選べる候補。", isPr: false },
      { rank: 4, itemSlug: "fukushima-gyunyuyashokudo-aizu", score: 82, reason: "芦ノ牧温泉駅周辺で食堂文化とラーメンを合わせて紹介できる。", isPr: false },
    ],
    sources: [
      { title: "うえんで 公式サイト", url: "https://www.uende.jp/", sourceType: "official", collectedAt, note: "うえんでの基本情報確認。" },
      { title: "Google Maps ますや本店 台新店", url: "https://maps.google.com/?q=%E3%81%BE%E3%81%99%E3%82%84%E6%9C%AC%E5%BA%97%20%E5%8F%B0%E6%96%B0%E5%BA%97%20%E7%A6%8F%E5%B3%B6%E7%9C%8C%E9%83%A1%E5%B1%B1%E5%B8%82%E5%8F%B0%E6%96%B01-31-10", sourceType: "map", collectedAt, note: "ますや本店所在地確認の補助。" },
    ],
    faqs: [
      { question: "会津山塩と郡山ブラックは同じ系統ですか？", answer: "違います。会津山塩は塩、郡山ブラックは濃い色の醤油スープの文脈で選び分けます。" },
    ],
  },
  {
    slug: "fukushima-car-friendly",
    title: "車移動で選ぶ福島ラーメン",
    description:
      "福島県は面積が広く、喜多方・白河・会津・浜通りをまたぐ移動は車が便利です。駐車場やドライブ導線を意識して候補を整理します。",
    conclusion:
      "公式駐車場情報が強い坂内食堂、会津のうえんで、白河のとら食堂、福島市の伊達屋、浜通りのチーナン食堂、須賀川の好房が車移動向けです。",
    quickTableLabel: "福島 車移動向けラーメン早見表",
    criteria: [
      "車移動で訪問計画を立てやすいエリアであること",
      "駐車場ありまたは駐車場確認を前提にできること",
      "県内の複数エリアをカバーすること",
      "観光・温泉・ドライブと合わせやすいこと",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-bannai-kitakata", score: 94, reason: "公式掲載で第1〜第3駐車場あり。喜多方ドライブの入口にしやすい。", isPr: false },
      { rank: 2, itemSlug: "fukushima-uende-aizu", score: 90, reason: "会津若松郊外で車移動向き。会津山塩という目的性も明確。", isPr: false },
      { rank: 3, itemSlug: "fukushima-torashokudo-shirakawa", score: 88, reason: "白河ラーメン目的の車移動候補。混雑・売切の事前確認が重要。", isPr: false },
      { rank: 4, itemSlug: "fukushima-dateya-fukushima", score: 86, reason: "福島市郊外の塩ラーメン候補。県北の車移動に向く。", isPr: false },
      { rank: 5, itemSlug: "fukushima-chinan-iwaki", score: 82, reason: "小名浜観光と合わせやすい浜通りの食堂系候補。", isPr: false },
      { rank: 6, itemSlug: "fukushima-koubou-sukagawa", score: 80, reason: "須賀川・県中の移動途中に組み込みやすい候補。", isPr: false },
      { rank: 7, itemSlug: "fukushima-ippei-kitakata", score: 78, reason: "喜多方の朝ラー・背脂候補として車移動に組み込みやすい。", isPr: false },
      { rank: 8, itemSlug: "fukushima-kaizan-iwaki", score: 76, reason: "いわき市内の車移動候補。浜通り側の選択肢を増やせる。", isPr: false },
    ],
    sources: [
      { title: "坂内食堂 公式 店舗案内", url: "https://www.bannaisyokudou.jp/store/", sourceType: "official", collectedAt, note: "駐車場情報確認。" },
      { title: "うえんで 公式サイト", url: "https://www.uende.jp/", sourceType: "official", collectedAt, note: "会津エリアの基本情報確認。" },
      { title: "Google Maps チーナン食堂", url: "https://maps.google.com/?q=%E3%83%81%E3%83%BC%E3%83%8A%E3%83%B3%E9%A3%9F%E5%A0%82%20%E7%A6%8F%E5%B3%B6%E7%9C%8C%E3%81%84%E3%82%8F%E3%81%8D%E5%B8%82%E5%B0%8F%E5%90%8D%E6%B5%9C%E6%A0%84%E7%94%BA66-30", sourceType: "map", collectedAt, note: "小名浜候補の所在地確認。" },
    ],
    faqs: [
      { question: "福島ラーメン巡りは車が必要ですか？", answer: "喜多方・白河・会津・浜通りをまたぐなら車が現実的です。駅近だけなら福島市や二本松、郡山周辺から選べます。" },
    ],
  },
  {
    slug: "fukushima-station-tourism",
    title: "駅近・観光導線で選ぶ福島ラーメン",
    description:
      "福島駅、二本松駅、芦ノ牧温泉、小名浜など、観光や公共交通の導線に組み込みやすい店舗を整理します。",
    conclusion:
      "福島駅周辺ならくをん、二本松駅周辺なら若武者、芦ノ牧温泉なら牛乳屋食堂、小名浜観光ならチーナン食堂が候補です。",
    quickTableLabel: "福島 駅近・観光導線ラーメン早見表",
    criteria: [
      "駅・温泉・観光地との導線が作りやすいこと",
      "車なしの読者にも提案できる余地があること",
      "ラーメン単体だけでなく旅行計画に組み込みやすいこと",
      "地図情報で所在地を確認できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-kuon-fukushima", score: 86, reason: "福島駅周辺の自家製麺つけ麺候補。新幹線・駅利用の検索意図に合う。", isPr: false },
      { rank: 2, itemSlug: "fukushima-wakamusha-nihonmatsu", score: 84, reason: "二本松駅周辺で使いやすい鶏白湯・創作系候補。", isPr: false },
      { rank: 3, itemSlug: "fukushima-gyunyuyashokudo-aizu", score: 82, reason: "芦ノ牧温泉駅周辺で会津観光と組み合わせやすい食堂系候補。", isPr: false },
      { rank: 4, itemSlug: "fukushima-chinan-iwaki", score: 80, reason: "小名浜観光と合わせやすい浜通りの候補。", isPr: false },
      { rank: 5, itemSlug: "fukushima-harukiya-koriyama", score: 78, reason: "郡山市街地で魚介醤油の中華そばを選べる候補。", isPr: false },
    ],
    sources: [
      { title: "Google Maps 自家製麺 くをん", url: "https://maps.google.com/?q=%E8%87%AA%E5%AE%B6%E8%A3%BD%E9%BA%BA%20%E3%81%8F%E3%82%92%E3%82%93%20%E7%A6%8F%E5%B3%B6%E7%9C%8C%E7%A6%8F%E5%B3%B6%E5%B8%82%E5%A4%AA%E7%94%B0%E7%94%BA8-1", sourceType: "map", collectedAt, note: "福島駅周辺候補の所在地確認。" },
      { title: "Google Maps 麺処 若武者", url: "https://maps.google.com/?q=%E9%BA%BA%E5%87%A6%20%E8%8B%A5%E6%AD%A6%E8%80%85%20%E7%A6%8F%E5%B3%B6%E7%9C%8C%E4%BA%8C%E6%9C%AC%E6%9D%BE%E5%B8%82%E6%9C%AC%E7%94%BA2-86-1", sourceType: "map", collectedAt, note: "二本松駅周辺候補の所在地確認。" },
    ],
    faqs: [
      { question: "福島で車なしでも選べるラーメンはありますか？", answer: "福島駅周辺のくをん、二本松駅周辺の若武者など、駅や観光導線に寄せた候補があります。ただし最終的なアクセスは地図で確認してください。" },
    ],
  },
  {
    slug: "fukushima-light-shoyu",
    title: "淡麗醤油・塩で選ぶ福島ラーメン",
    description:
      "喜多方の塩、白河の手打ち中華、福島市の塩、郡山の魚介醤油、須賀川の醤油・塩まで、濃厚系以外の候補を整理します。",
    conclusion:
      "塩なら伊達屋と喜一、白河の手打ち中華ならとら食堂・すずき・火風鼎、郡山の魚介醤油なら春木屋、須賀川なら好房が候補です。",
    quickTableLabel: "福島 淡麗醤油・塩 早見表",
    criteria: [
      "重すぎない醤油・塩の検索意図に合うこと",
      "喜多方・白河・福島市・郡山・須賀川をカバーすること",
      "連食や観光中の一杯として提案しやすいこと",
      "公式または地図・専門媒体で基本情報を追跡できること",
    ],
    lastUpdatedAt: collectedAt,
    items: [
      { rank: 1, itemSlug: "fukushima-dateya-fukushima", score: 92, reason: "福島市で塩ラーメンを探す読者に最も提案しやすい候補。", isPr: false },
      { rank: 2, itemSlug: "fukushima-torashokudo-shirakawa", score: 90, reason: "白河手打ち中華の代表。淡麗醤油の入口としても強い。", isPr: false },
      { rank: 3, itemSlug: "fukushima-kiichi-kitakata", score: 86, reason: "喜多方の塩ラーメン候補として、醤油以外の選択肢を作れる。", isPr: false },
      { rank: 4, itemSlug: "fukushima-harukiya-koriyama", score: 84, reason: "郡山で魚介醤油の中華そばを選びたい読者に向く。", isPr: false },
      { rank: 5, itemSlug: "fukushima-suzuki-shirakawa", score: 82, reason: "白河の手打ち中華を比較したい時の候補。", isPr: false },
      { rank: 6, itemSlug: "fukushima-kafuutei-shirakawa", score: 80, reason: "手打ち麺とチャーシューの個性があり、白河内の比較に向く。", isPr: false },
      { rank: 7, itemSlug: "fukushima-koubou-sukagawa", score: 78, reason: "須賀川・県中の醤油・塩候補として地域バランスを補える。", isPr: false },
    ],
    sources: [
      { title: "とら食堂 公式X", url: "https://x.com/torashokudo", sourceType: "sns", collectedAt, note: "白河手打ち中華の代表候補確認。" },
      { title: "Google Maps 伊達屋", url: "https://maps.google.com/?q=%E4%BC%8A%E9%81%94%E5%B1%8B%20%E7%A6%8F%E5%B3%B6%E7%9C%8C%E7%A6%8F%E5%B3%B6%E5%B8%82%E5%8D%97%E6%B2%A2%E5%8F%88%E4%B8%8B%E7%95%AA%E5%8C%A0%E7%94%B022", sourceType: "map", collectedAt, note: "福島市塩ラーメン候補の所在地確認。" },
      { title: "うえんで 公式サイト", url: "https://www.uende.jp/", sourceType: "official", collectedAt, note: "会津山塩の文脈確認。" },
    ],
    faqs: [
      { question: "福島で塩ラーメンならどこですか？", answer: "福島市なら伊達屋、喜多方なら喜一、会津山塩ならうえんでが比較候補です。" },
    ],
  },
];
