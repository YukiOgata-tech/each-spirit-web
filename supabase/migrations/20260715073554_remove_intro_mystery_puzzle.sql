-- Remove the temporary introductory puzzle while keeping the mystery platform
-- ready for future, irregular releases.
delete from es.mystery_puzzles
where slug = 'silent-signal';
