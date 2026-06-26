"use server";

import { createClient } from "@/lib/supabase/server";
import {
  jstToday,
  generateDailyFortune,
  FORTUNE_GENDERS,
  type FortuneInput,
  type FortuneResult,
} from "@/lib/fortune";
import { buildLuckyItems, ensureUserDailyFortune } from "@/lib/fortune-server";

/** 入力値の検証（不正な誕生日・性別を弾く）。 */
function validateInput(raw: FortuneInput): FortuneInput {
  const birthday = String(raw?.birthday ?? "");
  const gender = raw?.gender;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) throw new Error("invalid_birthday");
  const d = new Date(`${birthday}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) throw new Error("invalid_birthday");
  const year = Number(birthday.slice(0, 4));
  if (year < 1900 || d.getTime() > Date.now()) throw new Error("invalid_birthday");
  if (!FORTUNE_GENDERS.includes(gender)) throw new Error("invalid_gender");
  return { birthday, gender };
}

/**
 * 誕生日・性別を受け取り、その日の運勢を返すサーバーアクション。
 *
 * - ゲスト: 保存せず、(date, birthday, gender) から決定論的に生成して返す。
 * - ログインユーザー: 共有プロフィール(public.profiles)へ誕生日・性別を保存し
 *   （次回以降は入力省略）、当日の結果を生成・保存してポイントを精算する。
 */
export async function requestFortune(
  raw: FortuneInput,
): Promise<{ result: FortuneResult; awardedPoints: number | null }> {
  const input = validateInput(raw);
  const date = jstToday();
  const items = await buildLuckyItems();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // 共有プロフィールに反映（自分の行のみ・RLS で保護）。以後は入力を省略できる。
    await supabase
      .from("profiles")
      .update({ birthday: input.birthday, gender: input.gender })
      .eq("id", user.id);
    const res = await ensureUserDailyFortune(supabase, user.id, date, items, input);
    if (res) return res;
  }

  const result = generateDailyFortune({ input, date, items });
  return { result, awardedPoints: null };
}
