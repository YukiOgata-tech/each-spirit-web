"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

/**
 * Google OAuth ログイン/登録ボタン。
 * Supabase の signInWithOAuth を呼び、認証後は既存の /auth/callback で
 * code を session に交換して `next` へ遷移する。
 *
 * 動作には Supabase ダッシュボードで Google プロバイダの有効化と
 * Redirect URL の登録が必要（未設定の間はクリックでエラーになる）。
 */
export function GoogleAuthButton({ next, label = "Google で続ける" }: { next?: string; label?: string }) {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    const redirectTo =
      `${window.location.origin}${routes.authCallback}` +
      (next ? `?next=${encodeURIComponent(next)}` : "");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    // 成功時は Google へリダイレクトされるためここには到達しない
    if (error) setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
    >
      <GoogleIcon />
      {loading ? "リダイレクト中…" : label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
