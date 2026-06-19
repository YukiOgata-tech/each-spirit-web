"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, LinkIcon, List, Pilcrow, Quote, Send, Sparkles, Type, Underline } from "lucide-react";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { Button } from "@/components/ui/button";

type ArticleEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
};

const initialBody = `## 見出しを入力

本文を書きます。文章内リンクは[表示テキスト](/path/to/page)の形式で挿入できます。

:::note
補足や注意書きをここに入れます。
:::
`;
const inputClass = "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";

async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
}

export function ArticleEditor({ action }: ArticleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState(initialBody);
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const preview = useMemo(() => body || "本文プレビュー", [body]);

  const apply = (value: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? body.length;
    const end = textarea?.selectionEnd ?? body.length;
    const next = body.slice(0, start) + value + body.slice(end);
    setBody(next);

    window.setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + value.length;
      }
    }, 0);
  };

  const uploadAsset = async (file: File) => {
    const optimized = await optimizeImage(file);
    const formData = new FormData();
    formData.set("file", optimized);
    formData.set("slug", slug || "draft");
    const res = await fetch("/api/admin/article-assets", { method: "POST", body: formData });
    const data = (await res.json()) as { ok: boolean; publicUrl?: string; message?: string };
    if (!res.ok || !data.ok || !data.publicUrl) {
      throw new Error(data.message ?? "upload failed");
    }
    return data.publicUrl;
  };

  const uploadBodyImage = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const publicUrl = await uploadAsset(file);
      apply(`\n\n:::official-image\nsrc: ${publicUrl}\nalt: 画像の説明\ncaption: 画像の説明を入力してください。\nsource: Each Spirit\nsourceUrl: ${publicUrl}\n:::\n\n`);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "画像アップロードに失敗しました");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const uploadCoverImage = async (file: File) => {
    setCoverUploading(true);
    setUploadError("");
    try {
      const publicUrl = await uploadAsset(file);
      setCoverImageUrl(publicUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "サムネイルアップロードに失敗しました");
    } finally {
      setCoverUploading(false);
      if (coverFileRef.current) coverFileRef.current.value = "";
    }
  };

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="カテゴリ">
              <input name="category" required defaultValue="dining" list="article-category-options" className={inputClass} placeholder="dining / ramen / beauty / cafe" />
              <datalist id="article-category-options">
                <option value="dining" />
                <option value="ramen" />
                <option value="beauty" />
                <option value="cafe" />
                <option value="travel" />
                <option value="column" />
              </datalist>
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                自由slugも可。ramenは /ramen/articles、beauty/cafeは地域付き、その他は /category/articles に出ます。
              </span>
            </Field>
            <Field label="地域">
              <input name="region" className={inputClass} placeholder="niigata など。自由カテゴリは空でも可" />
            </Field>
            <Field label="slug">
              <input name="slug" required value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} placeholder="shokudo-ajiyoshi-niigata-kobari" />
            </Field>
            <Field label="著者名">
              <input name="author_name" defaultValue="Each Spirit 編集部" className={inputClass} />
            </Field>
          </div>

          <Field label="タイトル" className="mt-4">
            <input name="title" required className={inputClass} placeholder="記事タイトル" />
          </Field>
          <Field label="説明文" className="mt-4">
            <textarea name="description" required rows={3} className={`${inputClass} resize-y`} placeholder="検索結果や記事冒頭に出る説明文" />
          </Field>
          <Field label="サムネイル画像URL" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                name="cover_image_url"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                className={inputClass}
                placeholder="外部画像URLを入力、または右のボタンでアップロード"
              />
              <Button type="button" variant="outline" disabled={coverUploading} onClick={() => coverFileRef.current?.click()}>
                <ImagePlus className="h-4 w-4" />
                {coverUploading ? "アップロード中" : "サムネをアップロード"}
              </Button>
            </div>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadCoverImage(file);
              }}
            />
            <span className="mt-1 block text-[11px] leading-5 text-slate-500">
              アップロード時はSupabase Storageへ最適化保存し、URLを自動入力します。外部URLを使う場合は本文内画像と同様に出典を本文側で明記してください。
            </span>
            {uploadError && <p className="mt-2 text-xs font-semibold text-red-600">{uploadError}</p>}
            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="サムネイルプレビュー" className="mt-3 aspect-[16/9] w-full max-w-md rounded-lg border border-slate-200 object-cover" />
            )}
          </Field>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
            <Tool icon={Type} label="H2" onClick={() => apply("\n\n## 見出し\n\n")} />
            <Tool icon={Pilcrow} label="H3" onClick={() => apply("\n\n### 小見出し\n\n")} />
            <Tool icon={Underline} label="太字" onClick={() => apply("**強調テキスト**")} />
            <Tool icon={List} label="箇条書き" onClick={() => apply("\n- 項目\n- 項目\n")} />
            <Tool icon={Quote} label="引用" onClick={() => apply("\n\n> 引用または要点\n\n")} />
            <Tool icon={LinkIcon} label="リンク" onClick={() => apply("[リンクテキスト](/path/to/page)")} />
            <Tool icon={Sparkles} label="関連カード" onClick={() => apply("\n\n:::link-cards\n- [関連記事タイトル](/category/articles/slug) - 説明文\n:::\n\n")} />
            <Tool icon={ImagePlus} label="外部画像" onClick={() => apply("\n\n:::official-image\nsrc: https://example.com/image.webp\nalt: 画像の説明\ncaption: キャプション\nsource: 出典名\nsourceUrl: https://example.com/\n:::\n\n")} />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4" />
              {uploading ? "アップロード中" : "画像アップロード"}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadBodyImage(file);
              }}
            />
            {uploadError && <p className="basis-full text-xs font-semibold text-red-600">{uploadError}</p>}
          </div>
          <textarea
            ref={textareaRef}
            name="body_md"
            required
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-[680px] w-full resize-y border-0 bg-white p-5 font-mono text-sm leading-7 text-slate-800 outline-none"
          />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="タグ">
              <textarea name="tags" rows={3} className={`${inputClass} resize-y`} placeholder="新潟, 食堂, 定食" />
            </Field>
            <Field label="関連slug">
              <textarea name="related_slugs" rows={3} className={`${inputClass} resize-y`} placeholder="niigata-ramen-first-guide" />
            </Field>
            <Field label="要点まとめ">
              <textarea name="summary" rows={4} className={`${inputClass} resize-y`} placeholder="1行1要点" />
            </Field>
            <Field label="このページで分かること">
              <textarea name="what_you_learn" rows={4} className={`${inputClass} resize-y`} placeholder="1行1項目" />
            </Field>
            <Field label="SEOタイトル">
              <input name="seo_title" className={inputClass} />
            </Field>
            <Field label="SEO説明">
              <input name="seo_description" className={inputClass} />
            </Field>
            <Field label="SEOキーワード" className="sm:col-span-2">
              <input name="seo_keywords" className={inputClass} placeholder="カンマ区切り" />
            </Field>
          </div>
        </section>

        <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
          <Button type="submit" name="status" value="draft" variant="outline">下書き保存</Button>
          <Button type="submit" name="status" value="published">
            <Send className="h-4 w-4" />
            記事を公開
          </Button>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">プレビュー</h2>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">desktop</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <MarkdownRenderer markdown={preview} />
          </div>
        </div>
      </aside>
    </form>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Tool({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onClick} title={label}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
