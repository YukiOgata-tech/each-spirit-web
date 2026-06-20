# メジャーカテゴリ画像（meta + hero 3枚）

各メジャーカテゴリのトップページ（`/food` `/health` `/beauty` `/travel` `/leisure`）が
共通で使う画像です。フォルダごとに **同じファイル名** で配置してください。

```
public/images/categories/<major>/
  meta.jpg     OG/SNSシェア & 配下ページのメタ画像フォールバック   1200 × 630
  hero-1.jpg   トップ hero のメイン画像（横長）                    1600 × 1200 程度
  hero-2.jpg   hero サブ画像                                       800 × 1000 程度
  hero-3.jpg   hero サブ画像                                       800 × 1000 程度
```

対象 major: `food` / `health` / `beauty` / `travel` / `leisure`

- ファイル名・拡張子は固定（`.jpg`）。形式を変える場合は `lib/category-media.ts` の `EXT` を変更。
- `meta.jpg` は、そのメジャー配下で個別メタ画像を持たないページ（セクション一覧・ランキング詳細など）の
  OG 画像フォールバックとして自動的に使われます（`lib/category-media.ts` の `majorMetaImage`）。
- hero 3枚はトップページの hero セクションのデザインに使われます（メジャーごとに配置・装飾が異なります）。
- 画像未配置の間は hero 背景のグラデーションが見えるだけで、レイアウトは崩れません。
