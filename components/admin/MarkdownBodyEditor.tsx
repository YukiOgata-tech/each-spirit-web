"use client";

import { useRef, useState } from "react";
import { ImagePlus, LinkIcon, List, Pilcrow, Quote, Sparkles, Type, Underline } from "lucide-react";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { decodeHeicIfNeeded, optimizeImage } from "@/lib/image-client";

type Props = {
  /** textarea の name（フォーム送信キー。例: body_md） */
  name: string;
  value: string;
  onChange: (next: string) => void;
  /** Storage 保存パスの接頭辞（末尾スラッシュ不要。例: items/${slug}） */
  uploadPathPrefix: string;
  minHeight?: string;
};

/** 記事/item 共通の Markdown 本文エディタ。ツールバー + textarea + ライブプレビュー + 画像アップロード。
 *  記法は MarkdownRenderer に準拠（## 見出し / **太字** / :::note / :::official-image / :::link-cards 等）。 */
export function MarkdownBodyEditor({ name, value, onChange, uploadPathPrefix, minHeight = "min-h-[360px]" }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const apply = (insert: string) => {
    const ta = textareaRef.current;
    const start = ta?.selectionStart ?? value.length;
    const end = ta?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + insert + value.slice(end));
    window.setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + insert.length;
      }
    }, 0);
  };

  const uploadBodyImage = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const decoded = await decodeHeicIfNeeded(file); // iPhone の HEIC を先に JPEG 化
      const optimized = await optimizeImage(decoded, "image/webp"); // 本文画像は常に webp 化
      const fd = new FormData();
      fd.set("file", optimized);
      fd.set("bucket", "each-spirit-images");
      fd.set("path", `${uploadPathPrefix}/${crypto.randomUUID()}.webp`);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; publicUrl?: string; message?: string };
      if (!res.ok || !data.ok || !data.publicUrl) throw new Error(data.message ?? "upload failed");
      apply(`\n\n:::official-image\nsrc: ${data.publicUrl}\nalt: 画像の説明\ncaption: 画像の説明を入力してください。\nsource: Each Spirit\nsourceUrl: ${data.publicUrl}\n:::\n\n`);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "画像アップロードに失敗しました");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 p-2">
        <Tool icon={Type} label="H2" onClick={() => apply("\n\n## 見出し\n\n")} />
        <Tool icon={Pilcrow} label="H3" onClick={() => apply("\n\n### 小見出し\n\n")} />
        <Tool icon={Underline} label="太字" onClick={() => apply("**強調テキスト**")} />
        <Tool icon={List} label="箇条書き" onClick={() => apply("\n- 項目\n- 項目\n")} />
        <Tool icon={Quote} label="注記" onClick={() => apply("\n\n:::note\n補足や注意書きをここに入れます。\n:::\n\n")} />
        <Tool icon={LinkIcon} label="リンク" onClick={() => apply("[リンクテキスト](/path/to/page)")} />
        <Tool icon={Sparkles} label="関連カード" onClick={() => apply("\n\n:::link-cards\n- [関連タイトル](/path) - 説明文\n:::\n\n")} />
        <Tool icon={ImagePlus} label="外部画像" onClick={() => apply("\n\n:::official-image\nsrc: https://example.com/image.webp\nalt: 画像の説明\ncaption: キャプション\nsource: 出典名\nsourceUrl: https://example.com/\n:::\n\n")} />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
          <ImagePlus className="h-4 w-4" />
          {uploading ? "アップロード中" : "画像アップロード"}
        </Button>
        <button type="button" onClick={() => setShowPreview((v) => !v)} className="ml-auto text-xs font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-700">
          {showPreview ? "プレビューを隠す" : "プレビュー表示"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadBodyImage(file);
          }}
        />
        {uploadError && <p className="basis-full text-xs font-semibold text-red-600">{uploadError}</p>}
      </div>
      <div className={showPreview ? "grid lg:grid-cols-2" : ""}>
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${minHeight} w-full resize-y border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-800 outline-none lg:border-r lg:border-slate-200`}
          placeholder={"## 見出し\n\n事実ベースの詳細をここに書きます。"}
        />
        {showPreview && (
          <div className={`${minHeight} overflow-y-auto bg-slate-50 p-4`}>
            <MarkdownRenderer markdown={value || "本文プレビュー"} />
          </div>
        )}
      </div>
    </div>
  );
}

function Tool({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onClick} title={label}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
