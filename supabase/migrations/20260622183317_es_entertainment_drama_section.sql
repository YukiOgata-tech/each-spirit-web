-- entertainment 配下に drama（ドラマ）セクションを追加（anime と同型の作品カタログ）。
-- section 汎用設計のため、行を足すだけで /entertainment/drama が機能する。

insert into es.content_sections (
  major_category, section_slug, label, description, href,
  content_model, item_path_segment, region_mode, target_mode,
  status, sort_order, display_config, seo_config, metadata
) values (
  'entertainment', 'drama', 'ドラマ',
  'ドラマ作品を原作タイプ・ジャンル・メディア展開から探せる作品カタログ。',
  '/entertainment/drama',
  'title', '', 'none', 'none',
  'published', 20, '{}'::jsonb, '{}'::jsonb,
  jsonb_build_object('catalog', true, 'content_category', 'drama')
)
on conflict (major_category, section_slug) do update set
  label = excluded.label,
  description = excluded.description,
  href = excluded.href,
  content_model = excluded.content_model,
  item_path_segment = excluded.item_path_segment,
  region_mode = excluded.region_mode,
  target_mode = excluded.target_mode,
  status = excluded.status,
  sort_order = excluded.sort_order;
