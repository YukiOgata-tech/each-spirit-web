"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight, Fingerprint, Info, LogIn, LogOut, Mail, Menu, Newspaper, ScrollText, UserCircle, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchForm } from "@/components/search/SearchForm";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

// メニュー下部の基本ページ導線
const BASIC_PAGES: { href: string; label: string; icon: typeof Newspaper }[] = [
  { href: routes.articles, label: "記事一覧", icon: Newspaper },
  { href: routes.contact, label: "お問い合わせ", icon: Mail },
  { href: routes.about, label: "このサイトについて", icon: Info },
  { href: routes.privacy, label: "プライバシーポリシー", icon: ScrollText },
  { href: routes.disclaimer, label: "免責事項", icon: ScrollText },
];

export function MobileHeaderMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 認証状態をクライアントで判定（AuthButtonClient と同方針。ISR を壊さない）
  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) setUser(data.user); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const closeMenu = () => setOpen(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    closeMenu();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 gap-2 rounded-md px-3"
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="text-sm font-bold">メニュー</span>
      </Button>

      <AnimatePresence>
        {open ? (
          <>
          {/* 背景オーバーレイ: メニュー外タップで閉じる（裏の導線への誤タップを防ぐ） */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={closeMenu}
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/20 sm:top-16"
          />
          <motion.div
            key="panel"
            id="mobile-site-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-56px)] overflow-y-auto border-t border-slate-200 bg-white shadow-2xl sm:top-16 sm:max-h-[calc(100dvh-64px)]"
          >
            <div className="mx-auto w-[calc(100%-32px)] max-w-2xl py-4">
              {/* 検索 */}
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <SearchForm size="compact" placeholder="記事・ジャンル・地域を検索" />
                <Link
                  href={routes.search}
                  onClick={closeMenu}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)]"
                >
                  詳細検索へ
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* アカウント */}
              <section className="mt-4" aria-label="アカウント">
                {user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={routes.account}
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-4 py-3 text-sm font-bold text-slate-950 transition hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10"
                    >
                      <UserCircle className="h-5 w-5 text-[var(--primary)]" />
                      マイページ
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(true)}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4" />
                      ログアウト
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`${routes.authLogin}?next=${routes.account}`}
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      <LogIn className="h-4 w-4" />
                      ログイン
                    </Link>
                    <Link
                      href={routes.authSignup}
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      新規登録
                    </Link>
                  </div>
                )}
              </section>

              {/* デイリー占い */}
              <Link
                href={routes.mystery}
                onClick={closeMenu}
                className="mt-4 flex min-h-14 items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-stone-100 shadow-lg"
              >
                <span className="flex items-center gap-3">
                  <Fingerprint className="h-5 w-5 text-red-500" />
                  <span>
                    <span className="block text-sm font-black">謎解き局</span>
                    <span className="block text-xs font-semibold text-stone-400">公開中の暗号に挑む</span>
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0" />
              </Link>

              <Link
                href={routes.fortune}
                onClick={closeMenu}
                className="mt-4 flex min-h-14 items-center justify-between gap-3 rounded-lg bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 px-4 py-3 text-white shadow-lg shadow-violet-500/25"
              >
                <span>
                  <span className="block text-sm font-black">デイリー占い</span>
                  <span className="block text-xs font-semibold text-white/85">今日の運勢をチェック</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0" />
              </Link>

              {/* 基本ページ */}
              <section className="mt-5" aria-label="メニュー">
                <h2 className="text-sm font-bold text-slate-950">メニュー</h2>
                <div className="mt-2 grid gap-1">
                  {BASIC_PAGES.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenu}
                      className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 py-2 transition hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                        <Icon className="h-4 w-4 text-slate-400" />
                        {label}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title="ログアウトしますか？"
        description="再度ご利用にはログインが必要です。"
        confirmLabel="ログアウト"
        cancelLabel="キャンセル"
        tone="danger"
        onConfirm={() => { setConfirmOpen(false); handleSignOut(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
