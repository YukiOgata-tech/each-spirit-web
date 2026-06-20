-- ==========================================================
-- each-spirit: content_regions / content_targets の権限付与
-- 作成: 2026-06-20
-- es スキーマの新規テーブルは明示 GRANT が必要（service_role 含む）。
-- ==========================================================

grant select on es.content_regions to anon, authenticated;
grant select on es.content_targets to anon, authenticated;
grant select, insert, update, delete on es.content_regions to service_role;
grant select, insert, update, delete on es.content_targets to service_role;
