-- ==========================================================
-- each-spirit: 地域(region) と protein targets を DB 化（D1/D2）
-- 作成: 2026-06-20
--
-- 「情報コンテンツはすべて es スキーマが正」方針の徹底。
-- 表示用のリッチな構造はカテゴリごとに異なるため、キー列＋完全オブジェクト
-- (data jsonb) で保持する。静的 content/*/regions.ts・protein/targets.ts は
-- seed 入力（fallback）として残す（静的=入力 / DB=配信 の踏襲）。
-- ==========================================================

create table if not exists es.content_regions (
  id            uuid primary key default gen_random_uuid(),
  major_category text not null check (major_category in ('food','health','beauty','travel','leisure')),
  section_slug  text not null check (section_slug <> ''),
  region_slug   text not null check (region_slug <> ''),
  status        text not null default 'live' check (status in ('live','planned','archived')),
  sort_order    int  not null default 100,
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (major_category, section_slug, region_slug)
);

create table if not exists es.content_targets (
  id            uuid primary key default gen_random_uuid(),
  major_category text not null default 'health' check (major_category in ('food','health','beauty','travel','leisure')),
  section_slug  text not null default 'protein' check (section_slug <> ''),
  target_slug   text not null check (target_slug <> ''),
  status        text not null default 'live' check (status in ('live','planned','archived')),
  sort_order    int  not null default 100,
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (major_category, section_slug, target_slug)
);

alter table es.content_regions enable row level security;
alter table es.content_targets enable row level security;

create policy "content_regions: public read live"
  on es.content_regions for select
  to anon, authenticated
  using (status = 'live');

create policy "content_targets: public read live"
  on es.content_targets for select
  to anon, authenticated
  using (status = 'live');

create trigger set_content_regions_updated_at
  before update on es.content_regions
  for each row execute function es.set_updated_at();

create trigger set_content_targets_updated_at
  before update on es.content_targets
  for each row execute function es.set_updated_at();
