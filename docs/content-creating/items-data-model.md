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

- `item_class`: **physical_service / intangible_service / media / person / product / other**。共通エンジンのブロック切替・JSON-LD 型の最適化軸（section/URL とは独立。例: food でもコンビニ商品は product）。
  - `physical_service`/`intangible_service` は所在地あり（intangible は住所任意）。media/product/person/other は所在地なし。
- `major_category`（food/health/beauty/travel/entertainment/leisure...）× `section_slug`（ramen/cafe/anime…）で URL と一覧をディスパッチ。

---

## スカラー列

| 列 | 型 | 用途 |
|---|---|---|
| `id` | uuid | PK |
| `slug` | text | URL slug（kebab-case） |
| `name` | text | 名称 |
| `description` | text | 短い説明（リード文。一覧カード・メタ説明にも使う） |
| `body_md` | text | **詳細記事本文（Markdown・任意）**。`description` が短いリード文なのに対し、item ごとの事実ベースの長文解説。`MarkdownRenderer` 記法（`##`/`**`/`:::note`/`:::official-image`/`:::link-cards` 等）。既定 `''`、表示はスペックの後・編集部コメントの前 |
| `region` | text | 地域（place の地域分割用）ページpath管理にも使われている |
| `phone` | text | 電話（place） |
| `price_range` | text | 価格帯（place/product） |
| `official_url` | text | 公式サイト（全型） |
| `tags` | text[] | 運用タグ（分類ではなく管理用） |
| `genres` | text[] | **分類ジャンル軸（全型共通・複数可・GIN索引）**につかえるようなもの。anime=ジャンル＋原作、ramen=スープ系統 等 |
| `status` | text | draft / published / archived |
| `editor_comment` | text | 編集部コメント |
| `like_count` / `view_count` | int | エンゲージメント（`like_count` は**現在サイト上では非表示**。いいね機能・データは保持し、数のみ非表示） |
| `major_category` | text | 大カテゴリ |
| `section_slug` | text | section |
| `canonical_path` | text | 正規URLパス 基本的に /[major_category]/[section_slug]/[slug] or /[major_category]/[section_slug]/[region] があるので注意|
| `item_class` | text | physical_service / intangible_service / media / person / product / other |
| `item_kind` | text | 任意（genre 的な補助分類）。travel の agency/app 判定は item_class へ移行済み。あってもなくてもよい |
| `created_at` / `updated_at` | timestamptz | 作成・更新。**`updated_at` は自動更新トリガを外した手動制御列**（INSERT は default now()。以降は明示的に書いた UPDATE のときだけ変わり、通常の編集で自動 now() されない）。表示日付として運用側で調整する。`lastVerifiedAt`（最終確認日）は updated_at 由来 |
| `changed_at` | timestamptz | **データ変更検知用（非表示）**。INSERT/UPDATE でトリガ `es.set_changed_at()` が `now()` を入れる。差分 on-demand revalidation（`/api/revalidate` 既定の差分モード）が「前回以降に変わった行」を判定するのに使う。表示・SEO・並び替えには一切使わない（`updated_at` の手動調整と干渉させないための専用列） |

### 旧カラム（DROP 済み 2026-06）
`image_url` → `image.url` ／ `address` `area` `map_url` `address_region` `latitude` `longitude` → `address_info` ／ `seo_title` `seo_description` → `seo`。
`item_kind` のみ travel(agency/app)判定・canonical でまだ使用中のため残置。

---

## JSONB 列：何を入れるか

### `metadata` — 型固有フィールド（`content_sections.item_schema` が定義）
section ごとに異なる項目を保持。**専用列へ移したキーはここに入れない**（列が正）：`sources` / `faqs` → 専用列、`genre`/`genres` → `genres` 列、`official_links` / `related_ranking_slugs` / `related_item_slugs` → `related_link` 列、`access` → `address_info`、栄養成分 → `nutrition`（下記）。
- place 例: `business_hours`, `closed_days`, `parking`, `best_for`, `recommended_menu`, salon の `treatments`/`men_welcome`, hotel の `onsen`/`meals`, cafe の `wifi`/`power` 等
- work(media) 例: `media_types`, `content_category`, `tone`, `anime_profile`, `viewing_guide` 等
- product(食品商品・汎用) 例: `product_type`(種類/分類), `variants`(フレーバー等), `targets`, `package_weight`/`package_price`/`price_per_kg`, `allergens`, `storage`, `pros`, `cons`（栄養成分は構造化 `nutrition`）

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
  "area": "新潟市西区",                      // エリア（市区・地区）
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
※ 旧 `official_links`（公式は `official_url` 列・地図は `address_info.map_url`）／`related_ranking_slugs`／`related_item_slugs` はすべてこの列へ統合済み。

### `nutrition` — 栄養成分（食品商品・汎用／engine の NutritionBlock で表示）
```jsonc
{
  "basis": "per_serving",   // または "per_100g"（表示基準）
  "serving_size": 35,        // 1食/単位量(g)
  "calories": 142, "protein": 24.2, "fat": 2.9, "carbs": 4.7,
  "sugar": null, "fiber": null, "salt": null   // 任意
}
```
※ `item_class = product` の食品（プロテイン・冷凍食品・コンビニ商品・菓子・飲料等）共通。admin では栄養を数値フィールドで入力し、保存時に `saveItem` が `nutrition` へ自動集約。`product_type`/`variants` と合わせ、新しい食品 section を足すだけで同じ ProductLayout＋NutritionBlock に乗る。

---

## 索引
- `items_major_section_idx` (`major_category`, `section_slug`) btree — section ディスパッチ
- `items_genres_gin_idx` (`genres`) GIN — ジャンル絞り込み（`genres @> '{異世界}'` 等）


## 関連
