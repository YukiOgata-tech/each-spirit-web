alter table es.ranking_items
  add column if not exists item_id uuid references es.items(id) on delete restrict;

update es.ranking_items ri
set item_id = i.id
from es.items i
where ri.item_id is null
  and i.slug = ri.item_slug
  and i.content_type = ri.item_content_type;

create unique index if not exists idx_items_major_section_slug_unique
  on es.items (major_category, section_slug, slug)
  where major_category is not null
    and section_slug is not null;

create unique index if not exists idx_rankings_major_section_slug_unique
  on es.rankings (major_category, section_slug, slug)
  where major_category is not null
    and section_slug is not null;

create index if not exists idx_ranking_items_item_id
  on es.ranking_items (item_id)
  where item_id is not null;

update es.items
set canonical_path = case
  when major_category = 'food' and section_slug = 'ramen' then '/food/ramen/shops/' || slug
  when major_category = 'food' and section_slug = 'cafe' then '/food/cafe/shops/' || slug
  when major_category = 'health' and section_slug = 'protein' then '/health/protein/products/' || slug
  when major_category = 'beauty' and section_slug = 'hair-salon' then '/beauty/hair-salon/salons/' || slug
  when major_category = 'travel' and section_slug = 'stays' then '/travel/stays/hotels/' || slug
  when major_category = 'travel' and section_slug = 'services' and content_type = 'travel_agency' then '/travel/services/agencies/' || slug
  when major_category = 'travel' and section_slug = 'services' and content_type = 'travel_app' then '/travel/services/apps'
  when major_category = 'leisure' and section_slug = 'spots' then '/leisure/spots/spots/' || slug
  else canonical_path
end
where major_category is not null
  and section_slug is not null;

update es.rankings
set canonical_path = '/' || major_category || '/' || section_slug || '/rankings/' || slug
where major_category is not null
  and section_slug is not null;

update es.content_sections
set
  metadata = metadata || jsonb_build_object('identity_source', 'major_category_section_slug'),
  updated_at = now();
