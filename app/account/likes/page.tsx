import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Bookmark, MapPin, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "保存した項目",
  robots: { index: false },
};

type LikeType = "like" | "bookmark" | "want_to_visit";

const TYPES: { key: LikeType; label: string; icon: React.ElementType; color: string }[] = [
  { key: "like", label: "いいね", icon: Heart, color: "text-rose-500" },
  { key: "bookmark", label: "ブックマーク", icon: Bookmark, color: "text-blue-500" },
  { key: "want_to_visit", label: "行きたい", icon: MapPin, color: "text-amber-500" },
];

const SECTION_LABEL: Record<string, string> = {
  "food:ramen": "ラーメン",
  "food:cafe": "カフェ",
  "health:protein": "プロテイン",
  "beauty:hair-salon": "美容サロン",
  "travel:stays": "宿・ホテル",
  "travel:services": "旅行サービス",
  "leisure:spots": "レジャー",
  article: "記事",
  ranking: "ランキング",
};

function itemLabel(item: { major_category?: string | null; section_slug?: string | null; item_kind?: string | null }) {
  if (item.major_category && item.section_slug) {
    const sectionLabel = SECTION_LABEL[`${item.major_category}:${item.section_slug}`];
    if (sectionLabel) return item.item_kind === "app" ? "旅行アプリ" : sectionLabel;
  }
  return "店舗・商品";
}

type PageProps = { searchParams: Promise<{ type?: string }> };

export default async function AccountLikesPage({ searchParams }: PageProps) {
  const { type: rawType } = await searchParams;
  const likeType: LikeType = rawType === "bookmark" || rawType === "want_to_visit" ? rawType : "like";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`${routes.authLogin}?next=${routes.account}/likes`);

  const { data: likesData } = await supabase
    .schema("es")
    .from("content_likes")
    .select("content_kind, target_id, region_slug, created_at")
    .eq("user_id", user.id)
    .eq("like_type", likeType)
    .order("created_at", { ascending: false });

  type Row = { content_kind: string; target_id: string; region_slug: string | null; created_at: string };
  const likes: Row[] = (likesData ?? []) as Row[];

  const itemIds = likes.filter((l) => l.content_kind === "item").map((l) => l.target_id);
  const articleIds = likes.filter((l) => l.content_kind === "article").map((l) => l.target_id);
  const rankingIds = likes.filter((l) => l.content_kind === "ranking").map((l) => l.target_id);

  const es = supabase.schema("es");
  const [itemsRes, articlesRes, rankingsRes] = await Promise.all([
    itemIds.length ? es.from("items").select("id, major_category, section_slug, item_kind, name, canonical_path").in("id", itemIds) : Promise.resolve({ data: [] }),
    articleIds.length ? es.from("articles").select("id, title, canonical_path").in("id", articleIds) : Promise.resolve({ data: [] }),
    rankingIds.length ? es.from("rankings").select("id, title, canonical_path").in("id", rankingIds) : Promise.resolve({ data: [] }),
  ]);

  const resolved = new Map<string, { name: string; href: string | null; label: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const it of (itemsRes.data ?? []) as any[]) {
    resolved.set(`item:${it.id}`, { name: it.name, href: it.canonical_path ?? null, label: itemLabel(it) });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const a of (articlesRes.data ?? []) as any[]) {
    resolved.set(`article:${a.id}`, { name: a.title, href: a.canonical_path ?? null, label: SECTION_LABEL.article });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (rankingsRes.data ?? []) as any[]) {
    resolved.set(`ranking:${r.id}`, { name: r.title, href: r.canonical_path ?? null, label: SECTION_LABEL.ranking });
  }

  const rows = likes.map((l) => {
    const r = resolved.get(`${l.content_kind}:${l.target_id}`);
    return {
      created_at: l.created_at,
      label: r?.label ?? l.content_kind,
      name: r?.name ?? l.target_id,
      href: r?.href ?? null,
    };
  });

  const active = TYPES.find((t) => t.key === likeType)!;

  return (
    <div className="bg-[var(--background)] pb-16">
      <section className="border-b border-[var(--border)] bg-white/80">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-6 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-8">
          <Link href={routes.account} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" /> マイページ
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-900 sm:text-2xl">
            <active.icon className={`h-5 w-5 shrink-0 ${active.color}`} />
            {active.label}した項目
          </h1>

          {/* 種別タブ */}
          <div className="mt-4 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <Link
                key={t.key}
                href={`${routes.account}/likes?type=${t.key}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  t.key === likeType
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 w-[min(1360px,calc(100%-40px))] max-sm:w-[min(1360px,calc(100%-24px))]">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-white p-10 text-center">
            <active.icon className={`mx-auto h-8 w-8 ${active.color} opacity-60`} />
            <p className="mt-3 text-sm text-slate-500">まだ{active.label}した項目はありません。</p>
            <Link href={routes.cafe} className="mt-4 inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              コンテンツを探す
            </Link>
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {rows.map((row, i) => {
              const inner = (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{row.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {row.label}
                      {" ・ "}
                      {new Date(row.created_at).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}
                    </p>
                  </div>
                  {row.href && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
                </>
              );
              const cls = "flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3";
              return (
                <li key={`${row.label}-${row.name}-${i}`}>
                  {row.href ? (
                    <Link href={row.href} className={`${cls} transition hover:border-[var(--primary)]/40 hover:shadow-sm`}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
