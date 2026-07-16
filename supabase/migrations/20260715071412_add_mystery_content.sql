-- Independent puzzle content and submission workflow.
-- Public problem data lives in es.*. Correct answers and submitted files remain private.

create table es.mystery_puzzles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  case_number integer not null unique check (case_number > 0),
  title text not null,
  excerpt text not null,
  body_md text not null default '',
  hero_image_url text,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  answer_mode text not null default 'text'
    check (answer_mode in ('text', 'file', 'text_and_file', 'field_visit', 'sns_proof')),
  judge_mode text not null default 'auto_text'
    check (judge_mode in ('auto_text', 'manual', 'hybrid')),
  location_label text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'closed', 'archived')),
  published_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mystery_puzzles_public_order_idx
  on es.mystery_puzzles (status, published_at desc, case_number desc);

create trigger set_mystery_puzzles_updated_at
  before update on es.mystery_puzzles
  for each row execute function es.set_updated_at();

alter table es.mystery_puzzles enable row level security;
create policy "mystery_puzzles: public read published"
  on es.mystery_puzzles for select to anon, authenticated
  using (status in ('published', 'closed'));

grant select on es.mystery_puzzles to anon, authenticated;
grant select, insert, update, delete on es.mystery_puzzles to service_role;

create table es.mystery_attachments (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references es.mystery_puzzles(id) on delete cascade,
  label text not null,
  description text,
  file_url text not null,
  file_type text not null default 'other'
    check (file_type in ('image', 'pdf', 'audio', 'archive', 'text', 'other')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index mystery_attachments_puzzle_idx
  on es.mystery_attachments (puzzle_id, sort_order, created_at);

alter table es.mystery_attachments enable row level security;
create policy "mystery_attachments: public read published puzzle"
  on es.mystery_attachments for select to anon, authenticated
  using (exists (
    select 1 from es.mystery_puzzles p
    where p.id = puzzle_id and p.status in ('published', 'closed')
  ));

grant select on es.mystery_attachments to anon, authenticated;
grant select, insert, update, delete on es.mystery_attachments to service_role;

create table es.mystery_hints (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references es.mystery_puzzles(id) on delete cascade,
  level smallint not null check (level > 0),
  title text not null,
  body_md text not null,
  penalty_label text,
  created_at timestamptz not null default now(),
  unique (puzzle_id, level)
);

alter table es.mystery_hints enable row level security;
create policy "mystery_hints: public read published puzzle"
  on es.mystery_hints for select to anon, authenticated
  using (exists (
    select 1 from es.mystery_puzzles p
    where p.id = puzzle_id and p.status in ('published', 'closed')
  ));

grant select on es.mystery_hints to anon, authenticated;
grant select, insert, update, delete on es.mystery_hints to service_role;

-- Accepted answers are deliberately isolated from the publicly readable puzzle row.
create table es.mystery_answers (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references es.mystery_puzzles(id) on delete cascade,
  answer_hash bytea not null,
  label text,
  created_at timestamptz not null default now(),
  unique (puzzle_id, answer_hash)
);

alter table es.mystery_answers enable row level security;
revoke all on es.mystery_answers from anon, authenticated;
grant select, insert, update, delete on es.mystery_answers to service_role;

create table es.mystery_submissions (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references es.mystery_puzzles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  answer_text text,
  answer_fingerprint bytea,
  file_path text,
  sns_url text,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'correct', 'incorrect', 'needs_info')),
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index mystery_submissions_owner_idx
  on es.mystery_submissions (user_id, created_at desc);
create index mystery_submissions_review_idx
  on es.mystery_submissions (puzzle_id, review_status, created_at);

alter table es.mystery_submissions enable row level security;
create policy "mystery_submissions: own read"
  on es.mystery_submissions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "mystery_submissions: own insert"
  on es.mystery_submissions for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant select on es.mystery_submissions to authenticated;
grant insert (puzzle_id, user_id, display_name, answer_text, answer_fingerprint, file_path, sns_url)
  on es.mystery_submissions to authenticated;
grant select, insert, update, delete on es.mystery_submissions to service_role;

create table es.mystery_solves (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references es.mystery_puzzles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  hint_count_used smallint not null default 0 check (hint_count_used >= 0),
  solved_at timestamptz not null default now(),
  unique (puzzle_id, user_id)
);

create index mystery_solves_board_idx
  on es.mystery_solves (puzzle_id, solved_at, id);
create index mystery_solves_user_idx
  on es.mystery_solves (user_id);

alter table es.mystery_solves enable row level security;
create policy "mystery_solves: public board read"
  on es.mystery_solves for select to anon, authenticated using (true);

-- user_id is not part of the public scoreboard privilege.
grant select (id, puzzle_id, display_name, hint_count_used, solved_at)
  on es.mystery_solves to anon, authenticated;
grant select, insert, update, delete on es.mystery_solves to service_role;

create or replace function es.normalize_mystery_answer(p_answer text)
returns text
language sql
immutable
strict
set search_path = ''
as $function$
  select lower(regexp_replace(btrim(p_answer), '[[:space:]]+', '', 'g'));
$function$;

revoke all on function es.normalize_mystery_answer(text) from public, anon, authenticated;

create or replace function es.submit_mystery_text_answer(
  p_puzzle_slug text,
  p_answer text,
  p_display_name text,
  p_hint_count smallint default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_puzzle es.mystery_puzzles%rowtype;
  v_name text := btrim(p_display_name);
  v_hash bytea;
  v_correct boolean;
  v_already_solved boolean;
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;
  if char_length(v_name) < 2 or char_length(v_name) > 24 then
    raise exception 'display name must be between 2 and 24 characters' using errcode = '22023';
  end if;
  if p_answer is null or char_length(btrim(p_answer)) = 0 or char_length(p_answer) > 200 then
    raise exception 'answer is required and must be at most 200 characters' using errcode = '22023';
  end if;

  select * into v_puzzle
  from es.mystery_puzzles
  where slug = p_puzzle_slug
    and status = 'published'
    and (closes_at is null or closes_at > now());

  if not found then
    raise exception 'puzzle is not open' using errcode = 'P0002';
  end if;
  if v_puzzle.judge_mode not in ('auto_text', 'hybrid') then
    raise exception 'this puzzle requires manual review' using errcode = '22023';
  end if;

  v_hash := extensions.digest(
    convert_to(es.normalize_mystery_answer(p_answer), 'UTF8'),
    'sha256'
  );

  select exists (
    select 1 from es.mystery_answers a
    where a.puzzle_id = v_puzzle.id and a.answer_hash = v_hash
  ) into v_correct;

  select exists (
    select 1 from es.mystery_solves s
    where s.puzzle_id = v_puzzle.id and s.user_id = v_uid
  ) into v_already_solved;

  insert into es.mystery_submissions (
    puzzle_id, user_id, display_name, answer_fingerprint, review_status, reviewed_at
  ) values (
    v_puzzle.id, v_uid, v_name, v_hash,
    case when v_correct then 'correct' else 'incorrect' end,
    now()
  );

  if v_correct then
    insert into es.mystery_solves (puzzle_id, user_id, display_name, hint_count_used)
    values (v_puzzle.id, v_uid, v_name, greatest(coalesce(p_hint_count, 0), 0))
    on conflict (puzzle_id, user_id) do update
      set display_name = excluded.display_name;
  end if;

  return jsonb_build_object(
    'status', case when v_correct then 'correct' else 'incorrect' end,
    'alreadySolved', v_already_solved,
    'message', case
      when v_correct and v_already_solved then '正解です。今回も見事な解読でした。'
      when v_correct then '解読成功。あなたの名前を正解者記録に刻みました。'
      else 'まだ暗号は沈黙しています。視点を変えて、もう一度。'
    end
  );
end;
$function$;

revoke all on function es.submit_mystery_text_answer(text, text, text, smallint)
  from public, anon;
grant execute on function es.submit_mystery_text_answer(text, text, text, smallint)
  to authenticated;

-- Public problem assets and private participant submissions use separate buckets.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('mystery-assets', 'mystery-assets', true, 15728640,
    array['image/jpeg','image/png','image/webp','image/gif','application/pdf','audio/mpeg','audio/wav','text/plain','application/zip','application/x-zip-compressed']),
  ('mystery-submissions', 'mystery-submissions', false, 10485760,
    array['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/zip','application/x-zip-compressed'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "mystery-assets: public read" on storage.objects;
create policy "mystery-assets: public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'mystery-assets');

drop policy if exists "mystery-submissions: own read" on storage.objects;
create policy "mystery-submissions: own read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'mystery-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "mystery-submissions: own upload" on storage.objects;
create policy "mystery-submissions: own upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'mystery-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "mystery-submissions: own delete" on storage.objects;
create policy "mystery-submissions: own delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'mystery-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- First playable case. Accepted answers are committed only as SHA-256 digests.
insert into es.mystery_puzzles (
  slug, case_number, title, excerpt, body_md, hero_image_url,
  difficulty, estimated_minutes, answer_mode, judge_mode, status, published_at
) values (
  'silent-signal',
  1,
  '沈黙した通信機',
  '編集部に残された6つの数字。通信員が最後に送ろうとした合言葉を特定してください。',
  E'## 依頼\n\n午前0時、編集部の古い通信機が一度だけ起動しました。画面に残ったのは、次の数字だけです。\n\n## 残された暗号\n\n```cipher\n19 / 9 / 7 / 14 / 1 / 12\n```\n\n通信員は、暗号を作る前にこう記していました。\n\n> 最初の文字を1として、順番どおりに並べた。\n\n数字が示す**6文字の合言葉**を、回答欄へ入力してください。英字・カタカナのどちらでも構いません。',
  '/mystery/mystery-hero.webp',
  1,
  5,
  'text',
  'auto_text',
  'published',
  '2026-07-15T00:00:00+09:00'
)
on conflict (slug) do nothing;

insert into es.mystery_answers (puzzle_id, answer_hash, label)
select
  p.id,
  accepted.answer_hash,
  accepted.label
from es.mystery_puzzles p
cross join (values
  (decode('d041924c15885af6d06530a425c6dbffc80520150c4dd264f40b4364b12421a8', 'hex'), 'English'),
  (decode('8986ac1180408414ff5cc6f26a7ef8363574219bccfb38317665d3c5d91b9e9d', 'hex'), 'Japanese')
) as accepted(answer_hash, label)
where p.slug = 'silent-signal'
on conflict (puzzle_id, answer_hash) do nothing;

insert into es.mystery_hints (puzzle_id, level, title, body_md, penalty_label)
select
  p.id,
  hint.level,
  hint.title,
  hint.body_md,
  hint.penalty_label
from es.mystery_puzzles p
cross join (values
  (1::smallint, '通信員のメモ', '数字は、日本語の五十音ではなく**アルファベット**の順番を示しています。', 'ヒント使用を記録'),
  (2::smallint, '復号の起点', '`1 = A`、`2 = B`として、6つの数字をそれぞれ文字へ置き換えてください。', 'ヒント使用を記録')
) as hint(level, title, body_md, penalty_label)
where p.slug = 'silent-signal'
on conflict (puzzle_id, level) do nothing;
