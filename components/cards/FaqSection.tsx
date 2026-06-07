import type { FAQ } from "@/lib/types";

export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">FAQ</h2>
      <div className="mt-4 divide-y divide-slate-200">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
            <h3 className="font-semibold text-slate-950">{faq.question}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
