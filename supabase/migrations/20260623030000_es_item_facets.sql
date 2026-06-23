-- ユニバーサル item 基盤: item_facets（metadata の構造化投影＝検索/SEO/絞り込み用）。
-- metadata(jsonb) を正本として残し、フィルタ/ソート対象の値を平坦・型別に投影する。
-- 1属性=複数行可（配列はジャンル等を要素ごとに）。保存時は saveItem が再投影する。

create table if not exists es.item_facets (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references es.items(id) on delete cascade,
  key         text not null,
  value_text  text,
  value_num   numeric,
  value_date  timestamptz,
  value_bool  boolean,
  created_at  timestamptz not null default now()
);

create index if not exists item_facets_item_idx on es.item_facets (item_id);
create index if not exists item_facets_key_text_idx on es.item_facets (key, value_text);
create index if not exists item_facets_key_num_idx on es.item_facets (key, value_num);

-- アプリ（lib/supabase-server = service_role）が読み書きできるよう付与。
grant select on es.item_facets to anon, authenticated, service_role;
grant insert, update, delete on es.item_facets to service_role;
