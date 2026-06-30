-- ============================================================================
-- Affiliate monetization links
--
-- 方針:
-- - platform master は少数（Amazon/Rakuten/Yahoo/旅行予約/ASP 等）に抑える
-- - item/article/ranking 側は検索語・開示文を affiliate_targets で持つ
-- - 売れ筋や特定案件だけ affiliate_links に個別URL/バナーを上書き登録する
-- - 公開面は active/enabled のみ read、編集は service_role 経由
-- ============================================================================

create table if not exists es.affiliate_platforms (
  id                   uuid primary key default gen_random_uuid(),
  provider             text not null unique,
  label                text not null,
  platform_type        text not null default 'shopping'
                         check (platform_type in ('shopping','travel','service','official','asp','other')),
  description          text not null default '',
  search_url_template  text not null,
  direct_url_template  text,
  default_cta_label    text not null default '価格を見る',
  default_rel          text not null default 'sponsored nofollow noopener noreferrer',
  tracking_config      jsonb not null default '{}'::jsonb,
  disclosure_required  boolean not null default true,
  enabled              boolean not null default true,
  sort_order           integer not null default 100,
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint affiliate_platforms_provider_format
    check (provider ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  constraint affiliate_platforms_search_template_has_query
    check (position('{{query}}' in search_url_template) > 0)
);

create trigger set_affiliate_platforms_updated_at
  before update on es.affiliate_platforms
  for each row execute function es.set_updated_at();

create index if not exists affiliate_platforms_enabled_sort_idx
  on es.affiliate_platforms (enabled, sort_order, provider);

alter table es.affiliate_platforms enable row level security;

create policy "affiliate_platforms: public read enabled"
  on es.affiliate_platforms
  for select to anon, authenticated
  using (enabled is true);

create policy "affiliate_platforms: service role full access"
  on es.affiliate_platforms
  for all to service_role
  using (true)
  with check (true);

grant select on es.affiliate_platforms to anon, authenticated;
grant select, insert, update, delete on es.affiliate_platforms to service_role;

create table if not exists es.affiliate_targets (
  id               uuid primary key default gen_random_uuid(),
  target_kind      text not null
                     check (target_kind in ('item','article','ranking','section','custom')),
  target_id        uuid,
  target_slug      text,
  major_category   text,
  section_slug     text,
  title            text not null,
  affiliate_query  text not null,
  disclosure_note  text not null default 'このページにはアフィリエイトリンクを含みます。',
  status           text not null default 'active'
                     check (status in ('draft','active','paused','archived')),
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint affiliate_targets_reference_required
    check (target_id is not null or target_slug is not null),
  constraint affiliate_targets_query_not_blank
    check (btrim(affiliate_query) <> '')
);

create trigger set_affiliate_targets_updated_at
  before update on es.affiliate_targets
  for each row execute function es.set_updated_at();

create unique index if not exists affiliate_targets_target_id_unique_idx
  on es.affiliate_targets (target_kind, target_id)
  where target_id is not null;

create unique index if not exists affiliate_targets_slug_unique_idx
  on es.affiliate_targets (
    target_kind,
    coalesce(major_category, ''),
    coalesce(section_slug, ''),
    target_slug
  )
  where target_id is null and target_slug is not null;

create index if not exists affiliate_targets_status_category_idx
  on es.affiliate_targets (status, major_category, section_slug, target_kind);

alter table es.affiliate_targets enable row level security;

create policy "affiliate_targets: public read active"
  on es.affiliate_targets
  for select to anon, authenticated
  using (status = 'active');

create policy "affiliate_targets: service role full access"
  on es.affiliate_targets
  for all to service_role
  using (true)
  with check (true);

grant select on es.affiliate_targets to anon, authenticated;
grant select, insert, update, delete on es.affiliate_targets to service_role;

create table if not exists es.affiliate_links (
  id                    uuid primary key default gen_random_uuid(),
  affiliate_target_id   uuid not null references es.affiliate_targets(id) on delete cascade,
  platform_id           uuid not null references es.affiliate_platforms(id) on delete restrict,
  label                 text,
  cta_label             text,
  url                   text,
  query                 text,
  link_role             text not null default 'search'
                          check (link_role in ('search','direct','banner','text')),
  placement             text not null default 'default'
                          check (placement in ('default','article_body','item_detail','ranking_card','sidebar','footer')),
  priority              integer not null default 100,
  status                text not null default 'active'
                          check (status in ('draft','active','paused','archived')),
  starts_at             timestamptz,
  ends_at               timestamptz,
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint affiliate_links_url_or_query_required
    check (url is not null or query is not null),
  constraint affiliate_links_window_order
    check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create trigger set_affiliate_links_updated_at
  before update on es.affiliate_links
  for each row execute function es.set_updated_at();

create index if not exists affiliate_links_target_status_idx
  on es.affiliate_links (affiliate_target_id, status, placement, priority);

create index if not exists affiliate_links_platform_status_idx
  on es.affiliate_links (platform_id, status);

alter table es.affiliate_links enable row level security;

create policy "affiliate_links: public read active"
  on es.affiliate_links
  for select to anon, authenticated
  using (
    status = 'active'
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
    and exists (
      select 1
      from es.affiliate_targets t
      where t.id = affiliate_links.affiliate_target_id
        and t.status = 'active'
    )
    and exists (
      select 1
      from es.affiliate_platforms p
      where p.id = affiliate_links.platform_id
        and p.enabled is true
    )
  );

create policy "affiliate_links: service role full access"
  on es.affiliate_links
  for all to service_role
  using (true)
  with check (true);

grant select on es.affiliate_links to anon, authenticated;
grant select, insert, update, delete on es.affiliate_links to service_role;
