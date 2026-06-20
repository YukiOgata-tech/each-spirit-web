update es.articles
set
  canonical_path = '/articles/' || category || '/' || slug,
  updated_at = now()
where
  category is not null
  and slug is not null
  and canonical_path is distinct from '/articles/' || category || '/' || slug;
