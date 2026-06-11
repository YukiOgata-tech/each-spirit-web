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

## マイグレーション一覧

| ファイル | 内容 | 適用日 |
|---------|------|--------|
| `20260611000001_es_initial.sql` | `es` スキーマ初期構築（全テーブル・RLS・トリガー・インデックス） | 2026-06-11 |
| `20260611000002_es_extensible.sql` | `like_type` PK 拡張・reviews・notifications・business_accounts・user_points・point_ledger・user_follows・content_reports | 2026-06-11 |
| `20260611000003_es_items.sql` | `es.items` 汎用アイテムテーブル・content_type CHECK 制約緩和（無限ジャンル対応）| 2026-06-11 |
| `20260611000004_es_rankings.sql` | `es.rankings` / `es.ranking_items` ランキングテーブル・like_count トリガー・逆引きインデックス | 2026-06-11 |

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
| `es.items` | 全ジャンル汎用アイテム（カフェ・ラーメン・ホテル・家電・アプリ等）UNIQUE(content_type, slug) |
| `es.rankings` | 全ジャンル汎用ランキング（カテゴリ・地域・タイトル・criteria）UNIQUE(content_type, slug) |
| `es.ranking_items` | ランキング内の順位リスト（ranking_id FK + rank UNIQUE）。es.items への論理参照 |

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
