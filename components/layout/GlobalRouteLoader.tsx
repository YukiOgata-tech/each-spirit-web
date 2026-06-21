"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { cn } from "@/lib/utils";

const MIN_MS = 350;
const MAX_MS = 5000;

function isModifiedEvent(e: MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

function shouldHandleLink(a: HTMLAnchorElement) {
  if (a.target && a.target !== "_self") return false;
  if (a.hasAttribute("download")) return false;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(a.href);
    if (url.origin !== window.location.origin) return false;
    return url.pathname + url.search !== window.location.pathname + window.location.search;
  } catch {
    return false;
  }
}

export function GlobalRouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const nav = useRef({ active: false, startedAt: 0, maxTimer: 0, minTimer: 0 });
  const observerRef = useRef<MutationObserver | null>(null);

  // lottie-web（JSON・wasm 不要）。マウント時に一度フェッチして「ウォーム」し、表示時は即 play。
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/lottie/es-loading.json")
      .then((res) => res.json())
      .then((data) => { if (alive) setAnimationData(data); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // 表示状態に合わせて再生/停止（非表示中は停止して CPU を使わない）
  useEffect(() => {
    const l = lottieRef.current;
    if (!l) return;
    if (visible) l.play();
    else l.pause();
  }, [visible, animationData]);

  const teardown = useRef(() => {
    const n = nav.current;
    window.clearTimeout(n.maxTimer);
    window.clearTimeout(n.minTimer);
    observerRef.current?.disconnect();
    observerRef.current = null;
  });

  const scheduleHide = useRef(() => {
    const n = nav.current;
    const delay = Math.max(0, MIN_MS - (Date.now() - n.startedAt));
    window.clearTimeout(n.minTimer);
    n.minTimer = window.setTimeout(() => {
      n.active = false;
      setVisible(false);
    }, delay);
  });

  const start = useRef(() => {
    const n = nav.current;
    teardown.current();
    n.active = true;
    n.startedAt = Date.now();
    n.maxTimer = window.setTimeout(() => {
      n.active = false;
      setVisible(false);
    }, MAX_MS);
    setVisible(true);
  });

  const onPathnameChange = useRef(() => {
    const n = nav.current;
    if (!n.active) return;
    observerRef.current?.disconnect();
    observerRef.current = null;

    const main = document.querySelector("main");
    if (!main || !main.querySelector(".each-spirit-loader")) {
      scheduleHide.current();
      return;
    }
    const observer = new MutationObserver(() => {
      if (main.querySelector(".each-spirit-loader")) return;
      observer.disconnect();
      observerRef.current = null;
      scheduleHide.current();
    });
    observerRef.current = observer;
    observer.observe(main, { childList: true, subtree: true });
  });

  useEffect(() => {
    const n = nav.current;
    const obs = observerRef;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || isModifiedEvent(e)) return;
      const anchor = (e.target as Element)?.closest("a");
      if (anchor && shouldHandleLink(anchor)) start.current();
    };
    const onPop = () => start.current();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(n.maxTimer);
      window.clearTimeout(n.minTimer);
      obs.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    onPathnameChange.current();
  }, [pathname]);

  return (
    <div
      role="status"
      aria-label="ページを切り替えています"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-[90] flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm transition-opacity duration-200",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="h-44 w-44 sm:h-52 sm:w-52" aria-hidden="true">
        {animationData && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop
            autoplay={false}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
      <p className="text-sm font-semibold text-slate-700">ページを切り替えています</p>
    </div>
  );
}
