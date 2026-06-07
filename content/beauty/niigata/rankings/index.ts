import type { Ranking, Source } from "@/lib/types";

const collectedAt = "2026-06-07";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string): Source => ({
  title, url, sourceType, collectedAt, note,
});

export const beautyRankings: Ranking[] = [
  {
    slug: "niigata-beauty-by-age",
    title: "【年代別】新潟おすすめ美容室ランキング",
    description: "10代〜50代の年代ごとに、ニーズ・施術内容・価格帯・雰囲気を軸に評価した新潟美容室ランキング。年齢に合わせた提案力と通いやすさを重視して選定しています。",
    criteria: [
      "年代別ニーズへの対応力（白髪ケア・トレンド・子連れ対応など）",
      "スタイリストのカウンセリング精度",
      "価格帯と年代のマッチング",
      "継続して通いやすい環境・予約のしやすさ",
      "口コミ評価と編集部取材",
    ],
    conclusion: "30〜40代の方はAtelier HANA、20〜30代のカラー重視ならSALONE BANDAI、ヘッドスパ・頭皮ケアにはCALM Spa & Treatmentが年代ニーズへの対応力が高い。",
    quickTableLabel: "年代別おすすめ美容室 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "atelier-hana",
        score: 94,
        reason: "30〜50代女性の「骨格・白髪・ライフスタイル」を丁寧に把握したカウンセリングが圧倒的。完全予約制のプライベートな空間で、自分のペースで施術を受けられる点が年代問わず高評価。グレイカラーへの移行提案も他店より自然で上質。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "salone-bandai",
        score: 88,
        reason: "20〜30代のカラー・髪質改善ニーズにピンポイントで応える構成。イルミナカラーの発色と持続力、TOKIOトリートメントとの組み合わせコストが適切。万代立地でアクセスも良く、昼休みや仕事帰りの利用がしやすい。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "calm-spa-niigata",
        score: 85,
        reason: "「ヘッドスパで頭皮ケアを始めたい」30〜50代へのファーストチョイス。産後ケア・更年期の頭皮トラブルへの対応力が他店と差別化ポイント。駐車場完備で車移動派にも使いやすい。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "bloom-niigataeki",
        score: 82,
        reason: "10代〜20代のインナーカラー・ハイライト需要に最も応えている。駅前の便利さと入りやすい価格帯が新社会人・学生層の来店ハードルを下げる。年長層には向かないが10〜20代の年代別評価では最高水準。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "grace-nishi",
        score: 79,
        reason: "子連れで通える環境が整っており、家族全員が同一サロンで完結できる。年代の幅広さと駐車場完備が西区・郊外在住ファミリー層に刺さる。価格帯も全年代で入りやすい設定。",
        isPr: false,
      },
    ],
    sources: [
      src("ホットペッパービューティー 新潟 大人女性サロン", "https://beauty.hotpepper.jp/svcSH/macHA/spkSP13_spdL066/", "local-media", "大人女性向けサロン掲載確認。"),
      src("楽天ビューティ 新潟市 口コミ", "https://beauty.rakuten.co.jp/addr15101/sort4/", "local-media", "口コミ数・評価に基づく参考情報。"),
      src("Beauty Park 新潟市 2026年最新", "https://www.beauty-park.jp/niigata/niigata-shi/", "editorial", "2026年版 新潟市人気サロン掲載確認。"),
    ],
    faqs: [
      { question: "20代と40代では美容室選びの基準が違いますか？", answer: "はい。20代はトレンドカラーや低価格帯、アクセスの良さが優先されやすく、40代は白髪・ダメージへの対応力や落ち着いた雰囲気、予約の取りやすさが重視される傾向があります。このランキングでは各年代の主要ニーズを基準に採点しています。" },
      { question: "年代別ランキングと他のランキングを組み合わせて使えますか？", answer: "はい。たとえば「30代でカラーも重視したい」場合は年代別No.2のSALONE BANDAIとカラー・髪質改善ランキングのNo.1が一致するため、より確信を持って選べます。複数ランキングの交点を探す使い方がおすすめです。" },
    ],
  },
  {
    slug: "niigata-beauty-color",
    title: "【カラー・髪質改善】新潟おすすめ美容室ランキング",
    description: "イルミナカラー・アディクシーカラー・バレイヤージュ・ケアブリーチ・髪質改善トリートメントを得意とするサロンを、技術力・メニュー構成・コストを軸に評価したランキング。",
    criteria: [
      "カラー薬剤・施術技術の水準（イルミナ・アディクシー・ブリーチ等）",
      "髪質改善メニューの充実度（TOKIO・オージュア等）",
      "カラーとトリートメントの組み合わせコスト",
      "カラー後の持ちと色落ちのきれいさ",
      "初回カウンセリングの精度",
    ],
    conclusion: "イルミナカラーと髪質改善ならSALONE BANDAIが最有力。ブリーチハイライト・バレイヤージュはLUCEが最も専門性が高い。",
    quickTableLabel: "カラー・髪質改善 美容室早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "salone-bandai",
        score: 95,
        reason: "イルミナカラーの発色と持続力、TOKIOインカラミとの組み合わせ提案が他店より整理されている。カラーと髪質改善のセットメニューのコスパが評価されており、万代エリアでカラーメインで通うならここが最優先候補。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "luce-chuo",
        score: 91,
        reason: "バレイヤージュ・ケアブリーチのデザインカラー専門性はエリア随一。ケアブリーチ「レゾ」取り扱いにより、ブリーチダメージを抑えながら高い明度を実現。透明感のある外国人風スタイルを求める層には筆頭候補。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "bloom-niigataeki",
        score: 84,
        reason: "アディクシーカラーによる赤みゼロ・透明感スタイルを得意とし、インナーカラー・ハイライトの施術件数も多い。価格帯が低めでカラー施術の入門としても最適。駅前アクセスも加点要因。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "atelier-hana",
        score: 78,
        reason: "白髪染め・グレイカラーの丁寧な対応が特徴で、40〜50代向けのカラー技術は高水準。ただしデザインカラー・ブリーチ系は他サロンが専門性で上回るため、年代層特化のランキングとなる。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "niero-nagaoka",
        score: 74,
        reason: "長岡エリアでは最も信頼できるカラー施術先。受賞歴のあるスタイリストの技術力は折り紙付きで、新潟市内に行けない長岡在住読者への優先推薦先。",
        isPr: false,
      },
    ],
    sources: [
      src("ホットペッパービューティー 新潟市カラー人気", "https://beauty.hotpepper.jp/genre/gkw008/pre15/city15100001/", "local-media", "新潟市カラー人気サロン掲載確認。"),
      src("Beauty Park 新潟カラー特集", "https://www.beauty-park.jp/niigata/niigata/color/", "editorial", "カラー施術人気サロンとして掲載確認。"),
      src("BSRプレス 新潟でカットが上手い美容室", "https://www.bestsalonreport.jp/press/27313/", "editorial", "新潟実力派サロン取材記事として参考。"),
    ],
    faqs: [
      { question: "イルミナカラーとアディクシーカラーの違いは何ですか？", answer: "イルミナカラーはWELLAの薬剤で、髪のダメージを抑えながらツヤのある透明感を出すのが得意。アディクシーカラーはSHISEIDO系で赤みを抑えた透明感に強い。どちらが向くかは髪質と希望の色味次第なので、カウンセリングで相談するのがベストです。" },
      { question: "髪質改善とカラーは同日にできますか？", answer: "多くのサロンで同日施術に対応していますが、施術時間が長くなります。髪の状態によって順序や選べるメニューが変わることもあるため、予約時に確認してください。" },
    ],
  },
  {
    slug: "niigata-beauty-headspa",
    title: "【ヘッドスパ・トリートメント】新潟おすすめ美容室ランキング",
    description: "ヘッドスパ・アロマトリートメント・オージュア・TOKIO・育毛ケアを得意とするサロンを、施術の質・メニュー構成・頭皮改善への対応力で評価したランキング。",
    criteria: [
      "ヘッドスパの施術メニューと専門性",
      "使用するトリートメント剤の品質（オージュア・TOKIO等）",
      "頭皮診断・育毛ケアへの対応",
      "施術後の持続感と手触りの変化",
      "リラクゼーション環境の質",
    ],
    conclusion: "本格ヘッドスパ・頭皮ケアはCALM Spa & Treatmentが県内最高水準。トリートメントとの組み合わせを重視するならAtelier HANAも有力。",
    quickTableLabel: "ヘッドスパ・トリートメント 美容室早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "calm-spa-niigata",
        score: 96,
        reason: "ヘッドスパに特化したメニュー設計と、オージュアによる頭皮・毛髪両面のアプローチが他店と差別化される。産後ケアや更年期の頭皮トラブルへの対応力が充実。完全予約制のプライベート空間でリラクゼーション性も高い。駐車場完備で郊外からのアクセスも良好。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "atelier-hana",
        score: 87,
        reason: "カットと組み合わせたヘッドスパコースの完成度が高く、一度の施術でスタイリングと頭皮ケアを完結できる。30〜50代の大人女性が求める上質な体験と空間づくりが全体評価を押し上げている。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "salone-bandai",
        score: 80,
        reason: "TOKIOインカラミトリートメントの仕上がりと持続性は市内トップクラス。カラー施術後のダメージケアとしてのトリートメントに強く、カラーと組み合わせる読者への提案で特に活きる。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "grace-nishi",
        score: 73,
        reason: "ファミリー向けサロンとしてはトリートメントメニューの選択肢が充実。普段使いでのケアとして継続しやすい価格帯と予約の取りやすさが評価のポイント。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "roots-furumachi",
        score: 68,
        reason: "メンズ向けのトリートメントと頭皮ケアに対応。男性でヘッドスパを試したい読者への入門として紹介しやすく、古町エリアの立地もアクセスしやすい。",
        isPr: false,
      },
    ],
    sources: [
      src("ホットペッパービューティー 新潟市 ヘッドスパ", "https://beauty.hotpepper.jp/", "local-media", "新潟市ヘッドスパ人気サロン掲載確認。"),
      src("楽天ビューティ 新潟 予約制", "https://beauty.rakuten.co.jp/pre15/ks117/sort4/", "local-media", "予約制・頭皮ケアサロン掲載確認。"),
      src("BSRプレス 新潟おすすめ美容室", "https://www.bestsalonreport.jp/_niigata/", "editorial", "編集部厳選新潟人気美容室として参考。"),
    ],
    faqs: [
      { question: "ヘッドスパとトリートメントは何が違いますか？", answer: "ヘッドスパは主に頭皮の血行促進・毛穴ケア・リラクゼーションを目的とした施術です。トリートメントは毛髪内部に成分を補給して質感を改善するケアです。両方組み合わせることで頭皮と毛髪を同時にケアできます。" },
      { question: "育毛効果があるヘッドスパはありますか？", answer: "直接的な医療行為はできませんが、頭皮環境の改善（血行促進・毛穴クレンジング）はヘアサイクルを整えるサポートになります。特にCALM Spa & Treatmentはこのアプローチに力を入れています。" },
    ],
  },
];
