alter table es.items
  add column if not exists item_kind text;

update es.items
set item_kind = case
  when major_category = 'food' and section_slug in ('ramen', 'cafe') then 'shop'
  when major_category = 'health' and section_slug = 'protein' then 'product'
  when major_category = 'beauty' and section_slug = 'hair-salon' then 'salon'
  when major_category = 'travel' and section_slug = 'stays' then 'hotel'
  when major_category = 'travel' and section_slug = 'services' and content_type = 'travel_app' then 'app'
  when major_category = 'travel' and section_slug = 'services' then 'agency'
  when major_category = 'leisure' and section_slug = 'spots' then 'spot'
  else item_kind
end
where item_kind is null;

alter table es.items
  add constraint items_item_kind_nonempty check (item_kind is null or item_kind <> '');

create index if not exists idx_items_major_section_kind_region_status
  on es.items (major_category, section_slug, item_kind, region, status);

create unique index if not exists idx_items_section_kind_slug_unique
  on es.items (major_category, section_slug, item_kind, slug)
  where major_category is not null
    and section_slug is not null
    and item_kind is not null;

update es.content_sections
set
  display_config = case
    when major_category = 'travel' and section_slug = 'services'
      then display_config || '{"item_kinds":["agency","app"]}'::jsonb
    else display_config
  end,
  metadata = metadata || jsonb_build_object('item_identity_source', 'major_category_section_slug_item_kind'),
  updated_at = now();
