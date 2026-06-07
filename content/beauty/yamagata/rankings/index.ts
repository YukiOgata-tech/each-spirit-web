import type { Ranking, Source } from "@/lib/types";

const collectedAt = "2026-06-07";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string): Source => ({
  title, url, sourceType, collectedAt, note,
});

export const beautyRankings: Ranking[] = [
  {
    slug: "yamagata-beauty-by-age",
    title: "【年代別】山形おすすめ美容室ランキング",
    description: "10代〜50代の年代ごとに、ニーズ・施術内容・価格帯・雰囲気を軸に評価した山形県美容室ランキング。年齢に合わせた提案力と通いやすさを重視して選定。",
    criteria: [
      "年代別ニーズへの対応力（白髪ケア・トレンド・子連れ対応など）",
      "スタイリストのカウンセリング精度",
      "価格帯と年代のマッチング",
      "継続して通いやすい環境・予約のしやすさ",
      "口コミ評価と編集部調査",
    ],
    conclusion: "30〜40代にはcerise、20〜30代のカラー重視ならBLOOM 七日町、ヘッドスパ・頭皮ケアにはLUNA、ファミリーにはmaplが年代ニーズへの対応力が高い。",
    quickTableLabel: "年代別おすすめ美容室 早見表（山形）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "cerise-tsurugaoka",
        score: 93,
        reason: "30〜50代女性の白髪・グレイカラー・縮毛矯正への丁寧な対応が群を抜く。完全予約制のプライベート空間でゆっくり相談できる点が鶴岡・庄内エリアの大人女性に圧倒的支持を受けている。グレイカラーへの移行提案は庄内エリアで最も実績豊富。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "bloom-yamagata-shichimachi",
        score: 87,
        reason: "20〜30代向けのカラー・髪質改善ニーズに的確に対応。七日町の利便性と適正価格が山形市中心部で働く若い世代に刺さる。アディクシーカラーとTOKIOの組み合わせは費用対効果の評価が高い。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "luna-yamagata-fukamachi",
        score: 84,
        reason: "ヘッドスパと酸性系トリートメントへの特化が他店と明確に差別化。30〜50代の頭皮ケア需要を確実に拾える。産後・更年期ケアへの対応力が特に評価ポイント。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "lien-yamagata-eki",
        score: 81,
        reason: "10〜20代のインナーカラー・ハイライト需要を山形駅前という最高立地で満たす。価格帯も入門向けで、山形市での初デザインカラー体験として最適。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "maple-tendo",
        score: 77,
        reason: "天童市・山形市郊外のファミリー層に最適化された環境。10台の駐車場と子連れ歓迎対応が車社会の山形で強い差別化要因になっている。全年代カバーで家族全員が通える点も評価。",
        isPr: false,
      },
    ],
    sources: [
      src("ホットペッパービューティー 山形市 大人女性サロン", "https://beauty.hotpepper.jp/svcSE/macED/salon/sacX413/", "local-media", "山形市内サロン掲載確認。"),
      src("楽天ビューティ 山形市 口コミ", "https://beauty.rakuten.co.jp/addr06201/sort4/", "local-media", "口コミ数・評価に基づく参考情報。"),
      src("Beauty Park 山形市 2026年", "https://www.beauty-park.jp/yamagata/yamagata-shi/", "editorial", "2026年版山形市人気サロン確認。"),
    ],
    faqs: [
      { question: "山形市と庄内エリア（鶴岡・酒田）では選び方が変わりますか？", answer: "山形市はサロン数が多く比較選択肢が広い一方、庄内エリアは地元密着型のサロンが多く、カウンセリングの丁寧さや継続利用のしやすさで選ぶとよいです。移動コストを考えると居住地に近いエリアのサロンを基本にし、特化施術（ヘッドスパ・グレイカラー等）は専門サロンへ遠征する使い方が現実的です。" },
      { question: "このランキングの評価基準は何ですか？", answer: "年代ごとの主要ニーズ（10代=トレンド・価格、30〜40代=白髪・カウンセリング、50代=頭皮ケア・扱いやすさ）を軸に、カウンセリング精度、価格の適正感、アクセス・利便性を総合評価しています。" },
    ],
  },
  {
    slug: "yamagata-beauty-color",
    title: "【カラー・髪質改善】山形おすすめ美容室ランキング",
    description: "アディクシーカラー・酸性トリートメント・ULTOWAトリートメント・オーガニックカラーを得意とするサロンを、技術力・メニュー構成・コストで評価した山形版ランキング。",
    criteria: [
      "カラー薬剤・施術技術の水準",
      "髪質改善メニューの充実度（酸性系・TOKIO・ULTOWA等）",
      "カラーとトリートメントの組み合わせコスト",
      "カラー後の持ちと色落ちのきれいさ",
      "初回カウンセリングの精度",
    ],
    conclusion: "アディクシー＋髪質改善ならBLOOM 七日町が最有力。酸性系・低ダメージにこだわるならLUNA。オーガニックカラーはnaturel。",
    quickTableLabel: "カラー・髪質改善 早見表（山形）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "bloom-yamagata-shichimachi",
        score: 94,
        reason: "アディクシーカラーの赤みゼロ透明感とTOKIOインカラミの組み合わせがコスパ最優秀。七日町立地で山形市内最も通いやすい立地。カウンセリングで仕上がりイメージを丁寧に共有する姿勢が評価される。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "luna-yamagata-fukamachi",
        score: 88,
        reason: "酸性トリートメントとULTOWAの低ダメージアプローチが他店との最大差別化点。「傷みを抑えながら質感を改善したい」ニーズへの回答として山形市内で最も専門性が高い。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "lien-yamagata-eki",
        score: 82,
        reason: "デザインカラー（インナー・ハイライト）の施術件数と実績が豊富。山形駅前という立地で予約が取りやすく、カラーを定期的にメンテナンスしやすい環境が整っている。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "naturel-sakata",
        score: 76,
        reason: "オーガニック・ヘナカラーへの対応は酒田・庄内エリアで最も充実。薬剤アレルギーや頭皮敏感肌の読者への唯一無二の提案先として機能する。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "cerise-tsurugaoka",
        score: 72,
        reason: "白髪染め・グレイカラーのカラー技術は鶴岡エリアで随一。デザインカラーより落ち着いたカラーの品質を求める30〜50代への提案として強い。",
        isPr: false,
      },
    ],
    sources: [
      src("ホットペッパービューティー 山形市 カラー人気", "https://beauty.hotpepper.jp/svcSE/macED/salon/sacX413/", "local-media", "山形市カラー人気サロン掲載確認。"),
      src("BSRプレス 山形 おすすめ美容室", "https://www.bestsalonreport.jp/press/67303/", "editorial", "山形メンズ向け美容室取材記事として参考。"),
    ],
    faqs: [
      { question: "山形市でTOKIOインカラミを取り扱うサロンはどこですか？", answer: "BLOOM 七日町がTOKIOインカラミを取り扱っています。施術前の確認と予約時に確認しておくと確実です。" },
      { question: "酸性トリートメントとTOKIOの違いは何ですか？", answer: "TOKIOインカラミは結合強化型で即効性と手触り改善が特徴。酸性トリートメントは低ダメージで持続性があり、敏感な髪質や繰り返しダメージがある髪に向きます。どちらが合うかはカウンセリングで確認するのがベストです。" },
    ],
  },
  {
    slug: "yamagata-beauty-headspa",
    title: "【ヘッドスパ・トリートメント】山形おすすめ美容室ランキング",
    description: "ヘッドスパ・酸性トリートメント・オーガニックケア・育毛ケアを得意とするサロンを、施術の質・専門性・頭皮改善への対応力で評価した山形版ランキング。",
    criteria: [
      "ヘッドスパの施術メニューと専門性",
      "使用するトリートメント剤の品質（酸性系・ULTOWA・オーガニック等）",
      "頭皮診断・育毛ケアへの対応",
      "施術後の持続感と手触りの変化",
      "リラクゼーション環境の質",
    ],
    conclusion: "本格ヘッドスパ・頭皮ケアはLUNAが山形県内最高水準。オーガニック派にはnaturel、トリートメントとの組み合わせならcerise。",
    quickTableLabel: "ヘッドスパ・トリートメント 早見表（山形）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "luna-yamagata-fukamachi",
        score: 97,
        reason: "ヘッドスパ専門性と酸性系薬剤へのこだわりが県内随一。アロマ×頭皮分析×育毛ケアのトリプルアプローチは他店では体験できない。産後・更年期の頭皮トラブル対応実績も豊富で、長期的なケアパートナーとして機能する。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "naturel-sakata",
        score: 85,
        reason: "天然由来・オーガニック成分へのこだわりが頭皮ケアと相性良い。化学薬剤を避けたい読者へのヘッドスパ先として酒田・庄内エリアで唯一の選択肢。子連れ対応で来院しやすい環境も評価ポイント。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "cerise-tsurugaoka",
        score: 78,
        reason: "カットと組み合わせたヘッドスパコースが完成度高く、30〜50代の一度の来店で頭皮ケアとスタイリングを完結できる。鶴岡市内でのヘッドスパ需要を最も確実に満たせるサロン。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "maple-tendo",
        score: 69,
        reason: "ファミリーサロンとしてはトリートメントメニューの選択肢が充実。定期的な通いやすさと駐車場完備の利便性で、天童市・山形市郊外在住者のトリートメントケア拠点として機能する。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "bloom-yamagata-shichimachi",
        score: 65,
        reason: "TOKIOインカラミによるカラー後のトリートメントが強み。カラーと併用前提のケアとして七日町で施術件数が多く、カラー後の手触り改善を求める山形市内の読者への提案として使いやすい。",
        isPr: false,
      },
    ],
    sources: [
      src("BSRプレス 山形でヘッドスパするならここ", "https://www.bestsalonreport.jp/press/67294/", "editorial", "山形ヘッドスパおすすめサロン取材記事として参考。"),
      src("楽天ビューティ 山形市 口コミ", "https://beauty.rakuten.co.jp/addr06201/sort4/", "local-media", "口コミ評価高いサロン確認。"),
    ],
    faqs: [
      { question: "山形でヘッドスパを専門に扱うサロンはありますか？", answer: "LUNAが山形市内でヘッドスパ・酸性トリートメントに最も特化しています。ヘッドスパが主な目的であれば、まずここをご検討ください。" },
      { question: "ヘッドスパはどのくらいの頻度で通うのが理想ですか？", answer: "月1回が一般的な目安です。頭皮の状態や悩みによって変わるため、初回施術後にスタイリストと相談して自分に合ったペースを決めるのがおすすめです。" },
    ],
  },
];
