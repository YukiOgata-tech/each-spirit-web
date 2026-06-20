# each-spirit Supabase マイグレーション管理

## 対象プロジェクト

| 項目 | 値 |
|------|-----|
| Supabase プロジェクト | drink-management app |
| プロジェクト ID | `ctwpnaizwsrffrkkbuig` |
| リージョン | ap-northeast-2 (Seoul) |

## 共有スキーマ構成

```
auth.users          ← each-spirit / 飲酒管理アプリ 共有
public.profiles     ← each-spirit / 飲酒管理アプリ 共有
  └ display_name, avatar, birthday を each-spirit でも利用
public.*（その他）  ← 飲酒管理アプリ専用（each-spirit は変更・依存しない）
es.*                ← each-spirit 専用スキーマ
```

## 初回セットアップ（手動・必須）

`es` スキーマを `supabase-js` の REST API（`supabase.schema("es")...`）から利用するには、**Supabase Dashboard での手動設定が必須**です。これは SQL マイグレーションでは設定できません。

> **Supabase Dashboard → Settings → API → Exposed schemas に `es` を追加して保存**

理由: Supabase の REST API（PostgREST）はセキュリティ上、デフォルトで `public` と `graphql_public` スキーマしか公開しません。`es` を Exposed schemas に追加しないと、`es` への全クエリが
`The schema must be one of the following: public, graphql_public` というエラーで失敗します。

未設定の場合、`app/account/page.tsx` は `Promise.allSettled` でエラーを握りつぶすためページは落ちませんが、**いいね・通知・ポイント等がすべて空表示**になります。

| 設定項目 | 値 |
|----------|-----|
| 場所 | Dashboard → Settings → API → Exposed schemas |
| 追加するスキーマ | `es` |
| 必要環境変数（`.env.local`） | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

## マイグレーション一覧

| ファイル | 内容 | 適用日 |
|---------|------|--------|
| `20260611000001_es_initial.sql` | `es` スキーマ初期構築（全テーブル・RLS・トリガー・インデックス） | 2026-06-11 |
| `20260611000002_es_extensible.sql` | `like_type` PK 拡張・reviews・notifications・business_accounts・user_points・point_ledger・user_follows・content_reports | 2026-06-11 |
| `20260611000003_es_items.sql` | `es.items` 汎用アイテムテーブル・content_type CHECK 制約緩和（無限ジャンル対応）| 2026-06-11 |
| `20260611000004_es_rankings.sql` | `es.rankings` / `es.ranking_items` ランキングテーブル・like_count トリガー・逆引きインデックス | 2026-06-11 |
| `20260619214911_major_category_canonical_paths.sql` | `major_category` / `section_slug` / `canonical_path` 追加、`es.content_sections` 中カテゴリ管理テーブル追加 | 2026-06-19 |
| `20260619222405_section_slug_primary_urls.sql` | item/ranking の canonical URL を大カテゴリ/中カテゴリ基準へ更新、`ranking_items.item_id` 追加 | 2026-06-19 |
| `20260619225244_item_kind_for_section_items.sql` | `es.items.item_kind` 追加予定。ローカル作成済みだが、現時点では本番未適用 | 未適用 |

## es スキーマ テーブル一覧

| テーブル | 用途 |
|---------|------|
| `es.user_prefs` | each-spirit ユーザー設定（お気に入りカテゴリ・地域など） |
| `es.content_likes` | 全コンテンツ統一いいね／ブックマーク／行きたい（PK: user_id + content_type + content_id + like_type） |
| `es.content_like_counts` | いいねカウントキャッシュ（trigger 自動更新） |
| `es.articles` | 記事（TypeScript ファイルから段階的移行） |
| `es.daily_fortunes` | デイリー占い結果キャッシュ（同日同タイプは UNIQUE） |
| `es.quiz_results` | カフェ診断・各種診断の結果保存 |
| `es.reviews` | 全コンテンツ汎用レビュー（評価・本文・訪問日） |
| `es.review_votes` | レビュー有用投票（helpful / unhelpful） |
| `es.notifications` | ユーザー通知（タイプ・リンク・既読管理） |
| `es.business_accounts` | 事業者アカウント（店舗オーナー・掲載プラン） |
| `es.user_points` | ユーザーポイント残高 |
| `es.point_ledger` | ポイント増減履歴台帳 |
| `es.user_follows` | ユーザー同士フォロー関係 |
| `es.content_reports` | コンテンツ通報（モデレーション用） |
| `es.items` | 全ジャンル汎用アイテム（カフェ・ラーメン・ホテル・家電・アプリ等）。現在の正は `major_category + section_slug + slug` |
| `es.rankings` | 全ジャンル汎用ランキング（カテゴリ・地域・タイトル・criteria）。現在の正は `major_category + section_slug + slug` |
| `es.ranking_items` | ランキング内の順位リスト（ranking_id FK + rank UNIQUE）。`item_id` で `es.items` へ参照 |
| `es.content_sections` | 大カテゴリ配下の中カテゴリ管理。`food/ramen`、`health/protein` などの表示名、URL、content model、地域/ターゲット要否を保持 |

## content_likes の content_type 値

| 値 | 対象コンテンツ |
|----|--------------|
| `cafe` | カフェ店舗 |
| `ramen_item` | ラーメン店舗 |
| `article` | 記事 |
| `ranking` | ランキング |
| `leisure_spot` | レジャースポット |
| `hotel` | ホテル |
| `beauty_salon` | 美容サロン |

## content_likes の like_type 値

| 値 | 意味 | 公開 |
|----|------|------|
| `like` | いいね（通常） | 公開（anon も閲覧可） |
| `bookmark` | ブックマーク | 本人のみ |
| `want_to_visit` | 行きたい | 本人のみ |

## マイグレーション適用手順（飲酒管理アプリ リポジトリへの共有時）

```bash
# Supabase CLI でリモートに適用
supabase db push --project-ref ctwpnaizwsrffrkkbuig

# または SQL を直接実行
supabase db query --project-ref ctwpnaizwsrffrkkbuig \
  < supabase/migrations/20260611000001_es_initial.sql
```

## 重要ルール

- `public.*` テーブルへの変更は原則禁止（飲酒管理アプリへの影響を避ける）
- 変更が必要な場合は必ず飲酒管理アプリ担当者と合意の上で行う
- 新規テーブルはすべて `es` スキーマに追加する
- すべての変更は `supabase/migrations/` にタイムスタンプ付きファイルで記録する
