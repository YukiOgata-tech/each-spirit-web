# Each Spirit

Next.js 15 App Router + TypeScript + Tailwind CSS v4 + Supabase で構築している、each-spirit.com 向けの比較・ランキング型メディア MVP です。

ラーメン、プロテイン、美容室、カフェ、旅行、レジャー、旅行アプリ・旅行会社などを、記事・ランキング・店舗/商品カードとして配信します。

## セットアップ

```bash
npm install
```

ローカル開発サーバー:

```bash
npm run dev
```

検証:

```bash
npm run lint
npm run typecheck
npm run build
```

大きめの変更を渡す前は、上記 3 コマンドを実行してください。

## 主なスクリプト

- `npm run dev`: Next.js 開発サーバーを Turbopack で起動します。
- `npm run lint`: ESLint を実行します。
- `npm run typecheck`: `tsc --noEmit` を実行します。
- `npm run build`: production build を作成します。
- `npm run start`: build 済みアプリを起動します。
- `npm run db:seed`: `content/**` の入力データを Supabase `es` スキーマへ upsert します。

## ディレクトリ構成

- `app/`: App Router の route、layout、metadata、loading UI、`sitemap.ts`、`robots.ts`、route handler。
- `components/`: 再利用 UI。`layout/`、`cards/`、`seo/`、`ui/`、カテゴリ別 UI など。
- `content/`: コンテンツの入力ソース。記事 Markdown、カテゴリ・地域・ランキング・店舗/商品データを管理します。
- `lib/`: 型、route 定義、SEO 補助、コンテンツ取得関数、Supabase client、共通 utility。
- `supabase/`: `es` スキーマ用 migration と運用ドキュメント。
- `scripts/`: Supabase seed、SQL 生成などの運用スクリプト。
- `public/`: 静的アセット。ブランド画像は `public/brand/` にあります。

UI コンポーネントでは `content/**` を直接 import せず、原則として `lib/content.ts` の取得関数を使います。

## コンテンツ配信の流れ

現在、記事・店舗/商品・ランキングの配信データは Supabase の `es` スキーマから読み取ります。

1. 開発時に `content/**` の Markdown / TypeScript データを編集します。
2. `npm run db:seed` を実行します。
3. `scripts/seed-supabase.ts` が `es.articles`、`es.items`、`es.rankings`、`es.ranking_items` へ upsert します。
4. アプリ側は `lib/content.ts` 経由で Supabase から読み取ります。

カテゴリ、地域、ターゲットなどの設定系データは `content/**` の TypeScript を直接参照しています。

## Supabase

each-spirit 専用テーブルはすべて Supabase の `es` スキーマに置きます。共有プロジェクト内の `public.*` は、飲酒管理アプリ側との共有領域のため原則変更しません。

必要な環境変数:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATE_SECRET=
```

`es` スキーマを API から使うには、Supabase Dashboard の Settings -> API -> Exposed schemas に `es` を追加する必要があります。詳細は `supabase/README.md` を参照してください。

用途別クライアント:

- `lib/supabase/client.ts`: ブラウザ用。
- `lib/supabase/server.ts`: SSR / Server Component 用。
- `lib/supabase-server.ts`: service-role 用。seed やサーバー専用処理で使い、UI からは使いません。

## ISR / 再検証

root layout の既定 ISR は `app/layout.tsx` の `revalidate` で管理しています。コンテンツ更新直後に即時反映したい場合は `app/api/revalidate/route.ts` の on-demand revalidate を使います。

`npm run db:seed` は、`SITE_REVALIDATE_URL` と `REVALIDATE_SECRET` が設定されている場合に再検証リクエストを送信します。

## SEO / AI 検索対策

- Next.js Metadata API
- canonical / OGP / Twitter Card
- JSON-LD: WebSite、Organization、Article、ItemList、BreadcrumbList、FAQPage など
- `sitemap.xml` / `robots.txt`
- `llms.txt`
- 参照元、確認日、FAQ、評価基準を型付きデータとして保持

## 実装済みの主な領域

- `/`
- `/ramen`、`/ramen/[region]`、記事、ランキング、店舗詳細
- `/protein`、目的別ページ、ランキング、商品詳細
- `/beauty`、地域ページ、記事、ランキング、サロン詳細
- `/cafe`、地域ページ、ランキング、店舗詳細
- `/travel`、地域ページ、ランキング、宿詳細
- `/travel-services`、地域ページ、旅行会社、旅行アプリ
- `/leisure`、地域ページ、ランキング、スポット詳細
- `/fortune`
- `/auth/login`、`/auth/signup`、`/auth/callback`
- `/account`、`/account/likes`
- `/contact`、`/about`、`/privacy`、`/disclaimer`

## 注意事項

- secret や `.env.local` は commit しないでください。
- `.next/` などの生成物は version control に含めません。
- DB 変更は `supabase/migrations/` に SQL として記録します。
- 構造化コンテンツを変更する場合は、参照元情報と確認日を保持してください。
- Next.js の API や挙動を変更する場合は、必要に応じて `node_modules/next/dist/docs/` の現在の説明を確認してください。
