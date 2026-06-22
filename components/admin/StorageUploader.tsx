"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Copy, ImagePlus, Search, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeHeicIfNeeded, isHeic, mimeForPath, optimizeImage } from "@/lib/image-client";

export type UploadArticle = {
  slug: string;
  title: string;
  category: string;
  status: string;
  references: { bucket: string; path: string }[];
};

type Props = {
  articles: UploadArticle[];
  publicPrefix: string; // 例: https://xxx.supabase.co/storage/v1/object/public/
};

const BUCKETS = ["each-spirit-images", "article-assets"] as const;

const inputClass =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15";

// 表示用にパスを正規化（サーバ側 normalizePath と同等。連続スラッシュ圧縮・前後トリム）
function normalizePath(input: string) {
  return input.trim().replace(/\\/g, "/").replace(/\/{2,}/g, "/").replace(/^\/+|\/+$/g, "");
}

function extLabel(path: string) {
  const mime = mimeForPath(path);
  if (mime === "image/webp") return "webp";
  if (mime === "image/png") return "png";
  if (mime === "image/gif") return "gif（変換なし）";
  return "jpg";
}

/** 公開URLを画像として読み込み、存在するか判定するバッジ（CORS回避のため <img> で確認） */
function ExistenceBadge({ url, refreshKey }: { url: string; refreshKey: number }) {
  const [state, setState] = useState<"loading" | "exists" | "missing">("loading");
  useEffect(() => {
    setState("loading");
    const img = new Image();
    img.onload = () => setState("exists");
    img.onerror = () => setState("missing");
    img.src = `${url}?v=${refreshKey}`;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url, refreshKey]);

  if (state === "loading") return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">確認中…</span>;
  if (state === "exists") return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">アップ済み</span>;
  return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">未アップロード</span>;
}

export function StorageUploader({ articles, publicPrefix }: Props) {
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [bucket, setBucket] = useState<string>(BUCKETS[0]);
  const [path, setPath] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [upsert, setUpsert] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ bucket: string; path: string; publicUrl: string } | null>(null);
  const [copied, setCopied] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => articles.find((a) => a.slug === selectedSlug), [articles, selectedSlug]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles.slice(0, 30);
    return articles
      .filter((a) => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
      .slice(0, 30);
  }, [articles, query]);

  const selectArticle = (slug: string) => {
    setSelectedSlug(slug);
    setBucket(BUCKETS[0]);
    setPath(`articles/${slug}/`);
    setResult(null);
    setError("");
  };

  const applyReference = (refBucket: string, refPath: string) => {
    setBucket(refBucket);
    setPath(refPath);
    setResult(null);
    setError("");
    uploaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onPickFile = async (f: File | null) => {
    setResult(null);
    setError("");
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(""); }
    if (!f) { setFile(null); return; }
    try {
      // HEIC（iPhone）はブラウザで描画できないので、選択時に JPEG へデコードして
      // プレビュー・後段の最適化に使えるようにする。
      let prepared = f;
      if (isHeic(f)) {
        setConverting(true);
        prepared = await decodeHeicIfNeeded(f);
      }
      setFile(prepared);
      setPreviewUrl(URL.createObjectURL(prepared));
    } catch (e) {
      setError(e instanceof Error ? e.message : "HEICの変換に失敗しました");
      setFile(null);
    } finally {
      setConverting(false);
    }
  };

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const normalized = normalizePath(path);
  const finalUrl = normalized ? `${publicPrefix}${bucket}/${normalized}` : "";

  const upload = async () => {
    if (!file) { setError("画像ファイルを選択してください"); return; }
    if (!normalized || !/\.[A-Za-z0-9]+$/.test(normalized)) { setError("拡張子付きのパスを入力してください（例: articles/slug/hero.webp）"); return; }
    setUploading(true);
    setError("");
    try {
      const targetMime = mimeForPath(normalized);
      const optimized = await optimizeImage(file, targetMime);
      const formData = new FormData();
      formData.set("file", optimized);
      formData.set("bucket", bucket);
      formData.set("path", normalized);
      formData.set("upsert", upsert ? "true" : "false");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      // レスポンスが JSON でない場合（プラットフォームのサイズ上限超過など）でも原因を出す
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; bucket?: string; path?: string; publicUrl?: string; message?: string }
        | null;
      if (!res.ok || !data?.ok || !data.publicUrl) {
        const reason =
          data?.message ??
          (res.status === 413
            ? "ファイルが大きすぎます（サーバ受信上限を超過）。圧縮して再度お試しください。"
            : `アップロードに失敗しました（HTTP ${res.status}）`);
        throw new Error(reason);
      }
      setResult({ bucket: data.bucket!, path: data.path!, publicUrl: data.publicUrl });
      setRefreshKey((k) => k + 1);
      void onPickFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      /* noop */
    }
  };

  const mdImage = result ? `![画像の説明](${result.publicUrl})` : "";
  const mdDirective = result
    ? `:::official-image\nsrc: ${result.publicUrl}\nalt: 画像の説明\ncaption: キャプション\nsource: Each Spirit\nsourceUrl: ${result.publicUrl}\n:::`
    : "";

  return (
    <div className="space-y-4">
      {/* 1. 記事選択 */}
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-bold text-slate-900">1. 記事を選ぶ</h2>
        <label className="relative mt-3 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タイトル・slug・カテゴリで検索"
            className={`${inputClass} pl-9`}
          />
        </label>
        <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto">
          {filtered.map((a) => {
            const active = a.slug === selectedSlug;
            const pending = a.references.length;
            return (
              <button
                key={a.slug}
                type="button"
                onClick={() => selectArticle(a.slug)}
                className={
                  active
                    ? "flex w-full items-center justify-between gap-3 rounded-lg border border-orange-400 bg-orange-50 px-3 py-2 text-left"
                    : "flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-orange-300"
                }
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900">{a.title}</span>
                  <span className="block truncate font-mono text-xs text-slate-400">{a.slug}{a.category ? ` · ${a.category}` : ""}</span>
                </span>
                {pending > 0 && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">参照 {pending}</span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && <p className="px-1 py-6 text-center text-sm text-slate-400">該当する記事がありません。</p>}
        </div>
      </section>

      {selected && (
        <>
          {/* 2. 参照画像（アップロード待ち検出） */}
          {selected.references.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-bold text-slate-900">2. この記事が参照している画像</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">本文・カバーに書かれた画像URLです。「未アップロード」のスロットへファイルを置いてください。</p>
              <ul className="mt-3 space-y-2">
                {selected.references.map((ref) => (
                  <li key={`${ref.bucket}/${ref.path}`} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-slate-700">{ref.bucket}/{ref.path}</p>
                    </div>
                    <ExistenceBadge url={`${publicPrefix}${ref.bucket}/${ref.path}`} refreshKey={refreshKey} />
                    <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => applyReference(ref.bucket, ref.path)}>
                      このパスに上げる
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. アップロード */}
          <section ref={uploaderRef} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-sm font-bold text-slate-900">{selected.references.length > 0 ? "3" : "2"}. アップロード</h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr]">
              <label>
                <span className="mb-1.5 block text-xs font-bold text-slate-600">バケット</span>
                <select value={bucket} onChange={(e) => setBucket(e.target.value)} className={inputClass}>
                  {BUCKETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-slate-600">パス（バケット内・拡張子まで）</span>
                <input value={path} onChange={(e) => setPath(e.target.value)} className={`${inputClass} font-mono`} placeholder={`articles/${selected.slug}/hero.webp`} />
              </label>
            </div>

            <div className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs">
              <p className="break-all text-slate-500">公開URL: <span className="font-mono text-slate-700">{finalUrl || "—"}</span></p>
              <p className="mt-1 text-slate-500">最適化形式: <span className="font-semibold text-slate-700">{normalized ? extLabel(normalized) : "—"}</span>（拡張子に合わせて再エンコード・最大幅1600pxに縮小）</p>
            </div>

            {/* ファイル選択 */}
            <div className="mt-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
                className="hidden"
                onChange={(e) => { void onPickFile(e.target.files?.[0] ?? null); }}
              />
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="プレビュー" className="aspect-[16/9] w-full max-w-md rounded-lg border border-slate-200 object-cover" />
              ) : (
                <button
                  type="button"
                  disabled={converting}
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-[16/9] w-full max-w-md flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-orange-400 hover:text-orange-500 disabled:opacity-60"
                >
                  <ImagePlus className="h-7 w-7" />
                  <span className="text-sm font-semibold">{converting ? "HEICを変換中…" : "画像を選択（HEIC可）"}</span>
                </button>
              )}
              {previewUrl && (
                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => fileRef.current?.click()}>別の画像に変更</Button>
              )}
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={upsert} onChange={(e) => setUpsert(e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-orange-500" />
              既存ファイルを上書きする（差し替え。公開キャッシュが残る場合あり）
            </label>

            {error && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700"
              >
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <div className="mt-4">
              <Button type="button" disabled={uploading || converting || !file} onClick={upload} className="bg-orange-500 text-white hover:bg-orange-600">
                <UploadCloud className="h-4 w-4" />
                {uploading ? "アップロード中…" : "このパスにアップロード"}
              </Button>
            </div>

            {/* 結果 */}
            {result && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm font-bold text-emerald-800">アップロード完了</p>
                <CopyRow label="公開URL" value={result.publicUrl} copied={copied === "url"} onCopy={() => copy("url", result.publicUrl)} />
                <CopyRow label="Markdown" value={mdImage} copied={copied === "md"} onCopy={() => copy("md", mdImage)} />
                <CopyRow label="official-image" value={mdDirective} copied={copied === "dir"} onCopy={() => copy("dir", mdDirective)} multiline />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function CopyRow({ label, value, copied, onCopy, multiline }: { label: string; value: string; copied: boolean; onCopy: () => void; multiline?: boolean }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{label}</span>
        <button type="button" onClick={onCopy} className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-1 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "コピー済み" : "コピー"}
        </button>
      </div>
      <pre className={`mt-1 overflow-x-auto rounded bg-white px-2.5 py-2 font-mono text-xs text-slate-700 ${multiline ? "whitespace-pre-wrap" : "whitespace-nowrap"}`}>{value}</pre>
    </div>
  );
}
