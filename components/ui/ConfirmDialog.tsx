"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * 軽量な確認モーダル。誤操作防止用（ログアウト等）。
 * open=false の間は何もレンダリングしない。Esc / 背景クリックでキャンセル。
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "実行する",
  cancelLabel = "キャンセル",
  tone = "default",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="閉じる" onClick={onCancel} className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-bold text-white transition",
              tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[var(--primary)] hover:opacity-90",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
