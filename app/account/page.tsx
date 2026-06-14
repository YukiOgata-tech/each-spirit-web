import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Heart, Bookmark, MapPin, Bell, ClipboardList,
  Star, Coffee, Trophy, Sparkles, ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard, DashboardCardEmpty } from "@/components/account/DashboardCard";
import { FortuneAnimToggle } from "@/components/account/FortuneAnimToggle";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ | Each Spirit",
  robots: { index: false },
};

// ── 型定義 ────────────────────────────────────────────────
type Profile = { display_name: string | null; avatar: string | null } | null;
type LikeRow  = { like_type: string; content_type: string; content_id: string; created_at: string };
type Notification = { id: string; title: string; body: string; action_url: string | null; created_at: string };
type QuizResult   = { id: string; quiz_type: string; result: Record<string, unknown>; created_at: string };
type Points = { balance: number; lifetime: number } | null;

// ── コンテンツタイプの日本語ラベル ────────────────────────
const CONTENT_TYPE_LABELS: Record<string, string> = {
  cafe: "カフェ",
  ramen_item: "ラーメン",
  article: "記事",
  ranking: "ランキング",
  leisure_spot: "レジャー",
  hotel: "ホテル",
  beauty_salon: "美容サロン",
};
const LIKE_TYPE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  like:          { label: "いいね",   icon: Heart,    color: "text-rose-500" },
  bookmark:      { label: "保存",     icon: Bookmark, color: "text-blue-500" },
  want_to_visit: { label: "行きたい", icon: MapPin,   color: "text-amber-500" },
};
const QUIZ_TYPE_LABELS: Record<string, string> = {
  cafe_style: "カフェスタイル診断",
  coffee_preference: "コーヒー好み診断",
};

// ── メインページ (Server Component) ───────────────────────
export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${routes.authLogin}?next=${routes.account}`);
  }

  // データ並列取得（es スキーマを利用するには Supabase Dashboard の
  // Settings > API > Extra schemas に "es" を追加してください）
  const [profileRes, likesRes, notificationsRes, quizRes, pointsRes] = await Promise.allSettled([
    supabase.from("profiles").select("display_name, avatar").eq("id", user.id).single(),
    supabase.schema("es").from("content_likes")
      .select("like_type, content_type, content_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.schema("es").from("notifications")
      .select("id, title, body, action_url, created_at")
      .eq("user_id", user.id)
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.schema("es").from("quiz_results")
      .select("id, quiz_type, result, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.schema("es").from("user_points")
      .select("balance, lifetime")
      .eq("user_id", user.id)
      .single(),
  ]);

  const profile: Profile = profileRes.status === "fulfilled" ? profileRes.value.data : null;
  const likes: LikeRow[] = likesRes.status === "fulfilled" ? (likesRes.value.data ?? []) : [];
  const notifications: Notification[] = notificationsRes.status === "fulfilled" ? (notificationsRes.value.data ?? []) : [];
  const quizResults: QuizResult[] = quizRes.status === "fulfilled" ? (quizRes.value.data ?? []) : [];
  const points: Points = pointsRes.status === "fulfilled" ? pointsRes.value.data : null;

  // 集計
  const likeCount        = likes.filter(l => l.like_type === "like").length;
  const bookmarkCount    = likes.filter(l => l.like_type === "bookmark").length;
  const wantToVisitCount = likes.filter(l => l.like_type === "want_to_visit").length;
  const recentLikes      = likes.slice(0, 8);

  const displayName  = profile?.display_name ?? user.email?.split("@")[0] ?? "ゲスト";
  const memberSince  = new Date(user.created_at).toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
  const initials     = displayName.slice(0, 2).toUpperCase();
  const linkedGoogle = user.identities?.some((i) => i.provider === "google") ?? false;

  return (
    <div className="bg-[var(--background)] pb-16">

      {/* ── Profile Hero ───────────────────────────────────── */}
      <section className="border-b border-[var(--border)] bg-white/80">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-7 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-10">
          {/* 上段: アバター + 名前 + メールアドレス */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* アバター：72〜96px固定枠 */}
            <div className="relative shrink-0">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={displayName}
                  className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-md sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-200 bg-gradient-to-br from-[var(--primary)] to-blue-400 text-2xl font-black text-white shadow-md sm:h-24 sm:w-24">
                  {initials}
                </div>
              )}
              <span className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-400 sm:h-6 sm:w-6">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[1.375rem] font-bold leading-[1.2] text-slate-900 sm:text-2xl">
                {displayName}
              </h1>
              <p className="mt-0.5 truncate text-sm text-slate-500">{user.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-xs text-slate-400">{memberSince} から利用中</p>
                {linkedGoogle && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    <GoogleGlyph /> Google 連携済み
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 下段: 統計ストリップ */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4">
            <StatPill icon={Heart} iconClass="text-rose-500" label="いいね" value={likeCount} href={`${routes.account}/likes?type=like`} />
            <StatPill icon={Bookmark} iconClass="text-blue-500" label="ブックマーク" value={bookmarkCount} href={`${routes.account}/likes?type=bookmark`} />
            <StatPill icon={MapPin} iconClass="text-amber-500" label="行きたい" value={wantToVisitCount} href={`${routes.account}/likes?type=want_to_visit`} />
            <StatPill icon={Star} iconClass="text-yellow-500" label="ポイント" value={points?.balance ?? 0} />
          </div>
        </div>
      </section>

      {/* ── ダッシュボード グリッド ──────────────────────────── */}
      <div className="mx-auto w-[min(1360px,calc(100%-40px))] max-sm:w-[min(1360px,calc(100%-24px))]">
        {/*
          モバイル: 1カラム
          md:     2カラム
          lg:     3カラム
          Activity は md:col-span-2 / lg:col-span-2 でワイドに
        */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* ── 最近のアクティビティ ─────────────────── */}
          <DashboardCard
            title="最近のアクティビティ"
            badge={likes.length > 0 ? likes.length : undefined}
            action={likes.length > 0 ? { label: "すべて見る", href: `${routes.account}/likes` } : undefined}
            className="md:col-span-2"
          >
            {recentLikes.length === 0 ? (
              <DashboardCardEmpty
                message="まだアクティビティはありません。気になるカフェや記事をいいねしてみましょう。"
                cta={{ label: "カフェを探す", href: routes.cafe }}
              />
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {recentLikes.map((like, i) => {
                  const LikeIcon = LIKE_TYPE_LABELS[like.like_type]?.icon ?? Heart;
                  const likeColor = LIKE_TYPE_LABELS[like.like_type]?.color ?? "text-slate-400";
                  const likeLabel = LIKE_TYPE_LABELS[like.like_type]?.label ?? like.like_type;
                  const contentLabel = CONTENT_TYPE_LABELS[like.content_type] ?? like.content_type;
                  return (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-2.5">
                      <LikeIcon className={`h-4 w-4 shrink-0 ${likeColor}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{like.content_id}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{contentLabel} · {likeLabel}</p>
                      </div>
                      <span className="shrink-0 text-[11px] tabular-nums text-slate-400">
                        {new Date(like.created_at).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </DashboardCard>

          {/* ── ポイント ────────────────────────────── */}
          <DashboardCard title="ポイント">
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <span className="text-[2rem] font-black tabular-nums leading-none text-slate-900">
                  {(points?.balance ?? 0).toLocaleString("ja-JP")}
                </span>
                <span className="mb-0.5 text-sm font-semibold text-slate-500">pt</span>
              </div>
              {points?.lifetime !== undefined && points.lifetime > 0 && (
                <p className="text-xs text-slate-400">累計獲得 {points.lifetime.toLocaleString("ja-JP")} pt</p>
              )}
              <div className="rounded-lg bg-[var(--muted)] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">ポイントの貯め方</p>
                <ul className="mt-2 space-y-1.5">
                  {[
                    { icon: "🔐", text: "毎日ログイン" },
                    { icon: "❤️", text: "コンテンツにいいね" },
                    { icon: "⭐", text: "レビューを書く" },
                    { icon: "🎯", text: "診断を完了" },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-center gap-2 text-xs text-slate-600">
                      <span>{icon}</span>{text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DashboardCard>

          {/* ── 今日の占い ──────────────────────────── */}
          <DashboardCard title="今日の占い">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 py-6">
                <div className="text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-violet-400" />
                  <p className="mt-2 text-sm font-semibold text-violet-700">7つの運勢を毎日チェック</p>
                  <p className="mt-1 text-xs text-violet-500">総合運・恋愛運・金運ほか</p>
                </div>
              </div>
              <Link
                href={routes.fortune}
                className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-violet-200 bg-white text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                今日の運勢を占う <ArrowRight className="h-4 w-4" />
              </Link>
              <FortuneAnimToggle />
            </div>
          </DashboardCard>

          {/* ── 通知 ────────────────────────────────── */}
          <DashboardCard
            title="お知らせ"
            badge={notifications.length > 0 ? notifications.length : undefined}
          >
            {notifications.length === 0 ? (
              <DashboardCardEmpty message="新しいお知らせはありません" />
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    {n.action_url ? (
                      <Link
                        href={n.action_url}
                        className="flex items-start gap-2.5 rounded-lg p-2 transition hover:bg-[var(--muted)]"
                      >
                        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{n.body}</p>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-start gap-2.5 rounded-lg p-2">
                        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{n.body}</p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>

          {/* ── 診断・クイズ履歴 ─────────────────────── */}
          <DashboardCard title="診断・クイズ">
            {quizResults.length === 0 ? (
              <DashboardCardEmpty message="まだ診断を受けていません。" />
            ) : (
              <ul className="space-y-2">
                {quizResults.map((q) => (
                  <li key={q.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-2.5">
                    <ClipboardList className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {QUIZ_TYPE_LABELS[q.quiz_type] ?? q.quiz_type}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Date(q.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>

          {/* ── クイックアクセス ─────────────────────── */}
          <DashboardCard title="カテゴリから探す">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Coffee,  label: "カフェ",     href: routes.cafe },
                { icon: Trophy,  label: "ランキング",  href: routes.ramen },
                { icon: MapPin,  label: "レジャー",    href: routes.leisure },
                { icon: Star,    label: "美容サロン",  href: routes.beauty },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 py-3 text-center transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
                >
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-slate-700">{label}</span>
                </Link>
              ))}
            </div>
          </DashboardCard>

        </div>
      </div>
    </div>
  );
}

// ── 統計ピル (再利用コンポーネント) ───────────────────────
function StatPill({
  icon: Icon,
  iconClass,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  iconClass: string;
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
      <div className="min-w-0">
        <p className="text-[1.125rem] font-black tabular-nums leading-none text-slate-900">
          {value.toLocaleString("ja-JP")}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</p>
      </div>
    </>
  );
  const base = "flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white px-3 py-2.5";
  return href ? (
    <Link href={href} className={`${base} transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5`}>
      {content}
    </Link>
  ) : (
    <div className={base}>{content}</div>
  );
}

function GoogleGlyph() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
