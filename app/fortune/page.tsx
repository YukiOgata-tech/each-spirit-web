import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { jstToday, type FortuneResult, type FortuneInput, type FortuneGender } from "@/lib/fortune";
import { buildLuckyItems, ensureUserDailyFortune } from "@/lib/fortune-server";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { FortuneReveal } from "@/components/fortune/FortuneReveal";

// 占いはユーザー固有・日替わりなので常に動的レンダリング（キャッシュしない）
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "今日の運勢｜誕生日と性別で占う無料診断・総合運/恋愛運/金運/仕事運/健康運",
  description:
    "総合運・恋愛運・金運・仕事運・健康運・対人運・おでかけ運を毎日チェック。誕生日と性別であなただけの運勢を占います。",
  path: routes.fortune,
  image: "/images/fortune/meta.jpg",
});

export default async function FortunePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const date = jstToday();
  const items = await buildLuckyItems();
  const isGuest = !user;

  let result: FortuneResult | null = null;
  let needsInput = true;
  let renderMode: "2d" | "3d" = "2d";
  let awardedPoints: number | null = null;

  if (user) {
    // 共有プロフィールから誕生日・性別を読み取り（あれば入力を省略）
    const { data: profile } = await supabase
      .from("profiles")
      .select("birthday, gender")
      .eq("id", user.id)
      .maybeSingle();
    const birthday = profile?.birthday as string | null | undefined;
    const gender = profile?.gender as FortuneGender | null | undefined;
    const input: FortuneInput | null = birthday && gender ? { birthday, gender } : null;

    // 当日の結果があれば再利用、無く入力があれば生成して保存。どちらも無ければ入力を促す。
    const res = await ensureUserDailyFortune(supabase, user.id, date, items, input);
    if (res) {
      result = res.result;
      awardedPoints = res.awardedPoints;
      needsInput = false;
    }

    // 占い演出設定（2D / 3D）— user_prefs.metadata.fortune_anim
    const { data: prefs } = await supabase
      .schema("es")
      .from("user_prefs")
      .select("metadata")
      .eq("user_id", user.id)
      .maybeSingle();
    const anim = (prefs?.metadata as { fortune_anim?: string } | null)?.fortune_anim;
    renderMode = anim === "3d" ? "3d" : "2d";
  }

  return (
    <FortuneReveal
      result={result}
      isGuest={isGuest}
      renderMode={renderMode}
      awardedPoints={awardedPoints}
      needsInput={needsInput}
      date={date}
    />
  );
}
