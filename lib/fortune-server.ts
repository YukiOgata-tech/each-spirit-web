import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getKeyItemPool } from "@/lib/content";
import {
  generateDailyFortune,
  type FortuneInput,
  type FortuneResult,
  type LuckyItem,
} from "@/lib/fortune";

/** 「今日のキーアイテム」候補プール（es.items を横断）。 */
export async function buildLuckyItems(): Promise<LuckyItem[]> {
  return getKeyItemPool();
}

/**
 * ログインユーザーの当日運勢を取得（無ければ生成して保存）し、デイリーボーナスを精算する。
 *
 * - 当日・本人の結果が既にあれば再利用（同日は固定 = 何度開いても変わらない）。
 * - 無く `input`（誕生日・性別）があれば生成して `es.daily_fortunes` に保存。
 * - 無く `input` も無い場合は生成できないため `null` を返す（呼び出し側で入力を促す）。
 *
 * `supabase` はユーザー文脈（RLS あり）のクライアントを渡すこと。
 */
export async function ensureUserDailyFortune(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  items: LuckyItem[],
  input: FortuneInput | null,
): Promise<{ result: FortuneResult; awardedPoints: number | null } | null> {
  const { data: existing } = await supabase
    .schema("es")
    .from("daily_fortunes")
    .select("result")
    .eq("user_id", userId)
    .eq("fortune_date", date)
    .eq("fortune_type", "daily")
    .maybeSingle();

  let result: FortuneResult;
  if (existing?.result) {
    result = existing.result as FortuneResult;
  } else if (input) {
    result = generateDailyFortune({ input, date, items });
    await supabase.schema("es").from("daily_fortunes").insert({
      user_id: userId,
      fortune_date: date,
      fortune_type: "daily",
      result,
    });
  } else {
    return null;
  }

  // デイリーボーナス（サーバー制御RPC・1日1回・金額はサーバー固定）
  let awardedPoints: number | null = null;
  const { data: awarded } = await supabase
    .schema("es")
    .rpc("claim_daily_bonus", { p_reason: "daily_fortune", p_reference: date });
  if (typeof awarded === "number" && awarded > 0) awardedPoints = awarded;

  return { result, awardedPoints };
}
