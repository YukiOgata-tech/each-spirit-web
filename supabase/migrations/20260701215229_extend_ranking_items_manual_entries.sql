-- ranking_items を「既存 item 参照」だけでなく、手入力のランキング項目にも対応させる。
-- 既存行は entry_kind='item' として扱い、追加列は必要な項目だけ入力する。

alter table es.ranking_items
  add column if not exists entry_kind text not null default 'item'
    check (entry_kind = any (array['item', 'manual'])),
  add column if not exists display_name text,
  add column if not exists description text,
  add column if not exists external_url text,
  add column if not exists image_url text,
  add column if not exists image_alt text,
  add column if not exists price_range text,
  add column if not exists area text,
  add column if not exists tags text[] not null default '{}'::text[];

create index if not exists idx_ranking_items_entry_kind
  on es.ranking_items using btree (entry_kind);
