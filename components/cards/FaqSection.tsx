"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";

function FaqItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-start gap-4 py-4 text-left transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      >
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-black text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-semibold leading-6 text-slate-900 transition-colors group-hover:text-[var(--primary)]">
          {faq.question}
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-all duration-200 group-hover:text-[var(--primary)] ${open ? "rotate-180 text-[var(--primary)]" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="pb-5 pl-10 text-sm leading-7 text-slate-600">{faq.answer}</p>
      </div>
    </div>
  );
}

export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="rounded-2xl border border-[var(--border,#dfe5e8)] bg-white p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary,#1d4f8f)]">FAQ</span>
      </div>
      <h2 className="text-lg font-bold text-slate-950">よくある質問</h2>
      <div className="mt-4">
        {faqs.map((faq, i) => (
          <FaqItem key={faq.question} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}
