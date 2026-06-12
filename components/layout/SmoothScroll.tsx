"use client";

import { useEffect } from "react";

/**
 * 全ページ共通の「id移動なめらかスクロール」。
 *
 * Next.js の <Link> はハッシュ遷移時に scroll-behavior を一時的に auto へ強制し
 * 即ジャンプにしてしまうため、同一ページ内アンカーのクリックを capture フェーズで
 * 横取りして scrollIntoView({behavior:"smooth"}) を実行する。
 * ヘッダー分のオフセットは globals.css の `scroll-padding-top` が担当（scrollIntoView も尊重する）。
 */
export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      // 別オリジン・ハッシュ無し・別ページは通常動作に任せる
      if (url.origin !== window.location.origin) return;
      if (!url.hash || url.hash === "#") return;
      if (url.pathname !== window.location.pathname) return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", url.hash);
    }

    // capture フェーズで Next の Link ハンドラより先に横取り
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // 別ページから /path#id で来た初回ロード時もなめらかに合わせる
  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target) return;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  return null;
}
