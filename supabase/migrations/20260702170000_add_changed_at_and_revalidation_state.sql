-- ============================================================================
-- 差分 on-demand revalidation の基盤
--
-- 目的: 記事などの更新後に /api/revalidate を叩いたとき、「前回以降に実際に
--       変更された行のページだけ」を再検証できるようにする。
--
-- changed_at: 表示には一切使わない「データ変更検知専用」タイムスタンプ。
--   INSERT / UPDATE のたびにトリガで now() を入れる。表示用の updated_at /
--   published_at / last_updated_at とは独立なので、表示日付の手動調整と干渉しない。
-- ============================================================================

-- 変更検知用の共通トリガ関数
create or replace function es.set_changed_at()
returns trigger
language plpgsql
as $$
begin
  new.changed_at = now();
  return new;
end;
$$;

-- ── articles ────────────────────────────────────────────────────────────────
alter table es.articles add column if not exists changed_at timestamptz not null default now();
-- 既存行は「作成後に実際に変更された時刻」を初期値に（updated_at 優先）
update es.articles set changed_at = coalesce(updated_at, created_at, now());
drop trigger if exists set_articles_changed_at on es.articles;
create trigger set_articles_changed_at
  before insert or update on es.articles
  for each row execute function es.set_changed_at();

-- ── items ───────────────────────────────────────────────────────────────────
alter table es.items add column if not exists changed_at timestamptz not null default now();
update es.items set changed_at = coalesce(updated_at, created_at, now());
drop trigger if exists set_items_changed_at on es.items;
create trigger set_items_changed_at
  before insert or update on es.items
  for each row execute function es.set_changed_at();

-- ── rankings ────────────────────────────────────────────────────────────────
alter table es.rankings add column if not exists changed_at timestamptz not null default now();
update es.rankings set changed_at = coalesce(updated_at, created_at, now());
drop trigger if exists set_rankings_changed_at on es.rankings;
create trigger set_rankings_changed_at
  before insert or update on es.rankings
  for each row execute function es.set_changed_at();

-- 差分抽出（changed_at > last_run_at）を速くするための索引
create index if not exists idx_articles_changed_at on es.articles (changed_at);
create index if not exists idx_items_changed_at on es.items (changed_at);
create index if not exists idx_rankings_changed_at on es.rankings (changed_at);

-- ── 差分 revalidate の基準時刻を保持する 1 行テーブル ────────────────────────
create table if not exists es.revalidation_state (
  id smallint primary key default 1,
  last_run_at timestamptz not null default now(),
  constraint revalidation_state_singleton check (id = 1)
);

-- 初期値 = now()。マイグレーション時点までのコンテンツは「既に配信済み」とみなす
-- （これまで全体 revalidate で反映してきたため）。以降の変更だけが差分対象になる。
insert into es.revalidation_state (id, last_run_at)
values (1, now())
on conflict (id) do nothing;

-- サービスロール専用（route が service-role で読み書きする）。公開アクセスは不可。
alter table es.revalidation_state enable row level security;
