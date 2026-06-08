"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";

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

  // Mutable state kept in a ref to avoid stale closures in event listeners
  const nav = useRef({ active: false, startedAt: 0, maxTimer: 0, minTimer: 0 });

  // Stable function refs — safe to call from event listeners set up once
  const start = useRef(() => {
    const n = nav.current;
    window.clearTimeout(n.maxTimer);
    window.clearTimeout(n.minTimer);
    n.active = true;
    n.startedAt = Date.now();
    // Safety valve: dismiss if navigation never resolves
    n.maxTimer = window.setTimeout(() => {
      nav.current.active = false;
      setVisible(false);
    }, MAX_MS);
    setVisible(true);
  });

  // Called when usePathname() reports the new route is committed
  const stop = useRef(() => {
    const n = nav.current;
    if (!n.active) return;
    window.clearTimeout(n.maxTimer);
    n.active = false;
    const delay = Math.max(0, MIN_MS - (Date.now() - n.startedAt));
    n.minTimer = window.setTimeout(() => setVisible(false), delay);
  });

  // Register click and popstate listeners once
  useEffect(() => {
    const n = nav.current; // capture for stable cleanup reference
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
    };
  }, []);

  // pathname changes when Next.js has committed the new page to the DOM
  useEffect(() => {
    stop.current();
  }, [pathname]);

  if (!visible) return null;
  return <LoadingScreen fullScreen compact label="ページを切り替えています" />;
}
