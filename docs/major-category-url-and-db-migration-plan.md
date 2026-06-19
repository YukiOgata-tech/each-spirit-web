# Major Category URL and DB Migration Plan

## Goal

Each Spirit を、個別ジャンルがトップレベルに散らばる小規模サイト構造から、汎用性の高い大規模情報サイト構造へ移行する。

確定する大カテゴリは以下。（今後拡張していく）

- `food`
- `health`
- `beauty`
- `travel`
- `leisure`

今後は、トップページの演出部分と `/fortune` を除き、公開コンテンツは Supabase `es` スキーマを正とする。大カテゴリそのものを追加するときだけリポジトリを編集し、UI・デザイン・ルーティング・専用コンポーネントを実装する。記事、ランキング、items/shops/products/spots などの通常コンテンツは、管理UIまたは import 処理から DB に投入して公開する。

## Final URL Policy

### 大カテゴリ（現時点）

大カテゴリはリポジトリ側で route と UI を持つ。

```txt
/food
/health
/beauty
/travel
/leisure
```

大カテゴリページは、その配下の小ジャンル、ランキング、items、記事導線を DB から取得して構成する。ただし、大カテゴリごとの見た目、ヒーロー、情報設計、カード表現はリポジトリ側で個別実装してよい。

### 小ジャンル・専用ページ

既存データの移行先は以下を基本にする。

```txt
/food/ramen
/food/ramen/[region]
/food/ramen/rankings/[slug]
/food/ramen/shops/[slug]

/food/cafe
/food/cafe/[region]
/food/cafe/rankings/[slug]
/food/cafe/shops/[slug]

/health/protein
/health/protein/[target]
/health/protein/products/[slug]
/health/protein/[target]/rankings/[slug]

/beauty/hair-salon
/beauty/hair-salon/[region]
/beauty/hair-salon/rankings/[slug]
/beauty/hair-salon/salons/[slug]

/travel/stays
/travel/stays/[region]
/travel/stays/[region]/rankings/[slug]
/travel/stays/[region]/hotels/[slug]

/travel/services
/travel/services/apps
/travel/services/[region]
/travel/services/[region]/rankings/[slug]
/travel/services/[region]/agencies/[slug]

/leisure/[region]
/leisure/[region]/rankings/[slug]
/leisure/[region]/spots/[slug]
```

補足:

- `ramen` というトップレベル path は廃止する。
- `cafe` というトップレベル path も廃止し、`/food/cafe` へ移す。
- `protein` は `/health/protein` へ移す。
- `travel-services` は `/travel/services` へ移す。
- 店舗系のURLは、DB内部の `items` という名前をそのまま出さず、公開URLでは `shops`, `salons`, `hotels`, `agencies`, `spots`, `products` など、ユーザーに自然な名前を使う。

### 記事

記事は大カテゴリ配下を標準の canonical route にする。大カテゴリの文脈をURL上でも明示し、`/food`、`/health`、`/beauty`、`/travel`、`/leisure` の各ハブから自然に記事一覧・記事詳細へ導線を作る。

```txt
/[majorCategory]/articles
/[majorCategory]/articles/[slug]
```

例:

```txt
/food/articles/niigata-ramen-first-guide
/food/articles/shokudo-ajiyoshi-niigata-kobari
/health/articles/protein-beginner-guide
/beauty/articles/niigata-hair-color-guide
/travel/articles/yamagata-onsen-stay-guide
/leisure/articles/niigata-rainy-day-spots
```

ただし、記事作成UIでは大カテゴリ配下に置かない独立記事も作成できるようにする。この場合は、以下を canonical route とする。

```txt
/articles
/articles/[slug]
```

独立記事の用途:

- サイト全体のお知らせ
- 特定大カテゴリに寄せない編集記事
- 複数カテゴリをまたぐ横断記事
- 将来の特集・ニュース・ブログ的な自由題材

独立記事は `major_category` を `null` にできる。ただし、SEO・一覧表示・内部導線のために、任意の `primary_topic` または `section_slug` は設定できるようにする。

既存の `/articles/[category]/[slug]` 方針は採用しない。必要であれば互換用 redirect のみ置く。

```txt
/articles/food/example -> /food/articles/example
/articles/health/example -> /health/articles/example
```

記事作成UIでは、投稿者が以下を入力・選択する。

- 配置: 大カテゴリ配下 / 独立記事
- 大カテゴリ: `food`, `health`, `beauty`, `travel`, `leisure`（大カテゴリ配下の場合は必須）
- 独自 slug
- 任意の小ジャンル/トピック: `ramen`, `cafe`, `protein`, `hair-salon`, `stays`, `services` など
- 任意の region
- title / description / body / thumbnail / sources / FAQ / related links

記事の canonical URL は、大カテゴリ配下なら必ず `/[majorCategory]/articles/[slug]`、独立記事なら `/articles/[slug]` にする。

## Existing Category Mapping

| Existing slug/content type | New major category | New section slug | New public path |
| --- | --- | --- | --- |
| `ramen`, `ramen_item` | `food` | `ramen` | `/food/ramen` |
| `cafe` | `food` | `cafe` | `/food/cafe` |
| `protein` | `health` | `protein` | `/health/protein` |
| `beauty`, `beauty_salon` | `beauty` | `hair-salon` | `/beauty/hair-salon` |
| `hotel`, old `travel` | `travel` | `stays` | `/travel/stays` |
| `travel_agency`, `travel_app`, old `travel-services` | `travel` | `services` | `/travel/services` |
| `leisure`, `leisure_spot` | `leisure` | `spots` or region-root | `/leisure` |
| planned `gadget` | future, not in current fixed list | likely `tech` if added later | not now |
| planned `tools` | future, not in current fixed list | likely `business-tools` if added later | not now |
| planned `life` | future, not in current fixed list | likely `life` if added later | not now |

## DB Design

既存の `es.articles`, `es.items`, `es.rankings`, `es.ranking_items` は活用する。大規模移行では、既存カラムを無理に破壊せず、URL設計に必要なカラムを追加して段階移行する。

### Add columns

`es.articles`:

```sql
alter table es.articles
  add column if not exists major_category text,
  add column if not exists section_slug text,
  add column if not exists canonical_path text;
```

`es.items`:

```sql
alter table es.items
  add column if not exists major_category text,
  add column if not exists section_slug text,
  add column if not exists canonical_path text;
```

`es.rankings`:

```sql
alter table es.rankings
  add column if not exists major_category text,
  add column if not exists section_slug text,
  add column if not exists canonical_path text;
```

意味:

- `major_category`: URL上の大カテゴリ。`food`, `health`, `beauty`, `travel`, `leisure`
- `section_slug`: 大カテゴリ配下の小ジャンル。`ramen`, `cafe`, `protein`, `hair-salon`, `stays`, `services` など
- `canonical_path`: 実際の公開URL。生成ロジックだけに依存させず、DB上でも確認できるようにする

既存の `category` / `content_type` は当面残す。

- `articles.category`: 既存互換のため残す。移行後は `major_category` をURL決定に使う。
- `items.content_type`: データ種別として残す。例: `ramen_item`, `cafe`, `protein`, `hotel`, `beauty_salon`
- `rankings.content_type`: ランキング種別として残す。例: `ramen`, `cafe`, `protein`, `hotel`, `travel_agency`

### Optional category registry table

大カテゴリや小ジャンルの追加をDBで管理するなら、将来的に以下を追加する。

```sql
create table if not exists es.content_sections (
  id uuid primary key default gen_random_uuid(),
  major_category text not null,
  section_slug text not null,
  label text not null,
  description text not null default '',
  status text not null default 'published' check (status in ('draft','published','archived')),
  sort_order integer not null default 100,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (major_category, section_slug)
);
```

ただし初回移行では、まず route と URL 安定化を優先し、`content/categories.ts` を `majorCategories` の最低限の設定として残してもよい。

## Data Migration Policy

既存DBデータは以下のように更新する。

### Articles

既存:

- `category = 'ramen'` -> `major_category = 'food'`, `section_slug = 'ramen'`, `canonical_path = '/food/articles/' || slug`
- `category = 'cafe'` -> `major_category = 'food'`, `section_slug = 'cafe'`, `canonical_path = '/food/articles/' || slug`
- `category = 'beauty'` -> `major_category = 'beauty'`, `section_slug = 'hair-salon'`, `canonical_path = '/beauty/articles/' || slug`
- `category = 'protein'` -> `major_category = 'health'`, `section_slug = 'protein'`, `canonical_path = '/health/articles/' || slug`
- `category = 'travel'` -> `major_category = 'travel'`, `section_slug = 'stays'`, `canonical_path = '/travel/articles/' || slug`
- `category = 'travel-services'` -> `major_category = 'travel'`, `section_slug = 'services'`, `canonical_path = '/travel/articles/' || slug`
- `category = 'leisure'` -> `major_category = 'leisure'`, `section_slug = 'spots'`, `canonical_path = '/leisure/articles/' || slug`

移行後の新規記事は `category` へ大カテゴリを入れるのではなく、`major_category` をURL決定に使う。大カテゴリ配下の記事では `major_category` を必須、独立記事では `major_category = null` を許可し、`canonical_path = '/articles/' || slug` とする。`category` は旧互換か、将来的に廃止候補。

### Items

既存:

- `content_type = 'ramen_item'` -> `major_category = 'food'`, `section_slug = 'ramen'`, `canonical_path = '/food/ramen/shops/' || slug`
- `content_type = 'cafe'` -> `major_category = 'food'`, `section_slug = 'cafe'`, `canonical_path = '/food/cafe/shops/' || slug`
- `content_type = 'protein'` -> `major_category = 'health'`, `section_slug = 'protein'`, `canonical_path = '/health/protein/products/' || slug`
- `content_type = 'beauty_salon'` -> `major_category = 'beauty'`, `section_slug = 'hair-salon'`, `canonical_path = '/beauty/hair-salon/' || region || '/salons/' || slug`
- `content_type = 'hotel'` -> `major_category = 'travel'`, `section_slug = 'stays'`, `canonical_path = '/travel/stays/' || region || '/hotels/' || slug`
- `content_type = 'travel_agency'` -> `major_category = 'travel'`, `section_slug = 'services'`, `canonical_path = '/travel/services/' || region || '/agencies/' || slug`
- `content_type = 'travel_app'` -> `major_category = 'travel'`, `section_slug = 'services'`, `canonical_path = '/travel/services/apps'`
- `content_type = 'leisure_spot'` -> `major_category = 'leisure'`, `section_slug = 'spots'`, `canonical_path = '/leisure/' || region || '/spots/' || slug`

### Rankings

既存:

- `content_type = 'ramen'` -> `major_category = 'food'`, `section_slug = 'ramen'`, `canonical_path = '/food/ramen/rankings/' || slug`
- `content_type = 'cafe'` -> `major_category = 'food'`, `section_slug = 'cafe'`, `canonical_path = '/food/cafe/' || region || '/rankings/' || slug`
- `content_type = 'protein'` -> `major_category = 'health'`, `section_slug = 'protein'`, `canonical_path = '/health/protein/' || metadata->>'target' || '/rankings/' || slug`
- `content_type = 'beauty'` -> `major_category = 'beauty'`, `section_slug = 'hair-salon'`, `canonical_path = '/beauty/hair-salon/' || region || '/rankings/' || slug`
- `content_type = 'hotel'` -> `major_category = 'travel'`, `section_slug = 'stays'`, `canonical_path = '/travel/stays/' || region || '/rankings/' || slug`
- `content_type = 'travel_agency'` -> `major_category = 'travel'`, `section_slug = 'services'`, `canonical_path = '/travel/services/' || region || '/rankings/' || slug`
- `content_type = 'leisure'` -> `major_category = 'leisure'`, `section_slug = 'spots'`, `canonical_path = '/leisure/' || region || '/rankings/' || slug`

## Application Refactor Plan

### 1. Routing helpers

Refactor `lib/routes.ts` first.

Add new canonical helpers:

```ts
routes.majorCategory(category)
routes.majorCategoryArticles(majorCategory)
routes.majorCategoryArticle(majorCategory, slug)
routes.standaloneArticles()
routes.standaloneArticle(slug)

routes.food
routes.foodRamen
routes.foodRamenRegion(region)
routes.foodRamenShop(slug)
routes.foodRamenRanking(slug)

routes.foodCafe
routes.foodCafeRegion(region)
routes.foodCafeShop(region, slug)
routes.foodCafeRanking(region, slug)

routes.health
routes.healthProtein
routes.healthProteinTarget(target)
routes.healthProteinProduct(slug)
routes.healthProteinRanking(target, slug)

routes.beautyHairSalon
routes.beautyHairSalonRegion(region)
routes.beautyHairSalonSalon(region, slug)
routes.beautyHairSalonRanking(region, slug)

routes.travelStays
routes.travelStaysRegion(region)
routes.travelStaysHotel(region, slug)
routes.travelStaysRanking(region, slug)

routes.travelServices
routes.travelServicesRegion(region)
routes.travelServiceAgency(region, slug)
routes.travelServiceRanking(region, slug)
routes.travelApps
```

Keep old helpers temporarily as aliases or remove only after all call sites are migrated.

### 2. Content read layer

Update `lib/content.ts`:

- `articleHref()` returns `/[majorCategory]/articles/[slug]` when `major_category` exists.
- `articleHref()` returns `/articles/[slug]` when the article is independent.
- `rankingHref()` returns the new major-category path.
- Add `itemHrefByContentType(contentType, region, slug)` for shared use in search, likes, fortune, and cards.
- Query functions should continue using `content_type` and `region`; do not force DB table splits.
- Prefer `canonical_path` when present, fallback to generated route during migration.

### 3. Article pages

Build canonical pages:

```txt
app/[category]/articles/page.tsx
app/[category]/articles/[slug]/page.tsx
app/articles/page.tsx
app/articles/[slug]/page.tsx
```

Current generic article route can be reused:

- `app/[category]/articles/[slug]/page.tsx` becomes the primary article renderer for major-category articles.
- `app/articles/[slug]/page.tsx` becomes the primary article renderer for independent articles.
- If `app/articles/[category]/[slug]/page.tsx` exists, keep it as compatibility redirect only.
- Move reusable article rendering from:
  - `app/[category]/[slug]/page.tsx`
  - `app/ramen/articles/[slug]/page.tsx`
  - `app/beauty/[region]/articles/[slug]/page.tsx`
  - `app/cafe/[region]/articles/[slug]/page.tsx`
  into one shared renderer or canonical route.

Old article routes become permanent redirects:

```txt
/ramen/articles/[slug] -> /food/articles/[slug]
/cafe/[region]/articles/[slug] -> /food/articles/[slug]
/beauty/[region]/articles/[slug] -> /beauty/articles/[slug]
/articles/[majorCategory]/[slug] -> /[majorCategory]/articles/[slug] when the first segment is a known major category
/{legacyCategory}/[slug] -> /[mappedMajorCategory]/articles/[slug] where applicable
/{legacyCategory}/articles/[slug] -> /[mappedMajorCategory]/articles/[slug]
```

### 4. Food pages

Reuse existing pages:

- Move/adapt `app/ramen/page.tsx` -> `app/food/ramen/page.tsx`
- Move/adapt `app/ramen/[region]/page.tsx` -> `app/food/ramen/[region]/page.tsx`
- Move/adapt `app/ramen/items/[slug]/page.tsx` -> `app/food/ramen/shops/[slug]/page.tsx`
- Move/adapt `app/ramen/rankings/[slug]/page.tsx` -> `app/food/ramen/rankings/[slug]/page.tsx`
- Move/adapt `app/cafe/page.tsx` -> `app/food/cafe/page.tsx`
- Move/adapt `app/cafe/[region]/page.tsx` -> `app/food/cafe/[region]/page.tsx`
- Move/adapt `app/cafe/[region]/items/[slug]/page.tsx` -> `app/food/cafe/[region]/shops/[slug]/page.tsx`
- Move/adapt `app/cafe/[region]/rankings/[slug]/page.tsx` -> `app/food/cafe/[region]/rankings/[slug]/page.tsx`

Also add `app/food/page.tsx` as a food hub that pulls `food` sections and content counts from DB.

### 5. Health pages

Reuse existing pages:

- Move/adapt `app/protein/page.tsx` -> `app/health/protein/page.tsx`
- Move/adapt `app/protein/[target]/page.tsx` -> `app/health/protein/[target]/page.tsx`
- Move/adapt `app/protein/products/[slug]/page.tsx` -> `app/health/protein/products/[slug]/page.tsx`
- Move/adapt `app/protein/[target]/rankings/[slug]/page.tsx` -> `app/health/protein/[target]/rankings/[slug]/page.tsx`

Add `app/health/page.tsx` as a health hub.

### 6. Beauty pages

Reuse existing pages, but insert `hair-salon` section in path:

- `app/beauty/page.tsx` remains the major category hub or becomes a beauty hub.
- Move/adapt `app/beauty/[region]/page.tsx` -> `app/beauty/hair-salon/[region]/page.tsx`
- Move/adapt `app/beauty/[region]/salons/[slug]/page.tsx` -> `app/beauty/hair-salon/[region]/salons/[slug]/page.tsx`
- Move/adapt `app/beauty/[region]/rankings/[slug]/page.tsx` -> `app/beauty/hair-salon/[region]/rankings/[slug]/page.tsx`
- Remove dedicated beauty article renderer in favor of `/beauty/articles/[slug]`.

### 7. Travel pages

Reuse existing pages:

- `app/travel/page.tsx` -> `app/travel/stays/page.tsx` or keep `/travel` as hub and create `/travel/stays`
- `app/travel/[region]/page.tsx` -> `app/travel/stays/[region]/page.tsx`
- `app/travel/[region]/hotels/[slug]/page.tsx` -> `app/travel/stays/[region]/hotels/[slug]/page.tsx`
- `app/travel/[region]/rankings/[slug]/page.tsx` -> `app/travel/stays/[region]/rankings/[slug]/page.tsx`
- `app/travel-services/page.tsx` -> `app/travel/services/page.tsx`
- `app/travel-services/apps/page.tsx` -> `app/travel/services/apps/page.tsx`
- `app/travel-services/[region]/page.tsx` -> `app/travel/services/[region]/page.tsx`
- `app/travel-services/[region]/agencies/[slug]/page.tsx` -> `app/travel/services/[region]/agencies/[slug]/page.tsx`
- `app/travel-services/[region]/rankings/[slug]/page.tsx` -> `app/travel/services/[region]/rankings/[slug]/page.tsx`

`/travel` becomes the major category hub that links to `stays` and `services`.

### 8. Leisure pages

`/leisure` is already a major category and can stay mostly unchanged.

- Keep `/leisure`
- Keep `/leisure/[region]`
- Keep `/leisure/[region]/spots/[slug]`
- Keep `/leisure/[region]/rankings/[slug]`
- Article pages move to `/leisure/articles/[slug]`

### 9. Redirects

Old routes must redirect with permanent redirects. This protects SEO and external links.

```txt
/ramen -> /food/ramen
/ramen/[region] -> /food/ramen/[region]
/ramen/items/[slug] -> /food/ramen/shops/[slug]
/ramen/rankings/[slug] -> /food/ramen/rankings/[slug]
/ramen/articles/[slug] -> /food/articles/[slug]

/cafe -> /food/cafe
/cafe/[region] -> /food/cafe/[region]
/cafe/[region]/items/[slug] -> /food/cafe/[region]/shops/[slug]
/cafe/[region]/rankings/[slug] -> /food/cafe/[region]/rankings/[slug]
/cafe/[region]/articles/[slug] -> /food/articles/[slug]

/protein -> /health/protein
/protein/[target] -> /health/protein/[target]
/protein/products/[slug] -> /health/protein/products/[slug]
/protein/[target]/rankings/[slug] -> /health/protein/[target]/rankings/[slug]

/beauty/[region] -> /beauty/hair-salon/[region]
/beauty/[region]/salons/[slug] -> /beauty/hair-salon/[region]/salons/[slug]
/beauty/[region]/rankings/[slug] -> /beauty/hair-salon/[region]/rankings/[slug]
/beauty/[region]/articles/[slug] -> /beauty/articles/[slug]

/travel/[region] -> /travel/stays/[region]
/travel/[region]/hotels/[slug] -> /travel/stays/[region]/hotels/[slug]
/travel/[region]/rankings/[slug] -> /travel/stays/[region]/rankings/[slug]

/travel-services -> /travel/services
/travel-services/apps -> /travel/services/apps
/travel-services/[region] -> /travel/services/[region]
/travel-services/[region]/agencies/[slug] -> /travel/services/[region]/agencies/[slug]
/travel-services/[region]/rankings/[slug] -> /travel/services/[region]/rankings/[slug]
```

Redirects can be implemented as lightweight `page.tsx` files using `permanentRedirect()`, or centrally in `next.config.ts`. For dynamic route compatibility and fewer edge cases, route-level redirects are acceptable during the migration.

### 10. Admin article UI

Refactor `/account/articles/new`.

Current problem:

- It accepts arbitrary `category` and maps directly to public article path.
- It has old special cases for `ramen`, `beauty`, `cafe`.

New behavior:

- `major_category` select is fixed to `food`, `health`, `beauty`, `travel`, `leisure`.
- Placement select supports:
  - major-category article: `/{majorCategory}/articles/{slug}`
  - independent article: `/articles/{slug}`
- `section_slug` is optional but suggested from existing sections.
- `slug` remains author-defined.
- `region` is optional unless the selected content model needs it for related cards. Article URL itself does not require region.
- Save action writes `major_category`, `section_slug`, and `canonical_path`.
- Publish redirect target is `/[majorCategory]/articles/[slug]` or `/articles/[slug]`.
- Revalidate:
  - `/{majorCategory}/articles` when major category exists
  - `/{majorCategory}/articles/[slug]` when major category exists
  - `/articles` for independent articles
  - `/articles/[slug]` for independent articles
  - `/{majorCategory}` when major category exists
  - `/sitemap.xml`
  - `/`

### 11. Future ranking/items authoring

The final goal is that rankings and items are also author-created DB content. Plan for a follow-up admin area:

```txt
/account/items/new
/account/rankings/new
```

Common requirements:

- choose `major_category`
- choose `section_slug`
- choose `content_type`
- set `region` only when the content model needs it
- upload or enter image URL with source/rights metadata
- save `sources`, `faqs`, `official_links`, `last_verified_at`
- generate `canonical_path`
- revalidate affected listing/detail/sitemap routes

Do not build this until URL routing is stable.

## SEO / Metadata Policy

- Canonical URLs must use new paths only.
- Old paths must use permanent redirects.
- `sitemap.ts` must emit only new canonical URLs, not legacy URLs.
- JSON-LD `url` fields must use new canonical URLs.
- Search results and internal links must point to new canonical URLs.
- OGP image should use page-specific image when available; otherwise site fallback.
- `robots.ts` does not need path-level blocking for old URLs if they redirect.
- Update `llms.txt` to new canonical paths.

## Implementation Phases

### Phase 0: Freeze and verify current state

- Run `git status --short`.
- Confirm no unrelated user changes are overwritten.
- Run `npm run lint` and `npm run typecheck` if the tree is stable enough.
- Do not run legacy seed scripts.

### Phase 1: DB migration

- Add `major_category`, `section_slug`, `canonical_path` columns.
- Backfill articles/items/rankings using the mapping above.
- Add indexes:

```sql
create index if not exists idx_articles_major_category_status
  on es.articles (major_category, status, updated_at desc);

create index if not exists idx_items_major_section_region_status
  on es.items (major_category, section_slug, region, status);

create index if not exists idx_rankings_major_section_region_status
  on es.rankings (major_category, section_slug, region, status);
```

- Verify counts before and after.
- Do not delete old columns in this phase.

### Phase 2: Route helpers and content layer

- Update `lib/routes.ts`.
- Update `articleHref`, `rankingHref`, and item URL helpers.
- Make content functions return or infer `majorCategory`, `sectionSlug`, and `canonicalPath`.
- Keep fallback generation for rows not yet backfilled.

### Phase 3: Canonical article routes

- Implement `/[category]/articles`.
- Implement `/[category]/articles/[slug]`.
- Implement `/articles`.
- Implement `/articles/[slug]`.
- Move shared article rendering into a reusable component if needed.
- Convert old article routes to redirects.

### Phase 4: Food and Health migration

- Create `/food` hub.
- Move/adapt ramen and cafe route files under `/food`.
- Create `/health` hub.
- Move/adapt protein route files under `/health`.
- Add redirects for old paths.

### Phase 5: Beauty and Travel migration

- Insert `/beauty/hair-salon`.
- Split `/travel` into hub, `/travel/stays`, and `/travel/services`.
- Add redirects for old paths.

### Phase 6: Search, header, sitemap, llms

- Update `content/categories.ts` or replace with major category config.
- Update search result links.
- Update header navigation.
- Update account likes links.
- Update fortune lucky item links.
- Update sitemap.
- Update llms.txt.

### Phase 7: Admin UI

- Refactor article authoring to major-category-first.
- Add section suggestions.
- Save canonical path.
- Revalidate new paths.
- Update docs for article creation flow.

### Phase 8: Verification

Required:

```bash
npm run lint
npm run typecheck
npm run build
```

Browser checks:

- `/`
- `/food`
- `/food/ramen`
- `/food/ramen/shops/[known-slug]`
- `/food/cafe`
- `/health/protein`
- `/beauty/hair-salon/[known-region]`
- `/travel`
- `/travel/stays/[known-region]`
- `/travel/services`
- `/leisure/[known-region]`
- `/food/articles/[known-slug]`
- `/articles/[known-independent-slug]` if an independent article exists
- `/search?q=駐車場あり`

Redirect checks:

- `/ramen`
- `/ramen/items/[known-slug]`
- `/cafe/[known-region]/items/[known-slug]`
- `/protein/products/[known-slug]`
- `/travel-services`

DB checks:

- all published articles have `major_category` and `canonical_path`
- all published items have `major_category`, `section_slug`, and `canonical_path`
- all published rankings have `major_category`, `section_slug`, and `canonical_path`
- no `ranking_items` references are broken

## Risks and Mitigations

### SEO disruption

Risk: Old indexed URLs become 404 or duplicate pages.

Mitigation:

- Permanent redirects for every old route.
- sitemap emits only new canonical URLs.
- metadata canonical points only to new URLs.

### Broken internal links

Risk: Search, account likes, fortune, article related links still point to old paths.

Mitigation:

- Centralize URL generation in `lib/routes.ts` and `lib/content.ts`.
- Search for old helpers and old literal paths before finishing.

### DB partial migration

Risk: Some rows lack `major_category` and disappear from new pages.

Mitigation:

- Keep fallback mapping from old `category` / `content_type`.
- Add DB verification query before deleting old routes.

### Overwriting user changes

Risk: Current worktree has many unrelated edits.

Mitigation:

- Avoid broad file rewrites.
- Move one route family at a time.
- Review `git diff --stat` before each phase.

## Non-goals for First Pass

- Do not remove old DB columns.
- Do not delete old content data unless it is known bad.
- Do not build ranking/items authoring UI until canonical URL migration is complete.
- Do not add future major categories beyond the confirmed five.
