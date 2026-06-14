-- ==========================================================
-- public.handle_new_user を OAuth(Google等)対応に更新
-- 作成: 2026-06-13
--
-- 【注意】これは public.*（飲酒管理アプリと共有）の変更です。
-- プロジェクトオーナー（両アプリの管理者）の合意のもとで実施しています。
-- 飲酒管理アプリ側のリポジトリにも同じ定義を反映してください。
--
-- 変更内容:
--   新規ユーザー作成時の profiles.display_name のフォールバックを拡張。
--     旧: display_name → 'ユーザー'
--     新: display_name → full_name → name → 'ユーザー'
--   Google 等の OAuth は full_name / name で名前を渡すため、
--   「ユーザー」固定になっていた問題を解消する。
--   avatar も avatar_url → picture のフォールバックを追加。
--   メール/パスワード登録（display_name を渡す）とは後方互換。
-- ==========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $function$
begin
  insert into public.profiles (id, email, display_name, avatar)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      'ユーザー'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$function$;
