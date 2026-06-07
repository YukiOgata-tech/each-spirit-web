export function StaticPage({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className="section-shell max-w-4xl">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <h1 className="text-3xl font-bold tracking-normal sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">{lead}</p>
      </section>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 leading-8 text-slate-700 sm:p-8">
        {children}
      </div>
    </div>
  );
}
