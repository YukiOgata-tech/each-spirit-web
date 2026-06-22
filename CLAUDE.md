# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## アーキテクチャ概要

新潟を中心とした地域情報・比較メディアサイト（Next.js 15 App Router）です。**静的コンテンツ + Supabase 動的レイヤーのハイブリッド構成**です。

- **コンテンツ**（記事・店舗・ランキング）は Supabase の `es` スキーマに格納し、`lib/content.ts` がそこから取得します。執筆・編集は `content/**/*.ts`（＋ `.md`）で行い、`npm run db:seed` で Supabase に反映する「**静的ファイル = 入力ソース / Supabase = 配信ソース**」フローです。
- **ユーザー機能**（認証・いいね・ブックマーク・ポイント・診断・通知）も Supabase（`es` スキーマ）で扱います。
- **全カテゴリ（protein 含む）が Supabase 配信に移行済み**。`content/` に残る静的データのうち、配信に直接使うのは設定系のみ（`categories.ts`・各 `regions.ts`・`protein/targets.ts`・`site.ts`）。それ以外（記事・店舗・ランキング・protein 商品/ランキング）は seed 経由で `es` に入れて配信する。

### カテゴリ構造（大カテゴリ × section）

サイトは **大カテゴリ（major category）× section** の2層構造です（2026-06 の再設計で ramen 単独構造から移行）。

- **大カテゴリ**: `food` / `health` / `beauty` / `travel` / `entertainment` / `leisure`。URL は `/{major}` 直下。
- **section**: 各大カテゴリの下にぶら下がる具体テーマ。`food/ramen`・`food/cafe`・`health/protein`・`beauty/hair-salon`・`travel/stays`・`travel/services`・`entertainment/anime`・`entertainment/drama`・`leisure/spots` など。section の定義は **`es.content_sections` テーブル**が正（`major_category`・`section_slug`・`content_model`・`item_path_segment`・`region_mode`・`target_mode`・`status` を持つ）。`lib/content.ts` の `getContentSections()` が読み取り（DB 未設定時は `fallbackContentSections` にフォールバック）。
- **正規 URL（canonical_path）**: コンテンツの URL は `lib/section-map.ts` と `lib/routes.ts` が一元決定する。店舗・商品などは `/{major}/{section}/{itemPathSegment}/{slug}`、ランキングは `/{major}/{section}/rankings/{slug}`。記事は ramen/cafe/beauty などの専用分岐を作らず、すべて `/articles/{category}/{slug}` に集約する。`major_category` / `section_slug` は記事の文脈付け・section 一覧への掲載に使い、記事詳細 URL には使わない。
- 旧 `content_type`（`ramen_item`・`protein`・`beauty_salon` など）→ 新 `major/section/item_kind` の変換も `lib/section-map.ts` に集約。seed・import・アプリ側の双方から使う純粋モジュール。

### データフロー

執筆（dev）→ seed → 配信:

```
content/**/*.ts (+ .md)  ──npm run db:seed──>  Supabase es.{articles,items,rankings,ranking_items}
                                                         │
                                               lib/content.ts ("server-only", es から取得)
                                                         │
                                                  app/**/page.tsx
```

`lib/content.ts` はすべてのコンテンツ取得の**唯一の境界**です（記事・店舗・ランキングは protein 含め全カテゴリ `es` スキーマから読み取り）。`"server-only"` マークが付いており、UI コンポーネントから `content/` や Supabase を直接 import してはいけません。静的な `content/**` ファイルは **seed の入力専用**で表示には使いません（設定系の `categories.ts`・`regions.ts`・`protein/targets.ts`・`site.ts` を除く）。

### ISR（増分静的再生成）

`app/layout.tsx` が `export const revalidate = 2592000` を持ち、コンテンツページは **ISR（30日ごとに再生成）** されます。`content/**` を編集して `npm run db:seed` しただけでは即時反映されないため、公開反映を急ぐ場合は `app/api/revalidate/route.ts` の on-demand revalidate を使います。

ISR を壊さないため、**root layout の配下（ヘッダー等）で `cookies()` / `headers()` を使わないこと**（使うと全ページが動的レンダリングになり ISR が無効化される）。ヘッダーの認証表示は `components/auth/AuthButtonClient.tsx`（クライアントで `getUser`）で行っています。ユーザー固有ページ（`/account` など）は `cookies()` 利用で自動的に動的のままです。

### lib モジュール一覧

| ファイル | 役割 |
|----------|------|
| `lib/types.ts` | 共有型定義（`Article`、`Item`、`Ranking`、`Source`、`FAQ` など） |
| `lib/content.ts` | コンテンツ取得関数の唯一の境界（`getContentSections`・`getGenericItemsBySection`・`getRankingBySection`・`getArticlesBySection` など section ベースの汎用関数 ＋ `getRamenItem`・`getBeautySalon` などカテゴリ別関数）。記事・店舗・ランキングは全カテゴリ Supabase `es` スキーマから取得 |
| `lib/section-map.ts` | 旧 `content_type` / article category → 新 `major/section/item_kind/canonical_path` の変換と canonical path 生成（`itemCanonicalPath`・`rankingCanonicalPath`・`articleCanonicalPath`）。`"server-only"` を付けない純粋モジュール（seed・import・アプリ共用） |
| `lib/routes.ts` | 正規ルート文字列ヘルパーと `absoluteUrl()`。記事は `articleCategory` / `articleByCategory`、section コンテンツは `sectionItem` / `sectionRanking` などを使う |
| `lib/seo.ts` | `pageMetadata()` と JSON-LD スキーマビルダー（`articleSchema`、`restaurantSchema` など） |
| `lib/admin.ts` / `lib/admin-item-schema.ts` / `lib/admin-ranking-schema.ts` | 投稿・編集 UI（`app/account/**` の記事・店舗・ランキング投稿）用の権限判定とフォームスキーマ |
| `lib/fortune.ts` / `lib/fortune-server.ts` | デイリー運勢機能のスコア算出・解説（クライアント側 `fortune.ts` / サーバー側 `fortune-server.ts`） |
| `lib/utils.ts` | クラス結合用の `cn()` |
| `lib/supabase/client.ts` | ブラウザ用 Supabase クライアント（anon、`"use client"` から使用） |
| `lib/supabase/server.ts` | SSR / RSC 用 Supabase クライアント（anon + cookie 連携）。RLS が効くユーザー文脈の操作はこれを使う |
| `lib/supabase-server.ts` | service-role + `schema: "es"` 固定のクライアント（`"server-only"`）。`lib/content.ts` のコンテンツ読み取りと seed で使用。**RLS を無視するため UI / クライアントからは使わない** |

### コンテンツ構造

`content/<category>/` 配下は **seed の入力専用**（表示には使わない）。カテゴリごとに以下の構造を持つ（例: `content/ramen/`・`content/beauty/<region>/`・`content/protein/` など。地域分割の有無はカテゴリで異なる）。

- `.../articles/index.ts` — `Article` メタデータの配列。`markdownFile` フィールドで同ディレクトリ内の `.md` を参照
- `.../items/index.ts`（`salons/`・`hotels/`・`products/` 等の場合あり） — 店舗・商品等のオブジェクト配列（`sources`、`faqs` を含む）
- `.../rankings/index.ts` — `Ranking` オブジェクトの配列。`RankingItem[]` は `itemSlug` で店舗・商品を参照

設定系（表示にも直接使う数少ない静的ファイル）:

- `content/categories.ts` — 大カテゴリ定義（`status: "live" | "planned"`）
- `content/<category>/regions.ts` — 地域定義、`content/protein/targets.ts` — 目的（target）定義
- `content/site.ts` — サイト全体のメタデータと `editorAuthor`

section のメタ（label・URL・content_model 等）は静的ファイルではなく **`es.content_sections` テーブル**が正（`lib/content.ts` の `fallbackContentSections` が DB 未設定時のフォールバック）。

各コンテンツオブジェクトは `sources: Source[]`（`collectedAt` 日付と `sourceType` 付き）を持ちます。コンテンツ編集時はこれらを保持してください。

### 動的ルートのパターン（大カテゴリ × section ディスパッチ）

ルートは `app/{major}/[section]/...` の動的構造です。`[section]` ページは「既知の section は専用実装へ委譲、それ以外は汎用ページへフォールバック」というディスパッチをします。

```ts
// app/food/[section]/page.tsx の例
export function generateStaticParams() { return [{ section: "ramen" }, { section: "cafe" }]; }
export async function generateMetadata({ params }) {
  const { section } = await params;
  if (section === "ramen" || section === "cafe") return {};   // 専用実装側で metadata を持つ
  return genericSectionMetadata("food", section);
}
export default async function Page({ params }) {
  const { section } = await params;
  if (section === "ramen") return <RamenIndexPage />;          // 専用実装
  if (section === "cafe") return <CafeIndexPage />;
  return <GenericSectionIndex majorCategory="food" sectionSlug={section} />;  // 汎用フォールバック
}
```

- **専用実装**: 個別にデザインされた section ページは `components/legacy-pages/{major}/{section}/**` に置く（`app/` の `[section]` ルートから委譲呼び出し）。
- **汎用ページ**: 専用実装を持たない section は `components/generic/GenericSectionPages.tsx`（index / 一覧）と `components/generic/SectionNavigation.tsx` がレンダリングし、`es.content_sections` の設定（`content_model`・`region_mode` 等）で表示を切り替える。
- 記事詳細は section 配下ではなく `app/articles/[category]/[slug]/page.tsx` に集約する。section ページには `getArticlesBySection()` で該当記事を掲載し、リンクは必ず `articleHref()` を使う。ランキング一覧/詳細は `app/{major}/[section]/rankings/**` と `components/articles/SectionRankingRoutes.tsx` / 汎用 ranking 詳細でレンダリングする。

各 `page.tsx` の中身は従来どおり `generateStaticParams` / `generateMetadata`（`lib/seo` の `pageMetadata()`）/ `lib/content.ts` 経由のデータ取得 → レンダリングの3点セット。

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

### 新 section の追加方法

大カテゴリ × section 構造への拡張を想定した設計です。**多くの場合、新しい section は汎用ページ（`GenericSectionPages`）で表示できるため `app/` にコードを追加する必要はありません**。

新 section（汎用ページで表示する場合）:

1. `es.content_sections` に行を追加（`supabase/migrations/` の SQL で。`major_category`・`section_slug`・`content_model`・`item_path_segment`・`region_mode`・`target_mode`・`status` を設定）
2. `lib/section-map.ts` の各マップ（`ITEM_CONTENT_TYPE_TO_SECTION` 等）に旧 content_type → 新 section の対応を追加（seed/import 経由でデータを入れる場合）
3. `content/<category>/` にコンテンツの入力ファイルを用意し、`npm run db:seed` で `es` に投入
4. 汎用ページ（`/{major}/{section}` 配下）が `content_sections` を読んで自動的にレンダリングする

専用デザインの section が必要な場合（汎用で足りないとき）:

5. `components/legacy-pages/{major}/{section}/**` に専用実装を置き、`app/{major}/[section]/**` のディスパッチ（`generateStaticParams` と if 分岐）に section を追加

新しい**大カテゴリ**を増やす場合は、`content/categories.ts` にエントリを追加し、`app/<major>/[section]/**` の動的ルート群（食・美容・entertainment など既存大カテゴリの構成を踏襲）を作成する。DB の `content_sections` 追加だけでは大カテゴリトップや sitemap の導線は完結しない。
