"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { cn } from "@/lib/utils";

const MIN_MS = 350;

export function GlobalRouteLoader() {
  const [visible, setVisible] = useState(false);
  const state = useRef({ active: false, startedAt: 0, hideTimer: 0 });

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

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const routeState = state.current;

    const syncWithRouteBoundary = () => {
      const routeIsLoading = Boolean(main.querySelector(".each-spirit-loader"));

      if (routeIsLoading) {
        window.clearTimeout(routeState.hideTimer);
        if (!routeState.active) {
          routeState.active = true;
          routeState.startedAt = Date.now();
          setVisible(true);
        }
        return;
      }

      if (!routeState.active) return;
      const delay = Math.max(0, MIN_MS - (Date.now() - routeState.startedAt));
      window.clearTimeout(routeState.hideTimer);
      routeState.hideTimer = window.setTimeout(() => {
        routeState.active = false;
        setVisible(false);
      }, delay);
    };

    const observer = new MutationObserver(syncWithRouteBoundary);
    observer.observe(main, { childList: true, subtree: true });
    syncWithRouteBoundary();

    return () => {
      observer.disconnect();
      window.clearTimeout(routeState.hideTimer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-label="ページを切り替えています"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-90 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-xs transition-opacity duration-200",
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
