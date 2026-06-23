-- ============================================================================
-- es スキーマ 初期スキーマ（consolidated initial schema）
-- 生成日: 2026-06-24 / 稼働中の本番 DB（project ctwpnaizwsrffrkkbuig）の
--         実構造を MCP で事実取得し、1ファイルに統合したもの。
--
-- これ以前の es 関連マイグレーション断片はすべてこのファイルに集約済み。
-- 対象は each-spirit 専有の `es` スキーマ ＋ each-spirit 所有のストレージバケット
-- （each-spirit-images / article-assets）のみ。
--
-- 【対象外】auth.* / public.*（飲酒管理アプリと共有）と avatars バケットは
--   別管理。FK は auth.users(id) を外部依存として参照する（存在前提）。
--   public.handle_new_user 等の共有オブジェクトはこのファイルでは扱わない。
-- ============================================================================

create schema if not exists es;
grant usage on schema es to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 共通関数 / トリガ関数
-- ----------------------------------------------------------------------------

create or replace function es.set_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function es.handle_like_insert()
returns trigger
language plpgsql
security definer
set search_path to 'es', 'public'
as $function$
begin
  insert into es.content_like_counts (content_kind, target_id, region_slug, like_type, count)
  values (NEW.content_kind, NEW.target_id, NEW.region_slug, NEW.like_type, 1)
  on conflict (content_kind, target_id, like_type)
  do update set count = es.content_like_counts.count + 1;
  return NEW;
end;
$function$;

create or replace function es.handle_like_delete()
returns trigger
language plpgsql
security definer
set search_path to 'es', 'public'
as $function$
begin
  update es.content_like_counts
  set count = greatest(count - 1, 0)
  where content_kind = OLD.content_kind and target_id = OLD.target_id and like_type = OLD.like_type;
  return OLD;
end;
$function$;

create or replace function es.sync_like_rollup()
returns trigger
language plpgsql
security definer
set search_path to 'es', 'public'
as $function$
declare v_kind text; v_id uuid; v_delta int;
begin
  if TG_OP = 'INSERT' then
    if NEW.like_type <> 'like' then return NEW; end if;
    v_kind := NEW.content_kind; v_id := NEW.target_id; v_delta := 1;
  else
    if OLD.like_type <> 'like' then return OLD; end if;
    v_kind := OLD.content_kind; v_id := OLD.target_id; v_delta := -1;
  end if;
  if v_kind = 'article' then
    update es.articles set like_count = greatest(like_count + v_delta, 0) where id = v_id;
  elsif v_kind = 'ranking' then
    update es.rankings set like_count = greatest(like_count + v_delta, 0) where id = v_id;
  else
    update es.items set like_count = greatest(like_count + v_delta, 0) where id = v_id;
  end if;
  return coalesce(NEW, OLD);
end;
$function$;

create or replace function es.handle_review_vote()
returns trigger
language plpgsql
security definer
set search_path to 'es', 'public'
as $function$
begin
  if TG_OP = 'INSERT' and NEW.vote = 'helpful' then
    update es.reviews set helpful_count = helpful_count + 1 where id = NEW.review_id;
  elsif TG_OP = 'DELETE' and OLD.vote = 'helpful' then
    update es.reviews set helpful_count = greatest(helpful_count - 1, 0) where id = OLD.review_id;
  end if;
  return coalesce(NEW, OLD);
end;
$function$;

create or replace function es.claim_daily_bonus(p_reason text, p_reference text)
returns integer
language plpgsql
security definer
set search_path to 'es', 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_amount int;
  v_new int;
begin
  if v_uid is null then return 0; end if;
  -- 金額はサーバー側で決定（呼び出し側からは指定不可＝不正防止）
  v_amount := case p_reason
                when 'daily_fortune' then 5
                when 'daily_login'   then 3
                else 0
              end;
  if v_amount = 0 then return 0; end if;

  -- 同一(reason, reference)は1回のみ
  if exists (select 1 from es.point_ledger
             where user_id = v_uid and reason = p_reason and reference = p_reference) then
    return 0;
  end if;

  insert into es.user_points (user_id, balance, lifetime, updated_at)
  values (v_uid, v_amount, v_amount, now())
  on conflict (user_id) do update set
    balance  = es.user_points.balance + v_amount,
    lifetime = es.user_points.lifetime + v_amount,
    updated_at = now()
  returning balance into v_new;

  insert into es.point_ledger (user_id, delta, reason, reference, balance_after)
  values (v_uid, v_amount, p_reason, p_reference, v_new);

  return v_amount;
exception when unique_violation then
  return 0;
end;
$function$;

grant execute on function es.claim_daily_bonus(text, text) to authenticated;

-- ============================================================================
-- テーブル定義（FK 依存順: items/rankings/reviews を先に作成）
-- ============================================================================

-- ----------------------------------------------------------------------------
-- admin_users : 管理者メールのホワイトリスト
-- ----------------------------------------------------------------------------
create table es.admin_users (
  email      text primary key,
  label      text,
  enabled    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_admin_users_updated_at before update on es.admin_users
  for each row execute function es.set_updated_at();

alter table es.admin_users enable row level security;
create policy "admin_users: own enabled read" on es.admin_users
  for select to authenticated
  using (enabled is true and lower(email) = lower(auth.jwt() ->> 'email'));

grant select on es.admin_users to authenticated;
grant select, insert, update, delete on es.admin_users to service_role;

-- ----------------------------------------------------------------------------
-- articles : 記事
-- ----------------------------------------------------------------------------
create table es.articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  category        text not null,
  region          text,
  title           text not null,
  description     text not null,
  body_md         text not null default ''::text,
  cover_image_url text,
  author_name     text,
  author_id       uuid references auth.users(id) on delete set null,
  tags            text[] not null default '{}'::text[],
  status          text not null default 'draft'::text
                    check (status = any (array['draft','published','archived'])),
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  seo_keywords    text[] not null default '{}'::text[],
  like_count      integer not null default 0 check (like_count >= 0),
  view_count      integer not null default 0 check (view_count >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  metadata        jsonb not null default '{}'::jsonb,
  major_category  text,
  section_slug    text,
  canonical_path  text
);

create index idx_articles_category_region on es.articles using btree (category, region);
create index idx_articles_major_category_status on es.articles using btree (major_category, status, updated_at desc);
create index idx_articles_status_published on es.articles using btree (published_at desc) where (status = 'published'::text);

create trigger set_articles_updated_at before update on es.articles
  for each row execute function es.set_updated_at();

alter table es.articles enable row level security;
create policy "articles: public read published" on es.articles
  for select to anon, authenticated using (status = 'published'::text);

grant select, insert, update, delete on es.articles to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- items : ユニバーサル・コンテンツベース（店舗/商品/作品/人物 など）
-- ----------------------------------------------------------------------------
create table es.items (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null,
  region         text,
  name           text not null,
  description    text not null default ''::text,
  phone          text,
  price_range    text,
  official_url   text,
  tags           text[] not null default '{}'::text[],
  status         text not null default 'published'::text
                   check (status = any (array['draft','published','archived'])),
  editor_comment text not null default ''::text,
  like_count     integer not null default 0 check (like_count >= 0),
  view_count     integer not null default 0 check (view_count >= 0),
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  major_category text,
  section_slug   text,
  canonical_path text,
  item_kind      text,
  item_class     text default 'other'::text
                   check (item_class = any (array['physical_service','intangible_service','media','person','product','other'])),
  genres         text[] not null default '{}'::text[],
  image          jsonb not null default '{}'::jsonb,
  address_info   jsonb not null default '{}'::jsonb,
  seo            jsonb not null default '{}'::jsonb,
  sources        jsonb not null default '[]'::jsonb,
  history        jsonb not null default '[]'::jsonb,
  faq            jsonb not null default '[]'::jsonb,
  service_model  jsonb not null default '[]'::jsonb,
  related_link   jsonb not null default '[]'::jsonb,
  constraint items_item_kind_nonempty check ((item_kind is null) or (item_kind <> ''::text))
);

create index idx_items_major_section_kind_region_status on es.items using btree (major_category, section_slug, item_kind, region, status);
create index idx_items_major_section_region_status on es.items using btree (major_category, section_slug, region, status);
create unique index idx_items_major_section_slug_unique on es.items using btree (major_category, section_slug, slug)
  where ((major_category is not null) and (section_slug is not null));
create index idx_items_metadata on es.items using gin (metadata);
create unique index idx_items_section_kind_slug_unique on es.items using btree (major_category, section_slug, item_kind, slug)
  where ((major_category is not null) and (section_slug is not null) and (item_kind is not null));
create index idx_items_section_like_count on es.items using btree (major_category, section_slug, like_count desc) where (status = 'published'::text);
create index idx_items_section_region on es.items using btree (major_category, section_slug, region) where (status = 'published'::text);
create index idx_items_tags on es.items using gin (tags);
create index items_genres_gin_idx on es.items using gin (genres);
create index items_item_class_idx on es.items using btree (item_class);
create index items_major_section_idx on es.items using btree (major_category, section_slug);

create trigger set_items_updated_at before update on es.items
  for each row execute function es.set_updated_at();

alter table es.items enable row level security;
create policy "items: public read published" on es.items
  for select to anon, authenticated using (status = 'published'::text);
create policy "items: authenticated write" on es.items
  for all to authenticated using (true) with check (true);

grant select, insert, update, delete on es.items to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- rankings : ランキング
-- ----------------------------------------------------------------------------
create table es.rankings (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null,
  region            text,
  title             text not null,
  description       text not null default ''::text,
  conclusion        text not null default ''::text,
  quick_table_label text not null default ''::text,
  criteria          text[] not null default '{}'::text[],
  tags              text[] not null default '{}'::text[],
  status            text not null default 'published'::text
                      check (status = any (array['draft','published','archived'])),
  last_updated_at   date,
  like_count        integer not null default 0 check (like_count >= 0),
  view_count        integer not null default 0 check (view_count >= 0),
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  major_category    text,
  section_slug      text,
  canonical_path    text,
  image_url         text
);

create index idx_rankings_major_section_region_status on es.rankings using btree (major_category, section_slug, region, status);
create unique index idx_rankings_major_section_slug_unique on es.rankings using btree (major_category, section_slug, slug)
  where ((major_category is not null) and (section_slug is not null));
create index idx_rankings_section_like_count on es.rankings using btree (major_category, section_slug, like_count desc) where (status = 'published'::text);
create index idx_rankings_section_region on es.rankings using btree (major_category, section_slug, region) where (status = 'published'::text);

create trigger set_rankings_updated_at before update on es.rankings
  for each row execute function es.set_updated_at();

alter table es.rankings enable row level security;
create policy "rankings: public read published" on es.rankings
  for select to anon, authenticated using (status = 'published'::text);

grant select, insert, update, delete on es.rankings to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- ranking_items : ランキング項目
-- ----------------------------------------------------------------------------
create table es.ranking_items (
  id         uuid primary key default gen_random_uuid(),
  ranking_id uuid not null references es.rankings(id) on delete cascade,
  rank       smallint not null check (rank >= 1),
  item_slug  text not null,
  score      numeric,
  reason     text not null default ''::text,
  is_pr      boolean not null default false,
  metadata   jsonb not null default '{}'::jsonb,
  item_id    uuid references es.items(id) on delete restrict,
  unique (ranking_id, rank)
);

create index idx_ranking_items_item_id on es.ranking_items using btree (item_id) where (item_id is not null);
create index idx_ranking_items_ranking on es.ranking_items using btree (ranking_id, rank);

alter table es.ranking_items enable row level security;
create policy "ranking_items: public read" on es.ranking_items
  for select to anon, authenticated using (true);

grant select, insert, update, delete on es.ranking_items to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- business_accounts : ビジネスアカウント（コンテンツ所有権）
-- ----------------------------------------------------------------------------
create table es.business_accounts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  plan         text not null default 'free'::text
                 check (plan = any (array['free','basic','premium','enterprise'])),
  status       text not null default 'pending'::text
                 check (status = any (array['pending','active','suspended','cancelled'])),
  verified_at  timestamptz,
  expires_at   timestamptz,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  content_kind text not null check (content_kind = any (array['item','article','ranking'])),
  target_id    uuid not null,
  unique (content_kind, target_id)
);

create index idx_business_accounts_content_ref on es.business_accounts using btree (content_kind, target_id);

create trigger set_business_accounts_updated_at before update on es.business_accounts
  for each row execute function es.set_updated_at();

alter table es.business_accounts enable row level security;
create policy "business_accounts: own read" on es.business_accounts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "business_accounts: own insert" on es.business_accounts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "business_accounts: own update" on es.business_accounts
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.business_accounts to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- content_like_counts : いいね集計（ロールアップ）
-- ----------------------------------------------------------------------------
create table es.content_like_counts (
  content_kind text not null check (content_kind = any (array['item','article','ranking'])),
  target_id    uuid not null,
  region_slug  text,
  count        integer not null default 0 check (count >= 0),
  like_type    text not null default 'like'::text,
  primary key (content_kind, target_id, like_type)
);

alter table es.content_like_counts enable row level security;
create policy "content_like_counts: public read" on es.content_like_counts
  for select to anon, authenticated using (true);

grant select, insert, update, delete on es.content_like_counts to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- content_likes : いいね/ブックマーク/行きたい
-- ----------------------------------------------------------------------------
create table es.content_likes (
  user_id      uuid not null references auth.users(id) on delete cascade,
  content_kind text not null check (content_kind = any (array['item','article','ranking'])),
  target_id    uuid not null,
  region_slug  text,
  created_at   timestamptz not null default now(),
  like_type    text not null default 'like'::text,
  constraint like_type_valid check (like_type = any (array['like','bookmark','want_to_visit'])),
  primary key (user_id, content_kind, target_id, like_type)
);

create index idx_content_likes_user on es.content_likes using btree (user_id);

create trigger on_content_like_insert after insert on es.content_likes
  for each row execute function es.handle_like_insert();
create trigger on_content_like_delete after delete on es.content_likes
  for each row execute function es.handle_like_delete();
create trigger on_like_rollup after insert or delete on es.content_likes
  for each row execute function es.sync_like_rollup();

alter table es.content_likes enable row level security;
create policy "content_likes: public read likes" on es.content_likes
  for select to anon, authenticated using (like_type = 'like'::text);
create policy "content_likes: own read private" on es.content_likes
  for select to authenticated
  using (((select auth.uid()) = user_id) and (like_type = any (array['bookmark','want_to_visit'])));
create policy "content_likes: own insert" on es.content_likes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "content_likes: own delete" on es.content_likes
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.content_likes to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- content_regions : 大カテゴリ × section の地域定義
-- ----------------------------------------------------------------------------
create table es.content_regions (
  id             uuid primary key default gen_random_uuid(),
  major_category text not null check (major_category = any (array['food','health','beauty','travel','leisure'])),
  section_slug   text not null check (section_slug <> ''::text),
  region_slug    text not null check (region_slug <> ''::text),
  status         text not null default 'live'::text
                   check (status = any (array['live','planned','archived'])),
  sort_order     integer not null default 100,
  data           jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (major_category, section_slug, region_slug)
);

create trigger set_content_regions_updated_at before update on es.content_regions
  for each row execute function es.set_updated_at();

alter table es.content_regions enable row level security;
create policy "content_regions: public read live" on es.content_regions
  for select to anon, authenticated using (status = 'live'::text);

grant select on es.content_regions to anon, authenticated;
grant select, insert, update, delete on es.content_regions to service_role;

-- ----------------------------------------------------------------------------
-- content_reports : 通報
-- ----------------------------------------------------------------------------
create table es.content_reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references auth.users(id) on delete cascade,
  reason       text not null
                 check (reason = any (array['spam','inappropriate','misinformation','copyright','duplicate','other'])),
  detail       text not null default ''::text,
  status       text not null default 'pending'::text
                 check (status = any (array['pending','reviewed','resolved','dismissed'])),
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  content_kind text not null check (content_kind = any (array['item','article','ranking'])),
  target_id    uuid not null
);

create index idx_content_reports_content_ref on es.content_reports using btree (content_kind, target_id);

alter table es.content_reports enable row level security;
create policy "content_reports: own read" on es.content_reports
  for select to authenticated using ((select auth.uid()) = reporter_id);
create policy "content_reports: own insert" on es.content_reports
  for insert to authenticated with check ((select auth.uid()) = reporter_id);

grant select, insert, update, delete on es.content_reports to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- content_sections : 大カテゴリ × section 定義（section のメタ正本）
-- ----------------------------------------------------------------------------
create table es.content_sections (
  id                uuid primary key default gen_random_uuid(),
  major_category    text not null
                      check (major_category = any (array['food','health','beauty','travel','leisure','entertainment'])),
  section_slug      text not null check (section_slug <> ''::text),
  label             text not null check (label <> ''::text),
  description       text not null default ''::text,
  href              text not null check (href <> ''::text),
  content_model     text not null default 'directory'::text,
  item_path_segment text,
  region_mode       text not null default 'optional'::text
                      check (region_mode = any (array['none','optional','required'])),
  target_mode       text not null default 'none'::text
                      check (target_mode = any (array['none','optional','required'])),
  status            text not null default 'published'::text
                      check (status = any (array['draft','published','archived'])),
  sort_order        integer not null default 100,
  display_config    jsonb not null default '{}'::jsonb,
  seo_config        jsonb not null default '{}'::jsonb,
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  item_schema       jsonb not null default '{}'::jsonb,
  unique (major_category, section_slug)
);

alter table es.content_sections enable row level security;
create policy "content_sections: public read published" on es.content_sections
  for select to anon, authenticated using (status = 'published'::text);
create policy "content_sections: service role full access" on es.content_sections
  for all to service_role using (true) with check (true);

grant select on es.content_sections to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- content_targets : 目的（target）定義（例: protein のターゲット）
-- ----------------------------------------------------------------------------
create table es.content_targets (
  id             uuid primary key default gen_random_uuid(),
  major_category text not null default 'health'::text
                   check (major_category = any (array['food','health','beauty','travel','leisure'])),
  section_slug   text not null default 'protein'::text check (section_slug <> ''::text),
  target_slug    text not null check (target_slug <> ''::text),
  status         text not null default 'live'::text
                   check (status = any (array['live','planned','archived'])),
  sort_order     integer not null default 100,
  data           jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (major_category, section_slug, target_slug)
);

create trigger set_content_targets_updated_at before update on es.content_targets
  for each row execute function es.set_updated_at();

alter table es.content_targets enable row level security;
create policy "content_targets: public read live" on es.content_targets
  for select to anon, authenticated using (status = 'live'::text);

grant select on es.content_targets to anon, authenticated;
grant select, insert, update, delete on es.content_targets to service_role;

-- ----------------------------------------------------------------------------
-- daily_fortunes : デイリー運勢
-- ----------------------------------------------------------------------------
create table es.daily_fortunes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  fortune_date date not null,
  fortune_type text not null default 'zodiac'::text,
  result       jsonb not null,
  created_at   timestamptz not null default now(),
  unique (user_id, fortune_date, fortune_type)
);

create index idx_daily_fortunes_user_date on es.daily_fortunes using btree (user_id, fortune_date);

alter table es.daily_fortunes enable row level security;
create policy "daily_fortunes: own read" on es.daily_fortunes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "daily_fortunes: own insert" on es.daily_fortunes
  for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.daily_fortunes to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- notifications : 通知
-- ----------------------------------------------------------------------------
create table es.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text not null default ''::text,
  action_url text,
  data       jsonb not null default '{}'::jsonb,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread on es.notifications using btree (user_id, created_at desc) where (read_at is null);

alter table es.notifications enable row level security;
create policy "notifications: own read" on es.notifications
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "notifications: own update" on es.notifications
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.notifications to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- point_ledger : ポイント履歴
-- ----------------------------------------------------------------------------
create table es.point_ledger (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  delta         integer not null,
  reason        text not null,
  reference     text,
  balance_after integer not null,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index idx_point_ledger_user on es.point_ledger using btree (user_id, created_at desc);
create unique index uq_point_ledger_daily on es.point_ledger using btree (user_id, reason, reference)
  where (reason = any (array['daily_fortune','daily_login']));

alter table es.point_ledger enable row level security;
create policy "point_ledger: own read" on es.point_ledger
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "point_ledger: own insert" on es.point_ledger
  for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.point_ledger to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- quiz_results : 診断結果
-- ----------------------------------------------------------------------------
create table es.quiz_results (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  quiz_type  text not null,
  answers    jsonb not null,
  result     jsonb not null,
  created_at timestamptz not null default now()
);

alter table es.quiz_results enable row level security;
create policy "quiz_results: own read" on es.quiz_results
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "quiz_results: own insert" on es.quiz_results
  for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.quiz_results to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- reviews : レビュー
-- ----------------------------------------------------------------------------
create table es.reviews (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  region_slug   text,
  rating        smallint not null check ((rating >= 1) and (rating <= 5)),
  title         text,
  body          text not null default ''::text,
  visit_date    date,
  status        text not null default 'published'::text
                  check (status = any (array['draft','published','hidden','deleted'])),
  helpful_count integer not null default 0 check (helpful_count >= 0),
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  content_kind  text not null check (content_kind = any (array['item','article','ranking'])),
  target_id     uuid not null,
  unique (user_id, content_kind, target_id)
);

create index idx_reviews_content_ref on es.reviews using btree (content_kind, target_id);
create index idx_reviews_user on es.reviews using btree (user_id);

create trigger set_reviews_updated_at before update on es.reviews
  for each row execute function es.set_updated_at();

alter table es.reviews enable row level security;
create policy "reviews: public read published" on es.reviews
  for select to anon, authenticated using (status = 'published'::text);
create policy "reviews: own read all" on es.reviews
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "reviews: own insert" on es.reviews
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "reviews: own update" on es.reviews
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "reviews: own delete" on es.reviews
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.reviews to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- review_votes : レビューへの投票（参考になった）
-- ----------------------------------------------------------------------------
create table es.review_votes (
  review_id  uuid not null references es.reviews(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  vote       text not null default 'helpful'::text
               check (vote = any (array['helpful','unhelpful'])),
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

create trigger on_review_vote_change after insert or delete on es.review_votes
  for each row execute function es.handle_review_vote();

alter table es.review_votes enable row level security;
create policy "review_votes: public read" on es.review_votes
  for select to anon, authenticated using (true);
create policy "review_votes: own insert" on es.review_votes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "review_votes: own delete" on es.review_votes
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.review_votes to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- user_follows : フォロー関係
-- ----------------------------------------------------------------------------
create table es.user_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followee_id uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint no_self_follow check (follower_id <> followee_id),
  primary key (follower_id, followee_id)
);

create index idx_user_follows_followee on es.user_follows using btree (followee_id);
create index idx_user_follows_follower on es.user_follows using btree (follower_id);

alter table es.user_follows enable row level security;
create policy "user_follows: public read" on es.user_follows
  for select to anon, authenticated using (true);
create policy "user_follows: own insert" on es.user_follows
  for insert to authenticated with check ((select auth.uid()) = follower_id);
create policy "user_follows: own delete" on es.user_follows
  for delete to authenticated using ((select auth.uid()) = follower_id);

grant select, insert, update, delete on es.user_follows to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- user_points : ポイント残高
-- ----------------------------------------------------------------------------
create table es.user_points (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  balance    integer not null default 0 check (balance >= 0),
  lifetime   integer not null default 0 check (lifetime >= 0),
  updated_at timestamptz not null default now()
);

alter table es.user_points enable row level security;
create policy "user_points: own read" on es.user_points
  for select to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.user_points to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- user_prefs : ユーザー設定
-- ----------------------------------------------------------------------------
create table es.user_prefs (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  favorite_categories text[] not null default '{}'::text[],
  favorite_regions    text[] not null default '{}'::text[],
  notify_email        boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  metadata            jsonb not null default '{}'::jsonb
);

create trigger set_user_prefs_updated_at before update on es.user_prefs
  for each row execute function es.set_updated_at();

alter table es.user_prefs enable row level security;
create policy "user_prefs: own read" on es.user_prefs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "user_prefs: own upsert" on es.user_prefs
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on es.user_prefs to anon, authenticated, service_role;

-- ============================================================================
-- ストレージバケット（each-spirit 所有のみ。avatars は飲酒管理アプリ管理のため対象外）
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('each-spirit-images', 'each-spirit-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('article-assets',     'article-assets',     true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

-- article-assets の公開読み取り（each-spirit-images は public バケットの公開URLで配信）
drop policy if exists "article-assets: public read" on storage.objects;
create policy "article-assets: public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'article-assets'::text);
