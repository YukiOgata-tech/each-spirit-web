-- ユニバーサル item 基盤 Phase 2.7: content_sections に item_schema(jsonb) を追加。
-- 作成/編集フォームのフィールド定義を DB から供給する（DB駆動の動的フォーム）。
-- 構造: { itemClass?, itemKind?, itemKinds?: [{value,label}], fields: ItemField[] }
--   - regionMode / itemPathSegment / label は content_sections の既存列を使う。
--   - 空(`{}`)の section はコード側 SECTION_ITEM_SCHEMAS にフォールバック（既存非破壊）。
-- 新しい型は content_sections 行 + item_schema を入れるだけでフォームに出る（デプロイ不要）。

alter table es.content_sections add column if not exists item_schema jsonb not null default '{}'::jsonb;
