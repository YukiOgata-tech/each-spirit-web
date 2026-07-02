# ランキングコンテンツ運用ガイド

最終確認日: 2026-07-02

このドキュメントは、Each Spirit のランキングコンテンツだけを対象に、現在のデータ型、公開方針、注意点、データ投入方法を整理したものです。根拠は `lib/types.ts`、`lib/content.ts`、`lib/admin-ranking-schema.ts`、`app/account/rankings/actions.ts`、公開ルート、`supabase/migrations/` の現行実装です。

## 1. 基本方針

ランキングは `es.rankings` を本体、`es.ranking_items` を順位項目として持つコンテンツです。

- ランキング本体は必ず `major_category + section_slug + slug` に属します。
- ランキング項目は、既存 `es.items` 参照と手入力項目の混在に対応します。
- 既存 item がある項目は内部詳細ページへリンクします。
- item がない手入力項目は、外部URLがあれば外部リンク、なければ非リンクの表示項目になります。
- 専用デザインページがある section でも、手入力項目を含むランキングは汎用ランキング詳細ページに fallback します。
- プロテインランキングだけは target 付きURLを正規URLにします。

## 2. 対応 section

管理画面で作成できるランキング section は `lib/admin-ranking-schema.ts` の `RANKING_SECTIONS` が基準です。

| key | 用途 | region | target |
|---|---|---:|---:|
| `food:ramen` | ラーメンランキング | 任意 | なし |
| `food:cafe` | カフェランキング | 必須 | なし |
| `health:protein` | プロテインランキング | なし | 必須 |
| `beauty:hair-salon` | 美容室ランキング | 必須 | なし |
| `travel:stays` | 宿・ホテルランキング | 必須 | なし |
| `travel:services` | 旅行会社ランキング | 必須 | なし |
| `leisure:spots` | レジャーランキング | 必須 | なし |

上記以外の section も公開側の汎用ランキングページでは扱えますが、管理画面の選択肢には現時点で出ません。追加する場合は `RANKING_SECTIONS` と必要な item schema / section 定義を揃えます。

## 3. DB構造

### `es.rankings`

主な列:

| 列 | 型 | 用途 |
|---|---|---|
| `id` | uuid | 主キー |
| `slug` | text | section 内のランキングslug |
| `major_category` | text | 大カテゴリ |
| `section_slug` | text | section |
| `canonical_path` | text | 正規URL |
| `region` | text | 地域。section により必須/任意/なし |
| `title` | text | タイトル |
| `description` | text | 概要文 |
| `image_url` | text | カード/OG/hero用画像。空なら上位項目画像を fallback |
| `conclusion` | text | まとめ・編集部結論 |
| `quick_table_label` | text | スコア表示ラベル |
| `criteria` | text[] | 評価軸 |
| `tags` | text[] | タグ |
| `status` | text | `draft` / `published` / `archived` |
| `last_updated_at` | date | 公開上の更新日 |
| `metadata` | jsonb | 追加情報。プロテインの `target` など |
| `like_count` / `view_count` | integer | 集計用 |

制約・index:

- `status` は `draft`, `published`, `archived` のみ。
- `major_category` と `section_slug` がある行は、`major_category + section_slug + slug` が一意。
- 公開読み取りは RLS policy により `status = 'published'` のみ。

### `es.ranking_items`

主な列:

| 列 | 型 | 用途 |
|---|---|---|
| `id` | uuid | 主キー |
| `ranking_id` | uuid | `es.rankings.id` へのFK |
| `rank` | smallint | 順位。1以上 |
| `entry_kind` | text | `item` または `manual` |
| `item_id` | uuid | 既存 item 参照時の `es.items.id` |
| `item_slug` | text | 既存 item slug または手入力項目slug |
| `display_name` | text | 手入力項目の表示名 |
| `description` | text | 手入力項目の説明 |
| `external_url` | text | 手入力項目の外部リンク |
| `image_url` | text | 手入力項目の画像 |
| `image_alt` | text | 手入力項目画像のalt |
| `price_range` | text | 価格帯など |
| `area` | text | エリア・補足 |
| `tags` | text[] | 手入力項目タグ |
| `metadata` | jsonb | 追加情報。項目別アフィリエイト検索語 `affiliate_query` など |
| `score` | numeric | スコア |
| `reason` | text | 掲載理由 |
| `is_pr` | boolean | PR表示 |
| `metadata` | jsonb | 追加情報 |

制約・index:

- `ranking_id + rank` は一意。
- `entry_kind` は `item` / `manual` のみ。
- `ranking_id` 削除時、項目は cascade delete。
- `item_id` がある場合、`es.items.id` を参照します。

## 4. TypeScript上の公開型

公開側の汎用ランキング型は `lib/types.ts` の `Ranking` と `RankingItem` です。

```ts
type Ranking = {
  slug: string;
  title: string;
  description: string;
  majorCategory?: string;
  sectionSlug?: string;
  canonicalPath?: string;
  imageUrl?: string;
  region?: string;
  target?: string;
  criteria: string[];
  conclusion: string;
  quickTableLabel: string;
  lastUpdatedAt: string;
  items: RankingItem[];
  sources: Source[];
  faqs: FAQ[];
};
```

```ts
type RankingItem = {
  rank: number;
  entryKind?: "item" | "manual";
  itemSlug: string;
  displayName?: string;
  description?: string;
  externalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  priceRange?: string;
  area?: string;
  tags?: string[];
  affiliateQuery?: string;
  metadata?: Record<string, unknown>;
  score: number;
  reason: string;
  isPr: boolean;
};
```

管理画面の入力行は `RankingItemRow` で、手入力用の `displayName`、`externalUrl`、`imageUrl`、`tags` などを文字列で保持し、保存時にDB列へ変換します。

## 5. URLとcanonical

### 通常ランキング

通常のランキング詳細URLは以下です。

```txt
/{major_category}/{section_slug}/rankings/{slug}
```

例:

```txt
/food/ramen/rankings/niigata-ramen-best
/beauty/hair-salon/rankings/niigata-hair-salon-ranking
```

`rankingHref()` は原則として `canonical_path` を使い、なければ section ranking URL を生成します。

### プロテインランキング

プロテインランキングだけは `metadata.target` を使った target 付きURLが正規です。

```txt
/health/protein/{target}/rankings/{slug}
```

例:

```txt
/health/protein/men/rankings/protein-ranking-men
/health/protein/beginner/rankings/protein-ranking-beginner
```

`/health/protein/rankings/{slug}` は互換入口として存在しますが、公開時は target 付きURLへ `permanentRedirect` します。target 付きURLでも、URL上の `{target}` とDB上の `metadata.target` が違う場合は正規URLへ `permanentRedirect` します。

## 6. 表示ロジック

### 一覧

section のランキング一覧は `SectionRankingsIndex` / `GenericSectionPages` が `getRankingsBySection()` を使って取得します。

- `status = 'published'` のみ表示。
- `last_updated_at` 降順。
- リンク先は `rankingHref()` で決まります。

### 詳細

汎用ランキング詳細は `GenericRankingDetailPage` です。

- `getRankingEntriesBySection()` で ranking と section 内 item を解決します。
- 既存 item が見つかった項目は item 詳細へ内部リンクします。
- 手入力項目は `display_name` を表示名に使います。
- 手入力項目に `external_url` があれば外部リンク、なければ非リンクのカードになります。
- `AffiliateSurface` はランキング単位で表示されます。
- `ranking_items.metadata.affiliate_query` がある項目は、カード内に項目別のアフィリエイトリンクを表示します。

### 専用ページとfallback

以下の section には専用デザインページがあります。

- `food:ramen`
- `food:cafe`
- `health:protein`
- `beauty:hair-salon`
- `travel:stays`
- `travel:services`
- `leisure:spots`

ただし、ランキングに `entry_kind = 'manual'` の項目が含まれる場合、専用ページではなく `GenericRankingDetailPage` に fallback します。専用ページは基本的に既存 item 前提のため、手入力項目を落とさないための設計です。

## 7. データ投入方法

### 推奨: 管理画面

通常は `/account/rankings/new` から作成します。

1. `カテゴリ(section)` を選ぶ。
2. `slug`、`タイトル`、`説明`、`画像URL`、`結論`、`評価軸`、`タグ`、`最終更新日`、`ステータス` を入力。
3. region 必須 section は `region` を選ぶ。
4. プロテインは `target` を必ず選ぶ。
5. ランキング項目を追加する。
6. 項目タイプを `既存item` または `手入力` から選ぶ。
7. 保存する。

保存時の挙動:

- `slug` は英小文字・数字・ハイフン形式へ正規化されます。
- 同一 `major_category + section_slug + slug` は重複不可です。
- ランキング本体を insert/update します。
- 既存の `ranking_items` は一度削除され、送信された行で全置換されます。
- `revalidateTag(ES_CONTENT_CACHE_TAG)` と関連 path の `revalidatePath()` が実行されます。
- 公開保存時は `canonical_path` へ redirect します。

### 既存item項目

`entry_kind = 'item'` の行です。

必須:

- `item_slug`: 同じ `major_category + section_slug` に存在する item の slug
- `rank`

保存時:

- 同じ section の `es.items` から `item_id` を解決します。
- item が見つからない行は保存対象から外れます。
- 公開ページでは item の `canonical_path` または section item URL へリンクします。

### 手入力項目

`entry_kind = 'manual'` の行です。

最低限必要:

- `display_name`
- `rank`

推奨:

- `item_slug`
- `description`
- `external_url`
- `image_url`
- `image_alt`
- `price_range`
- `area`
- `tags`
- `metadata.affiliate_query`
- `reason`
- `score`

保存時:

- `item_id` は `null` になります。
- `display_name` が空の manual 行は保存されません。
- `item_slug` が空なら、表示名または順位から slug が補完されます。
- `tags` はカンマ/改行区切りから `text[]` に変換されます。

## 8. SQL投入時の注意

DBへ直接投入する場合も、管理画面と同じ構造に合わせます。Supabase 操作は原則 MCP 経由で行います。

### 既存item項目の例

```sql
insert into es.rankings (
  slug, major_category, section_slug, canonical_path,
  region, title, description, conclusion, quick_table_label,
  criteria, tags, status, last_updated_at, metadata
) values (
  'sample-ranking',
  'food',
  'ramen',
  '/food/ramen/rankings/sample-ranking',
  'niigata',
  'サンプルランキング',
  '説明文',
  'まとめ',
  'スコア',
  array['味', '価格', 'アクセス'],
  array['新潟', 'ラーメン'],
  'published',
  current_date,
  '{}'::jsonb
)
returning id;
```

```sql
insert into es.ranking_items (
  ranking_id, rank, entry_kind, item_slug, item_id, score, reason, is_pr
) values (
  '<ranking_id>',
  1,
  'item',
  'existing-item-slug',
  '<item_id>',
  92,
  '評価理由',
  false
);
```

### 手入力項目の例

```sql
insert into es.ranking_items (
  ranking_id, rank, entry_kind, item_slug, display_name,
  description, external_url, image_url, image_alt,
  price_range, area, tags, score, reason, is_pr
) values (
  '<ranking_id>',
  1,
  'manual',
  'manual-entry-slug',
  '手入力の掲載名',
  '項目説明',
  'https://example.com/',
  'https://example.com/image.webp',
  '画像の説明',
  '3,000円前後',
  '新潟市',
  array['初心者向け', '比較対象'],
  88,
  '掲載理由',
  false
);
```

項目ごとに Amazon / 楽天などの購入導線を出したい場合は、`metadata.affiliate_query` に検索語を入れます。書籍なら「書籍名 著者名」、商品なら「商品名 ブランド名」を推奨します。

```sql
update es.ranking_items
set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'affiliate_query', '書籍名 著者名'
)
where ranking_id = '<ranking_id>'
  and item_slug = 'book-slug';
```

### プロテインランキングの例

プロテインは `metadata.target` と `canonical_path` を必ず揃えます。

```sql
insert into es.rankings (
  slug, major_category, section_slug, canonical_path,
  title, description, status, last_updated_at, metadata
) values (
  'protein-ranking-men',
  'health',
  'protein',
  '/health/protein/men/rankings/protein-ranking-men',
  '男性向けプロテインランキング',
  '説明文',
  'published',
  current_date,
  '{"target":"men"}'::jsonb
);
```

## 9. SEOとsitemap

- 通常 ranking detail は `/{major}/{section}/rankings/{slug}`。
- プロテイン ranking detail は `/health/protein/{target}/rankings/{slug}`。
- `app/sitemap.ts` はプロテインランキングを target 付きURLで出力します。
- section のランキング一覧URL `/{major}/{section}/rankings` は `content_sections` から sitemap に列挙されます。
- 互換URLや target 不一致URLは `permanentRedirect` で正規URLへ寄せます。
- 重複URLを増やさないため、DB直接投入時も `canonical_path` を公開方針に合わせてください。

## 10. 注意点

- `ranking_items` は保存時に全置換されるため、管理画面外で追加した項目は次回保存時に消える可能性があります。
- 既存item項目は、同じ section に item が存在しないと保存されません。
- 手入力項目は item 詳細ページを持ちません。詳細ページが必要になったら item を作成し、ランキング項目を `entry_kind = 'item'` に切り替えます。
- 専用デザインページは既存 item 前提です。手入力項目を含めると汎用詳細ページに切り替わります。
- プロテインは target 必須です。`metadata.target`、URL、`canonical_path` を不一致にしないでください。
- `image_url` が空の場合、ランキング画像は上位 item または手入力項目の画像へ fallback します。
- `sources` と `faqs` は現在 `metadata.sources` / `metadata.faqs` から公開型へ map されます。管理画面の基本フォームでは主要入力対象ではないため、必要な場合は編集UI拡張またはDB直接編集を検討します。
- `affiliate_targets` に `target_kind = 'ranking'` の行を作ると、ランキング単位の `AffiliateSurface` 表示対象になります。
- 順位項目ごとの購入導線は `ranking_items.metadata.affiliate_query` から生成します。個別商品URLを固定したい場合は、今後 `affiliate_links` と項目単位の target 設計を追加検討します。

## 11. 検証状況

今回の文書化では、以下をローカル実装から確認しました。

- `lib/types.ts` の `Ranking` / `RankingItem`
- `lib/admin-ranking-schema.ts` の管理画面 section と入力行型
- `app/account/rankings/actions.ts` の保存・全置換・canonical・revalidate
- `lib/content.ts` の取得・mapping・`rankingHref()`
- `components/generic/GenericSectionPages.tsx` の汎用表示
- 各 `app/{major}/[section]/rankings/[slug]/page.tsx` の専用ページ fallback
- `app/sitemap.ts` のプロテイン target 付きURL出力
- `supabase/migrations/20260624120000_es_initial_schema.sql`
- `supabase/migrations/20260701215229_extend_ranking_items_manual_entries.sql`
- `supabase/migrations/20260702093000_normalize_protein_ranking_canonical_paths.sql`

2026-07-02 の直前作業で、Supabase MCP により `normalize_protein_ranking_canonical_paths` の適用とプロテイン `canonical_path` の target 付きURL化は確認済みです。一方、このドキュメント作成時点では MCP SQL が利用上限で拒否されたため、リモートDBの全列・全制約を再照会する確認は未実施です。DB実スキーマの再監査が必要な場合は、MCP利用可能状態で `information_schema.columns`、`pg_constraint`、`pg_indexes` を再確認してください。
