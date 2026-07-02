# 書籍・商品画像とアフィリエイト導線の取得運用

このドキュメントは、ランキングや記事に出す書籍・商品画像、ISBN、アフィリエイト検索語を、他の agent が同じ方針で追加できるようにまとめたものです。

## 基本方針

公開サイトのリクエスト時に外部 API を叩かない。

API や外部ページは、ローカル環境・管理用スクリプト・手動調査で「取得/確認」するために使い、公開表示では Supabase DB に保存済みの値を読む。

理由:

- ページ表示が API 制限、認証エラー、一時障害に左右されにくい。
- ISR / on-demand revalidate と相性が良い。
- ISBN、画像URL、取得元、確認日を DB に残せる。
- 外部 API のレスポンス形式や規約変更が、公開ページの即時障害になりにくい。

## 現在の表示側の前提

ランキング詳細は `components/generic/GenericSectionPages.tsx` の `GenericRankingDetailPage` が表示する。

- `ranking_items.image_url` があれば、ランキング項目カードの画像として使う。
- `ranking_items.image_alt` があれば alt として使う。
- `ranking_items.metadata.affiliate_query` があれば、その項目カード内にアフィリエイトリンクを表示する。
- `rankings.image_url` はランキングカード/OG/hero 用。空なら上位項目画像へ fallback する。
- 画像URLは `safeImageSrc()` を通す。許可外ホストや壊れたURLは fallback 画像になる。

外部画像ホストは `lib/image-hosts.ts` の `ALLOWED_IMAGE_HOSTS` に追加する。書籍系で現在許可している主なホスト:

- `www.hanmoto.com`
- `thumbnail.image.rakuten.co.jp`
- `m.media-amazon.com`

## 取得優先順位

書籍ランキングでは、まず ISBN を確定し、ISBN ベースの画像URLを DB に保存する。

推奨順:

1. NDL Search API などで「タイトル + 著者」から ISBN を確認する。
2. 書影は `https://www.hanmoto.com/bd/img/{ISBN13}.jpg` を第一候補にする。
3. 楽天 Books API / Amazon PA-API / Google Books API は補助候補にする。
4. 取得したURLは HEAD/GET で画像として取得できるか確認する。
5. DB には画像URLだけでなく、ISBN、取得元、確認日も保存する。

楽天や Amazon の API は、認証、リファラー、利用条件、レート制限で失敗することがある。公開ページがそれに依存しないよう、取得できた結果だけを DB に固定保存する。

## DB保存先

ランキング項目ごとの画像は `es.ranking_items` に保存する。

主な列:

| 列 | 用途 |
| --- | --- |
| `image_url` | 項目カードに出す画像URL |
| `image_alt` | 画像alt |
| `metadata.isbn13` | 書籍のISBN13 |
| `metadata.book_image_provider` | 画像取得元の識別子 |
| `metadata.book_image_source_url` | 確認元ページ |
| `metadata.book_image_checked_at` | 確認日 |
| `metadata.affiliate_query` | 項目別アフィリエイト検索語 |

ランキング本体の代表画像は `es.rankings.image_url` に保存する。通常は1位項目の書影、またはランキング内容を表す独自画像を使う。

## SQL例

Supabase は原則 MCP 経由で操作する。MCP の範囲外の時だけ CLI を使う。

例: 既存ランキングの手入力項目へ書影とISBNを追加する。

```sql
with book_images(item_slug, isbn13, image_url, source_url) as (
  values
    (
      'jirai-glico',
      '9784041111659',
      'https://www.hanmoto.com/bd/img/9784041111659.jpg',
      'https://www.books.or.jp/book-details/9784041111659'
    )
)
update es.ranking_items ri
set
  image_url = bi.image_url,
  image_alt = coalesce(ri.display_name, ri.item_slug) || 'の書影',
  metadata = coalesce(ri.metadata, '{}'::jsonb)
    || jsonb_build_object(
      'isbn13', bi.isbn13,
      'book_image_provider', 'hanmoto_books_or_jp',
      'book_image_source_url', bi.source_url,
      'book_image_checked_at', '2026-07-02'
    )
from book_images bi
where ri.ranking_id = '<ranking_id>'
  and ri.item_slug = bi.item_slug;
```

`ranking_items` だけを更新しても、差分 revalidate の基準になる `rankings.changed_at` は直接更新されない。最後に親ランキングを更新する。

```sql
update es.rankings
set
  updated_at = now(),
  image_url = coalesce(image_url, 'https://www.hanmoto.com/bd/img/9784041111659.jpg')
where id = '<ranking_id>';
```

## アフィリエイト導線

項目単位の購入導線は、まず `ranking_items.metadata.affiliate_query` を使う。

```sql
update es.ranking_items
set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'affiliate_query', '書籍名 著者名'
)
where ranking_id = '<ranking_id>'
  and item_slug = '<item_slug>';
```

この場合、公開ページでは `getAffiliateLinksForQuery()` が Amazon / 楽天などの platform 設定からリンクを生成する。商品ごとの固定URLが必要な場合だけ、将来的に `affiliate_links` の個別URL登録を検討する。

## revalidate

DBを直接更新した後は、以下のどちらかで反映する。

- 親 `rankings.updated_at` を更新し、差分 revalidate の対象にする。
- 明示的に対象パスを `/api/revalidate` へ投げる。

対象例:

- `/entertainment/books`
- `/entertainment/books/rankings`
- `/entertainment/books/rankings/{ranking_slug}`
- `/sitemap.xml`

コード変更が本番に未反映の場合、画像ホスト許可が足りず `next/image` で表示できないことがある。その場合は先にコードをデプロイしてから revalidate する。

## 作業チェックリスト

1. 対象ランキングの `id`、`slug`、`ranking_items.item_slug` を確認する。
2. タイトル + 著者で ISBN13 を確認する。
3. 書影URLが画像として取得できるか確認する。
4. 必要な画像ホストが `lib/image-hosts.ts` に入っているか確認する。
5. `ranking_items.image_url`、`image_alt`、`metadata.isbn13`、取得元、確認日を更新する。
6. `metadata.affiliate_query` が未設定なら入れる。
7. 親 `rankings.updated_at` を更新する。
8. `npm run typecheck` と `npm run lint` を実行する。
9. デプロイ後に対象パスを revalidate し、本番URLで確認する。

## 2026-07-02 の実施例

`おすすめ推理小説ランキング 2026年7月最新版` に対して、10件すべての `ranking_items` に以下を保存した。

- `image_url`: `https://www.hanmoto.com/bd/img/{ISBN13}.jpg`
- `image_alt`: `{作品名}の書影`
- `metadata.isbn13`
- `metadata.book_image_provider = hanmoto_books_or_jp`
- `metadata.book_image_source_url`
- `metadata.book_image_checked_at = 2026-07-02`

対象ランキング:

- `id`: `6f3dd9c6-799c-442a-980d-d6e9eda5bd07`
- `slug`: `mystery-novels-ranking-2026-07`
- `canonical_path`: `/entertainment/books/rankings/mystery-novels-ranking-2026-07`

同時に、表示側で外部書影ホストを許可し、ランキング項目画像も `safeImageSrc()` 経由にした。
