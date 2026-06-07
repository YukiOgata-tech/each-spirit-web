# Each Spirit

Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui style components を使った、each-spirit.com 向け情報メディアMVPです。

## セットアップ

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

ローカル開発サーバーを起動する場合のみ、別途 `npm run dev` を実行します。

## 実装済みページ

- `/`
- `/ramen`
- `/ramen/articles/niigata-ramen-first-guide`
- `/ramen/rankings/niigata-ramen-starter`
- `/ramen/items/aoba-niigata-ekimae`
- `/ramen/items/seabura-dou-bandai`
- `/ramen/items/iekei-minami`
- `/about`
- `/contact`
- `/privacy`
- `/disclaimer`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`

## ディレクトリ構成

要求された構成をベースに、Next.js App Routerの責務に合わせて以下のように整理しています。

- `app/`: ルーティング、metadata、sitemap、robots、llms.txt
- `components/`: layout、cards、seo、ui の再利用コンポーネント
- `content/`: 静的コンテンツ。記事本文はMarkdown、メタデータ・ランキング・店舗情報は型付きTS
- `lib/`: content取得層、SEO/JSON-LD、routes、型、ユーティリティ

UIが直接 `content/` を読まず、`lib/content.ts` の取得関数経由で表示する構成にしています。将来的にSupabase等へ移行する場合は、`lib/content.ts` の内部実装をDB取得へ差し替えます。

## SEO / AI検索対策

- Metadata API
- canonical / OGP
- JSON-LD: WebSite, Organization, Article, ItemList, Restaurant, BreadcrumbList, FAQPage
- 記事冒頭の要点まとめ
- ランキング冒頭の結論と早見表
- 評価基準の明文化
- Source型による参照元、確認日、メモの追跡
- `llms.txt` 生成ルート

## 今後の拡張方針

- カテゴリ追加時は `content/categories.ts` にカテゴリを追加し、カテゴリ専用ディレクトリを `app/{category}` に作成します。
- カテゴリごとの配色はCSS変数またはカテゴリテーマを使って差し替えます。
- PR掲載や収益化を始める場合は、ランキング項目の `isPr` と記事/店舗ページの表記ルールを拡張します。
- 管理画面やDB化を行う場合も、UI側は取得関数を使い続け、データソースだけを変更します。
