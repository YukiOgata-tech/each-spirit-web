# Repository Guidelines

## プロジェクト構成

このリポジトリは、each-spirit.com 向けの Next.js 15 App Router メディア MVP です。

- `app/` はルート、レイアウト、metadata、loading UI、`sitemap.ts`、`robots.ts`、route handler を管理します。
- `components/` は再利用 UI です。`layout/`、`cards/`、`seo/`、`ui/` に分かれています。
- `content/` はコンテンツの**入力ソース**です。Markdown 記事は `content/ramen/articles/`、カテゴリ・ランキング・店舗データは型付き TypeScript に置きます。記事・店舗・ランキングは `npm run db:seed` で Supabase `es` スキーマへ反映し、配信時は `lib/content.ts` が Supabase から読み取ります（protein 含め全カテゴリ移行済み。`content/**` の設定系ファイルのみ直接配信）。執筆は dev で `content/**` を編集 → seed の流れ。コンテンツページは ISR（`app/layout.tsx` の `revalidate = 3600`）。root layout 配下で `cookies()`/`headers()` を使うと ISR が無効化されるので注意。
- `lib/` は型、ルート定義、SEO 補助、コンテンツ取得関数、共通ユーティリティを置きます。Supabase クライアントは `lib/supabase/`（ブラウザ用 `client.ts` / SSR 用 `server.ts`）と `lib/supabase-server.ts`（service-role、seed 専用）に分かれます。
- `middleware.ts` は全リクエストで Supabase セッションをリフレッシュします。認証 UI は `app/auth/`、マイページは `app/account/`。
- `supabase/` は DB マイグレーション（`migrations/*.sql`）と運用ドキュメント（`README.md`）です。`scripts/` は seed・SQL 生成などの一回限りのツール群です。
- `public/` は静的アセットです。ブランド画像は `public/brand/` にあります。

UI コンポーネントでは raw content を直接 import せず、`lib/content.ts` の取得関数を使ってください。Supabase は用途に応じて `lib/supabase/` のクライアントを使い、service-role の `lib/supabase-server.ts` は UI から使わないでください。

## 開発・ビルド・検証コマンド

- `npm install`: 依存関係をインストールします。
- `npm run dev`: ローカル開発サーバーを起動します。
- `npm run lint`: ESLint を実行します。
- `npm run typecheck`: strict TypeScript 設定で `tsc --noEmit` を実行します。
- `npm run build`: production build を作成します。
- `npm run start`: `npm run build` 後の production build を起動します。

大きめの変更を渡す前に、`lint`、`typecheck`、`build` を実行してください。

## コーディング規約・命名

TypeScript と React Server Components を標準にします。ブラウザ API、状態を持つ操作、effect が必要な場合だけ `"use client"` を追加してください。root import は `@/*` を優先します。

既存スタイルに合わせ、2 スペース indent、named export、PascalCase のコンポーネントファイル、lowercase の route folder を使います。content ID と slug は `niigata-ramen-first-guide` のような kebab-case にします。

Tailwind CSS v4 の utility と `components/ui/` の shadcn-style primitive を使います。class の結合には必要に応じて `lib/utils.ts` を使ってください。

## テスト方針

専用の test runner は未設定です。現時点では lint、typecheck、build を必須の検証手順とします。将来テストを追加する場合は、対象機能の近く、または `__tests__/` に配置し、unit や route に対応する名前を付けてください。

## コミット・Pull Request

Git 履歴は initial scaffold commit のみなので、`add ramen ranking metadata` や `fix article breadcrumb schema` のように、短く命令形の件名を使ってください。

Pull Request には、変更概要、実行した検証コマンド、関連 issue、UI 変更のスクリーンショットを含めます。content source、SEO、公開 route の変更も明記してください。

## セキュリティ・設定

secret やローカル環境ファイルは commit しないでください。`.next/` などの生成物も version control に含めません。構造化コンテンツを変更する場合は、参照元情報と確認日を保持してください。

Supabase の鍵（`SUPABASE_SERVICE_ROLE_KEY` など）は `.env.local` に置き、絶対に commit しないでください。each-spirit 専用テーブルはすべて `es` スキーマに追加し、共有の `public.*` は変更しないでください。DB 変更は `supabase/migrations/` に SQL で記録します。`es` スキーマを API から使うには Supabase Dashboard の Settings → API → Exposed schemas に `es` を追加する手動設定が必要です（詳細は `supabase/README.md`）。

## エージェント向け注意

Next.js の規約は古い学習データと異なる場合があります。framework に依存する API を変更する前に、`node_modules/next/dist/docs/` を確認し、deprecation notice に従ってください。
