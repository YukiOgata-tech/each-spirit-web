import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getCurrentAdminUser } from "@/lib/admin";
import { routes } from "@/lib/routes";
import { saveArticle } from "./actions";

export const metadata: Metadata = {
  title: "記事作成 | Each Spirit",
  robots: { index: false },
};

export default async function NewArticlePage() {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    redirect(`${routes.authLogin}?next=/account/articles/new`);
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1480px,calc(100%-32px))] py-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Admin editor</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-normal text-slate-950">記事作成</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Markdownで記事を書き、PCでは右側に公開表示と同じプレビューを表示します。
              </p>
            </div>
            <p className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              {admin.email}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 w-[min(1480px,calc(100%-32px))]">
        <ArticleEditor action={saveArticle} />
      </div>
    </main>
  );
}
