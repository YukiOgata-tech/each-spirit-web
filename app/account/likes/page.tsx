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

const CONTENT_LABEL: Record<string, string> = {
  cafe: "カフェ",
  ramen_item: "ラーメン",
  beauty_salon: "美容サロン",
  hotel: "ホテル",
  leisure_spot: "レジャー",
  article: "記事",
  ranking: "ランキング",
};

const ITEM_TYPES = new Set(["cafe", "ramen_item", "beauty_salon", "hotel", "leisure_spot"]);

function itemHref(type: string, region: string | null, slug: string): string | null {
  switch (type) {
    case "cafe": return region ? routes.cafeItem(region, slug) : null;
    case "ramen_item": return routes.ramenItem(slug);
    case "beauty_salon": return region ? routes.beautySalon(region, slug) : null;
    case "hotel": return region ? routes.travelHotel(region, slug) : null;
    case "leisure_spot": return routes.leisureSpot(region ?? "niigata", slug);
    default: return null;
  }
}
function articleHref(category: string, region: string | null, slug: string): string | null {
  if (category === "ramen") return routes.ramenArticle(slug);
  if (category === "beauty" && region) return routes.beautyArticle(region, slug);
  return null;
}
function rankingHref(category: string, region: string | null, slug: string): string | null {
  switch (category) {
    case "ramen": return routes.ramenRanking(slug);
    case "cafe": return region ? routes.cafeRanking(region, slug) : null;
    case "beauty": return region ? routes.beautyRanking(region, slug) : null;
    case "hotel": return region ? routes.travelRanking(region, slug) : null;
    case "leisure": return region ? routes.leisureRanking(region, slug) : null;
    default: return null;
  }
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
    .select("content_type, content_id, region_slug, created_at")
    .eq("user_id", user.id)
    .eq("like_type", likeType)
    .order("created_at", { ascending: false });

  type Row = { content_type: string; content_id: string; region_slug: string | null; created_at: string };
  const likes: Row[] = (likesData ?? []) as Row[];

  const itemSlugs = likes.filter((l) => ITEM_TYPES.has(l.content_type)).map((l) => l.content_id);
  const articleSlugs = likes.filter((l) => l.content_type === "article").map((l) => l.content_id);
  const rankingSlugs = likes.filter((l) => l.content_type === "ranking").map((l) => l.content_id);

  const es = supabase.schema("es");
  const [itemsRes, articlesRes, rankingsRes] = await Promise.all([
    itemSlugs.length ? es.from("items").select("content_type, slug, name, region").in("slug", itemSlugs) : Promise.resolve({ data: [] }),
    articleSlugs.length ? es.from("articles").select("slug, title, category, region").in("slug", articleSlugs) : Promise.resolve({ data: [] }),
    rankingSlugs.length ? es.from("rankings").select("slug, title, content_type, region").in("slug", rankingSlugs) : Promise.resolve({ data: [] }),
  ]);

  const resolved = new Map<string, { name: string; href: string | null }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const it of (itemsRes.data ?? []) as any[]) {
    resolved.set(`${it.content_type}:${it.slug}`, { name: it.name, href: itemHref(it.content_type, it.region, it.slug) });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const a of (articlesRes.data ?? []) as any[]) {
    resolved.set(`article:${a.slug}`, { name: a.title, href: articleHref(a.category, a.region, a.slug) });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (rankingsRes.data ?? []) as any[]) {
    resolved.set(`ranking:${r.slug}`, { name: r.title, href: rankingHref(r.content_type, r.region, r.slug) });
  }

  const rows = likes.map((l) => {
    const key = l.content_type === "article" || l.content_type === "ranking"
      ? `${l.content_type}:${l.content_id}`
      : `${l.content_type}:${l.content_id}`;
    const r = resolved.get(key);
    return {
      ...l,
      name: r?.name ?? l.content_id,
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
                      {CONTENT_LABEL[row.content_type] ?? row.content_type}
                      {" ・ "}
                      {new Date(row.created_at).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}
                    </p>
                  </div>
                  {row.href && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
                </>
              );
              const cls = "flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3";
              return (
                <li key={`${row.content_type}-${row.content_id}-${i}`}>
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
