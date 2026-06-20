-- ==========================================================
-- each-spirit: likes/reviews/counts の識別キー移行（#2）
-- 作成: 2026-06-20
--
-- content_type + content_id(slug) → content_kind(item|article|ranking) + target_id(uuid)。
-- URL/slug 変更に強い堅牢なキーへ。counts 集計と like_count ロールアップのトリガも
-- target_id ベースへ書き換え、ロールアップは単一関数に統合する。旧列は nullable で残す。
-- ==========================================================

alter table es.content_likes        add column if not exists content_kind text;
alter table es.content_likes        add column if not exists target_id uuid;
alter table es.content_like_counts  add column if not exists content_kind text;
alter table es.content_like_counts  add column if not exists target_id uuid;
alter table es.reviews              add column if not exists content_kind text;
alter table es.reviews              add column if not exists target_id uuid;

update es.content_likes cl set
  content_kind = case when cl.content_type='article' then 'article' when cl.content_type='ranking' then 'ranking' else 'item' end,
  target_id = case
    when cl.content_type='article' then (select a.id from es.articles a where a.slug=cl.content_id)
    when cl.content_type='ranking' then (select r.id from es.rankings r where r.slug=cl.content_id)
    else (select i.id from es.items i where i.slug=cl.content_id and i.content_type=cl.content_type)
  end
where cl.target_id is null;

update es.content_like_counts c set
  content_kind = case when c.content_type='article' then 'article' when c.content_type='ranking' then 'ranking' else 'item' end,
  target_id = case
    when c.content_type='article' then (select a.id from es.articles a where a.slug=c.content_id)
    when c.content_type='ranking' then (select r.id from es.rankings r where r.slug=c.content_id)
    else (select i.id from es.items i where i.slug=c.content_id and i.content_type=c.content_type)
  end
where c.target_id is null;

update es.reviews rv set
  content_kind = case when rv.content_type='article' then 'article' when rv.content_type='ranking' then 'ranking' else 'item' end,
  target_id = case
    when rv.content_type='article' then (select a.id from es.articles a where a.slug=rv.content_id)
    when rv.content_type='ranking' then (select r.id from es.rankings r where r.slug=rv.content_id)
    else (select i.id from es.items i where i.slug=rv.content_id and i.content_type=rv.content_type)
  end
where rv.target_id is null;

delete from es.content_likes where target_id is null;
delete from es.content_like_counts where target_id is null;

alter table es.content_likes drop constraint if exists content_likes_pkey;
alter table es.content_likes alter column content_type drop not null;
alter table es.content_likes alter column content_id   drop not null;
alter table es.content_likes alter column content_kind set not null;
alter table es.content_likes alter column target_id    set not null;
alter table es.content_likes add constraint content_likes_pkey primary key (user_id, content_kind, target_id, like_type);

alter table es.content_like_counts drop constraint if exists content_like_counts_pkey;
alter table es.content_like_counts alter column content_type drop not null;
alter table es.content_like_counts alter column content_id   drop not null;
alter table es.content_like_counts alter column content_kind set not null;
alter table es.content_like_counts alter column target_id    set not null;
alter table es.content_like_counts add constraint content_like_counts_pkey primary key (content_kind, target_id, like_type);

alter table es.reviews alter column content_type drop not null;
alter table es.reviews alter column content_id   drop not null;
create index if not exists idx_reviews_content_ref on es.reviews (content_kind, target_id);

create or replace function es.handle_like_insert()
returns trigger language plpgsql security definer set search_path to 'es','public' as $fn$
begin
  insert into es.content_like_counts (content_kind, target_id, region_slug, like_type, count)
  values (NEW.content_kind, NEW.target_id, NEW.region_slug, NEW.like_type, 1)
  on conflict (content_kind, target_id, like_type)
  do update set count = es.content_like_counts.count + 1;
  return NEW;
end;
$fn$;

create or replace function es.handle_like_delete()
returns trigger language plpgsql security definer set search_path to 'es','public' as $fn$
begin
  update es.content_like_counts
  set count = greatest(count - 1, 0)
  where content_kind = OLD.content_kind and target_id = OLD.target_id and like_type = OLD.like_type;
  return OLD;
end;
$fn$;

drop trigger if exists on_article_like_change on es.content_likes;
drop trigger if exists on_item_like_change   on es.content_likes;
drop trigger if exists on_ranking_like_change on es.content_likes;

create or replace function es.sync_like_rollup()
returns trigger language plpgsql security definer set search_path to 'es','public' as $fn$
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
$fn$;

create trigger on_like_rollup
  after insert or delete on es.content_likes
  for each row execute function es.sync_like_rollup();

drop function if exists es.sync_article_like_count();
drop function if exists es.sync_item_like_count();
drop function if exists es.sync_ranking_like_count();
