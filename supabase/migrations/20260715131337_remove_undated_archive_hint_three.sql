delete from es.mystery_hints
where level = 3
  and puzzle_id = (
    select id
    from es.mystery_puzzles
    where slug = 'undated-archive'
  );
