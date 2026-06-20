-- each-spirit: likes/reviews/business/reports の旧 content_type/content_id を削除
-- content_kind + target_id を正とする。

-- business_accounts / content_reports は旧キーしかなかったため、新キーを追加する。
alter table es.business_accounts add column if not exists content_kind text;
alter table es.business_accounts add column if not exists target_id uuid;
alter table es.content_reports add column if not exists content_kind text;
alter table es.content_reports add column if not exists target_id uuid;

-- 既存行がある場合は、曖昧な slug 参照を安全に自動移行できないため停止する。
do $$
begin
  if exists (select 1 from es.business_accounts where content_kind is null or target_id is null) then
    raise exception 'Cannot drop business_accounts.content_type/content_id: content_kind/target_id are missing';
  end if;

  if exists (select 1 from es.content_reports where content_kind is null or target_id is null) then
    raise exception 'Cannot drop content_reports.content_type/content_id: content_kind/target_id are missing';
  end if;

  if exists (select 1 from es.reviews where content_kind is null or target_id is null) then
    raise exception 'Cannot drop reviews.content_type/content_id: content_kind/target_id are missing';
  end if;
end $$;

-- content_likes / counts は既に new key が primary key / trigger の正。
drop index if exists es.idx_content_likes_content;
drop index if exists es.idx_content_likes_type_id_liketype;
alter table es.content_likes drop constraint if exists content_type_nonempty;
alter table es.content_likes drop constraint if exists content_likes_content_kind_check;
alter table es.content_likes add constraint content_likes_content_kind_check check (content_kind in ('item', 'article', 'ranking'));
alter table es.content_likes drop column if exists content_type;
alter table es.content_likes drop column if exists content_id;

alter table es.content_like_counts drop constraint if exists content_like_counts_content_kind_check;
alter table es.content_like_counts add constraint content_like_counts_content_kind_check check (content_kind in ('item', 'article', 'ranking'));
alter table es.content_like_counts drop column if exists content_type;
alter table es.content_like_counts drop column if exists content_id;

-- reviews は new key を必須化し、unique を new key ベースへ移す。
drop index if exists es.idx_reviews_content;
alter table es.reviews drop constraint if exists reviews_user_id_content_type_content_id_key;
alter table es.reviews drop constraint if exists content_type_nonempty;
alter table es.reviews alter column content_kind set not null;
alter table es.reviews alter column target_id set not null;
alter table es.reviews drop constraint if exists reviews_content_kind_check;
alter table es.reviews add constraint reviews_content_kind_check check (content_kind in ('item', 'article', 'ranking'));
alter table es.reviews add constraint reviews_user_content_ref_key unique (user_id, content_kind, target_id);
create index if not exists idx_reviews_content_ref on es.reviews (content_kind, target_id);
alter table es.reviews drop column if exists content_type;
alter table es.reviews drop column if exists content_id;

-- business_accounts は content_kind + target_id で掲載対象を識別する。
alter table es.business_accounts drop constraint if exists business_accounts_content_type_content_id_key;
alter table es.business_accounts alter column content_kind set not null;
alter table es.business_accounts alter column target_id set not null;
alter table es.business_accounts drop constraint if exists business_accounts_content_kind_check;
alter table es.business_accounts add constraint business_accounts_content_kind_check check (content_kind in ('item', 'article', 'ranking'));
alter table es.business_accounts add constraint business_accounts_content_ref_key unique (content_kind, target_id);
create index if not exists idx_business_accounts_content_ref on es.business_accounts (content_kind, target_id);
alter table es.business_accounts drop column if exists content_type;
alter table es.business_accounts drop column if exists content_id;

-- content_reports も content_kind + target_id で通報対象を識別する。
alter table es.content_reports alter column content_kind set not null;
alter table es.content_reports alter column target_id set not null;
alter table es.content_reports drop constraint if exists content_reports_content_kind_check;
alter table es.content_reports add constraint content_reports_content_kind_check check (content_kind in ('item', 'article', 'ranking'));
create index if not exists idx_content_reports_content_ref on es.content_reports (content_kind, target_id);
alter table es.content_reports drop column if exists content_type;
alter table es.content_reports drop column if exists content_id;
