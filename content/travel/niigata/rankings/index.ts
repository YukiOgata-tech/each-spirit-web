import type { Ranking } from "@/lib/types";

export const niigataHotelRankings: Ranking[] = [
  {
    slug: "niigata-onsen-ryokan-overall",
    title: "新潟温泉旅館 総合ランキング 2026",
    description: "泉質・料理・ロケーション・サービス・価格バランスを総合評価。越後湯沢・松之山・栃尾又など新潟を代表する個性的な旅館を比較します。",
    criteria: [
      "泉質の希少性・効能",
      "料理のクオリティと地域性",
      "ロケーションと景観",
      "スタッフのホスピタリティ",
      "価格対満足度バランス",
    ],
    conclusion: "希少なラジウム泉の自在館、日本三大薬湯の千歳が上位。文学ゆかりの高半も独自の滞在体験として外せない1軒。",
    quickTableLabel: "新潟温泉旅館 総合ランキング TOP5",
    lastUpdatedAt: "2026-06-08",
    items: [
      { rank: 1, itemSlug: "zaikakan-tochinoomata",  score: 92, reason: "日本有数のラジウム含有量という泉質の希少性が際立つ。湯治文化が根付いた宿で、他では体験できない療養温泉を求めるなら最右翼。", isPr: false },
      { rank: 2, itemSlug: "chitose-matsunoyama",     score: 90, reason: "日本三大薬湯という知名度と、実際に入ると納得できる独特の濃厚塩化物泉。棚田の里山という非日常ロケーションも加点要因。", isPr: false },
      { rank: 3, itemSlug: "takahan-yuzawa",           score: 88, reason: "『雪国』ゆかりという文化資本と越後湯沢温泉の安定した泉質。老舗ならではの館内の重みが滞在に深みを加える。", isPr: false },
      { rank: 4, itemSlug: "seifusou-tsukinoka",       score: 85, reason: "月岡温泉の中でも安定した評価を誇る宿。温泉街としての利便性が高く、初めての新潟温泉旅行にも入りやすい選択肢。", isPr: false },
      { rank: 5, itemSlug: "shiomisou-senami",         score: 83, reason: "日本海の夕日という絶景体験は他の宿では代替できない唯一無二の価値。夕日を軸に旅程を組むなら一択。", isPr: false },
    ],
    sources: [
      { title: "各旅館公式情報・現地調査", url: "", sourceType: "editorial", collectedAt: "2026-06-08", note: "価格・サービス内容は変動します。訪問前に各旅館へ確認してください。" },
    ],
    faqs: [
      { question: "このランキングはどのような基準で作成していますか？", answer: "泉質の希少性・料理の地域性・ロケーション・ホスピタリティ・価格バランスの5軸で総合評価しています。編集部独自の基準によるもので、PR掲載はありません。" },
      { question: "温泉初心者におすすめの宿は？", answer: "月岡温泉の清風苑は温泉街としての環境が整っており、温泉初心者でも楽しみやすいです。街歩き・足湯・土産物も充実しています。" },
    ],
  },
  {
    slug: "niigata-onsen-secret",
    title: "秘湯・湯治宿ランキング",
    description: "希少な泉質、山間の秘湯ロケーション、湯治文化を重視した宿のランキング。「温泉に入りに行く」ことが旅の目的になる宿を選びました。",
    criteria: [
      "泉質の希少性・個性",
      "秘湯感・非日常性",
      "源泉かけ流しの有無",
      "湯治文化・リピーター率",
      "アクセスの不便さも加味した秘湯度",
    ],
    conclusion: "日本有数のラジウム泉を持つ自在館が圧倒的。松之山・咲花・岩室と、新潟は秘湯系の宿の宝庫。",
    quickTableLabel: "秘湯・湯治宿 ランキング TOP4",
    lastUpdatedAt: "2026-06-08",
    items: [
      { rank: 1, itemSlug: "zaikakan-tochinoomata", score: 96, reason: "ラジウム温泉（放射能泉）という泉質の希少性は全国でもトップクラス。山奥のロケーションも含め、本物の秘湯体験ができる数少ない宿。", isPr: false },
      { rank: 2, itemSlug: "chitose-matsunoyama",    score: 92, reason: "日本三大薬湯の認知度と実際の泉質が伴っている。棚田の里山に囲まれた立地は秘湯感あり。温泉目的の旅行者が多い。", isPr: false },
      { rank: 3, itemSlug: "heisui-sakihana",        score: 88, reason: "翡翠色の硫黄泉という視覚的インパクトも大きい個性的な泉質。川沿いの露天風呂で入浴体験としての完成度が高い。", isPr: false },
      { rank: 4, itemSlug: "wakachiku-iwamuro",      score: 82, reason: "弥彦山麓の静かなロケーションと小規模旅館ならではの湯治的雰囲気。観光地でありながら秘湯感を保っている希少な環境。", isPr: false },
    ],
    sources: [
      { title: "各旅館公式情報・現地調査", url: "", sourceType: "editorial", collectedAt: "2026-06-08", note: "訪問前に各旅館へ確認してください。" },
    ],
    faqs: [
      { question: "湯治宿はどのくらい滞在するものですか？", answer: "湯治は本来1週間〜数週間の長期滞在が基本ですが、現代では2〜3泊でも湯治体験ができる宿が多い。まず1泊してみて気に入ったらリピートする旅行者も多い。" },
      { question: "秘湯系の宿に行くなら事前に何を準備すればいいですか？", answer: "山間部の宿は交通手段の確認が最優先。冬季は積雪で通行止めになる道もあります。携帯電話の電波が繋がりにくい場所もあるため、宿の電話番号をメモしておくと安心。" },
    ],
  },
  {
    slug: "niigata-onsen-scenery",
    title: "絶景・ロケーション重視ランキング",
    description: "景色・立地・季節の自然美を最重視した宿選び。日本海の夕日・妙高山の雄姿・雪国の冬景色・阿賀野川の流れなど、景観が旅の主役になる宿を厳選。",
    criteria: [
      "景観・ロケーションのインパクト",
      "客室や露天風呂からの眺め",
      "季節ごとの変化",
      "非日常体験としての完成度",
    ],
    conclusion: "日本海の夕日を独占できる汐美荘が首位。妙高山の眺望は香嶽楼が強い。雪国の景色を求めるなら高半が唯一無二。",
    quickTableLabel: "絶景・ロケーション重視ランキング TOP4",
    lastUpdatedAt: "2026-06-08",
    items: [
      { rank: 1, itemSlug: "shiomisou-senami",         score: 94, reason: "日本海に沈む夕日を露天風呂から眺めるという体験の唯一性が圧倒的。夕日目的の旅行者が繰り返し訪れる宿。", isPr: false },
      { rank: 2, itemSlug: "kougakulou-akakura",       score: 90, reason: "妙高山を正面に望む開放感ある露天風呂は季節を問わず素晴らしい。雪化粧した妙高山の眺望は特別な体験。", isPr: false },
      { rank: 3, itemSlug: "takahan-yuzawa",            score: 86, reason: "雪深い越後湯沢の白銀の景色は冬季に圧倒的な存在感を放つ。川端康成が見た風景と同じものを体験できる。", isPr: false },
      { rank: 4, itemSlug: "heisui-sakihana",           score: 82, reason: "阿賀野川を望む露天風呂は川面を渡る風と水音が心地よい。紅葉シーズンは特に美しいロケーション。", isPr: false },
    ],
    sources: [
      { title: "各旅館公式情報・現地調査", url: "", sourceType: "editorial", collectedAt: "2026-06-08", note: "訪問前に各旅館へ確認してください。" },
    ],
    faqs: [
      { question: "瀬波温泉の夕日はいつが一番きれいですか？", answer: "大気が澄む秋（9〜11月）が特に美しい。夏は水平線付近に雲がかかりやすいが、晴れた日の夕日はどの季節も圧巻。日の入り時刻を事前に調べて夕食前に露天風呂に入るのがおすすめ。" },
      { question: "妙高山の眺めが楽しめる時期はいつですか？", answer: "雪がない夏〜秋は緑豊かな妙高山の全景が見られる。11月〜4月は白銀の山容で全く異なる迫力がある。スキーシーズン（12〜3月）は特に山が美しい。" },
    ],
  },
];
