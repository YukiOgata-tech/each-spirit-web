-- エンターテインメントの「今後追加予定」ジャンルを draft（準備中）状態で登録する。
-- ハブ（/entertainment）のジャンル一覧に sort_order 順で「準備中」として表示され、
-- データが揃い次第 status を published に変えるだけで公開できる（section 汎用設計）。
-- draft のため getContentSections（published のみ）には載らず、個別ページ・sitemap・
-- generateStaticParams には現れない（ハブだけ includeUnpublished で表示）。
-- 補足: content_sections.status の CHECK は draft / published / archived。

insert into es.content_sections (
  major_category, section_slug, label, description, href,
  content_model, item_path_segment, region_mode, target_mode,
  status, sort_order, display_config, seo_config, metadata
) values
  ('entertainment', 'apps', 'アプリ',
   'エンタメ系アプリ・サービスを用途や料金から比較する作品カタログ。',
   '/entertainment/apps', 'title', '', 'none', 'none',
   'draft', 30, '{}'::jsonb, '{}'::jsonb, jsonb_build_object('catalog', true, 'content_category', 'app')),
  ('entertainment', 'game-apps', 'ゲームアプリ',
   'スマホ・PCのゲームアプリをジャンルや課金体系から探す作品カタログ。',
   '/entertainment/game-apps', 'title', '', 'none', 'none',
   'draft', 40, '{}'::jsonb, '{}'::jsonb, jsonb_build_object('catalog', true, 'content_category', 'game_app')),
  ('entertainment', 'events', 'イベント',
   'ライブ・展示・季節イベントなどを時期やテーマから探すカタログ。',
   '/entertainment/events', 'title', '', 'none', 'none',
   'draft', 50, '{}'::jsonb, '{}'::jsonb, jsonb_build_object('catalog', true, 'content_category', 'event'))
on conflict (major_category, section_slug) do nothing;
