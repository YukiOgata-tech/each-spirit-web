import { editorAuthor } from "@/content/site";
import type { Article } from "@/lib/types";

const collectedAt = "2026-06-07";

export const beautyArticles: Article[] = [
  {
    slug: "yamagata-beauty-salon-guide",
    title: "山形の美容室を年代・施術・エリアで選ぶガイド",
    description:
      "山形市・鶴岡市・酒田市・天童市の美容室を年代別ニーズ、施術内容、エリアの3軸で整理。山形特有の移動事情と庄内・内陸の地域差も踏まえた選び方をまとめます。",
    category: "美容室",
    tags: ["山形", "美容室", "選び方", "年代別", "庄内", "山形市"],
    publishedAt: "2026-06-07",
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "山形市（内陸）と鶴岡・酒田（庄内）はエリア特性が異なるため、居住地に近い地域を基本にしつつ、特化施術だけ遠征する使い分けが現実的。",
      "車移動が標準の山形では駐車場の有無がサロン選びの重要条件で、郊外型サロンは駐車場完備が多く選びやすい。",
      "Each Spiritの山形美容室カードでは参照ソースと確認日を掲載しているが、営業時間・価格は変更される場合があるため訪問前に公式情報を確認してください。",
    ],
    whatYouLearn: [
      "山形エリア別の美容室選びのポイント",
      "施術内容で候補を絞る方法",
      "山形の移動事情を踏まえたサロン選び",
    ],
    sources: [
      { title: "ホットペッパービューティー 山形市", url: "https://beauty.hotpepper.jp/svcSE/macED/salon/sacX413/", sourceType: "local-media", collectedAt, note: "山形市内のサロン傾向を確認。" },
      { title: "楽天ビューティ 山形市 口コミ", url: "https://beauty.rakuten.co.jp/addr06201/sort4/", sourceType: "local-media", collectedAt, note: "口コミ数・評価の高いサロン傾向を確認。" },
      { title: "BSRプレス 山形 美容室", url: "https://www.bestsalonreport.jp/press/67303/", sourceType: "editorial", collectedAt, note: "山形の実力派サロン取材記事として参考。" },
    ],
    faqs: [
      { question: "山形市と鶴岡・酒田では美容室の選び方が違いますか？", answer: "はい。山形市はサロン数が多く選択肢が豊富なため比較が重要で、鶴岡・酒田などの庄内エリアは地域密着型が多く、長期的な関係性を重視して選ぶことが多いです。" },
      { question: "車がないと山形の美容室には行きにくいですか？", answer: "山形市中心部（七日町・駅前）は徒歩やバスで行けるサロンも多いです。天童市・鶴岡市・酒田市などは車移動が便利なサロンが多く、駐車場完備かを確認しておくとよいです。" },
    ],
    relatedSlugs: ["yamagata-hair-color-guide"],
  },
  {
    slug: "yamagata-hair-color-guide",
    title: "山形でヘアカラーを選ぶ前に知りたいこと",
    description:
      "アディクシーカラー・酸性トリートメント・オーガニックカラー・グレイカラーの違いと費用感を整理。山形の気候・生活環境に合わせたカラー選びのポイントもまとめます。",
    category: "美容室",
    tags: ["カラー", "アディクシーカラー", "酸性トリートメント", "グレイカラー", "山形", "オーガニック"],
    publishedAt: "2026-06-07",
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "山形は降雪・湿度など気候の影響で髪のダメージが出やすく、髪質改善トリートメントとカラーを組み合わせるニーズが高い。",
      "酸性系トリートメント（ULTOWA等）は低ダメージで山形の気候変化に対応しやすく、カラーとの相性も良い。",
      "庄内エリアではオーガニックカラー対応サロンが選択肢として有効で、頭皮敏感肌の読者への提案として機能する。",
    ],
    whatYouLearn: [
      "山形気候に合ったカラー選びの考え方",
      "酸性系トリートメントの特徴",
      "オーガニック・グレイカラーの活用場面",
    ],
    sources: [
      { title: "Beauty Park 山形市 カラー", url: "https://www.beauty-park.jp/yamagata/yamagata-shi/", sourceType: "editorial", collectedAt, note: "山形市カラー人気サロンとメニュー傾向を確認。" },
      { title: "ヘアログ 山形市 人気美容室", url: "https://hairlog.jp/yamagata/C6201", sourceType: "local-media", collectedAt, note: "山形の人気スタイルとトレンドを確認。" },
      { title: "庄内コンシェルジュ 美容室", url: "https://shonai-yamagata.com/beauty-health/beauty-salon/search/", sourceType: "local-media", collectedAt, note: "庄内エリアのサロン情報として確認。" },
    ],
    faqs: [
      { question: "山形の冬は髪にダメージが出やすいですか？", answer: "はい。乾燥した冬の寒さと暖房による室内乾燥、雪道での帽子着用による摩擦などが積み重なります。保湿系トリートメントや洗い流さないオイルの定期使用がおすすめです。" },
      { question: "カラーと縮毛矯正は同日にできますか？", answer: "技術的には可能な場合もありますが、髪へのダメージが大きくなるため多くのサロンでは別日を推奨しています。最低でも2週間の間隔を空けるのが一般的です。" },
    ],
    relatedSlugs: ["yamagata-beauty-salon-guide"],
  },
];
