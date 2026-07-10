"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * 記事本文中の画像をタップ/クリックで全画面拡大表示するラッパー。
 * `children` はサムネイル表示用の既存の画像要素（<Image>/<img>）をそのまま渡す。
 * 拡大表示は host 制限を受けない生の <img> で描画するため、公式サイト画像など
 * next/image の remotePatterns に無いホストでも安全に表示できる。
 */
export function ImageLightbox({
  src,
  alt,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt || "画像"}を拡大表示`}
        className={`block w-full cursor-zoom-in text-left ${className}`}
      >
        {children}
      </button>

      {open && mounted &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={alt || "画像を拡大表示"}>
            <button
              type="button"
              aria-label="閉じる"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-zoom-out bg-slate-950/85 backdrop-blur-sm"
            />
            <div className="relative max-h-full max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl" />
              <button
                type="button"
                aria-label="閉じる"
                onClick={() => setOpen(false)}
                className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
