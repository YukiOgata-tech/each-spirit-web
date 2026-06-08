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

  const nav = useRef({ active: false, startedAt: 0, maxTimer: 0, minTimer: 0 });
  const observerRef = useRef<MutationObserver | null>(null);

  // Shared teardown — clears all timers and any pending observer
  const teardown = useRef(() => {
    const n = nav.current;
    window.clearTimeout(n.maxTimer);
    window.clearTimeout(n.minTimer);
    observerRef.current?.disconnect();
    observerRef.current = null;
  });

  // Schedule final hide with minimum display guarantee
  const scheduleHide = useRef(() => {
    const n = nav.current;
    const delay = Math.max(0, MIN_MS - (Date.now() - n.startedAt));
    window.clearTimeout(n.minTimer);
    n.minTimer = window.setTimeout(() => {
      n.active = false;
      setVisible(false);
    }, delay);
  });

  // Show loader and arm the safety max timer
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

  // Called when pathname changes.
  // At this point Next.js has committed the new page shell:
  //   - If a loading.tsx fallback is in <main>, wait for it to be replaced.
  //   - Otherwise the full page is already in the DOM; hide after MIN_MS.
  const onPathnameChange = useRef(() => {
    const n = nav.current;
    if (!n.active) return;

    // Clear any previous observer (rapid navigation guard)
    observerRef.current?.disconnect();
    observerRef.current = null;

    const main = document.querySelector("main");
    if (!main || !main.querySelector(".each-spirit-loader")) {
      // No page-level loading fallback — page is fully rendered
      scheduleHide.current();
      return;
    }

    // loading.tsx is showing; watch for it to leave the DOM
    const observer = new MutationObserver(() => {
      if (main.querySelector(".each-spirit-loader")) return; // still loading
      observer.disconnect();
      observerRef.current = null;
      scheduleHide.current();
    });
    observerRef.current = observer;
    observer.observe(main, { childList: true, subtree: true });
  });

  // Register click and popstate listeners once
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

  // pathname changes when Next.js commits the new route's layout/shell
  useEffect(() => {
    onPathnameChange.current();
  }, [pathname]);

  if (!visible) return null;
  return <LoadingScreen fullScreen compact label="ページを切り替えています" />;
}
