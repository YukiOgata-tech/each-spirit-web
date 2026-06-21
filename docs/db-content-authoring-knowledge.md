# DB直接コンテンツ作成のための知識ベース

DB（Supabase `es` スキーマ）を直接読み書きしてコンテンツを作成・更新する人（例: Supabase MCP 経由の ChatGPT、SQL クライアント、スクリプト）が、**スキーマ定義だけでは分からない前提**を把握するための文書。

> この文書は「何を書くか」の内容指示は一切含まない。**配信の仕組み上、知らないと正しく表示されない／壊れる前提**だけをまとめる。UI からの投稿手順は [admin-authoring-ui-guide.md](./admin-authoring-ui-guide.md)、パス/スラグ仕様は [content-display-path-slug-spec.md](./content-display-path-slug-spec.md) を参照。

---

## 0. 大前提

- すべてのコンテンツは Supabase の **`es` スキーマ**が配信の正（静的ファイルは旧入力ソースで、表示には使われない）。
- API/PostgREST から `es` を使うには Exposed schemas に `es` 追加が必要（設定済み）。クエリは `es` スキーマのテーブルに対して行う。
- ページは **ISR（1時間ごと再生成）**。DB を更新しても**反映に最大1時間**かかる（即時ではない）。
- 公開判定は各テーブルの **`status = 'published'`**。`draft` はサイトに一切表示されない。

---

## 1. ページ配備済みの major カテゴリ

公開ページとルーティングが**配備済み（live）**の大カテゴリは以下の5つ。これら以外（`gadget` / `life` / `tools` 等）は planned で未配備のため、配下に行を入れても表示されない。

| major | トップページ | 代表 section（例） | 備考 |
|---|---|---|---|
| `food` | `/food` | `ramen`, `cafe`, `teishoku` | グルメ |
| `health` | `/health` | `protein` | 健康 |
| `beauty` | `/beauty` | `hair-salon` | 美容 |
| `travel` | `/travel` | `stays`, `services` | 旅行（宿・旅行サービス） |
| `leisure` | `/leisure` | `spots` | レジャー |

- section の実体は **`es.content_sections`**（`status='published'` のものが配信）。`major_category` × `section_slug` で識別。
- section ごとに `content_model`（restaurant/product/salon/hotel/travel-service/spot）、`item_path_segment`（shops/products/salons/hotels/agencies/apps/spots）、`region_mode`、`target_mode` が定義される。

---

## 2. 記事（`es.articles`）で必ず知るべきこと

### 2.1 必須カラム（NOT NULL）

| カラム | 必須 | 備考 |
|---|---|---|
| `slug` | ✅ | kebab-case `^[a-z0-9]+(?:-[a-z0-9]+)*$`、ドット不可、**全記事で一意** |
| `category` | ✅ | 公開URLの第一分類（後述）。空にできない |
| `title` | ✅ | |
| `description` | ✅ | 一覧カード・検索結果・OG に使う説明文 |
| `body_md` | ✅ | 本文（Markdown）。既定 `''` |
| `tags` | ✅ | `text[]`。既定 `{}` |
| `status` | ✅ | 既定 `'draft'`。**公開するには `'published'` を明示** |
| `seo_keywords` | ✅ | `text[]`。既定 `{}` |
| `metadata` | ✅ | `jsonb`。既定 `{}`（後述の構造） |

### 2.2 公開（サイトに出す）ために必要

- `status = 'published'` にする（既定の `draft` のままだと表示されない）。
- `published_at` を設定する（公開日時。日付表示・並び順に使われる。未設定だと日付欄が空になる）。

### 2.3 URL と分類のルール（重要）

- 記事の表示URLは **`/articles/{category}/{slug}`** に統一（大カテゴリ配下／独立の区別なし）。
- **`category`** = 公開上の分類。`/articles/{category}` のカテゴリ別一覧にもまとまる。**表記揺れを避けるため既存の `category` 値を再利用**する（新語を作るとカテゴリが乱立する）。
- **`canonical_path`** カラムは記事では**表示に使われない**（アプリが `category + slug` から都度導出する）。整合のため `/articles/{category}/{slug}` を入れておくのは可。
- **`major_category` + `section_slug`** = **任意の紐づけ**。URL には影響しない。`live` な section（例 `food`+`ramen`）に一致させると、その **section ページ（`/food/ramen`）の記事欄にインライン表示**される。未設定なら `/articles/{category}` 配下にのみ存在する。
- `region` は任意（記事URLには使わない。関連付けの文脈用）。

### 2.4 `metadata`（jsonb）で表示が決まる項目

本文以外の構造化表示は **`metadata` 内のキー**で駆動される。キー名は snake_case。

| metadata キー | 型 | 表示される場所 |
|---|---|---|
| `author` | `{ name, role, url }` | 著者表示 |
| `summary` | `string[]` | 「要点まとめ」リスト |
| `what_you_learn` | `string[]` | 「このページで分かること」リスト |
| `sources` | `Source[]` | 参照ソース一覧 |
| `faqs` | `FAQ[]` | FAQ（構造化データにも使用） |
| `related_slugs` | `string[]` | 関連記事の参照 |
| `related_links` | `RelatedLink[]` | 関連リンク |

- `Source` = `{ title, url, sourceType, collectedAt, note }`（`sourceType` 例: `official`）
- `FAQ` = `{ question, answer }`
- `RelatedLink` = `{ title, url, type, note }`
- `cover_image_url` = 一覧カード／OG／詳細ヘッダのサムネイル（任意。**§4 の画像ホスト制約**が適用）。

---

## 3. 本文 `body_md` — Markdown は「独自・限定パーサ」

> 一般的な Markdown の全機能ではない。**下記に挙げた記法だけ**が描画される（`components/cards/MarkdownRenderer.tsx`）。これを知らないと「書いたのに反映されない」が起きる。

- ブロックは**空行（連続改行）で区切る**。段落内の単一改行は改行として保持される。
- 先頭の YAML frontmatter（`---` で囲んだ部分）と HTML コメント `<!-- -->` は**除去**される。

### 3.1 対応する記法（これだけ）

- 見出し: `# ` `## ` `### `（**h1〜h3 のみ**。`####` 以降は無効）
- 太字 `**強調**`、インラインコード `` `code` ``
- リンク `[表示](URL)` … **`/` 始まりは内部リンク**、それ以外は別タブ外部リンク
- 箇条書き `- `、番号付き `1. `（**ネスト不可**。1ブロック＝1リスト）
- 引用 `> `
- 表: **GFM パイプ表**（2行目に `|---|---|` の区切り行が必須）
- 画像（標準）: `![代替テキスト](画像URL "キャプション")` を**単独ブロック**で

### 3.2 非対応（書いても描画されない／素通り）

斜体 `*x*` `_x_`、`####` 以降の見出し、ネストした箇条書き、チェックリスト、脚注、定義リスト、生 HTML、画像のサイズ/配置指定。

### 3.3 記事の途中に画像を差し込む（2通り）

**(A) 標準画像**（単独ブロック）:

```
![代替テキスト](画像URL "任意のキャプション")
```

**(B) 出典付き画像ディレクティブ（推奨）** — 「公式画像」バッジ＋出典リンク付きで 16:9 表示:

```
:::official-image
src: 画像URL
alt: 代替テキスト
caption: キャプション
source: 出典名
sourceUrl: 出典URL
:::
```

- `src` 必須。`source` と `sourceUrl` の両方があると出典リンクが出る。

### 3.4 その他のブロックディレクティブ

- 関連カード:
  ```
  :::link-cards
  - [表示名](/path/to/page) - 説明文
  - [表示名](URL) - 説明文
  :::
  ```
- 注記ボックス:
  ```
  :::note
  補足や注意書き
  :::
  ```

ディレクティブは **`:::名前` で始まり `:::` で終わる単独ブロック**にする（前後に空行）。

---

## 4. 画像の最重要制約 — ホスト許可リスト

> これを知らないと「URLを入れたのに画像が出ない／エラーになる」。**全画像URL に適用**（記事 `cover_image_url`・本文画像・`items.image_url`・`rankings.image_url`）。

- サイトは Next.js の画像最適化（`next/image`）を使うため、**許可されたホストの画像URLしか描画できない**。許可外のホストはエラーになり表示されない。
- **最も安全な方法: Supabase ストレージの公開バケットにアップロードし、その公開URLを使う**（ストレージのホストは許可済み）。
  - バケット `each-spirit-images`（公開・最大5MB・`jpeg/png/webp/gif`）= コンテンツ画像の正規置き場。
  - バケット `article-assets` も選択可（公開・同条件）。
- **記事画像のパス規則（重要）**: 記事に使う画像は **`each-spirit-images/articles/{記事slug}/{任意ファイル名}`** に置く（slug 単位フォルダで衝突しない）。公開URLは
  `https://<SUPABASE>/storage/v1/object/public/each-spirit-images/articles/{slug}/{file}`。
  記事slug はグローバル一意なので、**実ファイルを上げる前に MD にこのURLを書いておける**。
- **直接ストレージ操作できない外部サービス向けの運用**: MD には先に上記URLを書いておき、**実ファイルは後から管理UI（マイページ → 画像をアップロード, `/account/storage`）で同じパスにアップロードする**。管理UIは記事を選ぶと本文中の画像URLを検出し、「未アップロード」のスロットへそのまま上げられる。アップロード時に**パスの拡張子に合わせて再エンコード＋縮小**して容量を抑える（`.webp` 推奨）。拡張子を変えると MD のURLと食い違うので、MD に書いた拡張子と実ファイルの拡張子を一致させること。
- もしくは **`next.config.ts` の `remotePatterns` に登録済みの外部ホスト**のみ使用可。現状の許可外部ホストは `images.unsplash.com` と一部の店舗・施設公式ドメイン（正は `next.config.ts`）。
- **新しい外部ホストを使うには `next.config.ts` への追記（コード変更＋デプロイ）が必要**。任意ドメインの直リンクは不可。
- **動画は `next/image` では扱えない**（現状は画像URLのみ）。

---

## 5. 店舗・商品（`es.items`）／ランキング（`es.rankings`）の画像

- `es.items.image_url`: カード画像・詳細ヒーロー・item の OG 画像。§4 の制約が適用。
- `es.rankings.image_url`: ランキングカード／OG 画像。**未設定なら自動で「1位アイテムの画像」にフォールバック**する（カードが空にならない）。
- ランキングは `es.ranking_items`（`rank`, `item_slug`, `item_id`）で `es.items` を参照。`item_id` は `items.id`(uuid) への FK。

---

## 6. スキーマから読み取りにくい補足

- **canonical_path の扱いの違い**: item / ranking は保存値（section から導出した値）が表示に使われる。**記事だけは保存値を使わず `category + slug` からアプリが再計算**する。
- **region / target の候補**は `es.content_regions` / `es.content_targets` が供給。section の `region_mode` が `required` の section では region 必須、`none` では region を持たせない。
- **like_count / view_count** はアプリが管理するカウンタ。手動で書き換えない。
- **slug の一意性スコープ**: 記事は全体で一意。items / rankings は `major_category + section_slug` の範囲で一意。
- 反映は ISR（フォールバック再生成は約1か月）だが、**管理UIからの保存・アップロードは on-demand 再検証で即時反映**される。seed など外部更新時は `/api/revalidate` を叩けば即時化できる。
