import { editorAuthor } from "@/content/site";
import type { Article } from "@/lib/types";

const collectedAt = "2026-06-07";

export const beautyArticles: Article[] = [
  {
    slug: "niigata-beauty-salon-guide",
    title: "新潟の美容室を年代・施術・エリアで選ぶガイド",
    description:
      "新潟市内・長岡市の美容室を年代別ニーズ、施術内容、エリアの3軸で整理。初めて行く美容室をどう選ぶか、カウンセリング前に準備すべきことを具体的にまとめます。",
    category: "美容室",
    tags: ["新潟", "美容室", "選び方", "年代別", "カラー", "ヘッドスパ"],
    publishedAt: "2026-06-07",
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "年代ごとに「トレンドカラー重視」「白髪ケア重視」「子連れ対応」など優先ポイントが異なるため、まず自分の主要ニーズを絞ることが失敗を減らす。",
      "施術の種類（カラー・ヘッドスパ・パーマ等）ごとに得意なサロンが異なるため、施術内容で絞ってからエリアで絞る順序が効率的。",
      "Each Spiritの美容室カードには参照ソースと確認日を掲載するが、営業時間・価格は変更されるため訪問前に公式情報を確認してください。",
    ],
    whatYouLearn: [
      "年代別の美容室選びのポイント",
      "施術内容で候補を絞る方法",
      "カウンセリング前の準備と確認事項",
    ],
    markdownFile: "niigata-beauty-salon-guide.md",
    sources: [
      { title: "ホットペッパービューティー 新潟", url: "https://beauty.hotpepper.jp/svcSH/macHA/salon/", sourceType: "local-media", collectedAt, note: "新潟市内の各施術カテゴリの人気サロン傾向を確認。" },
      { title: "楽天ビューティ 新潟市 口コミ", url: "https://beauty.rakuten.co.jp/addr15101/sort4/", sourceType: "local-media", collectedAt, note: "口コミ数・評価の高いサロン傾向を確認。" },
      { title: "Beauty Park 新潟 2026年最新", url: "https://www.beauty-park.jp/niigata/niigata/", sourceType: "editorial", collectedAt, note: "2026年版 新潟人気ヘアサロン動向を確認。" },
    ],
    faqs: [
      { question: "初めての美容室で何を伝えればいいですか？", answer: "希望のスタイル・長さ・カラーのイメージ写真を準備しておくと伝わりやすいです。また「やりたくないこと」「普段のセット習慣」「ライフスタイル（職場ルール等）」も伝えると、現実に合った提案が受けられます。" },
      { question: "施術前のカウンセリングはどのくらい時間をかけますか？", answer: "初回は5〜15分程度が一般的です。プライベートサロンでは30分近くかける場合もあります。じっくり相談したい場合は予約時にその旨を伝えると時間を確保してもらいやすいです。" },
    ],
    relatedSlugs: ["niigata-hair-color-guide"],
  },
  {
    slug: "niigata-hair-color-guide",
    title: "新潟でヘアカラーを選ぶ前に知りたいこと",
    description:
      "イルミナカラー・アディクシーカラー・バレイヤージュ・髪質改善の違いと費用感を整理。「どのカラーが自分に合うか」を判断するための基礎知識をまとめます。",
    category: "美容室",
    tags: ["カラー", "イルミナカラー", "バレイヤージュ", "髪質改善", "新潟", "ヘアカラー"],
    publishedAt: "2026-06-07",
    updatedAt: collectedAt,
    author: editorAuthor,
    summary: [
      "イルミナカラーはツヤと透明感、アディクシーカラーは赤みゼロの透明感に強い。用途の違いを把握してサロン選びの参考にできる。",
      "バレイヤージュ・ハイライトはブリーチを使うため費用とダメージが増えるが、ケアブリーチで軽減できるサロンがある。",
      "髪質改善トリートメント（TOKIO・オージュア等）との組み合わせで、カラーダメージを補いながら質感を整えることが今のトレンド。",
    ],
    whatYouLearn: [
      "主要カラー薬剤の特徴と向き不向き",
      "ブリーチ系カラーのリスクと対策",
      "カラーとトリートメントの費用目安",
    ],
    markdownFile: "niigata-hair-color-guide.md",
    sources: [
      { title: "ホットペッパービューティー 新潟 カラー人気", url: "https://beauty.hotpepper.jp/genre/gkw008/pre15/city15100001/", sourceType: "local-media", collectedAt, note: "新潟市カラー人気サロンとメニュー傾向を確認。" },
      { title: "Beauty Park 新潟 カラー特集", url: "https://www.beauty-park.jp/niigata/niigata/color/", sourceType: "editorial", collectedAt, note: "カラー施術人気サロンのメニュー情報を参考。" },
      { title: "ヘアログ 新潟 人気美容室", url: "https://hairlog.jp/niigata/", sourceType: "local-media", collectedAt, note: "新潟の人気スタイルとカラートレンドを確認。" },
    ],
    faqs: [
      { question: "カラーは何ヶ月に1回がベストですか？", answer: "全体カラーは2〜3ヶ月に1回が一般的な目安です。ただしデザインカラー（バレイヤージュ等）は伸びても自然に見えるため間隔を長くできる場合があります。根元が気になるリタッチだけなら1〜2ヶ月が多いです。" },
      { question: "ダメージが心配な場合はどう伝えればいいですか？", answer: "「できるだけ傷みを抑えながら色を入れたい」と明確に伝えるのが一番です。ケアブリーチや低ダメージ薬剤を使っている旨をカウンセリングで確認してから施術を決めるのがおすすめです。" },
    ],
    relatedSlugs: ["niigata-beauty-salon-guide"],
  },
];
