**ニュース機能 実装方針**

### 1. URL構造

```text
/news
/news/[category]
/news/[category]/[slug]
```

実装先：

```text
app/news/page.tsx
app/news/[category]/page.tsx
app/news/[category]/[slug]/page.tsx
```

### 2. データモデル

新規テーブルは作らず、既存の `es.articles` を拡張します。

```text
content_type: article | news
```

- 通常記事: `/articles/{category}/{slug}`
- ニュース: `/news/{category}/{slug}`

同一コンテンツを両方のURLで公開しません。

### 3. URL生成の一元化

`articleHref()`相当の処理で`content_type`を判定します。

```ts
news    -> /news/{category}/{slug}
article -> /articles/{category}/{slug}
```

canonical URL、内部リンク、サイトマップ、再検証先も同じ判定を使います。

### 4. ニュースページ

以下を追加します。

- ニューストップ
- カテゴリ別ニュース一覧
- ニュース詳細ページ
- 新着順表示
- 通常記事と共通化できる本文、出典、FAQ、関連リンク表示

### 5. SEO対応

ニュース詳細ページでは以下を出力します。

- canonical URL
- title、description
- OGP、Twitter Card
- `NewsArticle`構造化データ
- `BreadcrumbList`
- 正確な`datePublished`
- 正確な`dateModified`
- 著者・運営媒体・代表画像

### 6. ニュースサイトマップ

```text
/news-sitemap.xml
```

掲載対象：

- `content_type = news`
- `status = published`
- 公開から2日以内

必要情報：

- 記事URL
- 媒体名
- 言語 `ja`
- 初回公開日時
- 記事タイトル

通常の`sitemap.xml`にもニュースURLを継続して掲載します。

### 7. 公開処理

ニュース公開時に以下を再検証します。

```text
/news/{category}/{slug}
/news
/news/{category}
/news-sitemap.xml
/sitemap.xml
/
```

併せてコンテンツキャッシュタグも無効化します。

### 8. 管理画面

既存の記事作成・編集画面へ種別選択を追加します。

```text
通常記事
ニュース
```

ニュース選択時には次を明確に入力できるようにします。

- ニュースカテゴリ
- 初回公開日時
- SEOタイトル・説明
- 代表画像
- 出典情報

### 9. RSS

新着情報の発見経路として追加を推奨します。

```text
/news/feed.xml
```

公開直後にRSSも更新します。

### 10. DBマイグレーション

`supabase/migrations/`へ以下を追加します。

- `content_type`カラム
- `article | news`の制約
- 既存データを`article`へ移行
- ニュース一覧取得用インデックス

### 11. 実装順序

1. DBマイグレーション
2. 型とマッピング処理
3. URL生成処理
4. ニュース詳細・一覧ルート
5. `NewsArticle`構造化データ
6. ニュースサイトマップ
7. 管理画面
8. revalidate処理
9. RSS
10. `lint`、`typecheck`、`build`、実ページ確認
