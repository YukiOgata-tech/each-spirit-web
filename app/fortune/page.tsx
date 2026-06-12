import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getRamenItems } from "@/lib/content";
import { generateDailyFortune, jstToday, type FortuneResult, type LuckyItem } from "@/lib/fortune";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { FortuneReveal } from "@/components/fortune/FortuneReveal";

// 占いはユーザー固有・日替わりなので常に動的レンダリング（キャッシュしない）
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "今日の運勢",
  description:
    "総合運・恋愛運・金運・仕事運・健康運・対人運・おでかけ運を毎日チェック。今日のあなたの運勢を占います。",
  path: routes.fortune,
});

/** おでかけ・グルメ運の「今日のラッキースポット」候補プール（暫定: ラーメン店） */
async function buildLuckyItems(): Promise<LuckyItem[]> {
  const items = await getRamenItems();
  return items.map((i) => ({
    type: "ramen_item",
    slug: i.slug,
    name: i.name,
    href: routes.ramenItem(i.slug),
  }));
}

export default async function FortunePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const date = jstToday();
  const items = await buildLuckyItems();
  const isGuest = !user;

  let result: FortuneResult;

  if (user) {
    // 当日・本人の結果があれば再利用、なければ生成して保存（同日は固定）
    const { data: existing } = await supabase
      .schema("es")
      .from("daily_fortunes")
      .select("result")
      .eq("user_id", user.id)
      .eq("fortune_date", date)
      .eq("fortune_type", "daily")
      .maybeSingle();

    if (existing?.result) {
      result = existing.result as FortuneResult;
    } else {
      result = generateDailyFortune({ seed: `${user.id}|${date}`, date, items });
      await supabase.schema("es").from("daily_fortunes").insert({
        user_id: user.id,
        fortune_date: date,
        fortune_type: "daily",
        result,
      });
    }
  } else {
    // 未ログイン: 保存なしの当日共通フォーチュン（テスト・お試し用）
    result = generateDailyFortune({ seed: `guest|${date}`, date, items });
  }

  return <FortuneReveal result={result} isGuest={isGuest} />;
}
