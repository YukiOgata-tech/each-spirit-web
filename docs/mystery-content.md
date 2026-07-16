# ミステリーコンテンツ実装仕様

最終確認日: 2026-07-16

この文書は、Each Spiritに実装済みの謎解き・暗号コンテンツについて、現在のコードとSupabase `es` スキーマの状態を記録する。

## 公開ルート

| パス | 実装 | 内容 |
| --- | --- | --- |
| `/mystery` | `app/mystery/page.tsx` | 公開中・受付終了済み問題の一覧 |
| `/mystery/[slug]` | `app/mystery/[slug]/page.tsx` | 問題詳細、資料、ヒント、回答、正解者記録 |
| `/api/mystery/submissions` | `app/api/mystery/submissions/route.ts` | ログインユーザーの公式回答・ファイル提出 |
| `/account` | `app/account/page.tsx` | ログインユーザー本人の「解読済み暗号」一覧 |
| `/account/storage` | `app/account/storage/page.tsx` | 管理者向け `mystery-assets` アップロード |

`/mystery` に公開対象がない場合は「現在、公開中の問題はありません」と表示する。

## データ取得とキャッシュ

公開ページの取得処理は `lib/mystery.ts` に集約されている。

- `getMysteryPuzzles()` は問題一覧と問題ごとの正解者数を取得する。
- `getMysteryPuzzle(slug)` は問題本文、添付資料、ヒント、正解者記録を取得する。
- 問題・本文・資料・ヒントのキャッシュタグは `es-mystery`。
- 正解者記録のキャッシュタグは `es-mystery-solves`。
- 問題データの再検証間隔は30日。
- 正解者記録の再検証間隔は300秒。
- 公式フォーム回答が正解した場合は `es-mystery-solves` を即時無効化する。

Supabase上の問題やヒントを直接変更した場合は、`POST /api/revalidate` に次のbodyを送る。

```json
{
  "scope": "mystery"
}
```

認証には `Authorization: Bearer <REVALIDATE_SECRET>` または `?secret=<REVALIDATE_SECRET>` を使用する。この処理は `/mystery`、`/mystery/[slug]`、`es-mystery`、`es-mystery-solves` を再検証する。

## 問題を構成する3軸

問題は表示方法、回答方法、回答記録方針を別々の値で保持する。

### 表示モデル `content_model`

| 値 | 表示処理 |
| --- | --- |
| `custom` | Reactコンポーネントによる専用表示 |
| `markdown` | `body_md` を `MarkdownRenderer` で表示 |
| `staged` | `body_md` の導入文と、正解によって順次解放されるstageを表示 |

`custom` では `custom_renderer_key` が必須で、それ以外のモデルでは `custom_renderer_key` は `null` でなければならない。

カスタムレンダラーの対応表は `components/mystery/MysteryContentRenderer.tsx` にある。現在登録されているキーは次の1件。

```text
undated_archive_v1 -> UndatedArchiveEvidence
```

問題詳細ルートにはslug固有の表示分岐を置いていない。

### 回答方法 `answer_method`

| 値 | UIと処理 |
| --- | --- |
| `form` | テキストフォームで回答する |
| `file` | ファイルを必須提出し、審査待ちとして保存する |
| `flexible` | 問題文で指定された現地・外部サイトなどの方法を案内する |

`answer_config` は回答UIの追加設定を保持するJSON objectである。アプリが参照するキーは次のとおり。

| キー | 使用箇所 |
| --- | --- |
| `placeholder` | フォーム回答のplaceholder |
| `maxLength` | フォーム回答の最大文字数。アプリ側上限は200文字 |
| `allowedTypes` | 提出ファイルのMIME type |
| `maxFiles` | 設定値として保持可能。現在の提出UI/APIは1ファイル |
| `maxSizeMb` | ファイルサイズ上限。アプリ側上限は10MB |
| `commentEnabled` | ファイル提出時の補足コメント欄 |
| `title` | 回答パネルのタイトル |
| `description` | 回答パネルの説明 |
| `actionLabel` | `flexible` の外部リンク表示名 |
| `actionUrl` | `flexible` の外部リンク |

`flexible` はサイト内の汎用提出APIを呼ばない。`actionUrl` がある場合は外部リンクを表示する。

### 回答記録方針 `answer_policy`

| 値 | ログイン | 回答・正解記録 |
| --- | --- | --- |
| `official` | 必須 | `mystery_submissions` と、正解時の `mystery_solves` を使用 |
| `check_only` | 不要 | 正誤だけ返し、回答本文・submission・solveを保存しない |

DB制約により、`check_only` は `form` でのみ使用できる。`staged` は必ず `form + check_only` になる。

## 詳細ページの表示構成

`app/mystery/[slug]/page.tsx` は次の構成を持つ。

1. ヒーロー画像、CASE番号、難易度、所要時間、回答方法
2. 問題本文と表示モデル固有コンテンツ
3. 添付資料
4. ヒントと回答パネル
5. `official` 問題だけに表示される正解者記録

表示モデルの分岐は `MysteryContentRenderer`、回答方法と記録方針の分岐は `MysteryAnswerPanel` が担当する。

暗号ページ専用の `loading.tsx` はない。ページ遷移時はルートの `app/loading.tsx` と `GlobalRouteLoader` を使用する。

## Markdown問題

`markdown` モデルは `mystery_puzzles.body_md` を `components/cards/MarkdownRenderer.tsx` で表示する。

現在のMarkdownレンダラーは通常の見出し、段落、リンク、リスト、引用、コード、表、画像と、既存のカスタムdirectiveを処理する。問題固有の追加Reactコンポーネントは使用しない。

公開資料を問題本文から参照する場合は、通常のMarkdown画像・リンクとしてURLを記述できる。別枠の添付資料は `mystery_attachments` を使用する。

## カスタム問題

`custom` モデルは、DBの `custom_renderer_key` とアプリ内レジストリを対応させて表示する。

カスタム問題の本文やメタデータはDBに保持できるが、専用Reactコンポーネントの変更にはアプリのデプロイが必要となる。

カスタムレンダラーには `puzzle` と `closed` が渡される。`puzzle.heroImageUrl` と `puzzle.attachments[].fileUrl` にはSupabase Storageの公開URLを設定できるため、カスタム問題でも画像URLをコンポーネントへ固定記述する必要はない。

## 多段階問題

多段階表示は `components/mystery/StagedMysteryRunner.tsx` が担当する。

### データ

- 各段階の本文は `mystery_stages` に保持する。
- 各段階の正解ハッシュは `mystery_stage_answers` に保持する。
- stage本文と正解テーブルは `anon` と `authenticated` から直接SELECTできない。
- 第1段階は `get_mystery_first_stage()` RPCで取得する。
- 回答判定と次段階の解放は `check_mystery_stage_answer()` RPCで行う。
- 第2段階以降は、その段階の `access_key` が一致しなければ判定できない。
- 未解放のstage本文は初期HTMLに含まれない。

### ブラウザ内の進行

解放済みstage、現在の `access_key`、完了状態は次のキーで `sessionStorage` に保存する。

```text
each-spirit:mystery-stage:{slug}
```

同じタブの再読み込みでは進行を復元する。リセット操作では該当キーを削除してページを再読み込みする。stageの進行状況と完了結果はSupabaseに保存せず、正解者記録にも追加しない。

現在、`staged` の公開問題データは登録されていない。

## 回答処理

### 公式フォーム回答

1. クライアントでログイン状態を確認する。
2. 未ログインの場合は `/auth/login?next=/mystery/{slug}` へのリンクを表示する。
3. `/api/mystery/submissions` がSupabase Authのユーザーを再確認する。
4. `submit_mystery_text_answer()` RPCが正解ハッシュを照合する。
5. 判定結果を `mystery_submissions` に保存する。
6. 正解時は `mystery_solves` にupsertする。

表示名は2文字以上24文字以下。回答は200文字以下。1ユーザーあたりの提出上限は1時間20回。

自動判定では、生の回答本文を `mystery_submissions.answer_text` に保存しない。正規化後のSHA-256ハッシュを `answer_fingerprint` に保存する。

### 判定のみ

`check_only` はブラウザから `check_mystery_text_answer()` RPCを呼び出す。

- ログインは要求しない。
- 正誤とメッセージだけを返す。
- 回答本文、submission、solveは保存しない。
- 1時間30回を上限として判定する。
- 試行制限には転送元IPとUser-Agentから作成したSHA-256 fingerprintを使用する。
- `mystery_check_attempts` に保存するのはfingerprintと時刻だけである。
- 24時間より古い試行行は判定処理内で削除する。

多段階回答も同じ試行制限を使用する。

### ファイル回答

`file` はログイン必須の公式回答として処理される。

- 対応形式はJPEG、PNG、WebP、PDF、テキスト、ZIP。
- 最大サイズは `answer_config.maxSizeMb` で指定し、APIの上限は10MB。
- 保存先は非公開の `mystery-submissions` bucket。
- object pathは `{user_id}/{puzzle_id}/{random_uuid}.{extension}`。
- DBには `file_path` と任意の補足コメントを保存する。
- 初期の `review_status` は `pending`。
- DB保存に失敗した場合は、アップロード済みobjectを削除する。

現在、ファイル提出を審査する専用管理画面は実装されていない。

### 回答の正規化

`normalize_mystery_answer(text)` は回答を次の順で正規化する。

1. 前後の空白を除去
2. すべての連続空白を除去
3. 小文字化

正解は正規化後のUTF-8文字列をSHA-256でhash化し、`mystery_answers.answer_hash` または `mystery_stage_answers.answer_hash` と照合する。

## Supabaseテーブル

すべて `es` スキーマに存在する。

| テーブル | 用途 |
| --- | --- |
| `mystery_puzzles` | 問題のメタデータ、本文、3軸の設定 |
| `mystery_attachments` | 公開添付資料 |
| `mystery_hints` | 公開ヒント |
| `mystery_answers` | 通常問題の非公開正解ハッシュ |
| `mystery_submissions` | ログインユーザーの提出・判定履歴 |
| `mystery_solves` | 公式問題の正解者記録 |
| `mystery_stages` | 非公開の多段階本文とaccess key |
| `mystery_stage_answers` | 非公開のstage正解ハッシュ |
| `mystery_check_attempts` | 匿名判定の試行制限用fingerprint |

`mystery_submissions` には初期実装由来の `sns_url` 列が残っているが、現在の `form / file / flexible` UIと提出APIはこの列へ書き込まない。初期実装の `answer_mode / judge_mode / location_label` 列は `mystery_puzzles` から削除済みである。

### `mystery_puzzles` の主要制約

- `slug` はkebab-caseで一意。
- `case_number` は1以上で一意。
- `difficulty` は1から5。
- `status` は `draft / published / closed / archived`。
- `content_model` は `custom / markdown / staged`。
- `answer_method` は `form / file / flexible`。
- `answer_policy` は `official / check_only`。
- `answer_config` はJSON object。

公開ページから読める問題statusは `published` と `closed`。`closed` は詳細表示と正解者記録の閲覧はできるが、回答受付は行わない。

## RLSと関数権限

- `mystery_puzzles`、`mystery_attachments`、`mystery_hints` は公開済み・受付終了済み問題だけを公開する。
- `mystery_solves` は公開ボード用の列だけを `anon` と `authenticated` に公開し、`user_id` は公開しない。
- `mystery_submissions` は本人の行だけSELECT・INSERTできる。
- `mystery_answers`、`mystery_stages`、`mystery_stage_answers`、`mystery_check_attempts` は直接公開しない。
- `submit_mystery_text_answer()` と `get_my_mystery_solves()` は `authenticated` だけが実行できる。
- `check_mystery_text_answer()`、`get_mystery_first_stage()`、`check_mystery_stage_answer()` は `anon` と `authenticated` が実行できる。

本人の解読済み一覧は `get_my_mystery_solves()` が `auth.uid()` と一致する公式solveだけを返す。

## Storage

| bucket | 公開設定 | 上限 | 用途 |
| --- | --- | --- | --- |
| `mystery-assets` | public | 15MB | 問題本文・添付資料用 |
| `mystery-submissions` | private | 10MB | ユーザー提出物 |

`mystery-assets` はpublic object URLで配信する。`storage.objects` の公開SELECT policyは削除されているため、匿名ユーザーへbucket一覧権限は付与していない。

`mystery-submissions` はobject pathの先頭folderが `auth.uid()` と一致するユーザーだけがread、upload、deleteできる。

管理者は `/account/storage` の自由パスモードで `mystery-assets` を選択し、画像、PDF、音声、テキスト、ZIPをアップロードできる。

## 画像配信

謎解きコンテンツ内の画像はVercel Image Optimizationを使用しない。

- 一覧・詳細のヒーロー、問題カード、カスタム資料は `MysteryImage` を使用する。
- `MysteryImage` は `next/image` に常に `unoptimized` を設定する。
- `next/image` のレイアウト制御、`fill`、`sizes`、lazy loadingは引き続き使用する。
- Markdown問題本文、ヒント、多段階本文は `MarkdownRenderer` に `unoptimizedImages` を渡す。
- 通常のMarkdown画像以外で使用されるHTML `img` もImage Optimizationを通らない。
- この設定は謎解きコンテンツ内だけに適用し、サイト全体の `next/image` 設定は変更しない。

現在の第一問は、ヒーロー画像1件と19件の資料画像がすべてWebPである。

`/mystery` 配下のOpen Graph画像とTwitter Card画像は、問題ごとのヒーロー画像ではなく `public/mystery/mystery-og.webp` を共通使用する。画像サイズは1200×630。

第二問以降の問題画像はSupabase Storageの `mystery-assets` bucketへWebPを主体に保存する。object pathは問題slugを先頭に置く。

```text
{slug}/hero.webp
{slug}/evidence/01.webp
{slug}/evidence/02.webp
{slug}/attachments/{filename}
```

公開URLは次の形式になる。

```text
https://{project-ref}.supabase.co/storage/v1/object/public/mystery-assets/{slug}/{path}
```

- ヒーローは完全な公開URLを `mystery_puzzles.hero_image_url` に保存する。
- Markdown本文内の画像は完全な公開URLを `body_md` に記述する。
- 別枠の資料は完全な公開URLを `mystery_attachments.file_url` に保存する。
- カスタム問題は `puzzle.attachments` から同じ公開URLを受け取れる。

## 現在の公開問題

Supabaseに登録されている公開問題は1件。

| CASE | slug | タイトル | 表示 | 回答 | 記録 |
| --- | --- | --- | --- | --- | --- |
| 001 | `undated-archive` | 年代の失われた収蔵庫 | `custom` / `undated_archive_v1` | `form` | `official` |

この問題は次の要素で構成される。

- 導入と復元規則は `mystery_puzzles.body_md`。
- 19件の資料定義と表示は `components/mystery/UndatedArchiveEvidence.tsx`。
- 資料画像は `public/mystery/undated-archive/`。
- ヒーロー画像は `public/mystery/mystery-hero.webp`。
- ヒントはSupabaseに2件登録されている。
- 正解は `mystery_answers` のhashと照合する。

## 問題の登録方法

謎解き問題の作成・編集専用管理画面は現在実装されていない。問題データはSupabaseまたは `supabase/migrations/` のSQLで登録する。

### Markdown問題

最低限、`mystery_puzzles` に次を設定する。

```text
content_model = markdown
custom_renderer_key = null
body_md = 問題本文
answer_method = form | file | flexible
answer_policy = official | check_only
```

フォーム判定を使用する場合は、正規化した正解のSHA-256 hashを `mystery_answers` に登録する。

### カスタム問題

1. 専用Reactコンポーネントを作成する。
2. `MysteryContentRenderer.tsx` の `customMysteryRenderers` にキーを登録する。
3. `mystery_puzzles.content_model` を `custom` にする。
4. `custom_renderer_key` に登録したキーを設定する。

### 多段階問題

1. `mystery_puzzles` を `staged + form + check_only` で登録する。
2. `mystery_stages` に1から連続する `stage_number` で本文を登録する。
3. 各stageの正解hashを `mystery_stage_answers` に登録する。

登録・変更後は `scope: mystery` のon-demand revalidationを実行する。

## 実装ファイル

| ファイル | 責務 |
| --- | --- |
| `lib/mystery.ts` | 型、公開データ取得、キャッシュタグ、表示ラベル |
| `app/mystery/page.tsx` | 一覧ページ |
| `app/mystery/[slug]/page.tsx` | 詳細ページ |
| `components/mystery/MysteryPuzzleCard.tsx` | 一覧カード |
| `components/mystery/MysteryImage.tsx` | `unoptimized` を強制する謎解き専用画像ラッパー |
| `components/mystery/MysteryContentRenderer.tsx` | 表示モデルの分岐、カスタムレジストリ |
| `components/mystery/MysteryAnswerPanel.tsx` | ヒント、ログイン判定、3種類の回答UI |
| `components/mystery/StagedMysteryRunner.tsx` | 多段階取得・回答・sessionStorage進行 |
| `components/mystery/UndatedArchiveEvidence.tsx` | 第一問の19資料 |
| `app/api/mystery/submissions/route.ts` | 公式フォーム回答、ファイル提出 |
| `app/api/revalidate/route.ts` | 謎解きキャッシュのon-demand再検証 |
| `supabase/migrations/20260715071412_add_mystery_content.sql` | 基本テーブル、Storage、初期RPC |
| `supabase/migrations/20260715071702_harden_mystery_access.sql` | 公開asset一覧権限の削除 |
| `supabase/migrations/20260715073554_remove_intro_mystery_puzzle.sql` | 仮問題の削除 |
| `supabase/migrations/20260715120212_publish_undated_archive_mystery.sql` | 第一問の登録 |
| `supabase/migrations/20260715131337_remove_undated_archive_hint_three.sql` | 第一問のヒント3削除 |
| `supabase/migrations/20260715143416_mystery_content_models.sql` | 3軸モデル、多段階、判定のみ、本人solve RPC |
| `supabase/migrations/20260715144808_harden_mystery_content_models.sql` | 非公開テーブルの明示的deny policy |
