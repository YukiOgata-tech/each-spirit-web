# コンテンツ表示・パス・スラグ 確定仕様（投稿UIの前提）

投稿・編集UIを作る前に、表示側 / パス / スラグの扱いをここで確定する。
対象は **トップと `/fortune` 以外の公開コンテンツ**。原則「**情報コンテンツはすべて `es` スキーマ（DB）が正**」。リポジトリ側は (1) もれなく表示する、(2) 投稿・編集する、の2役。

関連: [major-category-url-and-db-migration-plan.md](./major-category-url-and-db-migration-plan.md)

---

## 1. パス（canonical_path）規則 ＝ 確定

DBの `canonical_path` を唯一の真実とする（実データ確認済み・全行で一貫）。生成規則:

```txt
section index   /{major}/{section}
region 一覧     /{major}/{section}/{region}
articles 一覧   /{major}/{section}/articles
article 詳細    /{major}/{section}/articles/{slug}
rankings 一覧   /{major}/{section}/rankings
ranking 詳細    /{major}/{section}/rankings/{slug}        ← region は入れない
item 詳細       /{major}/{section}/{item_path_segment}/{slug}  ← region は入れない
独立記事        /articles/{slug}                          ← major/section を持たない記事
```

- `{item_path_segment}` は `content_sections.item_path_segment`（shops / products / salons / hotels / agencies / spots）。
- region は **DB列・地域ページ・一覧フィルタ・内部導線**でのみ扱い、詳細の canonical には含めない。
- **canonical_path は書き込み時にアプリ側で生成して保存**する（DBトリガでは生成しない）。生成は1か所に集約する（後述 `buildCanonicalPath()`）。

### 投稿UIでの canonical 生成（確定）
保存時に以下で算出して `canonical_path` 列へ格納:

| 種別 | canonical |
|---|---|
| item | `/{major}/{section}/{item_path_segment}/{slug}` |
| ranking | `/{major}/{section}/rankings/{slug}` |
| article（section配下） | `/{major}/{section}/articles/{slug}` |
| article（独立） | `/articles/{slug}` |

---

## 2. スラグ規則 ＝ 確定

形式は **kebab-case**（`niigata-ramen-first-guide`）。一意スコープは現行の unique index に合わせる:

| テーブル | 一意スコープ（正） | 補足 |
|---|---|---|
| `es.items` | **(major_category, section_slug, slug)** | 同一 section 内で slug 一意。travel/services は agency/app が同居するため両者横断で一意 |
| `es.rankings` | **(major_category, section_slug, slug)** | 同上 |
| `es.articles` | **slug 単独（全体で一意）** | 独立記事も含め全記事で衝突不可 |

### 予約スラグ（major / 独立記事 top-level で使用不可）
`app/account/articles/new` の予約リストを正とする:
`about, account, api, apple-icon.png, articles, auth, contact, disclaimer, fortune, icon.png, llms.txt, opengraph-image, privacy, robots.txt, search, sitemap.xml`
（major カテゴリ `food/health/beauty/travel/leisure` も予約。section slug はその配下なので衝突しない）

### 投稿UIのバリデーション（確定）
- 形式: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- 重複チェック: 上記スコープで保存前に存在確認（編集時は自分を除外）。
- article 独立投稿時は予約スラグを禁止。


---

## 3. 表示の DB 依存方針 ＝ 線引き
| データ | 現状 | 確定方針 |
|---|---|---|
| 記事 / items / rankings / ranking_items | DB ✓ | DBが正（変更なし） |
| content_sections（中カテゴリ） | DB ✓（fallback list あり） | DBが正 |
| major カテゴリ（food/health/beauty/travel/leisure） | repo `content/categories.ts` | **リポジトリ固定（意図どおり維持）** |
| 地域（region 名称・SEO・featured・画像） | repo `content/*/regions.ts` ＋ leisure はハードコード | **要決定 D1** |
| protein targets | repo `content/protein/targets.ts` | **要決定 D2** |
| site メタ | repo `content/site.ts` | リポジトリ固定（維持） |

「すべてDB依存が理想」に厳密に従うなら region / target も DB 化する（D1/D2）。

---

## 4. 決定事項（確定済み）

- **D1 地域(region)を DB 化 → 実施済み**：`es.content_regions`（major/section/region_slug/status/sort_order/data jsonb）を新設。`content/*/regions.ts`＋leisure を seed（`scripts/seed-regions-targets.ts`、15行）。`lib/content.ts` の region getter を **async DB 読み取り（static フォールバック）** へ移行済み。
- **D2 protein targets を DB 化 → 実施済み**：`es.content_targets` を新設・seed（6行）。`getProteinTargets/getProteinTarget` を async DB 読み取りへ。
- **D3 旧互換カラム整理 → 実施済み**：`items/rankings.content_type`・`ranking_items.item_content_type` を nullable 化し、旧 unique index（`items_content_type_slug_key` / `rankings_content_type_slug_key`）を撤去（`20260620000001`）。その後、保存・読み取り経路を `major_category + section_slug + item_kind + item_id` ベースへ移行し、旧3カラムは削除 migration（`20260620074642`）で撤去。
- **D4 protein ranking のURL**：canonical は `/health/protein/rankings/{slug}`（section形）で確定。`/health/protein/{target}/rankings/{slug}` ルートは当面残すが二次的。target別は一覧フィルタで表現する方針。

## 4b. region/target の編集方針（投稿UI）

`content_regions` / `content_targets` は `data jsonb` に表示用フルオブジェクトを保持する。region/target の新規・編集UIは将来別途。当面は `scripts/seed-regions-targets.ts` を seed 入力として再投入する運用（静的=入力 / DB=配信）。

---

## 5. 投稿・編集UI（D1〜D4 確定後に着手）

- `/account/items/new` `/account/items/{id}/edit`
- `/account/rankings/new` `/account/rankings/{id}/edit`
- 既存 `/account/articles/new` と同じ admin ガード（`getCurrentAdminUser`）。
- フォームは `content_sections` を選択 → section の `content_model` / `item_path_segment` / `region_mode` / `target_mode` に応じて入力項目を出し分け。
- 保存時に `major_category` / `section_slug` / `item_kind` / `canonical_path` を確定して書き込み、関連ページの revalidate を行う。
