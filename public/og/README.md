# OG 背景画像（item_class 別・1200×630 推奨）

items 個別ページの OG 画像は `/api/og/item` がここの背景に `name` を合成して動的生成する。
item_class ごとに以下のファイル名で配置する（ロゴ込み）。

- `physical_service-class.jpg` — 店舗・施設（来店型）
- `intangible_service-class.jpg` — サービス（非来店）
- `media-class.jpg` — 作品・メディア
- `product-class.jpg` — 商品
- `person-class.jpg` — 人物
- `other-class.jpg` — その他

未配置の item_class は `other-class.jpg`（無ければ単色背景）にフォールバックする。
