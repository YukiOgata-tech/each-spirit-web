import type { Source } from "@/lib/types";

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">参照ソース一覧</h2>
      <div className="mt-4 space-y-3">
        {sources.map((source) => (
          <div key={source.title + source.url} className="rounded-md bg-slate-50 p-3">
            <a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 underline underline-offset-4">
              {source.title}
            </a>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              種別: {source.sourceType} / 確認日: {source.collectedAt} / {source.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
