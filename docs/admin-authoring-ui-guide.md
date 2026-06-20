# 作成UI（管理者向け投稿・編集）ガイド

リポジトリの管理画面から DB（`es` スキーマ）へ直接コンテンツを投入・編集するためのガイド。
関連: [content-display-path-slug-spec.md](./content-display-path-slug-spec.md)（パス/スラグ/表示の確定仕様）、[major-category-url-and-db-migration-plan.md](./major-category-url-and-db-migration-plan.md)

## 全体概要

3種類のエディタがある。すべてマイページ `/account` の「管理メニュー」からアクセスでき、表示は **`es.admin_users` に登録された管理者のみ**（`lib/admin.ts` の `getCurrentAdminUser` / `requireAdminUser` でガード。非管理者はログインへリダイレクト）。

| エディタ | 新規 | 編集 | テーブル |
|---|---|---|---|
| 記事 | `/account/articles/new` | （既存記事から） | `es.articles` |
| 店舗・商品 | `/account/items/new` | `/account/items/[id]/edit` | `es.items` |
| ランキング | `/account/rankings/new` | `/account/rankings/[id]/edit` | `es.rankings` + `es.ranking_items` |

共通の仕組み:
- ネイティブ `<form action={サーバーアクション}>`（`saveArticle` / `saveItem` / `saveRanking`）。
- 保存時に **canonical_path / major_category / section_slug / item_kind** を自動導出。
- slug 重複チェック → upsert → 関連ページ revalidate → リダイレクト（公開=詳細ページ / 下書き=マイページ）。
- セクション定義: `lib/admin-item-schema.ts`（items）、`lib/admin-ranking-schema.ts`（rankings）。
- フォーム本体: `components/admin/ItemEditor.tsx` / `RankingEditor.tsx` / `ArticleEditor.tsx`。

---

## 1. 店舗・商品エディタ（items）

カテゴリ(section)を選ぶと入力項目が切り替わる汎用フォーム（新規時は選択可、編集時は section 固定）。

### 共通項目（全 section）
- **slug**（必須・`^[a-z0-9]+(?:-[a-z0-9]+)*$`）、**名称**（必須）、説明
- **地域(region)**: section により表示/必須が変化。DB（`es.content_regions`）の候補からセレクト
- エリア / 住所 / 電話 / 価格帯 / 画像URL / 公式URL / 地図URL / 最終確認日
- タグ（カンマ・改行区切り）、編集部コメント
- ステータス（公開 / 下書き）

### section 別の詳細項目（`metadata` jsonb に格納）

| section | item_kind | region | 固有項目 |
|---|---|---|---|
| グルメ/ラーメン (`food:ramen`) | shop | 任意 | ジャンル、おすすめメニュー、営業時間、定休日、駐車場(✓)、駐車場メモ |
| グルメ/カフェ (`food:cafe`) | shop | 必須 | スタイル、看板メニュー、ハイライト、営業時間、定休日、予約(選択)、WiFi/電源/駐車場/ペット可(✓)、Instagram |
| 健康/プロテイン (`health:protein`) | product | なし | ブランド(必須)、種類(選択)、対象target(list)、1食量/タンパク質/カロリー/炭水化物/脂質/内容量/価格/1kg単価(数値)、フレーバー/メリット/デメリット(list) |
| 美容/美容室 (`beauty:hair-salon`) | salon | 必須 | キャッチ、アクセス、施術(list)、対象年代(list)、カット/カラー料金、営業時間、定休日、駐車場(✓)、子連れ可/メンズ可(✓)、Instagram |
| 旅行/宿 (`travel:stays`) | hotel | 必須 | スタイル、ハイライト、チェックイン/アウト、食事、温泉(✓)、温泉メモ、駐車場(✓) |
| 旅行/旅行会社 (`travel:services:agency`) | agency | 必須 | キャッチ、ハイライト、サービス(list)、向いている人(list)、相談スタイル、営業時間、定休日、登録番号 |
| 旅行/旅行アプリ (`travel:services:app`) | app | なし | 提供元、対応プラットフォーム(list)、向いている人(list) |
| レジャー/スポット (`leisure:spots`) | spot | 必須 | 種別(選択)、ジャンル、ハイライト、向いている人(list)、営業時間、定休日、駐車場(✓) |

入力タイプ: テキスト / 複数行(textarea) / 数値 / チェックボックス(✓) / 選択(select) / リスト(カンマ・改行 → 配列)。

> 編集時は既存 `metadata` を**マージ**して、フォームに無いキー（official_links / sources / faqs 等）を保全する。

---

## 2. ランキングエディタ（rankings）

ランキング本体＋順位項目（`ranking_items`）を編集。

### 本体項目
- **カテゴリ(section)**（新規=選択 / 編集=固定）、**slug**（必須）、**タイトル**（必須）
- 説明、結論、クイック表ラベル、評価軸(list)
- **地域(region)**（section により必須）、**対象target**（プロテインのみ・`es.content_targets` から）
- タグ(list)、最終更新日、ステータス（公開/下書き）

### 順位項目（動的に行を追加/削除）
各行: **順位(rank)** / **item（その section の登録済み店舗・商品からセレクト）** / スコア / 理由 / PR(✓)
- 保存時に item の slug から **`item_id`(uuid) を自動解決**して紐付け（`ranking_items` を delete→insert で洗い替え）。
- 「行を追加」で増やし、ゴミ箱で削除。該当 section に item が無い場合は警告（先に店舗・商品を作成）。
- ランキング section と item の対応: ramen/cafe/protein/hair-salon/stays/services(agency)/spots。

---

## 3. 記事エディタ（articles）

- 配置（大カテゴリ配下 or 独立記事 `/articles/...`）、大カテゴリ＋中カテゴリ(section)、slug、タイトル、説明
- **Markdown 本文＋ライブプレビュー**、サムネ画像アップロード（webp最適化）、記事内画像の出典登録
- 要点まとめ・学べること(list)、参照ソース / FAQ / 関連リンク（動的行）、タグ、SEOタイトル/説明/キーワード
- 下書き保存 / 公開
- 予約スラグ（about, account, auth, fortune, search 等）は独立記事・大カテゴリ slug として使用不可。

---

## 保存時の自動処理（共通）

1. **canonical_path 生成**
   - item: `/{major}/{section}/{item_path_segment}/{slug}`（travel_app のみ `/travel/services/apps`）
   - ranking: `/{major}/{section}/rankings/{slug}`
   - article: `/{major}/{section}/articles/{slug}`（独立記事は `/articles/{slug}`）
2. **major_category / section_slug / item_kind** を section から導出して保存。
3. **slug 重複チェック**（items/rankings は `major_category+section_slug` スコープ・編集時は自分を除外、記事は全体一意）。
4. **revalidate**（詳細・一覧・地域ページ・`/sitemap.xml`）で即時反映。
5. 公開→詳細ページ / 下書き→マイページへリダイレクト。

---

## 一括投入（JSON / CLI）との関係

UI は1件ずつの作成・編集経路。大量投入は同じ DB 構造へ CLI で行える（AI のリミットを使わない運用）:
- 記事: `npm run db:import:articles <json>`（`scripts/import-articles-json.ts`）
- 店舗・ランキング: `scripts/import-research-json.ts`
- いずれも `lib/section-map.ts` のマッピングで canonical / major / section / item_kind / item_id を自動付与し、旧 `content_type` 系カラムは保存しない。

## 補足: region / target の供給元

地域・target の**選択肢**は `es.content_regions` / `es.content_targets`（DB）から供給。region/target 自体の追加UIは未実装で、現状は `scripts/seed-regions-targets.ts`（入力＝`content/*/regions.ts`・`content/protein/targets.ts`）で投入する（静的=入力 / DB=配信）。
