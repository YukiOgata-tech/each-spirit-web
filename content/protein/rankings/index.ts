import type { ProteinRanking, Source } from "@/lib/types";

const collectedAt = "2026-06-08";
const src = (title: string, url: string, sourceType: Source["sourceType"], note: string): Source => ({
  title, url, sourceType, collectedAt, note,
});

export const proteinRankings: ProteinRanking[] = [
  {
    slug: "protein-ranking-women",
    target: "women",
    title: "女性向けおすすめプロテイン ランキング",
    description: "ダイエット・美容・健康維持を目的とする女性向けに、低カロリー・飲みやすさ・人工甘味料の有無・味のラインナップを軸に評価した実データランキング。",
    criteria: ["1食あたりのカロリー（低いほど高評価）", "脂質の少なさ", "人工甘味料不使用かどうか", "フレーバーの豊富さと飲みやすさ", "コスパ（1kg換算価格）"],
    conclusion: "ダイエット重視・人工甘味料が気になる女性にはULTORA、飲みやすさ重視にはVALX、コスパ重視ならGronGが最有力候補。",
    quickTableLabel: "女性向けプロテイン 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        productSlug: "ultora-whey-diet",
        score: 95,
        reason: "人工甘味料不使用・低脂質（1.5g/食）・10種類のフレーバー（抹茶ラテ・ほうじ茶ラテ・黒ゴマきな粉など和風フレーバー含む）と女性向けの条件を最もバランスよく満たす。楽天総合1位実績が口コミの信頼性を裏付けている。",
      },
      {
        rank: 2,
        productSlug: "valx-whey-wpc",
        score: 88,
        reason: "1食116kcal・脂質1.7gと低カロリー設計で「アーモンドとうふ」など個性的フレーバーが女性に好評。山本義徳氏監修の信頼感と飲みやすさへのこだわりが他社との差別化ポイント。",
      },
      {
        rank: 3,
        productSlug: "grong-whey-standard",
        score: 82,
        reason: "低糖質（2.5g/食）・国内製造・11種ビタミン配合と機能面が充実。1kg¥4,480と女性でも継続しやすい価格帯。ナチュラル（無味）でスムージーに混ぜる用途にも対応。",
      },
      {
        rank: 4,
        productSlug: "savas-whey-100",
        score: 76,
        reason: "ドラッグストアで買えるアクセスの良さと明治グループの安心感が女性初心者に支持される。ビタミンB群・C・D配合で美容サポートも期待できる。",
      },
      {
        rank: 5,
        productSlug: "finelab-whey-wpi",
        score: 71,
        reason: "脂質0.3g・炭水化物0.1gという極限の低脂質・低糖質はダイエット追い込み期に最適。乳糖が少ないためお腹が弱い女性にも向きやすい。ただし価格は高め。",
      },
    ],
    sources: [
      src("ULTORA ホエイダイエットプロテイン 公式", "https://ultora.co.jp/", "official", "栄養成分・人工甘味料不使用・フレーバーを確認。"),
      src("VALX ホエイプロテイン 公式", "https://shop.valx.jp/", "official", "栄養成分・フレーバーを確認。"),
      src("楽天総合ランキング プロテイン", "https://www.rakuten.co.jp/", "local-media", "楽天での口コミ・ランキング実績を確認。"),
    ],
    faqs: [
      { question: "女性はプロテインを飲みすぎると太りますか？", answer: "プロテイン自体は高タンパク・低脂質の食品ですが、摂りすぎると総カロリーオーバーになります。1日の食事でのタンパク質量に合わせて補う形で使えば太ることはありません。目安は1日1〜2食分（20〜40g程度）のプロテイン補給です。" },
      { question: "生理中でもプロテインを飲んでいいですか？", answer: "はい。プロテインは食事の一部として問題ありません。ただし人によっては胃腸の調子が変わる時期なので、体調に合わせて量を調整してください。" },
    ],
  },
  {
    slug: "protein-ranking-men",
    target: "men",
    title: "男性向けおすすめプロテイン ランキング",
    description: "筋肥大・体力向上を目的とする男性向けに、1食あたりのタンパク質量・コスパ・品質・継続しやすさを軸に評価した実データランキング。",
    criteria: ["1食あたりのタンパク質量（多いほど高評価）", "コスパ（1kg換算価格）", "溶けやすさ・飲みやすさ", "大容量サイズの有無", "信頼性・実績"],
    conclusion: "品質最優先ならON Gold Standard、コスパ重視ならMyprotein（セール時）またはGronG、バランス重視ならVALXが最有力候補。",
    quickTableLabel: "男性向けプロテイン 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        productSlug: "on-gold-standard-whey",
        score: 93,
        reason: "1食24g・脂質わずか1gとタンパク質効率が最高水準。WPI主体でBCAA 5.5g含有、世界的実績で信頼性も抜群。筋肥大を本気で取り組む男性への最有力推薦。コストコで2.88kgを¥12,280で入手すると1kg換算¥4,264になる。",
      },
      {
        rank: 2,
        productSlug: "myprotein-impact-whey",
        score: 89,
        reason: "セール時の1kg換算¥2,000台は業界最安クラス。1食21gのタンパク質とフレーバー50種以上で毎日継続できる。大量摂取が必要なバルクアップ期のコスト管理に最適。",
      },
      {
        rank: 3,
        productSlug: "grong-whey-standard",
        score: 83,
        reason: "国内製造・1食22.3gのタンパク質・3kg購入で1kg換算¥3,993と国産ブランド中最高のコスパ。低糖質設計でバルクアップ・減量どちらの目的にも使いやすい。",
      },
      {
        rank: 4,
        productSlug: "dns-whey-100",
        score: 78,
        reason: "国内食品工場製造・合成着色料不使用・1食24.2gの高タンパクで品質重視の男性向け。「水だけで美味しく溶ける」設計がトレーニング後の利便性を高める。",
      },
      {
        rank: 5,
        productSlug: "kentai-powerbody-whey",
        score: 73,
        reason: "2.3kgで¥7,400（1kg換算¥3,217）は国産ブランド最安クラス。ビタミン・ミネラル豊富でサプリを別途購入する必要がなく、長期コスト管理に優れる。",
      },
    ],
    sources: [
      src("Optimum Nutrition Gold Standard 公式JP", "https://www.optimumnutrition.com/ja-jp/", "official", "栄養成分・価格を確認。"),
      src("Myprotein JP 公式", "https://www.myprotein.jp/", "official", "セール価格・栄養成分を確認。"),
      src("GronG 公式", "https://shop.grong.jp/", "official", "栄養成分・価格を確認。"),
    ],
    faqs: [
      { question: "筋肉をつけるには1日何gのプロテインが必要ですか？", answer: "筋肥大を目的とする場合、体重1kgあたり1.6〜2.2gのタンパク質摂取が推奨されています（例: 体重70kgで112〜154g/日）。食事からのタンパク質に加えてプロテインで不足分を補う形が効率的です。" },
      { question: "トレーニング後すぐに飲まないといけませんか？", answer: "「ゴールデンタイム（30分以内）」は以前ほど重視されなくなっています。1日を通じた総タンパク質量の方が重要です。ただしトレーニング後1〜2時間以内に摂取することが一般的な目安として推奨されています。" },
    ],
  },
  {
    slug: "protein-ranking-trainer",
    target: "trainer",
    title: "トレーナー・上級者向けおすすめプロテイン ランキング",
    description: "競技パフォーマンスと体組成管理を追求するトレーナー・アスリート向けに、WPI純度・BCAA含有量・脂質の少なさ・信頼性を軸に評価した実データランキング。",
    criteria: ["WPI純度・タンパク質含有率", "脂質・炭水化物の少なさ", "BCAA含有量", "成分の透明性・信頼性", "大量摂取時のコスト管理"],
    conclusion: "純度・品質最優先ならON Gold StandardまたはファインラボWPI、大量消費のコスト管理ならMyprotein（大容量セール時）、国産重視ならDNSが最有力。",
    quickTableLabel: "トレーナー・上級者向けプロテイン 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        productSlug: "on-gold-standard-whey",
        score: 96,
        reason: "WPI主体の高純度配合・BCAA 5.5g・グルタミン4g含有と競技・ボディメイクに必要な成分が揃う。世界累計売上No.1クラスの信頼性と豊富なエビデンスが上級者に選ばれ続ける理由。コストコ購入で1kg換算¥4,264と比較的入手しやすい。",
      },
      {
        rank: 2,
        productSlug: "finelab-whey-wpi",
        score: 90,
        reason: "CFM製法WPIの脂質0.3g・炭水化物0.1g/食という数値はコンテスト前の体組成管理に最適。乳糖少なく消化吸収効率が高い。減量期の厳格な食事管理中にも使いやすい。",
      },
      {
        rank: 3,
        productSlug: "myprotein-impact-whey",
        score: 84,
        reason: "5kgサイズが選べるため大量消費する上級者のコスト管理に対応。セール時の1kg¥2,000台は毎日大量摂取しても費用を抑えられる。WPCのため純度よりボリューム重視のバルクアップ期に特に有効。",
      },
      {
        rank: 4,
        productSlug: "dns-whey-100",
        score: 78,
        reason: "国内食品工場製造・合成着色料不使用の品質基準が競技者の信頼を得ている。1食24.2gの高タンパクと8種フレーバーで長期使用中も継続しやすい。",
      },
      {
        rank: 5,
        productSlug: "kentai-powerbody-whey",
        score: 70,
        reason: "2.3kgの大容量・1kg換算¥3,217でビタミン・ミネラルも豊富。体重管理よりも筋力増強を重視する競技者で、コスト効率を優先したい場合の選択肢。",
      },
    ],
    sources: [
      src("Optimum Nutrition Gold Standard 公式", "https://www.optimumnutrition.com/ja-jp/", "official", "栄養成分・BCAA含有量を確認。"),
      src("ファイン・ラボ WPI 公式", "https://www.fine-lab.com/wpi-product-page", "official", "CFM製法・栄養成分を確認。"),
    ],
    faqs: [
      { question: "WPIとWPCはどちらが筋肉増量に効果的ですか？", answer: "筋肉増量効果においては吸収されるアミノ酸量が重要で、WPI・WPCとも必須アミノ酸を十分含んでいます。WPIは脂質・乳糖が少なく消化吸収が早いため、カロリー管理が厳しい減量期・コンテスト前に優位性があります。" },
      { question: "コンテスト前の水分調整中でもプロテインは飲めますか？", answer: "水分調整については個人の方針・コーチの指示に従ってください。プロテインパウダー自体は水分含有量が少ないですが、溶かす水の量が増えるためその点を考慮する必要があります。" },
    ],
  },
  {
    slug: "protein-ranking-student",
    target: "student",
    title: "大学生・コスパ重視のおすすめプロテイン ランキング",
    description: "毎月の費用を抑えながら毎日続けたい大学生向けに、1kg換算価格・購入しやすさ・継続しやすい味を軸に評価した実データランキング。",
    criteria: ["1kg換算価格（安いほど高評価）", "大容量サイズの有無", "購入しやすさ（ネット・コンビニ等）", "飲みやすさ・続けやすい味", "タンパク質量のコスパ（1g単価）"],
    conclusion: "最安値はKentai（2.3kgで¥3,217/kg）、セール活用ならMyprotein、手軽に買えるならGronGまたはSAVAS。",
    quickTableLabel: "大学生・コスパ重視 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        productSlug: "kentai-powerbody-whey",
        score: 91,
        reason: "2.3kgで約¥7,400（1kg換算¥3,217）は国産ブランド中の最安クラス。ビタミン・ミネラル豊富でサプリを別途買う必要がなく、総合的な出費が抑えられる。毎日使うなら大容量一択。",
      },
      {
        rank: 2,
        productSlug: "grong-whey-standard",
        score: 87,
        reason: "3kgで¥11,980（1kg換算¥3,993）と大容量コスパ優秀。国内製造でAmazon常連上位の信頼性。フレーバーは少ないがナチュラル（無味）をスムージーに混ぜる使い方も人気。",
      },
      {
        rank: 3,
        productSlug: "myprotein-impact-whey",
        score: 84,
        reason: "セール時の1kg換算¥2,000台は全ブランド中最安クラス。フレーバー50種類以上で飽きにくく、5kgまとめ買いで長期コストを最小化できる。セール情報を把握していることが前提。",
      },
      {
        rank: 4,
        productSlug: "savas-whey-100",
        score: 75,
        reason: "コンビニ・ドラッグストアで急に必要になったときでも入手できるアクセス性が最強。価格は割高だが「まず試す1kg目」として初心者・学生が手に取りやすい国産ブランド。",
      },
      {
        rank: 5,
        productSlug: "valx-whey-wpc",
        score: 69,
        reason: "420gの小さいサイズが約¥2,500前後で「まず試してみたい」ニーズに応える。価格は高めだが飲みやすさ・美味しさで継続率が高く、最初の1本として失敗しにくい。",
      },
    ],
    sources: [
      src("Kentai パワーボディ 100%ホエイプロテイン 公式", "https://kentai.co.jp/product/protein/powerbody100whey.html", "official", "2.3kg価格・栄養成分確認。"),
      src("GronG 公式", "https://shop.grong.jp/", "official", "3kg価格確認。"),
      src("Myprotein JP 公式", "https://www.myprotein.jp/", "official", "セール価格情報確認。"),
    ],
    faqs: [
      { question: "月にどのくらいの費用がかかりますか？", answer: "1日1食（20〜30g）使用の場合、Kentai 2.3kgで約¥3,217/kgなら月約¥2,000〜¥3,000程度が目安です。週3〜5回のトレーニングに合わせて飲む場合はさらに費用を抑えられます。" },
      { question: "Amazonと公式サイトどちらで買うのがお得ですか？", answer: "商品によって異なります。MyproteinはMyprotein公式サイトのセール時が最安になることが多く、GronGはAmazonが安定して購入できます。価格比較サイトで定期的に確認することをおすすめします。" },
    ],
  },
  {
    slug: "protein-ranking-diet",
    target: "diet",
    title: "ダイエット向けおすすめプロテイン ランキング",
    description: "脂質・糖質を抑えながら筋肉を維持・増加させたい方向けに、1食あたりのカロリー・脂質量・糖質量・満腹感を軸に評価した実データランキング。",
    criteria: ["1食あたりのカロリー（低いほど高評価）", "脂質の少なさ（低いほど高評価）", "炭水化物・糖質の少なさ", "1食あたりのタンパク質量（多いほど高評価）", "飲みやすさ・置き換えとしての使いやすさ"],
    conclusion: "人工甘味料不使用で低脂質ならULTORA、極限の低脂質・低糖質ならファインラボWPI、バランス型コスパはGronGが最有力候補。",
    quickTableLabel: "ダイエット向けプロテイン 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        productSlug: "ultora-whey-diet",
        score: 94,
        reason: "1食117kcal・脂質1.5g・タンパク質22.6gとダイエットの三条件を最高バランスで満たす。人工甘味料不使用・和風フレーバー豊富で継続しやすく、楽天1位実績も信頼感を裏付ける。",
      },
      {
        rank: 2,
        productSlug: "finelab-whey-wpi",
        score: 90,
        reason: "1食76kcal・脂質0.3g・炭水化物0.1gという数値はダイエット用途で国内最高水準。カロリー収支の厳格な管理期・停滞突破期に特に有効。乳糖が少なくお腹が弱い方にも向きやすい。",
      },
      {
        rank: 3,
        productSlug: "grong-whey-standard",
        score: 82,
        reason: "1食118kcal・糖質2.5g・タンパク質22.3gと低糖質かつタンパク質量が多い。1kg¥4,480のコスパで継続しやすく、ダイエットの長期戦に向く。",
      },
      {
        rank: 4,
        productSlug: "valx-whey-wpc",
        score: 78,
        reason: "1食116kcal・脂質1.7gとダイエット向けの低カロリー設計。美味しさ・飲みやすさが高くストレスなく続けられ、ダイエット中のモチベーション維持に貢献する。",
      },
      {
        rank: 5,
        productSlug: "on-gold-standard-whey",
        score: 73,
        reason: "脂質わずか1g/食はダイエット中の脂質管理に優れる。1食119kcal・タンパク質24gと効率も高い。減量と筋肉維持を同時に追う身体づくり中間期に適した選択。",
      },
    ],
    sources: [
      src("ULTORA 公式", "https://ultora.co.jp/", "official", "栄養成分・人工甘味料不使用を確認。"),
      src("ファイン・ラボ WPI 公式", "https://www.fine-lab.com/wpi-product-page", "official", "脂質・炭水化物の極小値を確認。"),
    ],
    faqs: [
      { question: "ダイエット中にプロテインを飲むと筋肉は落ちにくくなりますか？", answer: "はい。ダイエット中はカロリー不足になりがちで、筋肉がエネルギーとして分解されやすくなります。十分なタンパク質（体重×1.2〜1.6g/日）を摂ることで筋肉量を維持しながら脂肪を落としやすくなります。" },
      { question: "置き換えダイエットとしてプロテインを使えますか？", answer: "食事の1食をプロテインに置き換えてカロリーを抑える方法は可能ですが、栄養バランスが偏るリスクがあります。完全置き換えより、食事の量を抑えながら食後や間食にプロテインでタンパク質を補う方が継続しやすく健康的です。" },
    ],
  },
  {
    slug: "protein-ranking-beginner",
    target: "beginner",
    title: "プロテイン初心者向けおすすめランキング",
    description: "プロテインを初めて飲む方向けに、入手しやすさ・飲みやすさ・わかりやすさ・サポートの充実度を軸に評価した実データランキング。",
    criteria: ["購入のしやすさ（コンビニ・ドラッグストア・ネット）", "飲みやすさ・溶けやすさ", "日本語サポートの充実度", "失敗しにくい価格帯（まず試せる）", "添加物の少なさ・安心感"],
    conclusion: "「今すぐ試せる」ならSAVAS（ドラッグストア）、「ネット購入で安く始めたい」ならGronGまたはVALX、「飲みやすさ最優先」ならVALXが最有力候補。",
    quickTableLabel: "初心者向けプロテイン 早見表",
    lastUpdatedAt: collectedAt,
    items: [
      {
        rank: 1,
        productSlug: "savas-whey-100",
        score: 92,
        reason: "ドラッグストア・コンビニ・Amazonで即日入手可能な圧倒的アクセス性。明治グループの日本語サポートと国産の安心感が初心者の不安を払拭する。ビタミン配合で「プロテイン+サプリ」の一石二鳥も魅力。",
      },
      {
        rank: 2,
        productSlug: "valx-whey-wpc",
        score: 87,
        reason: "飲みやすさ・美味しさへの高評価が初回の「プロテインは飲みにくい」先入観を覆す。420gの小さいサイズで¥2,500前後から試せ、失敗時のダメージが小さい。",
      },
      {
        rank: 3,
        productSlug: "grong-whey-standard",
        score: 83,
        reason: "Amazon常連上位のGronGは1kg¥4,480と手を出しやすい価格帯。レビュー数が多く「他の人がどう使っているか」を参照しながら選べる安心感がある。",
      },
      {
        rank: 4,
        productSlug: "myprotein-impact-whey",
        score: 77,
        reason: "50種類以上のフレーバーが「自分の好きな味を見つけられる」メリットに。初めてでも好みのフレーバーで続けられる可能性が高い。セール時の価格は初心者でも始めやすいコスパ。",
      },
      {
        rank: 5,
        productSlug: "dns-whey-100",
        score: 70,
        reason: "スポーツ専門店での取り扱いが多く、店員に相談しながら選べる環境が整っている。「水だけで美味しく溶ける」設計が初心者の「上手く溶かせない」悩みを解消する。",
      },
    ],
    sources: [
      src("ザバス ホエイプロテイン100 明治公式", "https://www.meiji.co.jp/sports/savas/products/built_powered/whey100.html", "official", "入手経路・栄養成分を確認。"),
      src("VALX 公式", "https://shop.valx.jp/", "official", "420gサイズ・フレーバーを確認。"),
      src("GronG 公式", "https://shop.grong.jp/", "official", "価格・入手方法を確認。"),
    ],
    faqs: [
      { question: "プロテインはいつ飲めばいいですか？", answer: "最も一般的なのは「トレーニング後30分〜1時間以内」です。ただし1日の総タンパク質量の方が重要なので、トレーニングがない日でも起床後や間食のタイミングで飲む方法もあります。まずは1日1回、続けやすいタイミングから始めましょう。" },
      { question: "水と牛乳どちらで溶かすのがいいですか？", answer: "水で溶かすと低カロリー・素早く飲める。牛乳で溶かすとタンパク質量・カルシウムが増えて風味がマイルドになります。ダイエット目的なら水、筋肉増量目的なら牛乳がおすすめです。まずは水で飲んで味を確認するのが一般的です。" },
    ],
  },
];
