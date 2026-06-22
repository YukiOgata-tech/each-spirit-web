-- 大カテゴリ entertainment（エンターテインメント）の anime セクションを content_sections に登録する。
-- entertainment は店舗系と違い「作品カタログ」型: region/target を持たず、item は
-- /entertainment/{section}/{slug}（item_path_segment 無し）の3階層で配信する。
-- 今後 tv / drama 等のセクションを同型で追加していく前提。

-- content_sections.major_category の CHECK 制約に entertainment を許可する
-- （items/rankings/articles 側には major_category の CHECK は無く、anime データは投入済み）。
alter table es.content_sections drop constraint if exists content_sections_major_category_check;
alter table es.content_sections add constraint content_sections_major_category_check
  check (major_category = any (array['food','health','beauty','travel','leisure','entertainment']));

insert into es.content_sections (
  major_category, section_slug, label, description, href,
  content_model, item_path_segment, region_mode, target_mode,
  status, sort_order, display_config, seo_config, metadata
) values (
  'entertainment', 'anime', 'アニメ',
  'アニメ作品を原作タイプ・ジャンル・メディア展開から探せる作品カタログ。',
  '/entertainment/anime',
  'title', '', 'none', 'none',
  'published', 10, '{}'::jsonb, '{}'::jsonb,
  jsonb_build_object('catalog', true, 'content_category', 'anime')
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
