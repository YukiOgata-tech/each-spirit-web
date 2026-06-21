import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getCurrentAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { routes } from "@/lib/routes";
import { StorageUploader, type UploadArticle } from "@/components/admin/StorageUploader";

export const metadata: Metadata = { title: "画像アップロード", robots: { index: false } };

const ALLOWED_BUCKETS = new Set(["each-spirit-images", "article-assets"]);

type ArticleRow = {
  slug: string;
  title: string | null;
  category: string | null;
  status: string | null;
  body_md: string | null;
  cover_image_url: string | null;
};

// 本文・カバーから storage 公開URLの参照（bucket/path）を抽出する。
// 外部サービスが MD に先に書いた「アップロード待ちスロット」を見つけるために使う。
function extractReferences(text: string): { bucket: string; path: string }[] {
  const out: { bucket: string; path: string }[] = [];
  const re = /\/storage\/v1\/object\/public\/([^/\s)"']+)\/([^\s)"']+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const bucket = m[1];
    const path = m[2].replace(/[).,]+$/, ""); // 末尾の記号を除去
    if (ALLOWED_BUCKETS.has(bucket)) out.push({ bucket, path });
  }
  return out;
}

export default async function StoragePage() {
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/storage`);

  const service = createServerClient();
  const { data } = await service
    .from("articles")
    .select("slug, title, category, status, body_md, cover_image_url")
    .order("updated_at", { ascending: false });

  const articles: UploadArticle[] = ((data as ArticleRow[] | null) ?? []).map((r) => {
    const refsRaw = [
      ...extractReferences(r.body_md ?? ""),
      ...extractReferences(r.cover_image_url ?? ""),
    ];
    // bucket+path で重複排除
    const seen = new Set<string>();
    const references = refsRaw.filter((ref) => {
      const key = `${ref.bucket}/${ref.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return {
      slug: r.slug,
      title: r.title ?? r.slug,
      category: r.category ?? "",
      status: r.status ?? "published",
      references,
    };
  });

  const publicPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1080px,calc(100%-24px))] py-5 sm:w-[min(1080px,calc(100%-32px))] sm:py-6">
          <Link href={routes.account} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800">
            <ArrowLeft className="h-3.5 w-3.5" />
            マイページ
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin only
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">画像アップロード</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            記事を選び、<span className="font-mono text-slate-700">articles/&#123;slug&#125;/</span> 配下の指定パスに画像をアップロードします。
            本文（MD）に先に書いたURLのパスへ後から実ファイルを置く用途です。アップロード時に拡張子へ合わせて最適化し、容量を抑えます。
          </p>
        </div>
      </header>

      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <StorageUploader articles={articles} publicPrefix={publicPrefix} />
      </div>
    </main>
  );
}
