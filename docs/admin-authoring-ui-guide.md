# 作成UI（管理者向け投稿・編集）ガイド

リポジトリの管理画面から DB（`es` スキーマ）へ直接コンテンツを投入・編集するためのガイド。
関連: [content-display-path-slug-spec.md](./content-display-path-slug-spec.md)（パス/スラグ/表示の確定仕様）

## 全体概要

3種類のエディタがある。すべてマイページ `/account` の「管理メニュー」からアクセスでき、表示は **`es.admin_users` に登録された管理者のみ**（`lib/admin.ts` の `getCurrentAdminUser` / `requireAdminUser` でガード。非管理者はログインへリダイレクト）。

| エディタ | 新規 | 編集 | テーブル |
|---|---|---|---|
| 記事 | `/account/articles/new` | （既存記事から） | `es.articles` |
| 店舗・商品 | `/account/items/new` | `/account/items/[id]/edit` | `es.items` |
| ランキング | `/account/rankings/new` | `/account/rankings/[id]/edit` | `es.rankings` + `es.ranking_items` |

共通の仕組み:
- ネイティブ `<form action={サーバーアクション}>`（`saveArticle` / `saveItem` / `saveRanking`）。
- 保存時に **canonical_path / major_category / section_slug / item_class** を自動導出（`item_kind` は任意のジャンル的ラベルに格下げ済みで、判別には使わない）。
- slug 重複チェック → upsert → 関連ページ revalidate → リダイレクト（公開=詳細ページ / 下書き=マイページ）。
- セクション定義: `es.content_sections.item_schema`（優先）＋ `lib/admin-item-schema.ts`（コード fallback）。ランキングは `lib/admin-ranking-schema.ts`。
- フォーム本体: `components/admin/ItemEditor.tsx` / `RankingEditor.tsx` / `ArticleEditor.tsx`。
- 詳細ページは `item_class` ごとに専用レイアウト（`components/detail/` の共通エンジン）。データモデルは [items-data-model.md](./items-data-model.md) を参照。

---

## 1. 店舗・商品エディタ（items）

大カテゴリを選び、その中の既存カテゴリ(section)を選ぶか、新しい section を作成してから item を投入する汎用フォーム（新規時は選択/作成可、編集時は大カテゴリ / section 固定）。

新規 section 作成時は、大カテゴリは既存のものから選び、section slug / 表示名 / item_kind / item URL segment / region の扱いを入力する。保存時に `es.content_sections` へ section を upsert してから `es.items` を作成する。section 固有の詳細項目は `lib/admin-item-schema.ts` に定義がある既存 section のみ表示され、新規 section は共通項目から開始する。

既存 major 配下の新規 section は、公開側では汎用 section ページと汎用 item 詳細ページで表示される。既存 section（ramen / protein / hair-salon など）のような専用デザイン、地域/target 導線、専用比較表が必要な場合は、後から section 固有ページとして実装する。

### item_class（型）と所在地欄
section の `item_class`（**physical_service / intangible_service / media / product / person / other**）で詳細ページのレイアウトと所在地欄の要否が決まる。**所在地系の欄（エリア/住所/電話/価格帯/地図URL/region）は physical_service・intangible_service のみ表示**（media/product/person 等では非表示・保存もしない）。

### 共通項目（全 section）
- **slug**（必須・`^[a-z0-9]+(?:-[a-z0-9]+)*$`）、**名称**（必須）、説明
- 画像URL（→ `image.url` 列）、公式URL
- 所在地系（場所型のみ）: エリア / 住所 / 電話 / 価格帯 / 地図URL（→ `address_info` jsonb に集約。住所から都道府県を自動抽出）
- **地域(region)**: section により表示/必須が変化。DB（`es.content_regions`）の候補からセレクト
- タグ（カンマ・改行区切り）、編集部コメント、ステータス（公開 / 下書き）
- ※「最終確認日」欄は廃止（`updated_at` を使用）

### 拡張情報（任意・全 section 共通 / それぞれ**専用列**へ保存）
metadata ではなく専用列に入る共通項目。
- **ジャンル** `genres`（カンマ/改行）: 分類軸。全型共通（ramen=スープ系統 / anime=ジャンル＋原作 等）。→ `genres` 列
- **画像 alt・出典クレジット**（名称/URL）→ `image`
- **SEO 上書き**（すべて任意・空欄なら自動）: タイトル / 説明 / 追加キーワード → `seo`。キーワードは名称・カテゴリ・genres・tags・エリアから**自動生成**され、ここは追記分のみ。OG画像は seo.og_image > 画像 > カテゴリ既定の順
- **出典 sources** / **FAQ** / **沿革 history** / **視聴・購入 service_model** / **関連リンク related_link**（各「1行1件・`|` 区切り」で入力 → 各専用列）

### section 別の詳細項目（型固有・`metadata` jsonb に格納）

専用列へ移った共通項目（genres / sources / faq / history / service_model / related_link / 画像 / 所在地 / seo / 栄養）は上記「共通項目・拡張情報」で扱う。ここは **section ごとの型固有フィールド**（`es.content_sections.item_schema` または `lib/admin-item-schema.ts` が定義）。

| section | item_class | region | 型固有項目 |
|---|---|---|---|
| グルメ/ラーメン (`food:ramen`) | physical_service | 任意 | おすすめメニュー、営業時間、定休日、駐車場(✓)、駐車場メモ |
| グルメ/カフェ (`food:cafe`) | physical_service | 必須 | スタイル、看板メニュー、ハイライト、営業時間、定休日、予約(選択)、WiFi/電源/駐車場/ペット可(✓)、Instagram |
| 健康/プロテイン (`health:protein`) | product | なし | ブランド(必須)、種類・分類(選択)、対象target(list)、栄養成分(基準＋1食量/タンパク質/カロリー/炭水化物/脂質/糖質/食塩=数値 → `nutrition` 構造へ集約)、内容量/価格/1kg単価(数値)、バリエーション/アレルゲン(list)、保存方法(選択)、メリット/デメリット(list) |
| 美容/美容室 (`beauty:hair-salon`) | physical_service | 必須 | キャッチ、アクセス、施術(list)、対象年代(list)、カット/カラー料金、営業時間、定休日、駐車場(✓)、子連れ可/メンズ可(✓)、Instagram |
| 旅行/宿 (`travel:stays`) | physical_service | 必須 | スタイル、ハイライト、チェックイン/アウト、食事、温泉(✓)、温泉メモ、駐車場(✓) |
| 旅行/旅行会社 (`travel:services`) | intangible_service | 必須 | キャッチ、ハイライト、サービス(list)、向いている人(list)、相談スタイル、営業時間、定休日、登録番号 |
| 旅行/旅行アプリ (`travel:services`) | product | なし | 提供元、対応プラットフォーム(list)、向いている人(list) |
| レジャー/スポット (`leisure:spots`) | physical_service | 必須 | 種別(選択)、ハイライト、向いている人(list)、営業時間、定休日、駐車場(✓) |
| エンタメ/アニメ・ドラマ (`entertainment:anime`/`drama`) | media | なし | メディア展開(list)、トーン、作品プロフィール 等 |

入力タイプ: テキスト / 複数行(textarea) / 数値 / チェックボックス(✓) / 選択(select) / リスト(カンマ・改行 → 配列)。

> `travel:services` は同一 section に **旅行会社(intangible_service) と 旅行アプリ(product) が同居**。新規フォームのスキーマ選択・編集時の判別は **`item_class`** で行う（`item_kind` には依存しない）。
> 編集時は既存 `metadata` の型固有キーを**マージ**して保全する（共通項目は専用列が正）。栄養は `nutrition` を保持し、フォームの数値欄から再集約する。

---

## 2. ランキングエディタ（rankings）

ランキング本体＋順位項目（`ranking_items`）を編集。

### 本体項目
- **カテゴリ(section)**（新規=選択 / 編集=固定）、**slug**（必須）、**タイトル**（必須）
- 説明、結論、クイック表ラベル、評価軸(list)
- **カード/メタ画像URL**（任意）: 空欄の場合は**1位アイテムの画像**を自動でカード/OG画像に流用（`es.rankings.image_url`）
- **地域(region)**（section により必須）、**対象target**（プロテインのみ・`es.content_targets` から）
- タグ(list)、最終更新日、ステータス（公開/下書き）

### 順位項目（動的に行を追加/削除）
各行: **順位(rank)** / **item（その section の登録済み店舗・商品からセレクト）** / スコア / 理由 / PR(✓)
- 保存時に item の slug から **`item_id`(uuid) を自動解決**して紐付け（`ranking_items` を delete→insert で洗い替え）。
- 「行を追加」で増やし、ゴミ箱で削除。該当 section に item が無い場合は警告（先に店舗・商品を作成）。
- ランキング section と item の対応: ramen/cafe/protein/hair-salon/stays/services(agency)/spots。

---

## 3. 記事エディタ（articles）

- **記事カテゴリslug（必須）**: 公開URL `/articles/{記事カテゴリ}/{slug}` の第一分類。既存カテゴリの再利用を推奨（表記揺れ防止のため、フォームに既存カテゴリ候補を表示）
- 配置（大カテゴリ配下 or 独立記事）と大カテゴリ＋中カテゴリ(section): **任意の紐づけ**。URLには使わず、設定すると該当 section ページ（例 `/food/ramen`）の記事欄にインライン表示される
- slug、タイトル、説明
- **Markdown 本文＋ライブプレビュー**、サムネ画像アップロード（webp最適化）、記事内画像の出典登録
- 要点まとめ・学べること(list)、参照ソース / FAQ / 関連リンク（動的行）、タグ、SEOタイトル/説明/キーワード
- 下書き保存 / 公開

> 記事URLは大カテゴリ配下・独立を問わず `/articles/{記事カテゴリ}/{slug}` に統一。section 固有の記事ルート（`/{major}/{section}/articles/...`）は廃止済み（記事はカテゴリ単位で `/articles/{記事カテゴリ}` から閲覧）。<br>
> Markdown 記法・記事内画像の差し込み・画像ホスト制約など、コンテンツ作成の前提知識は [db-content-authoring-knowledge.md](./db-content-authoring-knowledge.md) を参照。

---

## 保存時の自動処理（共通）

1. **canonical_path 生成**
   - item: `item_path_segment` があれば `/{major}/{section}/{item_path_segment}/{slug}`、無ければ `/{major}/{section}/{slug}`（作品カタログ型）
   - ranking: `/{major}/{section}/rankings/{slug}`
   - article: `/articles/{記事カテゴリ}/{slug}`（大カテゴリ配下・独立を問わず統一。アプリは category+slug から表示URLを導出する）
2. **major_category / section_slug / item_class** を section から導出して保存（`item_kind` はスキーマ既定の任意ラベル。記事の major/section は任意の紐づけ）。
3. **専用列・JSONB への集約**（items）: 画像→`image`、所在地→`address_info`（都道府県を住所から抽出）、SEO→`seo`、栄養数値→`nutrition`、`genres`/`sources`/`faq`/`history`/`service_model`/`related_link` を各列へ。型固有項目のみ `metadata` に残す。
4. **slug 重複チェック**（items/rankings は `major_category+section_slug` スコープ・編集時は自分を除外、記事は全体一意）。
5. **revalidate**（詳細・一覧・地域ページ・`/sitemap.xml`）で即時反映。
6. 公開→詳細ページ / 下書き→マイページへリダイレクト。

---

## 一括投入（JSON / CLI）との関係

UI は1件ずつの作成・編集経路。大量投入は同じ DB 構造へ CLI で行える（AI のリミットを使わない運用）:
- 記事: `npm run db:import:articles <json>`（`scripts/import-articles-json.ts`）
- 店舗・ランキング: `scripts/import-research-json.ts`
- いずれも `lib/section-map.ts` のマッピングで canonical / major / section / item_class / item_id を自動付与。画像・所在地・genres・sources・faq 等は新 JSONB 列構造へ投入し、旧 `content_type`・flat 所在地カラム・`last_verified_at` は使わない。

## 補足: region / target の供給元

地域・target の**選択肢**は `es.content_regions` / `es.content_targets`（DB）から供給。region/target 自体の追加UIは未実装で、現状は `scripts/seed-regions-targets.ts`（入力＝`content/*/regions.ts`・`content/protein/targets.ts`）で投入する（静的=入力 / DB=配信）。
