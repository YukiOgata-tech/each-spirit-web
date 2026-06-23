-- ユニバーサル item 基盤 Phase 1: items に粗い型 item_class を追加。
-- place / work / product / app / service / event / person / concept。
-- 既存データから backfill（非破壊・列追加のみ）。型固有の項目は引き続き metadata(jsonb) に持つ。

alter table es.items add column if not exists item_class text;

update es.items set item_class = case
  when major_category = 'entertainment' then 'work'
  when item_kind = 'product' then 'product'
  when item_kind = 'app' then 'app'
  else 'place'
end
where item_class is null;

alter table es.items alter column item_class set default 'place';

alter table es.items drop constraint if exists items_item_class_check;
alter table es.items add constraint items_item_class_check
  check (item_class in ('place','work','product','app','service','event','person','concept'));

create index if not exists items_item_class_idx on es.items (item_class);
