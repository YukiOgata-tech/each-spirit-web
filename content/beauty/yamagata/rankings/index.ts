import type { Ranking, Source } from "@/lib/types";

const collectedAt = "2026-06-08";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string): Source => ({
  title, url, sourceType, collectedAt, note,
});

export const beautyRankings: Ranking[] = [
  {
    slug: "yamagata-beauty-by-age",
    title: "【年代別】山形おすすめ美容室ランキング",
    description: "10代〜50代の年代ごとに、ニーズ・施術内容・価格帯・利便性を軸に評価した山形県美容室ランキング。実在するサロンの公開情報をもとに編集部が整理しています。",
    criteria: [
      "年代別ニーズへの対応力",
      "価格帯と年代のマッチング",
      "アクセス・駐車場などの利便性",
      "公開されている口コミ・予約サイト掲載情報",
      "営業時間・定休日の利用しやすさ",
    ],
    conclusion: "30〜50代の白髪・カット重視にはHAIR DESIGN BUCOまたはBaker Street、20〜30代のカラー重視にはREM山形2号店、コスパ重視の鶴岡エリアならAgu鶴岡東原店、天童市在住ならLAFUCONA。",
    quickTableLabel: "年代別おすすめ美容室 早見表（山形）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "hair-design-buco",
        score: 88,
        reason: "イルミナカラーとドライカット技術の組み合わせで30〜50代女性のカット・カラーニーズを高水準で満たす。カット¥4,950〜・カット+イルミナ¥12,650〜と価格は高めだが品質評価が高く、駐車場完備で車移動も問題ない。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "rem-yamagata-2",
        score: 84,
        reason: "イルミナカラー・アディクシーカラー・TOKIOトリートメント・酸熱トリートメントと20〜30代のカラー＋ケアニーズを総合的にカバー。バス停「大学病院」から徒歩1分のアクセスの良さも評価ポイント。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "baker-street-yamagata",
        score: 80,
        reason: "完全予約制でカウンセリングを重視した似合わせカット専門サロン。七日町という中心地に専用駐車場3台完備。新規¥3,000〜と比較的入りやすく、30〜50代の「ゆっくり相談したい」ニーズに応える。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "agu-navy-tsuruoka",
        score: 75,
        reason: "カット¥2,500〜・カット+カラー¥3,900〜と庄内エリアで最も入りやすい価格帯。年中無休夜21時まで営業・駐車場7〜8台で10〜40代まで幅広く対応。鶴岡在住者の定番サロンとして定着している。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "earth-sakata",
        score: 68,
        reason: "全国チェーンの安定した品質で、酒田市内で年中無休の選択肢として機能する。料金・詳細メニューは公式サイトまたはホットペッパービューティーで確認が必要だが、チェーンとしての信頼感が強み。",
        isPr: false,
      },
    ],
    sources: [
      src("HAIR DESIGN BUCO 公式サイト", "https://hairdesign-buco.com/", "official", "住所・電話・営業時間・料金確認。"),
      src("REM 山形2号店 ホットペッパービューティー", "https://beauty.hotpepper.jp/slnH000477049/", "local-media", "得意施術・口コミ確認。"),
      src("Beauty Park 山形市 2026年最新", "https://www.beauty-park.jp/yamagata/yamagata-shi/", "editorial", "山形市内人気サロン掲載確認。"),
    ],
    faqs: [
      { question: "このランキングはどのような基準で選んでいますか？", answer: "ホットペッパービューティー・各公式サイト・楽天ビューティーなどに公開されている情報をもとに編集部が整理しています。実際の施術品質は訪問前に口コミや予約サイトで最新情報をご確認ください。" },
      { question: "山形市内と庄内（鶴岡・酒田）どちらのサロンを選ぶべきですか？", answer: "お住まいのエリアに近い方が通いやすいです。特定の施術（カラー品質重視など）が目的であれば、山形市内のサロンまで遠征する価値もあります。" },
    ],
  },
  {
    slug: "yamagata-beauty-color",
    title: "【カラー・髪質改善】山形おすすめ美容室ランキング",
    description: "イルミナカラー・アディクシーカラー・酸熱トリートメント・TOKIOトリートメントを得意とするサロンを、公開情報をもとに評価した山形版ランキング。",
    criteria: [
      "カラー薬剤の種類と対応メニューの幅",
      "髪質改善メニューの有無（TOKIO・酸熱等）",
      "口コミ・予約サイトでの評価",
      "アクセス・利便性",
      "価格帯の適正感",
    ],
    conclusion: "イルミナ+TOKIOトリートメントの組み合わせが充実したREM山形2号店、イルミナカラーの品質で定評のあるHAIR DESIGN BUCOが山形市内のカラー重視層への最有力候補。",
    quickTableLabel: "カラー・髪質改善 早見表（山形）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "rem-yamagata-2",
        score: 93,
        reason: "イルミナカラー・アディクシーカラー・TOKIOトリートメント・酸熱トリートメントが揃い、カラーとケアの組み合わせメニューが最も充実している山形市内のサロン。ホットペッパービューティーでのランキング上位掲載が信頼感を裏付けている。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "hair-design-buco",
        score: 86,
        reason: "イルミナカラーのドライカットとの組み合わせが特徴で、カット+イルミナカラー¥12,650〜と明確な料金設定がある。30〜50代の白髪も含めたカラー相談ができる点が評価される。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "agu-navy-tsuruoka",
        score: 76,
        reason: "カット+カラー¥3,900〜と庄内エリアで最もコスパが高いカラーサロン。年中無休で夜21時まで営業と継続利用しやすい環境が整っている。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "earth-tsuruoka",
        score: 70,
        reason: "全国チェーンの安定したカラーメニューが強み。鶴岡市内で初めてカラーを試したい読者への安心候補として機能する。詳細料金は公式サイトで要確認。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "earth-sakata",
        score: 65,
        reason: "酒田市内でカラーとパーマを年中無休で対応するチェーンサロン。庄内エリアの酒田在住読者向けのカラー選択肢として紹介できる。",
        isPr: false,
      },
    ],
    sources: [
      src("REM 山形2号店 ホットペッパービューティー", "https://beauty.hotpepper.jp/slnH000477049/", "local-media", "得意施術・口コミ確認。"),
      src("HAIR DESIGN BUCO 公式サイト", "https://hairdesign-buco.com/", "official", "料金・施術内容確認。"),
      src("Agu hair navy 鶴岡東原店 Agu公式サイト", "https://agu-hair.com/salon/2047/", "official", "料金・メニュー確認。"),
    ],
    faqs: [
      { question: "山形でTOKIOトリートメントを受けられるサロンはどこですか？", answer: "REM 山形2号店がTOKIOトリートメント・酸熱トリートメントに対応していることが確認されています。電話023-626-5133または予約サイトでご確認ください。" },
      { question: "イルミナカラーと酸熱トリートメントは同日にできますか？", answer: "多くの場合で対応可能ですが施術時間が長くなります。予約時に希望メニューをお伝えください。" },
    ],
  },
  {
    slug: "yamagata-beauty-headspa",
    title: "【ヘッドスパ・トリートメント】山形おすすめ美容室ランキング",
    description: "ヘッドスパ・トリートメント・ケア系施術を得意とするサロンを公開情報をもとに評価した山形版ランキング。詳細は各サロンの最新情報をご確認ください。",
    criteria: [
      "トリートメント・ケアメニューの充実度",
      "口コミ・予約サイトでの評価",
      "駐車場・アクセスなどの利便性",
      "価格帯の適正感",
      "営業時間・定休日の利用しやすさ",
    ],
    conclusion: "酸熱トリートメントとTOKIOが揃うREM山形2号店がトリートメント重視の山形市内最有力候補。ヘッドスパ専門性はBSRプレスで山形市内のサロンを調査してから選ぶことをすすめます。",
    quickTableLabel: "ヘッドスパ・トリートメント 早見表（山形）",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        itemSlug: "rem-yamagata-2",
        score: 88,
        reason: "TOKIOトリートメント・酸熱トリートメントが揃い、カラー後のケアとして活用できる。ホットペッパービューティーで山形市ランキング上位に掲載されており、トリートメント系の信頼性が高い。",
        isPr: false,
      },
      {
        rank: 2,
        itemSlug: "hair-design-buco",
        score: 78,
        reason: "トリートメントメニューへの対応とイルミナカラーの組み合わせが30〜50代のケア重視層に向く。駐車場完備で通いやすい環境も評価ポイント。",
        isPr: false,
      },
      {
        rank: 3,
        itemSlug: "baker-street-yamagata",
        score: 70,
        reason: "完全予約制でカウンセリングを重視するため、頭皮や髪の状態に合わせた提案を受けやすい。七日町の駐車場完備サロンとして30〜50代のゆっくり相談したい層に向く。",
        isPr: false,
      },
      {
        rank: 4,
        itemSlug: "agu-navy-tsuruoka",
        score: 62,
        reason: "鶴岡エリアでトリートメントを含む基本ケアメニューに対応。コスパが良く年中無休で、庄内エリアでのトリートメント利用の入門として使いやすい。",
        isPr: false,
      },
      {
        rank: 5,
        itemSlug: "lafucona-tendo",
        score: 55,
        reason: "天童市在住で近くのサロンを探している読者向け。詳細メニューは公式サイト（lafucona.com）または電話（023-674-9447）で要確認。",
        isPr: false,
      },
    ],
    sources: [
      src("REM 山形2号店 ホットペッパービューティー", "https://beauty.hotpepper.jp/slnH000477049/", "local-media", "トリートメントメニュー確認。"),
      src("BSRプレス 山形でヘッドスパするならここ", "https://www.bestsalonreport.jp/press/67294/", "editorial", "山形ヘッドスパおすすめサロン取材記事として参考。"),
      src("楽天ビューティ 山形市 口コミ", "https://beauty.rakuten.co.jp/addr06201/sort4/", "local-media", "山形市口コミ高評価サロン確認。"),
    ],
    faqs: [
      { question: "山形でヘッドスパを専門に扱うサロンはどこですか？", answer: "ヘッドスパ専門性についてはBSRプレスの取材記事（bestsalonreport.jp/press/67294/）が参考になります。また各サロンへの電話確認が最も確実です。" },
      { question: "トリートメントはどのくらいの頻度で通うのが良いですか？", answer: "月1〜2回が一般的な目安です。髪の状態や施術の種類によって変わるため、サロンのスタイリストにご相談ください。" },
    ],
  },
];
