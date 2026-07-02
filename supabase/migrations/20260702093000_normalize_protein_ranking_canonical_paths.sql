-- Protein rankings use target-specific detail URLs as the canonical public path.
-- Example: /health/protein/men/rankings/{slug}

update es.rankings
set canonical_path = '/health/protein/'
  || coalesce(nullif(metadata->>'target', ''), 'beginner')
  || '/rankings/'
  || slug
where major_category = 'health'
  and section_slug = 'protein';
