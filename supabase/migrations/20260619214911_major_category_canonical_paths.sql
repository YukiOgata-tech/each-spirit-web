alter table es.articles
  add column if not exists major_category text,
  add column if not exists section_slug text,
  add column if not exists canonical_path text;

alter table es.items
  add column if not exists major_category text,
  add column if not exists section_slug text,
  add column if not exists canonical_path text;

alter table es.rankings
  add column if not exists major_category text,
  add column if not exists section_slug text,
  add column if not exists canonical_path text;

create table if not exists es.content_sections (
  id uuid primary key default gen_random_uuid(),
  major_category text not null check (major_category in ('food', 'health', 'beauty', 'travel', 'leisure')),
  section_slug text not null check (section_slug <> ''),
  label text not null check (label <> ''),
  description text not null default '',
  href text not null check (href <> ''),
  content_model text not null default 'directory',
  item_path_segment text,
  region_mode text not null default 'optional' check (region_mode in ('none', 'optional', 'required')),
  target_mode text not null default 'none' check (target_mode in ('none', 'optional', 'required')),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 100,
  display_config jsonb not null default '{}',
  seo_config jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (major_category, section_slug)
);

alter table es.content_sections enable row level security;

create policy "content_sections: public read published"
  on es.content_sections for select
  to anon, authenticated
  using (status = 'published');

create policy "content_sections: service role full access"
  on es.content_sections for all
  to service_role
  using (true)
  with check (true);

alter table es.content_sections
  add column if not exists content_model text not null default 'directory',
  add column if not exists item_path_segment text,
  add column if not exists region_mode text not null default 'optional',
  add column if not exists target_mode text not null default 'none',
  add column if not exists display_config jsonb not null default '{}',
  add column if not exists seo_config jsonb not null default '{}';

insert into es.content_sections (
  major_category,
  section_slug,
  label,
  description,
  href,
  content_model,
  item_path_segment,
  region_mode,
  target_mode,
  sort_order,
  metadata
)
values
  ('food', 'ramen', 'ラーメン', '地域、味、移動手段で選べるラーメンガイド。', '/food/ramen', 'restaurant', 'shops', 'optional', 'none', 10, '{"item_label":"店舗"}'::jsonb),
  ('food', 'cafe', 'カフェ', '雰囲気、コーヒー、作業環境で選べるカフェガイド。', '/food/cafe', 'restaurant', 'shops', 'required', 'none', 20, '{"item_label":"店舗"}'::jsonb),
  ('health', 'protein', 'プロテイン', '目的、成分、価格帯で選べるプロテイン比較。', '/health/protein', 'product', 'products', 'none', 'optional', 10, '{"item_label":"商品"}'::jsonb),
  ('beauty', 'hair-salon', '美容室', '年代、施術、エリアで選べる美容室ガイド。', '/beauty/hair-salon', 'salon', 'salons', 'required', 'none', 10, '{"item_label":"サロン"}'::jsonb),
  ('travel', 'stays', '宿・温泉', '温泉旅館や宿泊施設を旅スタイルで選べる旅行ガイド。', '/travel/stays', 'hotel', 'hotels', 'required', 'none', 10, '{"item_label":"宿"}'::jsonb),
  ('travel', 'services', '旅行サービス', '旅行会社と旅行アプリを比較する旅行サービスガイド。', '/travel/services', 'travel-service', 'agencies', 'required', 'none', 20, '{"item_label":"旅行会社"}'::jsonb),
  ('leisure', 'spots', 'スポット', '天候、同行者、移動手段で選べるレジャースポットガイド。', '/leisure/spots', 'spot', 'spots', 'required', 'none', 10, '{"item_label":"スポット"}'::jsonb)
on conflict (major_category, section_slug) do update
set
  label = excluded.label,
  description = excluded.description,
  href = excluded.href,
  content_model = excluded.content_model,
  item_path_segment = excluded.item_path_segment,
  region_mode = excluded.region_mode,
  target_mode = excluded.target_mode,
  sort_order = excluded.sort_order,
  metadata = es.content_sections.metadata || excluded.metadata,
  updated_at = now();

update es.articles
set
  major_category = case
    when category in ('ramen', 'cafe') then 'food'
    when category = 'protein' then 'health'
    when category = 'beauty' then 'beauty'
    when category in ('travel', 'travel-services') then 'travel'
    when category = 'leisure' then 'leisure'
    else major_category
  end,
  section_slug = case
    when category = 'ramen' then 'ramen'
    when category = 'cafe' then 'cafe'
    when category = 'protein' then 'protein'
    when category = 'beauty' then 'hair-salon'
    when category = 'travel' then 'stays'
    when category = 'travel-services' then 'services'
    when category = 'leisure' then 'spots'
    else section_slug
  end
where major_category is null
  and category in ('ramen', 'cafe', 'protein', 'beauty', 'travel', 'travel-services', 'leisure');

update es.articles
set canonical_path = case
  when major_category is null then '/articles/' || slug
  when section_slug is not null then '/' || major_category || '/' || section_slug || '/articles/' || slug
  else '/articles/' || slug
end
where canonical_path is null;

update es.items
set
  major_category = case
    when content_type in ('ramen_item', 'cafe') then 'food'
    when content_type = 'protein' then 'health'
    when content_type = 'beauty_salon' then 'beauty'
    when content_type in ('hotel', 'travel_agency', 'travel_app') then 'travel'
    when content_type = 'leisure_spot' then 'leisure'
    else major_category
  end,
  section_slug = case
    when content_type = 'ramen_item' then 'ramen'
    when content_type = 'cafe' then 'cafe'
    when content_type = 'protein' then 'protein'
    when content_type = 'beauty_salon' then 'hair-salon'
    when content_type = 'hotel' then 'stays'
    when content_type in ('travel_agency', 'travel_app') then 'services'
    when content_type = 'leisure_spot' then 'spots'
    else section_slug
  end
where major_category is null
  and content_type in ('ramen_item', 'cafe', 'protein', 'beauty_salon', 'hotel', 'travel_agency', 'travel_app', 'leisure_spot');

update es.items
set canonical_path = case
  when content_type = 'ramen_item' then '/food/ramen/shops/' || slug
  when content_type = 'cafe' and region is not null then '/food/cafe/' || region || '/shops/' || slug
  when content_type = 'cafe' then '/food/cafe/shops/' || slug
  when content_type = 'protein' then '/health/protein/products/' || slug
  when content_type = 'beauty_salon' and region is not null then '/beauty/hair-salon/' || region || '/salons/' || slug
  when content_type = 'hotel' and region is not null then '/travel/stays/' || region || '/hotels/' || slug
  when content_type = 'travel_agency' and region is not null then '/travel/services/' || region || '/agencies/' || slug
  when content_type = 'travel_app' then '/travel/services/apps'
  when content_type = 'leisure_spot' and region is not null then '/leisure/spots/' || region || '/spots/' || slug
  else canonical_path
end
where canonical_path is null;

update es.rankings
set
  major_category = case
    when content_type in ('ramen', 'cafe') then 'food'
    when content_type = 'protein' then 'health'
    when content_type = 'beauty' then 'beauty'
    when content_type in ('hotel', 'travel_agency') then 'travel'
    when content_type = 'leisure' then 'leisure'
    else major_category
  end,
  section_slug = case
    when content_type = 'ramen' then 'ramen'
    when content_type = 'cafe' then 'cafe'
    when content_type = 'protein' then 'protein'
    when content_type = 'beauty' then 'hair-salon'
    when content_type = 'hotel' then 'stays'
    when content_type = 'travel_agency' then 'services'
    when content_type = 'leisure' then 'spots'
    else section_slug
  end
where major_category is null
  and content_type in ('ramen', 'cafe', 'protein', 'beauty', 'hotel', 'travel_agency', 'leisure');

update es.rankings
set canonical_path = case
  when content_type = 'ramen' then '/food/ramen/rankings/' || slug
  when content_type = 'cafe' and region is not null then '/food/cafe/' || region || '/rankings/' || slug
  when content_type = 'protein' and metadata ? 'target' then '/health/protein/' || (metadata->>'target') || '/rankings/' || slug
  when content_type = 'beauty' and region is not null then '/beauty/hair-salon/' || region || '/rankings/' || slug
  when content_type = 'hotel' and region is not null then '/travel/stays/' || region || '/rankings/' || slug
  when content_type = 'travel_agency' and region is not null then '/travel/services/' || region || '/rankings/' || slug
  when content_type = 'leisure' and region is not null then '/leisure/spots/' || region || '/rankings/' || slug
  else canonical_path
end
where canonical_path is null;

create index if not exists idx_articles_major_category_status
  on es.articles (major_category, status, updated_at desc);

create index if not exists idx_items_major_section_region_status
  on es.items (major_category, section_slug, region, status);

create index if not exists idx_rankings_major_section_region_status
  on es.rankings (major_category, section_slug, region, status);
