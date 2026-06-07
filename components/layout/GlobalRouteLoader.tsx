"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";

const MIN_VISIBLE_MS = 520;
const MAX_VISIBLE_MS = 2200;

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function shouldHandleLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  const url = new URL(anchor.href);
  if (url.origin !== window.location.origin) return false;
  const current = window.location.pathname + window.location.search;
  const next = url.pathname + url.search;
  return current !== next;
}

export function GlobalRouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const startedAtRef = useRef(0);
  const maxTimerRef = useRef<number | null>(null);

  const start = () => {
    startedAtRef.current = Date.now();
    setVisible(true);
    if (maxTimerRef.current) window.clearTimeout(maxTimerRef.current);
    maxTimerRef.current = window.setTimeout(() => setVisible(false), MAX_VISIBLE_MS);
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedEvent(event)) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor || !shouldHandleLink(anchor)) return;
      start();
    };
    const onPopState = () => start();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      if (maxTimerRef.current) window.clearTimeout(maxTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const elapsed = Date.now() - startedAtRef.current;
    const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [pathname, visible]);

  if (!visible) return null;
  return <LoadingScreen fullScreen compact label="ページを切り替えています" />;
}
