with puzzle as (
  insert into es.mystery_puzzles (
    slug,
    case_number,
    title,
    excerpt,
    body_md,
    hero_image_url,
    difficulty,
    estimated_minutes,
    answer_mode,
    judge_mode,
    status,
    published_at
  ) values (
    'undated-archive',
    1,
    '年代の失われた収蔵庫',
    '年代札を失った19点の歴史資料を復元し、収蔵庫の入口に隠された言葉を特定してください。',
    E'## 調査依頼\n\n回収された19点の資料は、整理作業の途中で年代札を失いました。どの資料にも、実在した歴史上の出来事を示す手掛かりが残されています。\n\n## 復元規則\n\n1. 各資料が示す出来事を特定する\n2. その出来事が起きた年代を調べる\n3. 19点を**古いものから新しいものへ**並べる\n4. 並べた順に、赤い**収蔵印**を読む\n\n資料番号は回収順であり、年代とは関係ありません。最後に現れる英語の言葉を回答欄へ入力してください。',
    '/mystery/mystery-hero.webp',
    4,
    90,
    'text',
    'auto_text',
    'published',
    now()
  )
  on conflict (slug) do update set
    case_number = excluded.case_number,
    title = excluded.title,
    excerpt = excluded.excerpt,
    body_md = excluded.body_md,
    hero_image_url = excluded.hero_image_url,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    answer_mode = excluded.answer_mode,
    judge_mode = excluded.judge_mode,
    status = excluded.status,
    published_at = coalesce(es.mystery_puzzles.published_at, excluded.published_at),
    updated_at = now()
  returning id
)
insert into es.mystery_answers (puzzle_id, answer_hash, label)
select
  puzzle.id,
  extensions.digest(
    convert_to(es.normalize_mystery_answer('welcome to Each Spirit'), 'UTF8'),
    'sha256'
  ),
  'English phrase'
from puzzle
on conflict (puzzle_id, answer_hash) do nothing;

insert into es.mystery_hints (puzzle_id, level, title, body_md, penalty_label)
select
  p.id,
  hint.level,
  hint.title,
  hint.body_md,
  'ヒント使用を記録'
from es.mystery_puzzles p
cross join (values
  (
    1::smallint,
    '空欄の役割',
    '各資料の空欄には、その資料が示す**出来事・人物・国・文書などの固有名**が入ります。まずは分かる資料から埋めてください。'
  ),
  (
    2::smallint,
    '資料番号を疑う',
    '特定した出来事について、発生した年を一つずつ書き出してください。資料番号は並べ替えには使いません。'
  ),
  (
    3::smallint,
    '最後の読み方',
    '資料を**最も古い出来事から最も新しい出来事へ**並べ、その順番で赤い収蔵印のアルファベットを読んでください。'
  )
) as hint(level, title, body_md)
where p.slug = 'undated-archive'
on conflict (puzzle_id, level) do update set
  title = excluded.title,
  body_md = excluded.body_md,
  penalty_label = excluded.penalty_label;
