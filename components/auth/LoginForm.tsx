"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { routes } from "@/lib/routes";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    params.error === "callback_failed" ? "認証に失敗しました。再度お試しください。" : null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません。");
      setLoading(false);
      return;
    }
    router.push(params.next ?? "/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      {/* 見出し：h1 28px、行間 1.15 */}
      <div className="space-y-2 text-center">
        <h1 className="text-[1.75rem] font-bold leading-[1.15] text-slate-900">ログイン</h1>
        <p className="text-sm text-slate-500">Each Spirit にログインしてください</p>
      </div>

      <div className="mt-7">
        <GoogleAuthButton next={params.next} label="Google でログイン" />
      </div>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        または
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          {/* エラーは該当欄の直下に表示 */}
          {error && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* モバイルは横幅いっぱい、sm 以上は auto */}
        <Button type="submit" className="mt-2 w-full sm:w-full" disabled={loading}>
          {loading ? "ログイン中…" : "ログイン"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        アカウントをお持ちでない方は{" "}
        <Link href={routes.authSignup} className="font-semibold text-slate-900 underline-offset-2 hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
