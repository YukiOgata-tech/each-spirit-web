-- ==========================================================
-- each-spirit: 旧互換カラム content_type の整理（D3）
-- 作成: 2026-06-20
--
-- 大カテゴリURL・DB移行（docs/content-display-path-slug-spec.md）に伴い、
-- items/rankings の識別を major_category + section_slug ベースへ統一する。
-- 旧 (content_type, slug) unique は section ベース unique と二重化しており、
-- section ベースの投稿UIの障害になるため撤去する。content_type は当面
-- 旧互換・トリガ用に残すが NOT NULL を外す（将来削除候補）。
-- 既存行の値は保持＝データ損失なし。
-- ==========================================================

-- 1) 旧 unique index (content_type, slug) を撤去（制約/インデックス両形に対応）
alter table es.items     drop constraint if exists items_content_type_slug_key;
drop index   if exists es.items_content_type_slug_key;
alter table es.rankings  drop constraint if exists rankings_content_type_slug_key;
drop index   if exists es.rankings_content_type_slug_key;

-- 2) content_type / item_content_type を nullable 化
alter table es.items         alter column content_type      drop not null;
alter table es.rankings      alter column content_type      drop not null;
alter table es.ranking_items alter column item_content_type drop not null;
