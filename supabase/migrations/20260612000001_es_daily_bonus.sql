-- ==========================================================
-- each-spirit: es デイリーボーナス付与RPC
-- 作成: 2026-06-12
--
-- ポイント付与をサーバー側で制御する SECURITY DEFINER 関数。
-- 金額は reason ごとにサーバーが決定（呼び出し側から金額指定不可＝不正防止）。
-- 同一(user, reason, reference) は1回のみ。user_points も同時に同期。
-- ==========================================================

create or replace function es.claim_daily_bonus(p_reason text, p_reference text)
returns int
language plpgsql
security definer
set search_path = es, public
as $$
declare
  v_uid uuid := auth.uid();
  v_amount int;
  v_new int;
begin
  if v_uid is null then return 0; end if;
  v_amount := case p_reason
                when 'daily_fortune' then 5
                when 'daily_login'   then 3
                else 0
              end;
  if v_amount = 0 then return 0; end if;

  if exists (select 1 from es.point_ledger
             where user_id = v_uid and reason = p_reason and reference = p_reference) then
    return 0;
  end if;

  insert into es.user_points (user_id, balance, lifetime, updated_at)
  values (v_uid, v_amount, v_amount, now())
  on conflict (user_id) do update set
    balance  = es.user_points.balance + v_amount,
    lifetime = es.user_points.lifetime + v_amount,
    updated_at = now()
  returning balance into v_new;

  insert into es.point_ledger (user_id, delta, reason, reference, balance_after)
  values (v_uid, v_amount, p_reason, p_reference, v_new);

  return v_amount;
exception when unique_violation then
  return 0;
end;
$$;

create unique index if not exists uq_point_ledger_daily
  on es.point_ledger (user_id, reason, reference)
  where reason in ('daily_fortune', 'daily_login');

grant execute on function es.claim_daily_bonus(text, text) to authenticated;
