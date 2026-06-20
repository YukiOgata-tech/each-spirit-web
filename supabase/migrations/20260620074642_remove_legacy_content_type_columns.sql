-- ==========================================================
-- each-spirit: items/rankings/ranking_items の旧 content_type 列を削除
-- 作成: 2026-06-20
--
-- major_category + section_slug + item_kind + canonical_path への移行後、
-- items.content_type / rankings.content_type / ranking_items.item_content_type は
-- section_slug とほぼ重複する旧互換列になったため削除する。
-- ==========================================================

do $$
begin
  if exists (
    select 1 from es.items
    where major_category is null
       or section_slug is null
       or item_kind is null
       or canonical_path is null
  ) then
    raise exception 'Cannot drop es.items.content_type: section/item_kind/canonical fields contain NULL';
  end if;

  if exists (
    select 1 from es.rankings
    where major_category is null
       or section_slug is null
       or canonical_path is null
  ) then
    raise exception 'Cannot drop es.rankings.content_type: section/canonical fields contain NULL';
  end if;

  if exists (
    select 1 from es.ranking_items
    where item_id is null
  ) then
    raise exception 'Cannot drop es.ranking_items.item_content_type: item_id contains NULL';
  end if;
end $$;

drop index if exists es.idx_items_type_region;
drop index if exists es.idx_items_like_count;
drop index if exists es.idx_rankings_type_region;
drop index if exists es.idx_rankings_like_count;
drop index if exists es.idx_ranking_items_item;

create index if not exists idx_items_section_region
  on es.items (major_category, section_slug, region)
  where status = 'published';

create index if not exists idx_items_section_like_count
  on es.items (major_category, section_slug, like_count desc)
  where status = 'published';

create index if not exists idx_rankings_section_region
  on es.rankings (major_category, section_slug, region)
  where status = 'published';

create index if not exists idx_rankings_section_like_count
  on es.rankings (major_category, section_slug, like_count desc)
  where status = 'published';

alter table es.items
  drop column if exists content_type;

alter table es.rankings
  drop column if exists content_type;

alter table es.ranking_items
  drop column if exists item_content_type;
