"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "2d" | "3d";

/**
 * 占いローディング演出の 2D / 3D 切替。設定は es.user_prefs.metadata.fortune_anim に保存。
 * 未ログイン時は非表示。
 */
export function FortuneAnimToggle() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("2d");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active || !user) return;
      setUserId(user.id);
      const { data } = await supabase
        .schema("es")
        .from("user_prefs")
        .select("metadata")
        .eq("user_id", user.id)
        .maybeSingle();
      const anim = (data?.metadata as { fortune_anim?: string } | null)?.fortune_anim;
      if (active && anim === "3d") setMode("3d");
    })();
    return () => { active = false; };
  }, []);

  async function choose(next: Mode) {
    if (!userId || next === mode || saving) return;
    const prev = mode;
    setMode(next);
    setSaving(true);
    const supabase = createClient();
    const { data } = await supabase.schema("es").from("user_prefs").select("metadata").eq("user_id", userId).maybeSingle();
    const meta = { ...((data?.metadata as Record<string, unknown>) ?? {}), fortune_anim: next };
    const { error } = await supabase.schema("es").from("user_prefs").upsert({ user_id: userId, metadata: meta }, { onConflict: "user_id" });
    if (error) setMode(prev); // 失敗時ロールバック
    setSaving(false);
  }

  if (!userId) return null;

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-[var(--muted)]/60 px-3 py-2">
      <span className="text-xs font-semibold text-slate-500">占い演出</span>
      <div className="flex rounded-full bg-white p-0.5 shadow-sm">
        {(["2d", "3d"] as const).map((m) => (
          <button
            key={m}
            onClick={() => choose(m)}
            disabled={saving}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold transition disabled:opacity-60",
              mode === m ? "bg-violet-500 text-white" : "text-slate-500 hover:text-slate-700",
            )}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
