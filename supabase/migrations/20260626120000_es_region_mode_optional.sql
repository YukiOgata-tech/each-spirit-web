-- region を任意化: 専用デザインの section（cafe / hair-salon / stays / services / spots）の
-- region_mode を required → optional に変更する。
-- region 列にデータがある item は従来どおりエリアカード／region ランディングで扱い、
-- region が無い item も section index の受け皿（RegionlessItems）と詳細ページで表示できるようにする。
-- 既存の region 付き item には影響しない（メタの必須フラグを緩めるだけ）。

update es.content_sections
set region_mode = 'optional'
where (major_category, section_slug) in (
  ('food', 'cafe'),
  ('beauty', 'hair-salon'),
  ('travel', 'stays'),
  ('travel', 'services'),
  ('leisure', 'spots')
)
and region_mode = 'required';
