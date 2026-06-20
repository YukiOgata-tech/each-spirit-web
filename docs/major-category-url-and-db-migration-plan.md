# 大カテゴリURL・DB管理移行計画

## 最終方針

Each Spirit は、トップページと `/fortune` 以外の公開コンテンツを Supabase `es` スキーマ中心で管理する。大カテゴリだけをリポジトリ側で固定し、中カテゴリ、記事、items、rankings はDB管理を正とする。

大カテゴリ:

- `food`: グルメ
- `health`: 健康
- `beauty`: 美容
- `travel`: 旅行
- `leisure`: レジャー

中カテゴリは `es.content_sections` で管理する。例: `food/ramen`, `food/cafe`, `health/protein`, `beauty/hair-salon`, `travel/stays`, `travel/services`, `leisure/spots`。

## URL 方針

canonical URL は以下に統一する。

```txt
/{major}
/{major}/{section}
/{major}/{section}/{region}

/{major}/{section}/articles
/{major}/{section}/articles/{slug}

/{major}/{section}/rankings
/{major}/{section}/rankings/{slug}

/{major}/{section}/{item_path_segment}/{slug}
```

地域ページは作る。ただし、item詳細・ranking詳細の canonical URL には region を入れない。地域はDBの `region`、地域ページ、一覧フィルタ、内部導線で扱う。

例:

```txt
/food/cafe
/food/cafe/niigata
/food/cafe/articles
/food/cafe/articles/example
/food/cafe/rankings
/food/cafe/rankings/niigata-atmosphere-cafe
/food/cafe/shops/cafe-hayashi-joetsu
```

独立記事だけは大カテゴリに属さない投稿として許可する。

```txt
/articles
/articles/{slug}
```

## 既存データの移行先

```txt
/food/ramen
/food/ramen/{region}
/food/ramen/rankings/{slug}
/food/ramen/shops/{slug}

/food/cafe
/food/cafe/{region}
/food/cafe/rankings/{slug}
/food/cafe/shops/{slug}

/health/protein
/health/protein/{target}
/health/protein/{target}/rankings/{slug}
/health/protein/products/{slug}

/beauty/hair-salon
/beauty/hair-salon/{region}
/beauty/hair-salon/rankings/{slug}
/beauty/hair-salon/salons/{slug}

/travel/stays
/travel/stays/{region}
/travel/stays/rankings/{slug}
/travel/stays/hotels/{slug}

/travel/services
/travel/services/apps
/travel/services/{region}
/travel/services/rankings/{slug}
/travel/services/agencies/{slug}

/leisure/spots
/leisure/spots/{region}
/leisure/spots/rankings/{slug}
/leisure/spots/spots/{slug}
```

旧トップレベルの `/ramen`, `/cafe`, `/protein`, `/travel-services` は route として残さない。旧URLはリダイレクトではなく削除する方針。

## App Router 構成

大カテゴリごとにrouteを分け、majorごとのデザイン差分を出しやすくする。

```txt
app/food/[section]/**
app/health/[section]/**
app/beauty/[section]/**
app/travel/[section]/**
app/leisure/[section]/**
```

中カテゴリごとの固定フォルダは作らない。既存ページ実装は `components/legacy-pages/**` に退避し、動的routeから呼び出す。

## DB 設計

公開コンテンツの識別は `content_type` ではなく、以下を正とする。

```txt
major_category + section_slug + slug
```

items は同じ section 内に複数種別を持つ可能性があるため、`item_kind` を持つ。

```txt
major_category + section_slug + item_kind + slug
```

主なテーブル:

- `es.content_sections`: 大カテゴリ配下の中カテゴリ管理
- `es.articles`: 記事
- `es.items`: 店舗・商品・施設・アプリなど
- `es.rankings`: ランキング
- `es.ranking_items`: ランキングとitemsの紐づけ

追加済み/追加予定の主要カラム:

- `major_category`
- `section_slug`
- `canonical_path`
- `item_kind` in `es.items`
- `item_id` in `es.ranking_items`

`content_type` / `item_content_type` は旧互換カラムであり、新規実装の正にはしない。最終的には参照を外し、削除候補にする。

## content_sections

`es.content_sections` の主なカラム:

- `major_category`
- `section_slug`
- `label`
- `description`
- `href`
- `content_model`
- `item_path_segment`
- `region_mode`
- `target_mode`
- `display_config`
- `seo_config`
- `metadata`

`content_sections` は RLS を有効化し、`published` のみ `anon` / `authenticated` から読めるようにする。

## 達成済み

- 大カテゴリrouteを作成
- 旧トップレベルrouteを削除
- `components/legacy-pages/**` へ既存ページを退避
- `es.content_sections` を作成
- `articles/items/rankings` に `major_category`, `section_slug`, `canonical_path` を追加
- `items/rankings` に `major_category + section_slug + slug` の一意indexを追加
- `ranking_items.item_id` を追加
- item/ranking canonical URL を region なしの形へ更新
- `items.item_kind` を追加し、既存主要 item を backfill
- 新canonical詳細routeを追加
- 旧region入り詳細routeを削除
- `/{major}/{section}/articles` の一覧routeを追加
- `/{major}/{section}/rankings` の一覧routeを追加
- `lib/content.ts` の主要 item/ranking query を `major_category + section_slug` ベースへ移行
- 検索のカテゴリ結果を `es.content_sections` ベースへ移行

## 残タスク

- `lib/content.ts` の travel services item query を `content_type` ではなく `major_category + section_slug + item_kind` へ移行する
- likes/reviews/counts の識別設計を `content_type + content_id` から canonical content key へ移行する
- seed/import scripts を新DB構成へ更新する
- `/account/items/new`, `/account/items/{id}/edit`, `/account/rankings/new`, `/account/rankings/{id}/edit` を実装する

## 失われるもの・使えなくなるもの

DBの既存行は削除しない。使えなくなるのは旧URLとしての到達性。

- `/ramen/**`
- `/cafe/**`
- `/protein/**`
- `/travel-services/**`
- `/travel/{region}/**`
- `/beauty/{region}/**`
- `/leisure/{region}/**`
- `/articles/{category}/**`
- `/{category}` や `/{category}/{slug}` の旧汎用記事route

詳細URLの旧region入りrouteも削除対象。

- `/{major}/{section}/{region}/rankings/{slug}`
- `/{major}/{section}/{region}/{item_path_segment}/{slug}`
