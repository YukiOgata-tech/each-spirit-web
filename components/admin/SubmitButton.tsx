"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

type Props = ButtonProps & {
  /** 送信中に差し替える表示文言（既定: 保存中…） */
  pendingLabel?: string;
};

/**
 * フォーム送信（サーバーアクション）実行中にスピナーを出す submit ボタン。
 * `<form action={...}>` の内側で使うこと（useFormStatus が親フォームの状態を読む）。
 * 複数の submit ボタンがある場合は、押されたボタン（name/value 一致）だけがスピナーになる。
 */
export function SubmitButton({ children, pendingLabel = "保存中…", disabled, ...props }: Props) {
  const { pending, data } = useFormStatus();
  // value 指定がなければ単一ボタン扱い。指定があれば送信中の値と一致するボタンだけを active にする。
  const isActive = pending && (props.value == null || data?.get(props.name ?? "") === props.value);
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={isActive} {...props}>
      {isActive ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
