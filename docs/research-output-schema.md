# 調査結果 JSON 返却仕様

このドキュメントは、外部 ChatGPT や調査担当に情報収集を依頼するときの **返却データ契約** です。

目的は、調査結果を人間向け Markdown ではなく、Codex が少ない手数で `content/**` や Supabase `es` スキーマへ反映できる形にすることです。

## 基本方針

- 返却形式は JSON のみ。Markdown の表、箇条書き、コード説明を混ぜないでください。
- 文章は日本語で書いてください。
- `slug` は英数字小文字とハイフンのみの kebab-case にしてください。
- 不明な値は推測で埋めず、文字列なら `""`、URL や電話番号なら `null`、配列なら `[]` を使ってください。
- `sources` と `last_verified_at` / `last_updated_at` は必須です。
- 各 `item` は最低 2 件以上の `sources` を持たせてください。ランキングは最低 1 件以上の `sources` を持たせてください。
- `articles` は最低 1 件以上必須です。本文は詳細な記事として作成してください。
- 記事本文は最終的に Supabase `es.articles.body_md` に保存します。返却時は `body_md` に Markdown 本文を直接入れるか、別 `.md` ファイルとして同梱してください。
- 公式情報、自治体・観光協会、店舗/会社公式 SNS を優先し、口コミサイトや個人ブログは補助情報として扱ってください。
- PR、広告、アフィリエイト、掲載料の関係が分かる場合は必ず `is_pr` または `metadata.disclosure` に明記してください。

## トップレベル構造（中身は例示）

```json
{
  "schema_version": "1.0",
  "research": {
    "category": "ramen",
    "region": "niigata",
    "prefecture": "新潟県",
    "collected_at": "2026-06-16",
    "objective": "新潟県のラーメン店舗とランキングを追加する",
    "notes": []
  },
  "region_overview": {
    "name": "新潟県",
    "short_name": "新潟",
    "description": "地域ページで使う説明文",
    "tagline": "短いキャッチコピー",
    "seo_title": "SEOタイトル",
    "seo_description": "120字前後のSEO説明文",
    "seo_keywords": ["新潟 ラーメン", "新潟市 ラーメン"],
    "areas": ["新潟市中央区", "長岡市"],
    "featured_slugs": ["example-shop"],
    "hero_image_keywords": ["niigata ramen", "japanese ramen shop"]
  },
  "items": [],
  "rankings": [],
  "articles": []
}
```

`region_overview` は新規地域ページを作る場合に使います。既存地域へ店舗やランキングだけ追加する場合でも、調査メモとして可能な範囲で入れてください。

## 共通型

### Source

`sources` は `metadata.sources` に入ります。

```json
{
  "title": "公式サイト 店舗情報",
  "url": "https://example.com/shop",
  "sourceType": "official",
  "collectedAt": "2026-06-16",
  "note": "住所、営業時間、定休日を確認"
}
```

`sourceType` は以下のいずれかです。

- `official`
- `map`
- `sns`
- `editorial`
- `user-review`
- `government`
- `tourism`
- `local-media`
- `other`

### FAQ

```json
{
  "question": "駐車場はありますか？",
  "answer": "公式情報では店舗前に数台分があります。満車時は周辺駐車場も確認してください。"
}
```

### OfficialLink

```json
{
  "label": "公式サイト",
  "url": "https://example.com",
  "type": "website"
}
```

`type` は `website`、`map`、`instagram`、`x`、`facebook`、`other` のいずれかです。

## items

`items` は Supabase の `es.items` に対応します。カテゴリ固有項目は `metadata` に入れます。

`image_url` はその item の代表画像です。詳細ページの表示画像、OGP / Twitter Card の meta image、JSON-LD の `image` に使われます。権利上安全に使える実物画像、または利用条件を満たした代替画像だけを入れてください。

### 共通 item 構造

```json
{
  "slug": "example-shop",
  "content_type": "ramen_item",
  "region": "niigata",
  "name": "店舗名",
  "description": "店舗や商品の紹介文。検索結果やカードで使える長さにする。",
  "image_url": null,
  "address": "新潟県新潟市中央区...",
  "area": "新潟市中央区・古町",
  "phone": null,
  "price_range": "900円前後",
  "official_url": "https://example.com",
  "map_url": "https://maps.google.com/...",
  "tags": ["新潟市中央区", "醤油", "駅近"],
  "status": "published",
  "last_verified_at": "2026-06-16",
  "editor_comment": "編集部目線の推薦コメント。",
  "metadata": {}
}
```

必須項目:

- `slug`
- `content_type`
- `region` (`travel_app` や `protein` のような全国対象は `null`)
- `name`
- `description`
- `image_url`（安全に使える代表画像がある場合。ない場合は `null`）
- `tags`
- `status`
- `last_verified_at`
- `editor_comment`
- `metadata.sources`
- `metadata.faqs`

### content_type 一覧

| 用途 | `content_type` | ランキング側 `item_content_type` |
| --- | --- | --- |
| ラーメン店舗 | `ramen_item` | `ramen_item` |
| カフェ店舗 | `cafe` | `cafe` |
| 美容サロン | `beauty_salon` | `beauty_salon` |
| 宿泊施設 | `hotel` | `hotel` |
| レジャースポット | `leisure_spot` | `leisure_spot` |
| 旅行会社 | `travel_agency` | `travel_agency` |
| 旅行アプリ | `travel_app` | `travel_app` |
| プロテイン商品 | `protein` | `protein` |

## metadata 仕様

### ramen_item

```json
{
  "genre": "醤油",
  "recommended_menu": "中華そば",
  "parking": true,
  "parking_note": "店舗前に数台。詳細は公式情報を確認。",
  "business_hours": "11:00-15:00",
  "closed_days": "水曜",
  "official_links": [],
  "sources": [],
  "faqs": [],
  "related_ranking_slugs": []
}
```

### cafe

```json
{
  "style": "自家焙煎",
  "signature_menu": "ハンドドリップコーヒー",
  "wifi": false,
  "power": false,
  "parking": true,
  "parking_note": "共用駐車場あり",
  "pet_friendly": false,
  "reservation": "not-needed",
  "business_hours": "10:00-18:00",
  "closed_days": "火曜",
  "instagram_url": null,
  "official_links": [],
  "highlight": "自家焙煎豆と落ち着いた空間が特徴。",
  "sources": [],
  "faqs": [],
  "related_ranking_slugs": []
}
```

`reservation` は `required`、`recommended`、`not-needed` のいずれかです。

### travel_agency

```json
{
  "tagline": "新潟発着ツアーと団体旅行に強い地域旅行会社",
  "services": ["国内旅行", "バスツアー", "団体旅行"],
  "best_for": ["県内発着の日帰り旅行", "職場旅行", "地域テーマ旅"],
  "consultation_style": "店頭・電話・Webフォーム",
  "business_hours": "9:00-17:30",
  "closed_days": "土曜・日曜・祝日",
  "registered_travel_agency": "新潟県知事登録旅行業 第X-XXX号",
  "official_links": [],
  "highlight": "地元発着ツアーと団体手配を相談しやすい。",
  "sources": [],
  "faqs": [],
  "related_ranking_slugs": []
}
```

`services` は既存型に合わせ、次の値を優先してください。

- `国内旅行`
- `海外旅行`
- `バスツアー`
- `団体旅行`
- `貸切バス`
- `宿泊手配`
- `航空券`
- `JR券`
- `着地型ツアー`
- `佐渡旅行`

### travel_app

```json
{
  "brand": "運営会社名",
  "platforms": ["iOS", "Android", "Web"],
  "best_for": ["旅程共有", "乗換検索"],
  "sources": [],
  "faqs": []
}
```

`area` には地域名ではなく、用途分類を入れてください。例: `旅程作成・共有`。

### hotel

```json
{
  "style": "温泉旅館",
  "highlight": "源泉かけ流しと地元食材の夕食が特徴。",
  "check_in": "15:00",
  "check_out": "10:00",
  "meals": "両食",
  "onsen": true,
  "onsen_note": "大浴場あり",
  "parking": true,
  "parking_note": "宿泊者無料",
  "official_links": [],
  "sources": [],
  "faqs": [],
  "related_ranking_slugs": []
}
```

### beauty_salon

```json
{
  "tagline": "大人女性のカラーと髪質改善に強いサロン",
  "access": "新潟駅から徒歩10分",
  "treatments": ["cut", "color", "treatment"],
  "age_groups": ["twenties", "thirties", "forties"],
  "cut_price": "5,500円",
  "color_price": "8,800円から",
  "parking": true,
  "parking_note": "提携駐車場あり",
  "children_welcome": false,
  "men_welcome": true,
  "business_hours": "10:00-19:00",
  "closed_days": "月曜",
  "instagram": null,
  "official_links": [],
  "sources": [],
  "faqs": [],
  "related_ranking_slugs": []
}
```

### leisure_spot

```json
{
  "kind": "outdoor",
  "genre": "公園",
  "best_for": ["子連れ", "半日散策"],
  "highlight": "無料で楽しめる広い芝生エリアが特徴。",
  "parking": true,
  "parking_note": "無料駐車場あり",
  "business_hours": "終日開放",
  "closed_days": "なし",
  "official_links": [],
  "sources": [],
  "faqs": [],
  "related_ranking_slugs": []
}
```

`kind` は `outdoor`、`indoor`、`hybrid` のいずれかです。

### protein

```json
{
  "brand": "ブランド名",
  "protein_type": "whey-wpc",
  "targets": ["beginner", "diet"],
  "serving_size": 30,
  "protein": 21,
  "calories": 120,
  "carbs": 4,
  "fat": 2,
  "package_weight": 1000,
  "package_price": 3980,
  "price_per_kg": 3980,
  "flavors": ["チョコ", "バニラ"],
  "pros": ["価格が比較的安い"],
  "cons": ["人工甘味料が気になる人には不向き"],
  "sources": [],
  "faqs": []
}
```

## rankings

`rankings` は Supabase の `es.rankings` と `es.ranking_items` に対応します。ランキング内の `items` は必ず同じ JSON 内の `items.slug`、または既存掲載済み item の slug を参照してください。

```json
{
  "slug": "niigata-ramen-best",
  "content_type": "ramen",
  "region": "niigata",
  "title": "新潟県のラーメンおすすめランキング",
  "description": "評価軸と対象地域が分かる説明文。",
  "conclusion": "総合力ならA、駅近ならB、濃厚系ならCが候補です。",
  "quick_table_label": "新潟ラーメン総合評価早見表",
  "criteria": ["味の個性", "地域性", "アクセス", "公式情報の明確さ"],
  "tags": ["新潟", "ラーメン", "ランキング"],
  "status": "published",
  "last_updated_at": "2026-06-16",
  "metadata": {
    "sources": [],
    "faqs": []
  },
  "items": [
    {
      "rank": 1,
      "item_content_type": "ramen_item",
      "item_slug": "example-shop",
      "score": 94,
      "reason": "味、地域性、アクセスのバランスがよい。",
      "is_pr": false,
      "metadata": {}
    }
  ]
}
```

### ranking content_type 一覧

| 用途 | `rankings.content_type` | `ranking_items.item_content_type` |
| --- | --- | --- |
| ラーメンランキング | `ramen` | `ramen_item` |
| カフェランキング | `cafe` | `cafe` |
| 美容サロンランキング | `beauty` | `beauty_salon` |
| 宿ランキング | `hotel` | `hotel` |
| レジャーランキング | `leisure` | `leisure_spot` |
| 旅行会社ランキング | `travel_agency` | `travel_agency` |
| プロテインランキング | `protein` | `protein` |

## articles

`articles` は最低 1 件以上必須です。Supabase の `es.articles` に対応します。

記事は短い紹介文やランキングの要約ではなく、検索流入と内部回遊に使える詳細記事として作成してください。本文は Markdown 形式で、見出し、比較観点、地域・用途別の選び方、ランキングや item への内部リンクに使いやすい関連 slug を含めてください。

本文は 4,000〜6,000 字目安です。各店舗の紹介では、公式情報などで確認した事実、読者にとっての使いどころ、注意点を分けて書いてください。編集者向けメモ、画像権利メモ、実装メモは記事本文に混ぜないでください。

本文は次のどちらかで返却できます。

- JSON 内の `body_md` に Markdown 本文を直接入れる。
- 記事本文を別 `.md` ファイルで作成し、JSON の `body_md` にファイル名を入れる。取り込み時に本文を読み込み、DB の `body_md` に保存します。

`.md` ファイルを分ける場合は、JSON と Markdown ファイルをまとめた zip で返却しても構いません。

```json
{
  "slug": "niigata-ramen-first-guide",
  "category": "ramen",
  "region": "niigata",
  "title": "新潟ラーメンの選び方ガイド",
  "description": "記事カードやSEOで使う説明文。",
  "body_md": "# 見出し\n\nMarkdown本文",
  "cover_image_url": null,
  "author_name": "Each Spirit 編集部",
  "tags": ["新潟", "ラーメン", "初めて"],
  "status": "published",
  "published_at": "2026-06-16",
  "seo_title": "新潟ラーメンの選び方ガイド",
  "seo_description": "新潟ラーメンの特徴と選び方を紹介します。",
  "seo_keywords": ["新潟 ラーメン", "新潟 ラーメン 初心者"],
  "metadata": {
    "summary": ["新潟ラーメンの主要スタイルが分かる"],
    "what_you_learn": ["エリア別の選び方", "初訪問向けの候補"],
    "sources": [],
    "faqs": [],
    "related_slugs": []
  }
}
```

## 画像候補

`image_url` は、権利上安全に使える場合のみ入れてください。公式サイト画像の直リンクを前提にしないでください。

`image_url` に入った画像は、以下に使われます。

- 詳細ページのメイン画像
- OGP / Twitter Card の meta image
- JSON-LD の `image`
- 一覧カードの画像

画像が不明な場合は `image_url: null` にし、`metadata.image_research` を追加してください。

```json
{
  "image_research": {
    "preferred_image": null,
    "source_url": null,
    "is_real_location_image": false,
    "usage_note": "実物画像は権利確認が必要。代替画像を推奨。",
    "requires_remote_pattern": false,
    "fallback_keywords": ["ramen shop japan", "niigata food"]
  }
}
```

## 最終チェック

返却前に以下を確認してください。

- JSON として parse できる。
- すべての item に `slug`、`content_type`、`region`、`name`、`description`、`last_verified_at`、`metadata.sources` がある。
- すべての ranking item の `item_slug` が、同じ JSON の `items` か既存掲載済み item を指している。
- `sourceType` が定義済み値だけを使っている。
- 日付は `YYYY-MM-DD`。
- URL は実在するページを指している。
- 不明な情報を断定していない。
