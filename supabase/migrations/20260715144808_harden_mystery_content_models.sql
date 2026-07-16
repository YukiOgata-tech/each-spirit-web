-- Explicit deny policies document that locked stages, accepted answers, and
-- anonymous rate-limit metadata are reachable only through restricted RPCs.

create policy "mystery_stages: deny direct read"
  on es.mystery_stages for select to anon, authenticated
  using (false);

create policy "mystery_stage_answers: deny direct read"
  on es.mystery_stage_answers for select to anon, authenticated
  using (false);

create policy "mystery_check_attempts: deny direct read"
  on es.mystery_check_attempts for select to anon, authenticated
  using (false);
