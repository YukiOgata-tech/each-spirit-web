# Google Ops CLI 運用メモ

この repo から Google Analytics 4、Google Cloud、AdSense をコマンドラインで確認・運用するためのメモ。

## 方針

- Google 認証情報、OAuth token、service account key は repo に commit しない。
- ローカルの Google 関連ファイルは `/.google/` 配下に置く。`.gitignore` で除外済み。
- GA4 の閲覧系は service account を優先する。
- AdSense は user OAuth が必要になるため、初回だけブラウザ認可を行い、refresh token を `/.google/` に保存する。
- GCP の project / IAM / API 有効化などは `gcloud` CLI で操作する。

## ローカル gcloud 設定

この環境では通常の `%APPDATA%/gcloud` にログを書けない場合があるため、repo 配下の local config を使う。

```powershell
New-Item -ItemType Directory -Force .google\gcloud
$env:CLOUDSDK_CONFIG = (Resolve-Path .google\gcloud).Path
gcloud auth login
gcloud config set project <gcp-project-id>
gcloud auth application-default login --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/adsense.readonly"
```

以後、このシェル内では `gcloud` が `/.google/gcloud` を使う。

## GA4 管理

必要なもの:

- GA4 property ID
- Google Cloud project
- Analytics Data API の有効化
- service account
- GA4 property 側で service account email に閲覧権限を付与

想定環境変数:

```env
GA4_PROPERTY_ID=
GOOGLE_APPLICATION_CREDENTIALS=C:\projects\each-spirit\.google\ga4-service-account.json
```

user ADC で `analytics.readonly` scope が Google 側にブロックされる場合があるため、GA4 は service account を優先する。

```powershell
$env:CLOUDSDK_CONFIG = (Resolve-Path .google\gcloud).Path
gcloud iam service-accounts create each-spirit-ga4-reader --display-name="Each Spirit GA4 Reader" --project each-sprit-499220
gcloud iam service-accounts keys create .google\ga4-service-account.json --iam-account each-spirit-ga4-reader@each-sprit-499220.iam.gserviceaccount.com --project each-sprit-499220
```

作成した service account email を GA4 property の Admin -> Property access management に Viewer 以上で追加する。

```text
each-spirit-ga4-reader@each-sprit-499220.iam.gserviceaccount.com
```

利用できる CLI:

```powershell
npm run ga:properties
npm run ga:realtime
npm run ga:pages -- --days 7
npm run ga:events -- --event fortune_generate --days 7
npm run ga:fortune -- --days 30
```

`GA4_PROPERTY_ID` が未設定の場合は、各コマンドに `-- --property <GA4_PROPERTY_ID>` を付ける。

確認したい主なイベント:

- `page_view`
- `fortune_generate_start`
- `fortune_generate`
- `fortune_generate_error`
- `fortune_result_view`
- `fortune_start`
- `fortune_share_click`
- `fortune_share_copy`
- `fortune_image_download`

## AdSense 管理

AdSense Management API は user OAuth 前提で扱う。

必要なもの:

- Google Cloud project
- OAuth consent screen
- OAuth client ID / client secret
- AdSense Management API の有効化
- 初回 browser authorization

想定環境変数:

```env
ADSENSE_CLIENT_ID=
ADSENSE_CLIENT_SECRET=
ADSENSE_TOKEN_PATH=C:\projects\each-spirit\.google\adsense-token.json
```

利用できる CLI:

```powershell
npm run adsense:accounts
```

`adsense:accounts` は AdSense Management API の user OAuth scope が必要。通常の `cloud-platform` scope の ADC だけでは不足する場合がある。

## 役割分担

- repo の実装確認: Codex が実施できる。
- `gcloud` / API client の実行: 認証後に Codex が実施できる。
- Google アカウントでの初回ログイン、OAuth 同意、GA4 property への service account 追加: ユーザー操作が必要。
- secret / token の共有: チャットには貼らず、`.env.local` または `/.google/` に置く。

## 次の実装候補

1. GA4 Data API 用の Node CLI を追加する。
2. `fortune_*` イベントの集計コマンドを追加する。
3. AdSense OAuth 初期化コマンドを追加する。
4. AdSense report / policy 確認コマンドを追加する。
5. `ads.txt` と AdSense site status の整合チェックを追加する。
