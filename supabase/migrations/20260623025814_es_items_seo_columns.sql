-- ユニバーサル item 基盤 Phase B-SEO: items に SEO 構造化列を追加（追加のみ・非破壊）。
-- metadata(jsonb) は原本として温存し、SEO/構造で使う値を識別容易なカラムへ反映する。
--   seo_title / seo_description : 個別ページの title/description 上書き（無ければ name/description にフォールバック）
--   address_region            : 都道府県（JSON-LD PostalAddress.addressRegion の構造化。住所から導出）
--   latitude / longitude      : geo（LocalBusiness/地図。将来用、現状データなし）

alter table es.items add column if not exists seo_title text;
alter table es.items add column if not exists seo_description text;
alter table es.items add column if not exists address_region text;
alter table es.items add column if not exists latitude numeric;
alter table es.items add column if not exists longitude numeric;

-- 既存 metadata の seo_title / seo_description を列へ反映（lossless：metadata は残す）
update es.items
set seo_title = coalesce(seo_title, nullif(metadata->>'seo_title', ''))
where metadata ? 'seo_title';
update es.items
set seo_description = coalesce(seo_description, nullif(metadata->>'seo_description', ''))
where metadata ? 'seo_description';

-- 住所から都道府県を抽出して address_region に反映（コードの正規表現と同等）
update es.items
set address_region = substring(address from '^(東京都|北海道|.{2,3}[都道府県])')
where address is not null and address <> '' and address_region is null;
