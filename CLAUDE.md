# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## アーキテクチャ概要

新潟ラーメンコンテンツを中心とした**静的生成メディアサイト**（Next.js 15 App Router）です。データはすべて TypeScript ファイルに埋め込まれており、データベースや外部 API はありません。

### データフロー

```
content/**/*.ts  →  lib/content.ts  →  app/**/page.tsx
content/**/*.md  →  lib/content.ts (getArticleMarkdown, readFileSync)
```

`lib/content.ts` はすべてのコンテンツへの**唯一の import 境界**です。`"server-only"` マークが付いており、UI コンポーネントから `content/` を直接 import してはいけません。

### lib モジュール一覧

| ファイル | 役割 |
|----------|------|
| `lib/types.ts` | 共有型定義（`Article`、`Item`、`Ranking`、`Source`、`FAQ` など） |
| `lib/content.ts` | コンテンツ取得関数（`getRamenArticle`、`getRankingEntries` など） |
| `lib/routes.ts` | 正規ルート文字列と `absoluteUrl()` ヘルパー |
| `lib/seo.ts` | `pageMetadata()` と JSON-LD スキーマビルダー（`articleSchema`、`restaurantSchema` など） |
| `lib/utils.ts` | クラス結合用の `cn()` |

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

### 新カテゴリの追加方法

ラーメン以外への拡張を想定した設計になっています。新カテゴリを追加する場合は以下の手順に従ってください。

1. `content/categories.ts` に `status: "planned"` で `Category` エントリを追加
2. `content/ramen/` のファイル構造を `content/<category>/` に複製
3. `lib/content.ts` に取得関数を追加
4. `lib/routes.ts` にルートヘルパーを追加
5. ラーメンページのパターンを踏まえて `app/<category>/` ページを作成
