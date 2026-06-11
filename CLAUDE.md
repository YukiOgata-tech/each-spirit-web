# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## アーキテクチャ概要

新潟を中心とした地域情報・比較メディアサイト（Next.js 15 App Router）です。**静的コンテンツ + Supabase 動的レイヤーのハイブリッド構成**です。

- **静的コンテンツ**（記事・店舗・ランキング等）は TypeScript / Markdown ファイルに埋め込み、ビルド時に静的生成します。
- **ユーザー機能**（認証・いいね・ブックマーク・ポイント・診断・通知）は Supabase で動的に扱います。

カテゴリは `protein` / `beauty` / `ramen` / `leisure` / `travel` / `cafe` が live、`gadget` / `life` / `tools` が planned です。

### データフロー（静的コンテンツ）

```
content/**/*.ts  →  lib/content.ts  →  app/**/page.tsx
content/**/*.md  →  lib/content.ts (getArticleMarkdown, readFileSync)
```

`lib/content.ts` はすべての静的コンテンツへの**唯一の import 境界**です。`"server-only"` マークが付いており、UI コンポーネントから `content/` を直接 import してはいけません。

### lib モジュール一覧

| ファイル | 役割 |
|----------|------|
| `lib/types.ts` | 共有型定義（`Article`、`Item`、`Ranking`、`Source`、`FAQ` など） |
| `lib/content.ts` | コンテンツ取得関数（`getRamenArticle`、`getRankingEntries` など） |
| `lib/routes.ts` | 正規ルート文字列と `absoluteUrl()` ヘルパー |
| `lib/seo.ts` | `pageMetadata()` と JSON-LD スキーマビルダー（`articleSchema`、`restaurantSchema` など） |
| `lib/utils.ts` | クラス結合用の `cn()` |
| `lib/supabase/client.ts` | ブラウザ用 Supabase クライアント（anon、`"use client"` から使用） |
| `lib/supabase/server.ts` | SSR / RSC 用 Supabase クライアント（anon + cookie 連携）。RLS が効くユーザー文脈の操作はこれを使う |
| `lib/supabase-server.ts` | service-role + `schema: "es"` 固定のクライアント（`"server-only"`）。seed / 管理バッチ専用。**RLS を無視するため UI からは使わない** |

### コンテンツ構造

- `content/ramen/articles/index.ts` — `Article` メタデータの配列。`markdownFile` フィールドで同ディレクトリ内の `.md` を参照
- `content/ramen/items/index.ts` — `Item` オブジェクトの配列（店舗詳細、`sources`、`faqs` を含む）
- `content/ramen/rankings/index.ts` — `Ranking` オブジェクトの配列。`RankingItem[]` は `itemSlug` で店舗を参照
- `content/categories.ts` — トップレベルのカテゴリ定義（`status: "live" | "planned"`）
- `content/site.ts` — サイト全体のメタデータと `editorAuthor`

各コンテンツオブジェクトは `sources: Source[]`（`collectedAt` 日付と `sourceType` 付き）を持ちます。コンテンツ編集時はこれらを保持してください。

### 動的ルートのパターン

すべての動的ルートは以下のパターンに従います。

```ts
export function generateStaticParams() { return getAll().map(x => ({ slug: x.slug })); }
export async function generateMetadata({ params }) { /* lib/seo の pageMetadata() を使用 */ }
export default async function Page({ params }) { /* lib/content 経由で取得してレンダリング */ }
```

`generateStaticParams` が静的生成を駆動するため、コンテンツを追加するだけで対応ページが自動生成されます。

### SEO

構造化データはすべて `<JsonLd data={...} />` (`components/seo/JsonLd.tsx`) で出力します。スキーマビルダーは `lib/seo.ts` にあります。ルートレイアウトが `websiteSchema` と `organizationSchema` をグローバルに注入します。

`lib/seo.ts` の `pageMetadata()` が canonical URL・OG・Twitter カードを一括処理します。`Metadata` オブジェクトを手動構築せず、必ず `generateMetadata` から `pageMetadata()` を呼んでください。

### Supabase（認証・ユーザーデータ）

ユーザー機能は Supabase で扱います。プロジェクトの詳細・テーブル一覧・運用ルールは `supabase/README.md` を参照してください。

- **スキーマ分離**: each-spirit 専用テーブルはすべて `es` スキーマに置きます。`auth.users` と `public.profiles` は別アプリ（飲酒管理アプリ）と共有しているため、**`public.*` への変更は原則禁止**です。新規テーブルは必ず `es` に追加します。
- **マイグレーション**: すべての DB 変更は `supabase/migrations/` にタイムスタンプ付き SQL で記録します。
- **クライアントの使い分け**: ブラウザは `lib/supabase/client.ts`、Server Component / Route Handler は `lib/supabase/server.ts`（ユーザー文脈・RLS あり）、seed や管理処理だけ `lib/supabase-server.ts`（service-role）。
- **セッション**: `middleware.ts` が全リクエストでセッションをリフレッシュします。認証 UI は `app/auth/`（login / signup / callback）、マイページは `app/account/`。
- **`es` スキーマを API から使うための必須手動設定**: `supabase.schema("es")` を使うには、Supabase Dashboard → **Settings → API → Exposed schemas** に `es` を追加する必要があります（PostgREST はデフォルトで `public` しか公開しないため）。これは SQL マイグレーションでは設定できず、ダッシュボードでの手作業です。未設定だと `es` への全クエリが失敗します。詳細は `supabase/README.md`。
- **seed**: `npm run db:seed`（`scripts/seed-supabase.ts`）。`SUPABASE_SERVICE_ROLE_KEY` 等の環境変数は `.env.local` に置き、コミットしないこと。

### 新カテゴリの追加方法

ラーメン以外への拡張を想定した設計になっています。新カテゴリを追加する場合は以下の手順に従ってください。

1. `content/categories.ts` に `status: "planned"` で `Category` エントリを追加
2. `content/ramen/` のファイル構造を `content/<category>/` に複製
3. `lib/content.ts` に取得関数を追加
4. `lib/routes.ts` にルートヘルパーを追加
5. ラーメンページのパターンを踏まえて `app/<category>/` ページを作成
