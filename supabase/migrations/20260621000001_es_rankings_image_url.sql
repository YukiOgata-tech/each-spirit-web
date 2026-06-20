-- ランキングのカード/メタ画像用 image_url を es.rankings に追加。
-- 未設定の場合はアプリ側で 1位アイテムの image_url にフォールバックする。
alter table es.rankings
  add column if not exists image_url text;

comment on column es.rankings.image_url is 'ランキングカード/OGメタ画像のURL。未設定時はアプリが1位アイテムの画像へフォールバック。';
