# コンテンツ追加・SEO・開発ガイドライン

このドキュメントは、本メディア（`each-spirit.com`）において、新規のカテゴリや記事、店舗（アイテム）、ランキング等を追加・運用する際の実装ポリシーおよびSEO・AI検索エンジン対策のベストプラクティスをまとめたものです。

---

## 1. ⚙️ システム・配信フローにおける注意点

### ① 画像URLドメインの追加（リモートパターン設定）
新しい店舗や記事のデータで外部の画像URL（例: 新たな写真共有サイトや特定ブログのドメイン）を指定する場合、Next.js の `<Image>` （`AttributedImage` 等）による画像最適化が実行されます。
- 新しいドメインから画像を読み込む際は、[next.config.ts](file:///C:/projects/each-spirit/next.config.ts) の `images.remotePatterns` にドメインの許可設定を追加してください。
- 登録を忘れると、ページビルド時または本番稼働時に画像のロードエラー（400 Bad Request 等）が発生します。

### ② シードデータの依存関係（登録順序）
[scripts/seed-supabase.ts](file:///C:/projects/each-spirit/scripts/seed-supabase.ts) では、ローカルの `content/**` から Supabase DB（`es` スキーマ）へデータを upsert します。
- ランキング（`rankings` テーブル）は、登録された店舗・商品（`items` テーブル）の `slug` を参照します。
- ローカルで新しいランキングを定義する際は、必ず**「そのランキングに紐づく店舗（Item/Product）データ」も定義されていること**を確認してください。参照先の店舗が存在しない場合、シードやビルドの段階で外部キー整合性エラーになります。

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

### ③ 構造化データ（JSON-LD）での画像連携
店舗詳細や宿の個別ページ用スキーマ（`restaurantSchema`, `lodgingBusinessSchema` など）では、Google 検索のリッチ結果要件を満たすために画像（`image` プロパティ）が必須または強く推奨されています。
- 各スキーマの生成時には、データに含まれる `imageUrl` から `absoluteUrl(imageUrl)` を通して、画像プロパティをオブジェクトに確実に埋め込む実装を行ってください（[lib/seo.ts](file:///C:/projects/each-spirit/lib/seo.ts) で標準対応済み）。

### ④ 一次情報の担保（E-E-A-T対策）
競合サイトとの信頼性の差別化として、各データが持つ **`sources`（参照元リスト）** や **`lastVerifiedAt`（最終確認日）** の記述を徹底してください。
- 官公庁の発表、地域の公式サイト、独自の実地検証情報などを [SourceList](file:///C:/projects/each-spirit/components/cards/SourceList.tsx) などを介して明記することで、Googleの「情報の透明性と信頼性（E-E-A-T）」の品質基準で高い評価を獲得できます。

---

## 3. 🚀 レンダリング・パフォーマンス面（ISRの維持）

### ① root layout 配下での動的関数の呼び出し禁止
本メディアはコンテンツ表示の高速化とサーバー負荷低減のため、**ISR（1時間キャッシュ）** をデフォルトとしています。
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
