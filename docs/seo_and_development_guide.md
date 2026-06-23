# コンテンツ追加・SEO・開発ガイドライン

このドキュメントは、本メディア（`each-spirit.com`）において、新規のカテゴリや記事、店舗（アイテム）、ランキング等を追加・運用する際の実装ポリシーおよびSEO・AI検索エンジン対策のベストプラクティスをまとめたものです。

---

## 1. ⚙️ システム・配信フローにおける注意点

### ① 画像URLドメインの追加（リモートパターン設定）
新しい店舗や記事のデータで外部の画像URL（例: 新たな写真共有サイトや特定ブログのドメイン）を指定する場合、Next.js の `<Image>` （`AttributedImage` 等）による画像最適化が実行されます。
- 新しいドメインから画像を読み込む際は、[next.config.ts](file:///C:/projects/each-spirit/next.config.ts) の `images.remotePatterns` にドメインの許可設定を追加してください。
- 登録を忘れると、ページビルド時または本番稼働時に画像のロードエラー（400 Bad Request 等）が発生します。

### ② Supabase 正のコンテンツ登録
公開コンテンツの正は Supabase DB（`es` スキーマ）です。新しい記事、店舗、ランキングは調査 JSON / Markdown を確認したうえで、import script や SQL で `es.articles`、`es.items`、`es.rankings`、`es.ranking_items` へ登録します。
- ランキング（`rankings` テーブル）は、登録された店舗・商品（`items` テーブル）の `slug` を参照します。
- 新しいランキングを登録する際は、必ず**「そのランキングに紐づく店舗（Item/Product）データ」も DB に存在すること**を確認してください。参照先の店舗が存在しない場合、登録時に外部キー整合性エラーになります。

[scripts/seed-supabase.ts](file:///C:/projects/each-spirit/scripts/seed-supabase.ts) は旧ローカル `content/**` から DB を upsert・洗い替えする復旧/初期投入用 script です。通常実行はブロックされ、`ALLOW_LEGACY_CONTENT_SEED=1` を明示した場合だけ動きます。

外部 ChatGPT などへ調査を依頼する場合は、`major_category`、`section_slug`、`slug`、`item_class`、`genres`、`sources` を持つ JSON と、記事本文 Markdown をセットで返却させてください。Markdown の自由記述だけで受け取ると、`es.items` / `es.rankings` / `es.ranking_items` への変換時に slug、metadata、sources の解釈コストが増えます。`items` の列構造（`image`/`address_info`/`seo`/`nutrition`/`sources`/`faq`/`history`/`service_model`/`related_link` 等の JSONB と型固有 `metadata`）は [docs/items-data-model.md](file:///C:/projects/each-spirit/docs/items-data-model.md) を正、大カテゴリ/中カテゴリ/URL 方針は [docs/content-display-path-slug-spec.md](file:///C:/projects/each-spirit/docs/content-display-path-slug-spec.md) を正とします。`last_verified_at` は廃止済み（`updated_at` を使用）。

記事URLは、大カテゴリ配下・独立を問わず `/articles/{category}/{slug}` です。例: `/articles/ramen/niigata-ramen-first-guide`、`/articles/protein/protein-beginner-guide`。`major_category` / `section_slug` / `region` は記事データの属性として扱い、記事URLの必須要素にはしません。

### ③ sitemap.ts へのカテゴリ登録
サイトマップ自動生成ファイルである [app/sitemap.ts](file:///C:/projects/each-spirit/app/sitemap.ts) は、Supabase から動的にデータを取得して生成を行っています。
- `gadget` や `life` などの新しいカテゴリを「Live（公開中）」に変更する際は、[sitemap.ts](file:///C:/projects/each-spirit/app/sitemap.ts) にもそのカテゴリの静的/動的ルートの取得・生成ロジックを追加してください。

---

## 2. 📝 SEO（E-E-A-T）および AI検索（SGE/AI Overview）対策

### ① ページ要約（Summary）の品質（AI対策）
コンテンツ定義時に設定する `summary: string[]`（要点まとめ）や `whatYouLearn: string[]`（このページで分かること）は非常に重要です。
- ChatGPT Search, Perplexity, Google SGE などのAI検索エンジンは、ファーストビューの構造化された「箇条書きの要約」を極めて優先的にクローリングして参照・引用します。
- 記事やランキングを追加する際は、**「そのページが提供する核心的な結論・要点3〜5つ」**を `summary` 配列に明確かつ具体的に記述してください。

### ② `data-speakable` 属性の付与
新しいカテゴリ用の個別テンプレート（例: `app/<category>/[slug]/page.tsx` など）をマークアップする際は、見出しやディスクリプション部分に以下のカスタム属性を付与するように設計してください。
```html
<h1 data-speakable="title">{title}</h1>
<p data-speakable="description">{description}</p>
```
[lib/seo.ts](file:///C:/projects/each-spirit/lib/seo.ts) で定義されている `SpeakableSpecification` のCSSセレクター（`data-speakable='title'` / `'description'`）と自動で連携し、音声検索や AI 検索エンジンに「コンテンツの主要要約箇所」を明示できます。

### ③ 構造化データ（JSON-LD）と型別スキーマ
items 個別ページの構造化データは、共通ビルダー **`itemSchema(item, path, { contentModel, aggregateRating })`**（[lib/seo.ts](file:///C:/projects/each-spirit/lib/seo.ts)）が `item_class` / `content_model` から schema.org 型を出し分けて生成します（Restaurant / CafeOrCoffeeShop / HairSalon / Hotel / TouristAttraction / TravelAgency / Product / CreativeWork / Person …）。
- 画像（`image` プロパティ）は `image.url`（GenericItem の `imageUrl`）から `absoluteUrl()` で埋め込み済み。住所/geo/営業時間/価格/`servesCuisine`(genres)/`citation`(sources)/`aggregateRating`（編集スコア）等も「在る項目だけ」自動出力。
- 旧 `restaurantSchema` / `lodgingBusinessSchema` 等の型別ビルダーは items 詳細では使わず、`itemSchema` に統合済み。

### ④ 一次情報の担保（E-E-A-T対策）
競合サイトとの信頼性の差別化として、各データの **`sources`（参照元リスト）** の記述を徹底してください（更新日は `updated_at` を使用、`lastVerifiedAt` 列は廃止）。
- 官公庁の発表、地域の公式サイト、独自の実地検証情報などを [SourceList](file:///C:/projects/each-spirit/components/cards/SourceList.tsx) で明記することで、Googleの「情報の透明性と信頼性（E-E-A-T）」基準で高い評価を獲得できます。
- **items**：`sources` / `faq` は専用 JSONB 列（投稿UIの「拡張情報」で `1行1件・| 区切り` 入力）。公開ページに「参照情報」「FAQ」として表示され、JSON-LD の `citation` / `FAQPage` に反映。
- **記事**：記事単位の `metadata.sources` / `metadata.faqs` / `metadata.related_links` を記事投稿UIで入力（articles 側は従来どおり）。

### ⑤ SEO メタの自動生成と上書き（items）
- `seo` 列（`title` / `description` / `keywords` / `og_image`）は**すべて任意の上書き**。空欄なら自動：title=名称、description=説明、OG=画像→カテゴリ既定。各キー独立（タイトルだけ／キーワードだけ等の部分上書き可）。
- **keywords は自動生成**（名称・section・genres・tags・都道府県・エリア）。投稿UIの「追加キーワード」は補足分のみ。

### ⑥ サイト内検索
`/search` は記事、ランキング、店舗/商品、カテゴリを横断する検索ページです。`WebSite` schema の `SearchAction` は `/search?q={search_term_string}` を指します。ヘッダーとトップページの検索フォームもこのページに送信します。

---

## 3. 🚀 レンダリング・パフォーマンス面（ISRの維持）

### ① root layout 配下での動的関数の呼び出し禁止
本メディアはコンテンツ表示の高速化とサーバー負荷低減のため、`app/layout.tsx` の `revalidate` による **ISR** をデフォルトとしています。現在の既定値は 30 日です。コンテンツを即時反映したい場合は `app/api/revalidate/route.ts` の on-demand revalidate を使ってください。
- ヘッダー、フッター、サイドバーなど、**ルートレイアウト（`RootLayout`）やその直下の共通コンポーネント内で、不用意に `cookies()` や `headers()` などの Next.js 動的関数を呼び出してはいけません**。これらを呼び出すと、サイト全体のすべての静的/ISRページが動的レンダリング（強制SSR）へフォールバックされ、キャッシュが破棄されてしまいます。
- ログイン状況やユーザー固有情報の切り替えは、必ず `"use client"` を明示したクライアントコンポーネント側から非同期（またはマウント後）で取得するように設計してください。

---

### 4. 🧪 変更後の品質検証手順

新しいコンテンツやカテゴリの追加、ルートの変更などの作業を行った後は、リポジトリのガイドラインに従い、以下の検証コマンドを必ず順に実行して動作を確認してください。

1. **型チェック**
   ```bash
   npm run typecheck
   ```
   TypeScriptのコンパイルエラーや整合性エラーがないかを確認します。

2. **静的解析（リンター）**
   ```bash
   npm run lint
   ```
   構文規約（ESLint）違反がないかを確認します。

3. **ビルド検証**
   ```bash
   npm run build
   ```
   Next.jsのプロダクションビルドが正常に完了し、全ISR/静的ページが正しくプリレンダリングされるかを検証します。
