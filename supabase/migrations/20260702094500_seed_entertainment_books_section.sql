insert into es.content_sections (
  major_category,
  section_slug,
  label,
  description,
  href,
  content_model,
  item_path_segment,
  region_mode,
  target_mode,
  status,
  sort_order,
  display_config,
  seo_config,
  metadata,
  item_schema
) values (
  'entertainment',
  'books',
  '書籍',
  '小説、ミステリー、話題作をテーマ別に比較する書籍ガイド。',
  '/entertainment/books',
  'media',
  'books',
  'none',
  'none',
  'published',
  30,
  '{}'::jsonb,
  jsonb_build_object(
    'title', '書籍ランキング・小説比較｜Each Spirit',
    'description', '推理小説や話題の書籍を、テーマ別ランキングと比較記事で整理します。'
  ),
  jsonb_build_object(
    'content_model', 'media',
    'notes', 'Books section for novels, mystery fiction, and book rankings.'
  ),
  '{}'::jsonb
)
on conflict (major_category, section_slug) do update
set label = excluded.label,
    description = excluded.description,
    href = excluded.href,
    content_model = excluded.content_model,
    item_path_segment = excluded.item_path_segment,
    region_mode = excluded.region_mode,
    target_mode = excluded.target_mode,
    status = excluded.status,
    sort_order = excluded.sort_order,
    seo_config = excluded.seo_config,
    metadata = es.content_sections.metadata || excluded.metadata,
    updated_at = now();
