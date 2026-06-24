"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, LinkIcon, List, Pilcrow, Plus, Quote, Send, Sparkles, Trash2, Type, Underline } from "lucide-react";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { decodeHeicIfNeeded, optimizeImage } from "@/lib/image-client";

type ArticleEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  categoryOptions: CategoryOption[];
  initial?: ArticleInitial;
};

export type ArticleInitial = {
  id: string;
  placement: "major" | "independent";
  majorCategory: string;
  sectionSlug: string;
  articleCategory: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  authorName: string;
  region: string;
  body: string;
  /** カンマ/改行区切りの文字列としてそのまま textarea に流し込む */
  tags: string;
  relatedSlugs: string;
  summary: string;
  whatYouLearn: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  sources: SourceInput[];
  relatedLinks: RelatedLinkInput[];
  faqs: FaqInput[];
};

type CategoryOption = {
  slug: string;
  path: string;
  label: string;
  kind: string;
  available: boolean;
  note: string;
};

type SourceInput = {
  id: string;
  title: string;
  url: string;
  sourceType: string;
  collectedAt: string;
  note: string;
};

type RelatedLinkInput = {
  id: string;
  title: string;
  url: string;
  type: string;
  note: string;
};

type FaqInput = {
  id: string;
  question: string;
  answer: string;
};

const initialBody = `## 見出しを入力

本文を書きます。文章内リンクは[表示テキスト](/path/to/page)の形式で挿入できます。

:::note
補足や注意書きをここに入れます。
:::
`;
const inputClass = "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";
const compactInputClass = "min-h-11 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 sm:text-xs";
const sectionClass = "rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 max-sm:shadow-none";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function id() {
  return Math.random().toString(36).slice(2);
}

export function ArticleEditor({ action, categoryOptions, initial }: ArticleEditorProps) {
  const isEdit = Boolean(initial);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState(initial?.body ?? initialBody);
  const [placement, setPlacement] = useState<"major" | "independent">(initial?.placement ?? "major");
  const [majorCategory, setMajorCategory] = useState(initial?.majorCategory || "food");
  const [sectionSlug, setSectionSlug] = useState(initial?.sectionSlug || "ramen");
  const [articleCategory, setArticleCategory] = useState(initial?.articleCategory || "ramen");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [sources, setSources] = useState<SourceInput[]>(
    initial && initial.sources.length > 0
      ? initial.sources
      : [{ id: id(), title: "", url: "", sourceType: "official", collectedAt: today(), note: "" }],
  );
  const [relatedLinks, setRelatedLinks] = useState<RelatedLinkInput[]>(
    initial && initial.relatedLinks.length > 0
      ? initial.relatedLinks
      : [{ id: id(), title: "", url: "", type: "article", note: "" }],
  );
  const [faqs, setFaqs] = useState<FaqInput[]>(
    initial && initial.faqs.length > 0
      ? initial.faqs
      : [{ id: id(), question: "", answer: "" }],
  );

  const preview = useMemo(() => body || "本文プレビュー", [body]);
  const normalizedCategory = articleCategory.trim().toLowerCase();
  const selectedCategory = categoryOptions.find((option) => option.slug === normalizedCategory);
  const hasInvalidCategoryCharacter = normalizedCategory.includes(".") || sectionSlug.includes(".");
  const suggestedCategories = categoryOptions
    .filter((option) => !normalizedCategory || option.slug.includes(normalizedCategory) || option.label.toLowerCase().includes(normalizedCategory))
    .slice(0, 12);

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
    const decoded = await decodeHeicIfNeeded(file); // iPhone の HEIC を先に JPEG 化
    const optimized = await optimizeImage(decoded, "image/webp"); // 記事エディタは常に webp 化して容量を抑える
    const formData = new FormData();
    formData.set("file", optimized);
    // 新方針: each-spirit-images/articles/{slug}/{uuid}.webp（slug 単位フォルダ）
    formData.set("bucket", "each-spirit-images");
    formData.set("path", `articles/${slug || "draft"}/${crypto.randomUUID()}.webp`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
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
    <form action={action} className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:gap-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="space-y-4 sm:space-y-5">
        <section className={sectionClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="配置">
              <select name="placement" value={placement} onChange={(event) => setPlacement(event.target.value as "major" | "independent")} className={inputClass}>
                <option value="major">大カテゴリ配下に作成</option>
                <option value="independent">独立記事として作成</option>
              </select>
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                URLはどちらも /articles/[記事カテゴリ]/[slug] です。大カテゴリ配下はカテゴリ/店舗ページとの紐づけにも使います。
              </span>
            </Field>
            <Field label="大カテゴリ">
              <select
                name="major_category"
                required={placement === "major"}
                value={majorCategory}
                onChange={(event) => setMajorCategory(event.target.value)}
                disabled={placement === "independent"}
                className={inputClass}
              >
                <option value="food">グルメ / food</option>
                <option value="health">健康 / health</option>
                <option value="beauty">美容 / beauty</option>
                <option value="travel">旅行 / travel</option>
                <option value="leisure">レジャー / leisure</option>
                <option value="entertainment">エンタメ / entertainment</option>
              </select>
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">記事URLには使いません。記事を紐づける大カテゴリです（独立記事では無効）。</span>
            </Field>
            <Field label="地域">
              <input name="region" defaultValue={initial?.region ?? ""} className={inputClass} placeholder="niigata など。必要な場合だけ入力" />
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">記事URLには使いません。関連記事・関連店舗の文脈付けに使います。</span>
            </Field>
            <Field label="小ジャンル">
              <input
                name="section_slug"
                value={sectionSlug}
                onChange={(event) => {
                  const nextSectionSlug = event.target.value;
                  setSectionSlug(event.target.value);
                  setArticleCategory((current) => current === sectionSlug || !current ? nextSectionSlug : current);
                }}
                disabled={placement === "independent"}
                className={inputClass}
                placeholder="ramen / cafe / protein / hair-salon"
              />
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">カテゴリ配下の細分化に使います。独立記事では保存されません。</span>
            </Field>
            <Field label="記事カテゴリslug（公開URLの分類）">
              <input
                name="article_category"
                required
                value={articleCategory}
                onChange={(event) => setArticleCategory(event.target.value)}
                className={inputClass}
                placeholder="dining / ramen / cafe / travel-tips"
              />
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">公開URLは <span className="font-mono">/articles/{normalizedCategory || "[category]"}/{slug || "[slug]"}</span> になります。同じテーマは既存カテゴリ名を再利用してください。</span>
              <CategorySlugStatus category={normalizedCategory} selected={selectedCategory} />
            </Field>
            <Field label="slug">
              <input name="slug" required value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} placeholder="shokudo-ajiyoshi-niigata-kobari" />
            </Field>
            <Field label="著者名">
              <input name="author_name" defaultValue={initial?.authorName || "Each Spirit 編集部"} className={inputClass} />
            </Field>
          </div>

          <Field label="タイトル" className="mt-4">
            <input name="title" required defaultValue={initial?.title ?? ""} className={inputClass} placeholder="記事タイトル" />
          </Field>
          <Field label="説明文" className="mt-4">
            <textarea name="description" required defaultValue={initial?.description ?? ""} rows={3} className={`${inputClass} resize-y`} placeholder="検索結果や記事冒頭に出る説明文" />
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
              <Button type="button" variant="outline" disabled={coverUploading} className="max-sm:w-full" onClick={() => coverFileRef.current?.click()}>
                <ImagePlus className="h-4 w-4" />
                {coverUploading ? "アップロード中" : "サムネをアップロード"}
              </Button>
            </div>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
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

        <section className={sectionClass}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">既存の記事カテゴリ（再利用候補）</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                公開中の記事カテゴリ一覧です。表記揺れを防ぐため、同テーマは既存カテゴリ名の再利用を推奨します。入力と連動して絞り込みます。
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{suggestedCategories.length}件表示</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500">slug</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500">path</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500">区分</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-500">状態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {suggestedCategories.length > 0 ? suggestedCategories.map((option) => {
                  const active = option.slug === normalizedCategory;
                  return (
                    <tr key={option.slug + option.kind} className={active ? "bg-[var(--primary)]/5" : undefined}>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-semibold text-slate-900">{option.slug}</td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-600">{option.path}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">{option.kind}</td>
                      <td className="px-3 py-2 text-xs">
                        <span className={option.available ? "font-semibold text-emerald-700" : "font-semibold text-red-600"}>
                          {option.available ? "使用可" : "使用不可"}
                        </span>
                        <span className="ml-2 text-slate-500">{option.note}</span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-xs leading-5 text-slate-500">
                      {hasInvalidCategoryCharacter
                        ? "カテゴリslugにドットは使えません。ハイフン区切りのslugにしてください。"
                        : <>一致する既存カテゴリはありません。新規カテゴリとして追加され、公開URLは /articles/{normalizedCategory || "[category]"}/[slug] になります。</>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm max-sm:shadow-none">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
            <Tool icon={Type} label="H2" onClick={() => apply("\n\n## 見出し\n\n")} />
            <Tool icon={Pilcrow} label="H3" onClick={() => apply("\n\n### 小見出し\n\n")} />
            <Tool icon={Underline} label="太字" onClick={() => apply("**強調テキスト**")} />
            <Tool icon={List} label="箇条書き" onClick={() => apply("\n- 項目\n- 項目\n")} />
            <Tool icon={Quote} label="引用" onClick={() => apply("\n\n> 引用または要点\n\n")} />
            <Tool icon={LinkIcon} label="リンク" onClick={() => apply("[リンクテキスト](/path/to/page)")} />
            <Tool icon={Sparkles} label="関連カード" onClick={() => apply("\n\n:::link-cards\n- [関連記事タイトル](/articles/ramen/example-slug) - 説明文\n:::\n\n")} />
            <Tool icon={ImagePlus} label="外部画像" onClick={() => apply("\n\n:::official-image\nsrc: https://example.com/image.webp\nalt: 画像の説明\ncaption: キャプション\nsource: 出典名\nsourceUrl: https://example.com/\n:::\n\n")} />
            <Button type="button" variant="outline" size="sm" disabled={uploading} className="max-sm:w-full" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4" />
              {uploading ? "アップロード中" : "画像アップロード"}
            </Button>
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
          <textarea
            ref={textareaRef}
            name="body_md"
            required
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-[460px] w-full resize-y border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-800 outline-none sm:min-h-[680px] sm:p-5"
          />
        </section>

        <section className={sectionClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">公式情報・参照ソース</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">記事の根拠にした公式ページ、地図、SNS、自治体情報などを登録します。記事下部の参照ソース一覧に表示されます。</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSources((current) => [...current, { id: id(), title: "", url: "", sourceType: "official", collectedAt: today(), note: "" }])}
            >
              <Plus className="h-4 w-4" />
              ソース追加
            </Button>
          </div>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={source.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-2 sm:grid-cols-[1.1fr_1.5fr_0.8fr_0.8fr_auto]">
                  <input
                    name="source_title"
                    value={source.title}
                    onChange={(event) => setSources((current) => current.map((item) => item.id === source.id ? { ...item, title: event.target.value } : item))}
                    className={compactInputClass}
                    placeholder="公式サイト / Google Map"
                    aria-label={`参照ソース${index + 1}の名称`}
                  />
                  <input
                    name="source_url"
                    value={source.url}
                    onChange={(event) => setSources((current) => current.map((item) => item.id === source.id ? { ...item, url: event.target.value } : item))}
                    className={compactInputClass}
                    placeholder="https://..."
                    aria-label={`参照ソース${index + 1}のURL`}
                  />
                  <select
                    name="source_type"
                    value={source.sourceType}
                    onChange={(event) => setSources((current) => current.map((item) => item.id === source.id ? { ...item, sourceType: event.target.value } : item))}
                    className={compactInputClass}
                    aria-label={`参照ソース${index + 1}の種別`}
                  >
                    <option value="official">公式</option>
                    <option value="map">地図</option>
                    <option value="sns">SNS</option>
                    <option value="government">自治体</option>
                    <option value="tourism">観光</option>
                    <option value="local-media">地域メディア</option>
                    <option value="editorial">編集部</option>
                    <option value="other">その他</option>
                  </select>
                  <input
                    name="source_collected_at"
                    type="date"
                    value={source.collectedAt}
                    onChange={(event) => setSources((current) => current.map((item) => item.id === source.id ? { ...item, collectedAt: event.target.value } : item))}
                    className={compactInputClass}
                    aria-label={`参照ソース${index + 1}の確認日`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSources((current) => current.length === 1 ? current.map((item) => item.id === source.id ? { ...item, title: "", url: "", note: "" } : item) : current.filter((item) => item.id !== source.id))}
                    title="ソース削除"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">ソース削除</span>
                  </Button>
                </div>
                <input
                  name="source_note"
                  value={source.note}
                  onChange={(event) => setSources((current) => current.map((item) => item.id === source.id ? { ...item, note: event.target.value } : item))}
                  className={`${compactInputClass} mt-2`}
                  placeholder="営業時間・メニュー・住所確認など"
                  aria-label={`参照ソース${index + 1}のメモ`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">関連記事・関連店舗リンク</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">記事下部にカード表示する内部導線です。関連店舗は `/food/ramen/shops/slug` などのURLを入力します。</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRelatedLinks((current) => [...current, { id: id(), title: "", url: "", type: "article", note: "" }])}
            >
              <Plus className="h-4 w-4" />
              リンク追加
            </Button>
          </div>
          <div className="space-y-3">
            {relatedLinks.map((link, index) => (
              <div key={link.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-2 sm:grid-cols-[1.1fr_1.5fr_0.8fr_auto]">
                  <input
                    name="related_link_title"
                    value={link.title}
                    onChange={(event) => setRelatedLinks((current) => current.map((item) => item.id === link.id ? { ...item, title: event.target.value } : item))}
                    className={compactInputClass}
                    placeholder="表示タイトル"
                    aria-label={`関連リンク${index + 1}のタイトル`}
                  />
                  <input
                    name="related_link_url"
                    value={link.url}
                    onChange={(event) => setRelatedLinks((current) => current.map((item) => item.id === link.id ? { ...item, url: event.target.value } : item))}
                    className={compactInputClass}
                    placeholder="/food/ramen/shops/example または https://..."
                    aria-label={`関連リンク${index + 1}のURL`}
                  />
                  <select
                    name="related_link_type"
                    value={link.type}
                    onChange={(event) => setRelatedLinks((current) => current.map((item) => item.id === link.id ? { ...item, type: event.target.value } : item))}
                    className={compactInputClass}
                    aria-label={`関連リンク${index + 1}の種別`}
                  >
                    <option value="article">記事</option>
                    <option value="item">店舗/商品</option>
                    <option value="ranking">ランキング</option>
                    <option value="category">カテゴリ</option>
                    <option value="external">外部</option>
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRelatedLinks((current) => current.length === 1 ? current.map((item) => item.id === link.id ? { ...item, title: "", url: "", note: "" } : item) : current.filter((item) => item.id !== link.id))}
                    title="関連リンク削除"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">関連リンク削除</span>
                  </Button>
                </div>
                <input
                  name="related_link_note"
                  value={link.note}
                  onChange={(event) => setRelatedLinks((current) => current.map((item) => item.id === link.id ? { ...item, note: event.target.value } : item))}
                  className={`${compactInputClass} mt-2`}
                  placeholder="このリンクを見る理由・補足"
                  aria-label={`関連リンク${index + 1}の補足`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">FAQ</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">記事下部のFAQとして表示し、FAQPageのJSON-LDにも反映します。検索意図に近い質問を入れてください。</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFaqs((current) => [...current, { id: id(), question: "", answer: "" }])}
            >
              <Plus className="h-4 w-4" />
              FAQ追加
            </Button>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    name="faq_question"
                    value={faq.question}
                    onChange={(event) => setFaqs((current) => current.map((item) => item.id === faq.id ? { ...item, question: event.target.value } : item))}
                    className={compactInputClass}
                    placeholder="例: 駐車場はありますか？"
                    aria-label={`FAQ${index + 1}の質問`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFaqs((current) => current.length === 1 ? current.map((item) => item.id === faq.id ? { ...item, question: "", answer: "" } : item) : current.filter((item) => item.id !== faq.id))}
                    title="FAQ削除"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">FAQ削除</span>
                  </Button>
                </div>
                <textarea
                  name="faq_answer"
                  value={faq.answer}
                  onChange={(event) => setFaqs((current) => current.map((item) => item.id === faq.id ? { ...item, answer: event.target.value } : item))}
                  rows={3}
                  className={`${compactInputClass} mt-2 resize-y leading-6`}
                  placeholder="回答を入力します。必要に応じて確認時点や公式情報への誘導も含めます。"
                  aria-label={`FAQ${index + 1}の回答`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="タグ">
              <textarea name="tags" defaultValue={initial?.tags ?? ""} rows={3} className={`${inputClass} resize-y`} placeholder="新潟, 食堂, 定食" />
            </Field>
            <Field label="関連slug（旧形式）">
              <textarea name="related_slugs" defaultValue={initial?.relatedSlugs ?? ""} rows={3} className={`${inputClass} resize-y`} placeholder="niigata-ramen-first-guide" />
            </Field>
            <Field label="要点まとめ">
              <textarea name="summary" defaultValue={initial?.summary ?? ""} rows={4} className={`${inputClass} resize-y`} placeholder="1行1要点" />
            </Field>
            <Field label="このページで分かること">
              <textarea name="what_you_learn" defaultValue={initial?.whatYouLearn ?? ""} rows={4} className={`${inputClass} resize-y`} placeholder="1行1項目" />
            </Field>
            <Field label="SEOタイトル">
              <input name="seo_title" defaultValue={initial?.seoTitle ?? ""} className={inputClass} />
            </Field>
            <Field label="SEO説明">
              <input name="seo_description" defaultValue={initial?.seoDescription ?? ""} className={inputClass} />
            </Field>
            <Field label="SEOキーワード" className="sm:col-span-2">
              <input name="seo_keywords" defaultValue={initial?.seoKeywords ?? ""} className={inputClass} placeholder="カンマ区切り" />
            </Field>
          </div>
        </section>

        {/* 編集時は「更新を保存(=公開維持)」を先頭に置き、Enter による暗黙送信でも
            下書き化されないようにする。下書き化したい時だけ「下書きに戻す」を押す。 */}
        <div className="sticky bottom-0 z-10 grid gap-2 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:py-4">
          {isEdit ? (
            <>
              <Button type="submit" name="status" value="published" className="w-full sm:w-auto sm:order-2">
                <Send className="h-4 w-4" />
                更新を保存
              </Button>
              <Button type="submit" name="status" value="draft" variant="outline" className="w-full sm:w-auto sm:order-1">下書きに戻す</Button>
            </>
          ) : (
            <>
              <Button type="submit" name="status" value="draft" variant="outline" className="w-full sm:w-auto">下書き保存</Button>
              <Button type="submit" name="status" value="published" className="w-full sm:w-auto">
                <Send className="h-4 w-4" />
                記事を公開
              </Button>
            </>
          )}
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

function CategorySlugStatus({ category, selected }: { category: string; selected?: CategoryOption }) {
  if (!category) {
    return <span className="mt-1 block text-[11px] leading-5 text-slate-500">カテゴリslugを入力してください。</span>;
  }
  if (category.includes(".")) {
    return <span className="mt-1 block text-[11px] font-semibold leading-5 text-red-600">カテゴリslugにドットは使えません。</span>;
  }
  if (!selected) {
    return (
      <span className="mt-1 block text-[11px] leading-5 text-emerald-700">
        記事カテゴリとして新規作成されます。公開URLは /articles/[category]/[slug] になります。
      </span>
    );
  }
  return (
    <span className={selected.available ? "mt-1 block text-[11px] leading-5 text-slate-500" : "mt-1 block text-[11px] font-semibold leading-5 text-red-600"}>
      {selected.kind}: {selected.note}
    </span>
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
