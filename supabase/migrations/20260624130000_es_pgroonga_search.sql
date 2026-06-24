-- ============================================================================
-- 横断検索: pgroonga 全文検索（items / articles / rankings / content_sections）
--  - 検索テキストは行から組み立てる immutable 関数で生成し、同じ式に pgroonga 索引を張る
--  - es.search_content(q, p_type, p_limit) が1呼び出しで4種を横断（内部は索引スキャン）
-- ============================================================================

create extension if not exists pgroonga;

-- 行 → 検索対象テキスト（immutable。索引式とクエリ式を完全一致させるため関数化）
create or replace function es.item_search_text(es.items) returns text
language sql immutable as $$
  select concat_ws(' ', $1.name, $1.description,
                   array_to_string($1.tags, ' '), array_to_string($1.genres, ' '),
                   $1.region, $1.major_category, $1.section_slug)
$$;

create or replace function es.article_search_text(es.articles) returns text
language sql immutable as $$
  select concat_ws(' ', $1.title, $1.description,
                   array_to_string($1.tags, ' '), $1.category, $1.major_category, $1.section_slug)
$$;

create or replace function es.ranking_search_text(es.rankings) returns text
language sql immutable as $$
  select concat_ws(' ', $1.title, $1.description, $1.conclusion,
                   array_to_string($1.criteria, ' '), array_to_string($1.tags, ' '),
                   $1.major_category, $1.section_slug)
$$;

create or replace function es.section_search_text(es.content_sections) returns text
language sql immutable as $$
  select concat_ws(' ', $1.label, $1.description, $1.major_category, $1.section_slug, $1.content_model)
$$;

-- pgroonga 索引（各テーブル1本）
create index if not exists items_pgroonga_idx    on es.items            using pgroonga (es.item_search_text(items));
create index if not exists articles_pgroonga_idx on es.articles         using pgroonga (es.article_search_text(articles));
create index if not exists rankings_pgroonga_idx  on es.rankings         using pgroonga (es.ranking_search_text(rankings));
create index if not exists sections_pgroonga_idx on es.content_sections using pgroonga (es.section_search_text(content_sections));

-- 横断検索 RPC。q をサニタイズ（pgroonga クエリ構文の演算子文字を除去）し、空なら何も返さない。
-- 種別ごとに pgroonga 索引スキャン → pgroonga_score 降順、同点は新しい順。published のみ。
create or replace function es.search_content(q text, p_type text default null, p_limit int default 48)
returns table (
  type text, ref_id uuid, title text, description text, href text,
  category text, tags text[], image_url text, updated_at timestamptz, score real
)
language sql stable
as $func$
  with p as (
    select btrim(regexp_replace(coalesce(q, ''), '[()"''\-+*:|<>~]', ' ', 'g')) as qq
  ),
  it as (
    select 'item'::text as type, i.id as ref_id, i.name as title, i.description,
           i.canonical_path as href,
           coalesce(cs.label, i.major_category) as category,
           i.tags,
           nullif(i.image->>'url', '') as image_url,
           i.updated_at,
           pgroonga_score(i.tableoid, i.ctid)::real as score
    from es.items i
    cross join p
    left join es.content_sections cs
      on cs.major_category = i.major_category and cs.section_slug = i.section_slug
    where i.status = 'published' and p.qq <> '' and (p_type is null or p_type = 'item')
      and es.item_search_text(i) &@~ p.qq
  ),
  ar as (
    select 'article'::text, a.id, a.title, a.description, a.canonical_path,
           coalesce(cs.label, a.category), a.tags,
           nullif(a.cover_image_url, ''), a.updated_at,
           pgroonga_score(a.tableoid, a.ctid)::real
    from es.articles a
    cross join p
    left join es.content_sections cs
      on cs.major_category = a.major_category and cs.section_slug = a.section_slug
    where a.status = 'published' and p.qq <> '' and (p_type is null or p_type = 'article')
      and es.article_search_text(a) &@~ p.qq
  ),
  rk as (
    select 'ranking'::text, r.id, r.title, r.description, r.canonical_path,
           coalesce(cs.label, r.major_category), r.tags,
           nullif(r.image_url, ''), r.updated_at,
           pgroonga_score(r.tableoid, r.ctid)::real
    from es.rankings r
    cross join p
    left join es.content_sections cs
      on cs.major_category = r.major_category and cs.section_slug = r.section_slug
    where r.status = 'published' and p.qq <> '' and (p_type is null or p_type = 'ranking')
      and es.ranking_search_text(r) &@~ p.qq
  ),
  ct as (
    select 'category'::text, s.id, s.label, s.description, s.href,
           s.major_category, array[s.section_slug]::text[],
           null::text, s.updated_at,
           pgroonga_score(s.tableoid, s.ctid)::real
    from es.content_sections s
    cross join p
    where s.status = 'published' and p.qq <> '' and (p_type is null or p_type = 'category')
      and es.section_search_text(s) &@~ p.qq
  )
  select * from (
    select * from it union all select * from ar union all select * from rk union all select * from ct
  ) u
  order by u.score desc, u.updated_at desc nulls last
  limit greatest(1, least(p_limit, 100));
$func$;

grant execute on function es.search_content(text, text, int) to anon, authenticated, service_role;
