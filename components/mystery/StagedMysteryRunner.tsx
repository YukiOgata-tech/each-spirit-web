"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, KeyRound, LoaderCircle, Radio, RotateCcw, XCircle } from "lucide-react";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Stage = {
  stageNumber: number;
  title: string;
  bodyMd: string;
  accessKey?: string;
};

type StoredProgress = {
  stages: Stage[];
  complete: boolean;
};

type StageCheckResult = {
  status?: "correct" | "incorrect";
  complete?: boolean;
  message?: string;
  nextStage?: Stage;
};

function storageKey(slug: string) {
  return `each-spirit:mystery-stage:${slug}`;
}

function readProgress(slug: string): StoredProgress | null {
  try {
    const raw = sessionStorage.getItem(storageKey(slug));
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredProgress;
    if (!Array.isArray(value.stages) || value.stages.length === 0) return null;
    return value;
  } catch {
    return null;
  }
}

export function StagedMysteryRunner({ slug, closed }: { slug: string; closed: boolean }) {
  const [progress, setProgress] = useState<StoredProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    const cached = readProgress(slug);
    if (cached) {
      setProgress(cached);
      setLoading(false);
      return;
    }

    const supabase = createClient().schema("es");
    void supabase.rpc("get_mystery_first_stage", { p_puzzle_slug: slug }).then(({ data, error }) => {
      if (!error && data && typeof data === "object") {
        const first = data as Stage;
        const initial = { stages: [first], complete: false };
        sessionStorage.setItem(storageKey(slug), JSON.stringify(initial));
        setProgress(initial);
      }
      setLoading(false);
    });
  }, [slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!progress || progress.complete) return;
    const current = progress.stages.at(-1);
    if (!current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const answer = String(formData.get("answer") ?? "").trim();
    if (!answer) return;

    setSubmitting(true);
    setMessage("");
    setIncorrect(false);

    const { data, error } = await createClient().schema("es").rpc("check_mystery_stage_answer", {
      p_puzzle_slug: slug,
      p_stage_number: current.stageNumber,
      p_answer: answer,
      p_access_key: current.accessKey ?? null,
    });

    if (error || !data || typeof data !== "object") {
      setMessage("回答を判定できませんでした。時間をおいて再度お試しください。");
      setIncorrect(true);
      setSubmitting(false);
      return;
    }

    const result = data as StageCheckResult;
    setMessage(result.message ?? "");
    setIncorrect(result.status === "incorrect");

    if (result.status === "correct") {
      const next: StoredProgress = {
        stages: result.nextStage ? [...progress.stages, result.nextStage] : progress.stages,
        complete: Boolean(result.complete),
      };
      sessionStorage.setItem(storageKey(slug), JSON.stringify(next));
      setProgress(next);
      form.reset();
    }
    setSubmitting(false);
  }

  function resetProgress() {
    sessionStorage.removeItem(storageKey(slug));
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="mt-10 flex min-h-40 items-center justify-center border border-stone-300 bg-stone-100 text-stone-600">
        <LoaderCircle className="h-5 w-5 animate-spin" aria-label="段階を読み込み中" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="mt-10 border border-dashed border-stone-400 px-5 py-10 text-center text-sm text-stone-600">
        現在、この問題の段階データを読み込めません。
      </div>
    );
  }

  const currentStage = progress.stages.at(-1);

  return (
    <section className="mt-10 border-t-2 border-stone-900 pt-8" aria-labelledby="staged-mystery-heading">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold text-red-800">SEQUENTIAL FILE</p>
          <h2 id="staged-mystery-heading" className="mt-1 text-xl font-black text-stone-950">段階調査</h2>
        </div>
        <span className="font-mono text-xs font-bold text-stone-500">STAGE {String(currentStage?.stageNumber ?? 1).padStart(2, "0")}</span>
      </div>

      <div className="mt-6 space-y-8">
        {progress.stages.map((stage, index) => {
          const active = index === progress.stages.length - 1;
          return (
            <article key={stage.stageNumber} className={active ? "border-l-4 border-red-800 pl-5" : "border-l-4 border-stone-300 pl-5 opacity-70"}>
              <p className="font-mono text-[10px] font-bold text-stone-500">STAGE {String(stage.stageNumber).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-black text-stone-900">{stage.title}</h3>
              <div className="mystery-markdown mt-4">
                <MarkdownRenderer markdown={stage.bodyMd} unoptimizedImages />
              </div>
            </article>
          );
        })}
      </div>

      {progress.complete ? (
        <div className="mt-8 border border-emerald-700 bg-emerald-950 px-5 py-6 text-stone-100">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          <p className="mt-3 font-mono text-[10px] font-bold text-emerald-300">ALL STAGES DECODED</p>
          <p className="mt-1 text-lg font-black">全段階の解読完了</p>
          <p className="mt-2 text-sm leading-6 text-stone-300">この結果は正解者記録には保存されません。</p>
          <Button type="button" variant="outline" className="mt-5 border-stone-500 bg-transparent text-stone-100 hover:bg-stone-800" onClick={resetProgress}>
            <RotateCcw className="h-4 w-4" /> 最初から挑戦
          </Button>
        </div>
      ) : closed ? (
        <p className="mt-8 border-l-2 border-stone-500 pl-4 text-sm text-stone-600">この問題の回答受付は終了しました。</p>
      ) : (
        <form className="mt-8 border border-stone-300 bg-stone-100 p-5" onSubmit={submit}>
          <div className="flex items-center gap-2 text-stone-900">
            <KeyRound className="h-5 w-5 text-red-800" />
            <label htmlFor="staged-answer" className="text-sm font-black">この段階の回答</label>
          </div>
          <input id="staged-answer" name="answer" required maxLength={200} autoComplete="off" className="mt-3 w-full border border-stone-400 bg-white px-3 py-3 font-mono text-sm text-stone-950 outline-none focus:border-red-700" placeholder="ANSWER" />
          {message && (
            <p className={`mt-3 flex items-start gap-2 text-sm font-bold ${incorrect ? "text-red-800" : "text-emerald-800"}`} role="status">
              {incorrect ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              {message}
            </p>
          )}
          <Button type="submit" disabled={submitting} className="mt-4 h-11 w-full bg-red-800 text-white hover:bg-red-700">
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
            {submitting ? "判定中" : "回答を判定"}
          </Button>
          <p className="mt-3 text-[11px] leading-5 text-stone-500">進行状況はこのタブ内だけに保持され、正解者記録には残りません。</p>
        </form>
      )}
    </section>
  );
}
