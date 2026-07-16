"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileUp,
  KeyRound,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Radio,
  RotateCcw,
  Send,
  Signpost,
  XCircle,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import type {
  MysteryAnswerConfig,
  MysteryAnswerMethod,
  MysteryAnswerPolicy,
  MysteryContentModel,
  MysteryHint,
} from "@/lib/mystery";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";

type SubmissionState = {
  status: "idle" | "correct" | "incorrect" | "pending" | "error";
  message: string;
};

const METHOD_COPY: Record<MysteryAnswerMethod, { title: string; description: string; icon: typeof KeyRound }> = {
  form: { title: "回答を送信", description: "導き出した答えをフォームへ入力してください。", icon: KeyRound },
  file: { title: "解答ファイルを提出", description: "指定された形式の解答ファイルを提出してください。", icon: FileUp },
  flexible: { title: "指定された方法で回答", description: "問題文に記載された場所・手順に従ってください。", icon: Signpost },
};

export function MysteryAnswerPanel({
  slug,
  contentModel,
  answerMethod,
  answerPolicy,
  answerConfig,
  hints,
  closed,
}: {
  slug: string;
  contentModel: MysteryContentModel;
  answerMethod: MysteryAnswerMethod;
  answerPolicy: MysteryAnswerPolicy;
  answerConfig: MysteryAnswerConfig;
  hints: MysteryHint[];
  closed: boolean;
}) {
  const [openedHints, setOpenedHints] = useState<number[]>([]);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "anonymous">(
    answerPolicy === "official" ? "loading" : "anonymous",
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionState>({ status: "idle", message: "" });

  useEffect(() => {
    if (answerPolicy !== "official" || contentModel === "staged") return;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setAuthState(data.user ? "authenticated" : "anonymous"));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session?.user ? "authenticated" : "anonymous");
    });
    return () => data.subscription.unsubscribe();
  }, [answerPolicy, contentModel]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setResult({ status: "idle", message: "" });

    try {
      if (answerPolicy === "check_only") {
        const formData = new FormData(form);
        const answer = String(formData.get("answer") ?? "").trim();
        const { data, error } = await createClient().schema("es").rpc("check_mystery_text_answer", {
          p_puzzle_slug: slug,
          p_answer: answer,
        });
        if (error || !data || typeof data !== "object") {
          setResult({ status: "error", message: "回答を判定できませんでした。時間をおいて再度お試しください。" });
        } else {
          const payload = data as { status?: "correct" | "incorrect"; message?: string };
          setResult({
            status: payload.status === "correct" ? "correct" : "incorrect",
            message: payload.message ?? "判定が完了しました。",
          });
        }
        return;
      }

      const formData = new FormData(form);
      formData.set("slug", slug);
      formData.set("hintCount", String(openedHints.length));
      const response = await fetch("/api/mystery/submissions", { method: "POST", body: formData });
      const payload = await response.json() as { code?: string; status?: string; message?: string };

      if (response.status === 401 || payload.code === "AUTH_REQUIRED") {
        setAuthState("anonymous");
        setResult({ status: "error", message: payload.message ?? "ログインが必要です。" });
      } else if (!response.ok) {
        setResult({ status: "error", message: payload.message ?? "送信できませんでした。" });
      } else if (payload.status === "correct") {
        setResult({ status: "correct", message: payload.message ?? "解読成功です。" });
      } else if (payload.status === "incorrect") {
        setResult({ status: "incorrect", message: payload.message ?? "正解とは一致しませんでした。" });
      } else {
        setResult({ status: "pending", message: payload.message ?? "提出を受け付けました。" });
        form.reset();
      }
    } catch {
      setResult({ status: "error", message: "通信に失敗しました。接続を確認して再度お試しください。" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {hints.length > 0 && (
        <HintsPanel hints={hints} openedHints={openedHints} onReveal={(level) => {
          setOpenedHints((current) => current.includes(level) ? current : [...current, level]);
        }} />
      )}

      {contentModel === "staged" ? (
        <section className="mystery-tool">
          <Radio className="h-5 w-5 text-red-400" />
          <p className="mystery-label mt-3 text-red-300">STAGE CONTROL</p>
          <h2 className="mt-1 text-lg font-bold text-stone-100">段階ごとに回答</h2>
          <p className="mt-2 text-xs leading-6 text-stone-400">回答欄は、左側の各段階に表示されます。結果は正解者記録には残りません。</p>
        </section>
      ) : (
        <AnswerTool
          slug={slug}
          answerMethod={answerMethod}
          answerPolicy={answerPolicy}
          answerConfig={answerConfig}
          authState={authState}
          closed={closed}
          submitting={submitting}
          result={result}
          onSubmit={submit}
          onReset={() => setResult({ status: "idle", message: "" })}
        />
      )}
    </div>
  );
}

function HintsPanel({
  hints,
  openedHints,
  onReveal,
}: {
  hints: MysteryHint[];
  openedHints: number[];
  onReveal: (level: number) => void;
}) {
  return (
    <section className="mystery-tool" aria-labelledby="mystery-hints-heading">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <div>
          <p className="mystery-label text-amber-300">CLUE ARCHIVE</p>
          <h2 id="mystery-hints-heading" className="mt-1 text-lg font-bold text-stone-100">ヒント保管庫</h2>
        </div>
      </div>
      <div className="mt-4 divide-y divide-stone-700 border-y border-stone-700">
        {hints.map((hint) => {
          const open = openedHints.includes(hint.level);
          return (
            <div key={hint.id} className="py-3">
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-bold text-stone-200 transition hover:text-white"
                onClick={() => onReveal(hint.level)}
                aria-expanded={open}
              >
                <span>HINT {String(hint.level).padStart(2, "0")} / {hint.title}</span>
                <span className="font-mono text-xs text-stone-500">{open ? "OPEN" : "LOCKED"}</span>
              </button>
              {open && (
                <div className="mystery-hint-markdown mt-2 border-l-2 border-amber-500 pl-4 text-sm text-stone-300">
                  <MarkdownRenderer markdown={hint.bodyMd} />
                  {hint.penaltyLabel && <p className="mt-2 font-mono text-[11px] text-stone-500">{hint.penaltyLabel}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AnswerTool({
  slug,
  answerMethod,
  answerPolicy,
  answerConfig,
  authState,
  closed,
  submitting,
  result,
  onSubmit,
  onReset,
}: {
  slug: string;
  answerMethod: MysteryAnswerMethod;
  answerPolicy: MysteryAnswerPolicy;
  answerConfig: MysteryAnswerConfig;
  authState: "loading" | "authenticated" | "anonymous";
  closed: boolean;
  submitting: boolean;
  result: SubmissionState;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  const copy = METHOD_COPY[answerMethod];
  const MethodIcon = copy.icon;
  const maxLength = Math.min(Math.max(answerConfig.maxLength ?? 200, 1), 200);
  const accept = answerConfig.allowedTypes?.join(",")
    ?? "image/jpeg,image/png,image/webp,application/pdf,text/plain,application/zip,.zip";

  if (result.status === "correct") {
    return (
      <section className="mystery-result mystery-result-correct" aria-live="polite">
        <span className="mystery-result-seal"><CheckCircle2 className="h-8 w-8" /></span>
        <p className="mystery-label text-emerald-300">DECODED</p>
        <h2 className="mt-2 text-2xl font-black text-stone-50">解読完了</h2>
        <p className="mt-3 text-sm leading-7 text-stone-300">{result.message}</p>
        {answerPolicy === "check_only" && <p className="mt-2 text-xs leading-5 text-stone-500">この判定は正解者記録には保存されません。</p>}
        <Button type="button" variant="outline" className="mt-6 border-stone-600 bg-transparent text-stone-100 hover:bg-stone-800" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> 回答欄へ戻る
        </Button>
      </section>
    );
  }

  return (
    <section className="mystery-tool" aria-labelledby="mystery-submit-heading">
      <div className="flex items-start gap-3">
        <MethodIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        <div>
          <p className="mystery-label text-red-300">TRANSMISSION</p>
          <h2 id="mystery-submit-heading" className="mt-1 text-lg font-bold text-stone-100">{answerConfig.title ?? copy.title}</h2>
          <p className="mt-1 text-xs leading-5 text-stone-400">{answerConfig.description ?? copy.description}</p>
        </div>
      </div>

      {closed ? (
        <p className="mt-5 border-l-2 border-stone-500 pl-4 text-sm leading-7 text-stone-300">この問題の回答受付は終了しました。</p>
      ) : answerPolicy === "official" && authState === "loading" ? (
        <div className="mt-6 flex min-h-24 items-center justify-center"><LoaderCircle className="h-5 w-5 animate-spin text-stone-500" aria-label="ログイン状態を確認中" /></div>
      ) : answerPolicy === "official" && authState === "anonymous" ? (
        <div className="mt-5 border border-stone-700 bg-stone-950 p-4">
          <LockKeyhole className="h-5 w-5 text-red-400" />
          <p className="mt-3 text-sm font-bold text-stone-100">回答にはログインが必要です</p>
          <p className="mt-1 text-xs leading-5 text-stone-500">ログイン後、この問題へ戻って回答できます。</p>
          <Button asChild className="mt-4 h-10 w-full bg-red-700 text-white hover:bg-red-600">
            <Link href={`${routes.authLogin}?next=${encodeURIComponent(routes.mysteryPuzzle(slug))}`}>
              <LockKeyhole className="h-4 w-4" /> ログインして回答
            </Link>
          </Button>
        </div>
      ) : answerMethod === "flexible" ? (
        <div className="mt-5 border-l-2 border-red-700 pl-4">
          <p className="text-sm leading-7 text-stone-300">{answerConfig.description ?? "問題文に記載された回答手順に従ってください。"}</p>
          {answerConfig.actionUrl && (
            <a href={answerConfig.actionUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-300 underline underline-offset-4">
              {answerConfig.actionLabel ?? "回答先を開く"} <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          {answerPolicy === "official" && (
            <div>
              <label htmlFor="mystery-display-name" className="mb-1.5 block text-xs font-bold text-stone-300">記録に残す表示名</label>
              <input id="mystery-display-name" name="displayName" required minLength={2} maxLength={24} className="mystery-input" placeholder="例: 暗号旅人" />
            </div>
          )}

          {answerMethod === "form" && (
            <div>
              <label htmlFor="mystery-answer" className="mb-1.5 block text-xs font-bold text-stone-300">回答</label>
              <input id="mystery-answer" name="answer" required maxLength={maxLength} autoComplete="off" className="mystery-input font-mono" placeholder={answerConfig.placeholder ?? "ANSWER"} />
            </div>
          )}

          {answerMethod === "file" && (
            <>
              <div>
                <label htmlFor="mystery-file" className="mb-1.5 block text-xs font-bold text-stone-300">提出ファイル</label>
                <input id="mystery-file" name="file" type="file" required accept={accept} className="mystery-file-input" />
                <p className="mt-1.5 text-[11px] leading-5 text-stone-500">指定形式、最大{Math.min(answerConfig.maxSizeMb ?? 10, 10)}MB。提出物は非公開です。</p>
              </div>
              {answerConfig.commentEnabled !== false && (
                <div>
                  <label htmlFor="mystery-comment" className="mb-1.5 block text-xs font-bold text-stone-300">補足コメント（任意）</label>
                  <textarea id="mystery-comment" name="answer" maxLength={500} className="mystery-input min-h-24 resize-y" />
                </div>
              )}
            </>
          )}

          {result.status !== "idle" && (
            <div className={`mystery-status mystery-status-${result.status}`} role="status">
              {result.status === "incorrect" || result.status === "error"
                ? <XCircle className="h-4 w-4 shrink-0" />
                : <CheckCircle2 className="h-4 w-4 shrink-0" />}
              <p>{result.message}</p>
            </div>
          )}

          <Button type="submit" disabled={submitting} className="h-12 w-full bg-red-700 text-stone-50 hover:bg-red-600">
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "送信中" : answerPolicy === "check_only" ? "正解を判定" : "回答を送信"}
          </Button>
          <p className="flex items-start gap-2 text-[11px] leading-5 text-stone-500">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {answerPolicy === "check_only"
              ? "正誤だけを判定し、回答内容や正解記録は保存しません。"
              : answerMethod === "form"
                ? "回答本文は保存せず、照合用ハッシュと判定結果だけを記録します。"
                : "提出ファイルは非公開で保存され、確認後に判定されます。"}
          </p>
        </form>
      )}
    </section>
  );
}
