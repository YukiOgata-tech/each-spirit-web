"use server";

import type { ContactFormState } from "@/app/contact/form-state";

const categories = new Set(["情報提供", "掲載内容の修正依頼", "取材・掲載相談", "広告・提携相談", "その他"]);

const clean = (value: FormDataEntryValue | null, maxLength: number) =>
  String(value ?? "")
    .replace(/\p{C}/gu, "")
    .trim()
    .slice(0, maxLength);

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function submitContactForm(_: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const loadedAt = Number(formData.get("loadedAt") ?? 0);
  const now = Date.now();
  const company = clean(formData.get("company"), 120);

  if (company) {
    return { ok: false, message: "送信できませんでした。入力内容を確認してください。", fieldErrors: {} };
  }

  if (!loadedAt || now - loadedAt < 2500) {
    return { ok: false, message: "送信までの時間が短すぎます。少し待ってから再度お試しください。", fieldErrors: {} };
  }

  const name = clean(formData.get("name"), 80);
  const email = clean(formData.get("email"), 254);
  const category = clean(formData.get("category"), 40);
  const subject = clean(formData.get("subject"), 120);
  const body = clean(formData.get("body"), 3000);
  const privacy = formData.get("privacy") === "on";

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (name.length < 1) fieldErrors.name = "お名前またはペンネームを入力してください。";
  if (!isEmail(email)) fieldErrors.email = "有効なメールアドレスを入力してください。";
  if (!categories.has(category)) fieldErrors.category = "お問い合わせ種別を選択してください。";
  if (subject.length < 4) fieldErrors.subject = "件名は4文字以上で入力してください。";
  if (body.length < 20) fieldErrors.body = "内容は20文字以上で入力してください。";
  if (!privacy) fieldErrors.privacy = "プライバシーポリシーへの同意が必要です。";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "入力内容に不足があります。", fieldErrors };
  }

  const safePayload = {
    name,
    email,
    category,
    subject,
    body,
    receivedAt: new Date(now).toISOString(),
    source: "contact-form",
  };

  void safePayload;

  return {
    ok: true,
    message: "送信内容を受け付けました。現在は内部送信先の接続前のため、後続実装で保存・通知処理を接続します。",
    fieldErrors: {},
  };
}
