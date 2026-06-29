"use client";

type AnalyticsValue = string | number | boolean | null | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, AnalyticsValue> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
  window.gtag("event", eventName, cleanParams);
}
