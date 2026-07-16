-- The bucket is public, so object URLs do not require a broad SELECT policy.
-- Removing it prevents anon/authenticated clients from listing all puzzle assets.
drop policy if exists "mystery-assets: public read" on storage.objects;

-- Direct answer-table access is already revoked. Keep an explicit deny policy as
-- defense in depth and to document the intended RLS posture.
drop policy if exists "mystery_answers: deny direct read" on es.mystery_answers;
create policy "mystery_answers: deny direct read"
  on es.mystery_answers for select to anon, authenticated
  using (false);
