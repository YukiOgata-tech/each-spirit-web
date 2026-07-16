-- Replace the provisional puzzle modes with three independent axes:
-- content model, answer method, and answer policy.

alter table es.mystery_puzzles
  add column content_model text not null default 'markdown'
    check (content_model in ('custom', 'markdown', 'staged')),
  add column custom_renderer_key text,
  add column answer_method text not null default 'form'
    check (answer_method in ('form', 'file', 'flexible')),
  add column answer_policy text not null default 'official'
    check (answer_policy in ('official', 'check_only')),
  add column answer_config jsonb not null default '{}'::jsonb
    check (jsonb_typeof(answer_config) = 'object');

update es.mystery_puzzles
set
  content_model = case when slug = 'undated-archive' then 'custom' else 'markdown' end,
  custom_renderer_key = case when slug = 'undated-archive' then 'undated_archive_v1' else null end,
  answer_method = case
    when answer_mode in ('file', 'text_and_file') then 'file'
    when answer_mode in ('field_visit', 'sns_proof') then 'flexible'
    else 'form'
  end,
  answer_policy = 'official',
  answer_config = case
    when answer_mode in ('file', 'text_and_file') then
      '{"allowedTypes":["image/jpeg","image/png","image/webp","application/pdf","text/plain","application/zip"],"maxFiles":1,"maxSizeMb":10,"commentEnabled":true}'::jsonb
    else '{"placeholder":"ANSWER","maxLength":200}'::jsonb
  end;

alter table es.mystery_puzzles
  add constraint mystery_puzzles_custom_renderer_check check (
    (content_model = 'custom' and custom_renderer_key is not null)
    or (content_model <> 'custom' and custom_renderer_key is null)
  ),
  add constraint mystery_puzzles_check_only_method_check check (
    answer_policy <> 'check_only' or answer_method = 'form'
  ),
  add constraint mystery_puzzles_staged_policy_check check (
    content_model <> 'staged'
    or (answer_policy = 'check_only' and answer_method = 'form')
  );

alter table es.mystery_puzzles
  drop column answer_mode,
  drop column judge_mode,
  drop column location_label;

-- Locked stage bodies and their accepted answers are never directly readable.
create table es.mystery_stages (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references es.mystery_puzzles(id) on delete cascade,
  stage_number integer not null check (stage_number > 0),
  title text not null,
  body_md text not null,
  access_key uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (puzzle_id, stage_number)
);

create index mystery_stages_puzzle_idx
  on es.mystery_stages (puzzle_id, stage_number);

create trigger set_mystery_stages_updated_at
  before update on es.mystery_stages
  for each row execute function es.set_updated_at();

alter table es.mystery_stages enable row level security;
revoke all on es.mystery_stages from public, anon, authenticated;
grant select, insert, update, delete on es.mystery_stages to service_role;

create table es.mystery_stage_answers (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references es.mystery_stages(id) on delete cascade,
  answer_hash bytea not null,
  label text,
  created_at timestamptz not null default now(),
  unique (stage_id, answer_hash)
);

alter table es.mystery_stage_answers enable row level security;
revoke all on es.mystery_stage_answers from public, anon, authenticated;
grant select, insert, update, delete on es.mystery_stage_answers to service_role;

-- Anonymous correctness checks write only a request fingerprint and timestamp.
-- No submitted answer, user progress, or solve record is stored.
create table es.mystery_check_attempts (
  id bigint generated always as identity primary key,
  request_fingerprint bytea not null,
  attempted_at timestamptz not null default now()
);

create index mystery_check_attempts_limit_idx
  on es.mystery_check_attempts (request_fingerprint, attempted_at desc);

alter table es.mystery_check_attempts enable row level security;
revoke all on es.mystery_check_attempts from public, anon, authenticated;
grant select, insert, delete on es.mystery_check_attempts to service_role;

create or replace function es.consume_mystery_check_attempt()
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_headers jsonb := coalesce(current_setting('request.headers', true), '{}')::jsonb;
  v_source text;
  v_fingerprint bytea;
  v_count integer;
begin
  v_source := coalesce(
    split_part(v_headers ->> 'x-forwarded-for', ',', 1),
    v_headers ->> 'cf-connecting-ip',
    'unknown'
  ) || '|' || coalesce(v_headers ->> 'user-agent', 'unknown');
  v_fingerprint := extensions.digest(convert_to(v_source, 'UTF8'), 'sha256');

  delete from es.mystery_check_attempts
  where attempted_at < now() - interval '24 hours';

  select count(*) into v_count
  from es.mystery_check_attempts
  where request_fingerprint = v_fingerprint
    and attempted_at >= now() - interval '1 hour';

  if v_count >= 30 then
    raise exception 'check rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into es.mystery_check_attempts (request_fingerprint)
  values (v_fingerprint);
end;
$function$;

revoke all on function es.consume_mystery_check_attempt() from public, anon, authenticated;

-- Official form submissions require authentication and create solve records.
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
    and answer_method = 'form'
    and answer_policy = 'official'
    and content_model <> 'staged'
    and (closes_at is null or closes_at > now());

  if not found then
    raise exception 'puzzle is not open for official form answers' using errcode = 'P0002';
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

create or replace function es.check_mystery_text_answer(
  p_puzzle_slug text,
  p_answer text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_puzzle_id uuid;
  v_hash bytea;
  v_correct boolean;
begin
  if p_answer is null or char_length(btrim(p_answer)) = 0 or char_length(p_answer) > 200 then
    raise exception 'answer is required and must be at most 200 characters' using errcode = '22023';
  end if;

  perform es.consume_mystery_check_attempt();

  select id into v_puzzle_id
  from es.mystery_puzzles
  where slug = p_puzzle_slug
    and status = 'published'
    and content_model <> 'staged'
    and answer_method = 'form'
    and answer_policy = 'check_only'
    and (closes_at is null or closes_at > now());

  if not found then
    raise exception 'puzzle is not open for answer checks' using errcode = 'P0002';
  end if;

  v_hash := extensions.digest(
    convert_to(es.normalize_mystery_answer(p_answer), 'UTF8'),
    'sha256'
  );

  select exists (
    select 1 from es.mystery_answers a
    where a.puzzle_id = v_puzzle_id and a.answer_hash = v_hash
  ) into v_correct;

  return jsonb_build_object(
    'status', case when v_correct then 'correct' else 'incorrect' end,
    'message', case
      when v_correct then '正解です。見事に解読しました。'
      else '正解とは一致しませんでした。もう一度考えてみてください。'
    end
  );
end;
$function$;

revoke all on function es.check_mystery_text_answer(text, text) from public;
grant execute on function es.check_mystery_text_answer(text, text) to anon, authenticated;

create or replace function es.get_mystery_first_stage(p_puzzle_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_stage es.mystery_stages%rowtype;
begin
  select s.* into v_stage
  from es.mystery_stages s
  join es.mystery_puzzles p on p.id = s.puzzle_id
  where p.slug = p_puzzle_slug
    and p.status = 'published'
    and p.content_model = 'staged'
    and p.answer_policy = 'check_only'
    and s.stage_number = 1
    and (p.closes_at is null or p.closes_at > now());

  if not found then
    raise exception 'first stage is not available' using errcode = 'P0002';
  end if;

  return jsonb_build_object(
    'stageNumber', v_stage.stage_number,
    'title', v_stage.title,
    'bodyMd', v_stage.body_md
  );
end;
$function$;

revoke all on function es.get_mystery_first_stage(text) from public;
grant execute on function es.get_mystery_first_stage(text) to anon, authenticated;

create or replace function es.check_mystery_stage_answer(
  p_puzzle_slug text,
  p_stage_number integer,
  p_answer text,
  p_access_key uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_stage es.mystery_stages%rowtype;
  v_next es.mystery_stages%rowtype;
  v_hash bytea;
  v_correct boolean;
begin
  if p_stage_number < 1 then
    raise exception 'invalid stage number' using errcode = '22023';
  end if;
  if p_answer is null or char_length(btrim(p_answer)) = 0 or char_length(p_answer) > 200 then
    raise exception 'answer is required and must be at most 200 characters' using errcode = '22023';
  end if;

  perform es.consume_mystery_check_attempt();

  select s.* into v_stage
  from es.mystery_stages s
  join es.mystery_puzzles p on p.id = s.puzzle_id
  where p.slug = p_puzzle_slug
    and p.status = 'published'
    and p.content_model = 'staged'
    and p.answer_policy = 'check_only'
    and s.stage_number = p_stage_number
    and (p.closes_at is null or p.closes_at > now());

  if not found then
    raise exception 'stage is not available' using errcode = 'P0002';
  end if;
  if v_stage.stage_number > 1 and p_access_key is distinct from v_stage.access_key then
    raise exception 'stage access denied' using errcode = '42501';
  end if;

  v_hash := extensions.digest(
    convert_to(es.normalize_mystery_answer(p_answer), 'UTF8'),
    'sha256'
  );

  select exists (
    select 1 from es.mystery_stage_answers a
    where a.stage_id = v_stage.id and a.answer_hash = v_hash
  ) into v_correct;

  if not v_correct then
    return jsonb_build_object(
      'status', 'incorrect',
      'message', '正解とは一致しませんでした。もう一度考えてみてください。'
    );
  end if;

  select * into v_next
  from es.mystery_stages
  where puzzle_id = v_stage.puzzle_id
    and stage_number = v_stage.stage_number + 1;

  if not found then
    return jsonb_build_object(
      'status', 'correct',
      'complete', true,
      'message', 'すべての段階を解読しました。'
    );
  end if;

  return jsonb_build_object(
    'status', 'correct',
    'complete', false,
    'message', '正解です。次の段階が解放されました。',
    'nextStage', jsonb_build_object(
      'stageNumber', v_next.stage_number,
      'title', v_next.title,
      'bodyMd', v_next.body_md,
      'accessKey', v_next.access_key
    )
  );
end;
$function$;

revoke all on function es.check_mystery_stage_answer(text, integer, text, uuid) from public;
grant execute on function es.check_mystery_stage_answer(text, integer, text, uuid) to anon, authenticated;

create or replace function es.get_my_mystery_solves()
returns table (
  puzzle_id uuid,
  slug text,
  case_number integer,
  title text,
  difficulty smallint,
  solved_at timestamptz,
  hint_count_used smallint
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    p.id,
    p.slug,
    p.case_number,
    p.title,
    p.difficulty,
    s.solved_at,
    s.hint_count_used
  from es.mystery_solves s
  join es.mystery_puzzles p on p.id = s.puzzle_id
  where auth.uid() is not null
    and s.user_id = auth.uid()
    and p.answer_policy = 'official'
  order by s.solved_at desc;
$function$;

revoke all on function es.get_my_mystery_solves() from public, anon;
grant execute on function es.get_my_mystery_solves() to authenticated;
