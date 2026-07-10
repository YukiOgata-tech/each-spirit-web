# Google AdSense 申請前チェックリスト

## 基本方針

個別の広告ユニット（`AdUnit` コンポーネント、記事本文・アイテム/ランキング詳細への設置）は AdSense **承認後**に着手する。サイト確認用スクリプトと `ads.txt` は申請ステップの一部として先行導入済み。

**ステータス（2026-07-10）**: Vercel の Production 環境変数に `NEXT_PUBLIC_ADSENSE_CLIENT_ID` を追加し再デプロイ、`each-spirit.com` 本番で確認用スクリプトの出力を確認済み。AdSense へ審査をリクエスト済み（結果待ち）。

## 済んでいる項目

- **コンテンツ量**: Supabase `es` スキーマで記事45件・アイテム578件・ランキング58件（公開分、2026-07-10時点）。量は十分。
- **必須ページ**: `about`（運営者情報・編集方針）・`contact`・`disclaimer`（免責事項）・`privacy`（プライバシーポリシー）が揃っている。`about` はペンネーム運営だが体制・編集方針を具体的に開示済み。
- **robots.txt / sitemap.xml**: `app/robots.ts` / `app/sitemap.ts` で整備済み。
- **独自ドメイン**: `each-spirit.com` で運用中。
- **GA4**: `components/seo/GoogleAnalytics.tsx` で導入済み。
- **プライバシーポリシー**: GA4稼働の実態反映、第三者配信広告（Cookie・パーソナライズ広告・オプトアウト案内）に関するセクションを追加済み（`app/privacy/page.tsx`、2026-07-10更新）。
- **広告・PRの開示**: `app/disclaimer/page.tsx` セクション4で広告・PR・アフィリエイト全般を開示済み（AdSense導入後も文言変更不要）。
- **占い・診断のエンタメ性明記**: `disclaimer` セクション6で「占い・診断はエンターテインメント目的」と明記済み。
- **AdSense 確認用スクリプト**: publisher ID `ca-pub-3927353202195333` を `NEXT_PUBLIC_ADSENSE_CLIENT_ID` として `.env.local` / `.env.example` に追加し、`components/seo/GoogleAdSense.tsx`（`GoogleAnalytics.tsx` と同パターン、env未設定なら非表示）を `app/layout.tsx` に組み込み済み（2026-07-10）。
- **`public/ads.txt`**: 同 publisher ID で `google.com, pub-3927353202195333, DIRECT, f08c47fec0942fa0` を設置済み（2026-07-10）。

## 申請前に運営者側で確認・判断してほしい項目（コードからは確認不可）

- サイトの運用実績期間（新規サイトより、一定期間運用された実績あるサイトの方が通りやすい傾向）
- 直近のトラフィック状況・検索流入の有無
- 各記事の文字数・独自性のばらつき（極端に薄い記事が多くないか）
- 各section・item・rankingページ単体で見たときに「広告を貼るに値するコンテンツ量」があるか（汎用ページ・item数の少ないsectionは特に確認）

## 承認後の作業（次フェーズ）

1. 承認後、広告ユニットの設置（ヒアリング済み、設置面は「記事詳細 + アイテム/ランキング詳細」）:
   - `components/articles/ArticleDetailPage.tsx`: 本文（`MarkdownRenderer`）後、`AffiliateSurface`（`placement="article_body"`）付近
   - `components/detail/ItemDetail.tsx`: `{Layout(ctx)}` と `AffiliateSurface`（`placement="item_detail"`）の間、または後
   - `components/generic/GenericSectionPages.tsx` の `GenericRankingDetailPage`: `AffiliateSurface`（L532付近）前後
   - アフィリエイトカードと視覚的に区別できるデザインにし、レイアウトシフト対策として最小高さを確保する
4. 将来的に記事本文中の任意位置に広告を挿入したい場合は、`components/cards/MarkdownRenderer.tsx` の `:::affiliate-card` ディレクティブ（`parseDirective` / `parseFields`）と同じ仕組みで `:::ad-slot` を追加できる（今回は見送り）
