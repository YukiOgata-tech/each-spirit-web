# アフィリエイト収益化方針

## 基本方針

each-spirit のアフィリエイトは、商品ごとに多数のリンクを手作業管理せず、まずは各プラットフォームの検索リンクテンプレートを使う。

- `affiliate_platforms`: Amazon / 楽天 / Yahoo / 旅行予約 / ASP などの少数マスタ
- `affiliate_targets`: item / article / ranking / section ごとの検索語、開示文、公開状態
- `affiliate_links`: 売れ筋や特定案件だけ個別URL・バナー・本文リンクを上書き登録

## 運用イメージ

商品・宿・店舗側には、原則として `affiliate_query` を持たせる。

例:

```text
affiliate_query = "SAVAS ホエイプロテイン100"
```

表示側で以下のような CTA を自動生成する。

```text
Amazonで探す
楽天で探す
Yahoo!で探す
```

特定の商品・宿・広告主だけ個別URLにしたい場合は `affiliate_links` に登録する。

## 表示ルール

- アフィリエイトリンクには `rel="sponsored nofollow noopener noreferrer"` を付ける。
- ページ内に「このページにはアフィリエイトリンクを含みます。」を表示する。
- ランキング順位や編集評価と広告出稿は混同しない。
- PR / 広告 / スポンサー枠は読者に分かる形で明示する。

## 実装済みの表示面

- `components/affiliate/AffiliateSurface.tsx`: article / item / ranking で使う共通表示。
- `components/affiliate/AffiliateClickLink.tsx`: 外部遷移と GA4 `affiliate_click` 計測。
- `components/affiliate/AffiliateMarkdownCard.tsx`: Markdown本文中の `:::affiliate-card` 表示。
- `lib/affiliate/resolve.ts`: `affiliate_targets` / `affiliate_platforms` / `affiliate_links` から表示リンクを解決。
- `lib/affiliate/rakuten.ts`: 楽天市場商品検索APIから `affiliateUrl` を取得。API失敗時は検索URLへフォールバック。

記事詳細は本文後、汎用 item 詳細は本文ブロック後、汎用 ranking 詳細はヒーロー直下に表示する。`affiliate_targets` が未登録のページでは何も表示しない。

本文内で任意位置に出したい場合は以下を使う。

```text
:::affiliate-card
query: ザバス ホエイプロテイン100
title: ザバスを通販で探す
description: 商品名・価格・在庫はリンク先で確認してください。
:::
```

楽天のAPIキーや Amazon の associate tag は DB に入れず、`.env.local` / Vercel の環境変数で管理する。

## 初期導入優先度

1. プロテイン商品詳細・ランキング
2. 旅行宿・旅行サービス
3. レジャー予約・体験予約
4. 記事本文内の `affiliate-card` 活用
5. GA4 の `affiliate_click` 計測

## 今後の実装候補

- platform master の管理 UI
- item / article / ranking 編集 UI での `affiliate_query` 入力
