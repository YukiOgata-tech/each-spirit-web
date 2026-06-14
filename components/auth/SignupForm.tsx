"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { routes } from "@/lib/routes";

export function SignupForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(null);
    setFormError(null);
    if (password.length < 8) {
      setPasswordError("パスワードは8文字以上にしてください。");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}${routes.authCallback}`,
        // public.handle_new_user トリガーが raw_user_meta_data.display_name を
        // profiles.display_name に使う。未指定だと既定値「ユーザー」になるため必ず渡す。
        data: { display_name: displayName.trim() },
      },
    });
    if (error) {
      setFormError(
        error.message === "User already registered"
          ? "このメールアドレスは既に登録されています。"
          : "登録に失敗しました。しばらくしてから再度お試しください。",
      );
      setLoading(false);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-[1.75rem] font-bold leading-[1.15] text-slate-900">確認メールを送信しました</h1>
        <p className="text-sm leading-relaxed text-slate-600">
          <span className="font-semibold">{email}</span> に確認メールを送りました。<br />
          メール内のリンクをクリックして登録を完了してください。
        </p>
        <p className="text-xs text-slate-400">メールが届かない場合は迷惑メールフォルダをご確認ください。</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-[1.75rem] font-bold leading-[1.15] text-slate-900">新規登録</h1>
        <p className="text-sm text-slate-500">Each Spirit のアカウントを作成します</p>
      </div>

      <div className="mt-7">
        <GoogleAuthButton next={routes.account} label="Google で登録" />
      </div>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        または
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        )}
        <div className="space-y-1.5">
          <label htmlFor="displayName" className="block text-sm font-semibold text-slate-700">
            表示名
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            required
            maxLength={30}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="form-input"
            placeholder="ニックネーム可"
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="8文字以上"
          />
          {/* パスワードエラーは直下に表示 */}
          {passwordError && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">{passwordError}</p>
          )}
        </div>

        <Button type="submit" className="mt-2 w-full" disabled={loading}>
          {loading ? "登録中…" : "アカウントを作成"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        すでにアカウントをお持ちの方は{" "}
        <Link href={routes.authLogin} className="font-semibold text-slate-900 underline-offset-2 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
