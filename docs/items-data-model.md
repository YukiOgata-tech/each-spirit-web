# items データモデル（汎用アイテム基盤）

> `es.items` は「飲食店・施設」専用構造から、** “どんなモノ” も同一テーブルで扱える汎用コンテンツ基盤**へ再設計中。型固有データは JSONB に持ち、`es.content_sections.item_schema` が「どの section がどのキーを・どんな型で持つか」を定義する。
>
> このファイルは **現在の items テーブル構造と、各 JSONB に何を入れるか** の正（single source of truth）。スキーマを変えたら必ずここを更新する。

## 設計原則

1. **すべては 1 row** — 店舗も作品も商品もアプリも `es.items` の1行。
2. **共通項目はスカラー列、型固有は JSONB**（`metadata` ＋ 専用 JSONB 列）。
3. **型固有 JSONB の中身は `content_sections.item_schema` が定義・検証**（自由投げ込みにしない）。
4. **横断検索はしない方針** → 検索専用テーブル（item_facets 等）は持たない。分類軸 `genres` のみ GIN で絞り込み可能。
5. **非破壊移行中** — 旧カラム（`image_url` / `address` 系 / `seo_*` / `item_kind`）は当面残し、アプリを新カラム参照へ切替（Phase 2）後に DROP（Phase 3）。

## クラス分け

- `item_class`: **place / work / product ...** UI 分岐・JSON-LD 型の最適化に使用。
- `major_category`（food/health/beauty/travel/entertainment/leisure...）× `section_slug`（ramen/cafe/anime…）で URL と一覧をディスパッチ。

---

## スカラー列

| 列 | 型 | 用途 |
|---|---|---|
| `id` | uuid | PK |
| `slug` | text | URL slug（kebab-case） |
| `name` | text | 名称 |
| `description` | text | 説明 |
| `region` | text | 地域（place の地域分割用） |
| `phone` | text | 電話（place） |
| `price_range` | text | 価格帯（place/product） |
| `official_url` | text | 公式サイト（全型） |
| `tags` | text[] | 運用タグ（分類ではなく管理用） |
| `genres` | text[] | **分類ジャンル軸（全型共通・複数可・GIN索引）**につかえるようなもの。anime=ジャンル＋原作、ramen=スープ系統 等 |
| `status` | text | draft / published / archived |
| `editor_comment` | text | 編集部コメント |
| `like_count` / `view_count` | int | エンゲージメント |
| `major_category` | text | 大カテゴリ |
| `section_slug` | text | section |
| `canonical_path` | text | 正規URLパス 基本的に /[major_category]/[section_slug]/[slug] or /[major_category]/[section_slug]/[region] があるので注意|
| `item_class` | text | place / work / product |
| `item_kind` | text | ⚠️旧・形態値（anime_movie 等）。`genres` へ統合予定（Phase 2 で廃止候補） |
| `created_at` / `updated_at` | timestamptz | 作成・更新（`lastVerifiedAt` は updated_at 由来） |

### 旧カラム（移行済み・Phase 3 で DROP 予定）
`image_url` → `image.url` ／ `address` `area` `map_url` `address_region` `latitude` `longitude` → `address_info` ／ `seo_title` `seo_description` → `seo`。
※データはすべて新 JSONB へ漏れなく移行済み（検証済み）。現状はアプリが旧カラムを読むため残置。

---

## JSONB 列：何を入れるか

### `metadata` — 型固有フィールド（`content_sections.item_schema` が定義）
section ごとに異なる項目を保持。** `faqs`/`sources`/`genre` はここに入れない**。
- place 例: `business_hours`, `closed_days`, `parking`, `best_for`, `recommended_menu`, salon の `treatments`/`men_welcome`, hotel の `onsen`/`meals`, cafe の `wifi`/`power` 等
- work 例: `media_types`, `content_category`, `tone`, `anime_profile`, `viewing_guide` 等
- product 例: `brand`, `protein`, `calories`, `carbs`, `fat`, `serving_size`, `flavors`, `pros`, `cons` 等
- ⚠️現状 `official_links` / `related_ranking_slugs` / `access` も metadata に残存（`access` は address_info にも複製済み。`official_links`→`related_link`、ランキング参照→`related_link` への整理は Phase 2 候補）

### `image` — items個別ページのトップ画像
```jsonc
{
  "url": "https://…/photo.jpg",            // 主画像（必須）
  "alt": "店舗外観",                        // 代替テキスト（空なら描画時 name でフォールバック）
  "credit": { "name": "○○公式", "url": "https://…" },  // 出典クレジット（任意・上書き用）
}
```

### `address_info` — 所在地
```jsonc
{
  "address": "新潟県新潟市西区笠木3629番地1",
  "prefecture": "新潟県",                   // JSON-LD addressRegion
  "lat": 37.9, "lng": 139.0,               // 緯度経度（任意）
  "map_url": "https://maps.google.com/?q=…",
  "access": "○○駅から徒歩5分"               // アクセス説明（任意）
}
```

### `seo` — SEO 上書き（任意。空なら name/description/image から自動生成）
```jsonc
{
  "title": "…",            // <title>・OG title 上書き
  "description": "…",      // meta description 上書き
  "keywords": ["…","…"],   // 任意
  "og_image": "https://…"  // OG 画像上書き（任意）
}
```

### `sources` — 出典・引用元（全型共通。E-E-A-T／事実照合用）
```jsonc
[
  { "url": "https://…", "title": "○○公式サイト", "source_type": "official", "collected_at": "2026-06-08" }
]
```
※ページに「参照情報」として表示＋JSON-LD `citation` へ出力。**related_link（読者の回遊先）とは別物**。

### `faq` — よくある質問
```jsonc
[ { "q": "駐車場はありますか？", "a": "7台あります。" }... ] // 数任意
```

### `history` — 経歴・沿革（日付付き）
```jsonc
[ { "date": "2020-04-01", "description": "…" }, { "date": "2020 ~ 2023", "description": "…" }  ] //
```

### `service_model` — 視聴/購入手段（映像作品・商品向け。共通エンジン表示用）
```jsonc
[ { "service": "Netflix", "url": "https://…", "note": "見放題" } ]
```

### `related_link` — 関連ページ（読者の回遊先）
```jsonc
[ { "label": "○○のランキングを見る", "url": "/entertainment/anime/rankings/…" } ] // 他のWEBサイトも可
```

---

## 索引
- `items_major_section_idx` (`major_category`, `section_slug`) btree — section ディスパッチ
- `items_genres_gin_idx` (`genres`) GIN — ジャンル絞り込み（`genres @> '{異世界}'` 等）


## 関連
- 大カテゴリ×section の全体設計: [universal-item-base-plan.md](./universal-item-base-plan.md)
- パス/slug 規則: [content-display-path-slug-spec.md](./content-display-path-slug-spec.md)
