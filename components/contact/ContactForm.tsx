"use client";

import { useActionState, useMemo } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { submitContactForm } from "@/app/contact/actions";
import type { ContactFormState } from "@/app/contact/form-state";
import { Button } from "@/components/ui/button";

const categories = ["情報提供", "掲載内容の修正依頼", "取材・掲載相談", "広告・提携相談", "その他"];

export function ContactForm({ initialState }: { initialState: ContactFormState }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const loadedAt = useMemo(() => String(Date.now()), []);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <input type="hidden" name="loadedAt" value={loadedAt} />
      <label className="hidden">
        会社名
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      {state.message ? (
        <div className={state.ok ? "rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-800" : "rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900"} role="status" aria-live="polite">
          {state.ok ? <CheckCircle2 className="mr-2 inline h-4 w-4" /> : <AlertCircle className="mr-2 inline h-4 w-4" />}
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="お名前・ペンネーム" error={state.fieldErrors.name}>
          <input name="name" className="form-input" placeholder="お名前" maxLength={80} required />
        </Field>
        <Field label="メールアドレス" error={state.fieldErrors.email}>
          <input name="email" type="email" className="form-input" placeholder="mail@example.com" maxLength={254} required />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
        <Field label="種別" error={state.fieldErrors.category}>
          <select name="category" className="form-input" defaultValue="情報提供" required>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </Field>
        <Field label="件名" error={state.fieldErrors.subject}>
          <input name="subject" className="form-input" placeholder="掲載内容の修正について" maxLength={120} required />
        </Field>
      </div>

      <Field label="お問い合わせ内容" error={state.fieldErrors.body}>
        <textarea name="body" className="form-input min-h-44 resize-y" placeholder="対象ページ、店舗名・施設名、確認したい内容などをできるだけ具体的に入力してください。" maxLength={3000} required />
      </Field>

      <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
        <input name="privacy" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" required />
        <span>
          入力内容が確認・返信・掲載内容の修正判断のために利用されること、必要に応じて編集部内で確認されることに同意します。
          {state.fieldErrors.privacy ? <span className="mt-1 block font-semibold text-red-700">{state.fieldErrors.privacy}</span> : null}
        </span>
      </label>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
        セキュリティ対策として、サーバー側で入力長、メール形式、種別、同意チェック、ハニーポット、短時間送信を検証しています。内部保存・通知機能は後続で接続します。
      </div>

      <Button type="submit" className="w-fit" disabled={isPending}>
        <Send className="h-4 w-4" />
        {isPending ? "送信確認中" : "送信する"}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      {children}
      {error ? <span className="text-sm font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}
