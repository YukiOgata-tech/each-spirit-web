import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, ExternalLink, ImageIcon, Info, Lightbulb, Link2, XCircle } from "lucide-react";
import type { AffiliateContentRef } from "@/lib/affiliate/types";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

function stripFrontmatter(markdown: string) {
  return markdown
    // CRLF/CR を LF に正規化（管理UI保存等で混入すると :::ブロックの区切り解析が崩れるため）
    .replace(/\r\n?/g, "\n")
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

export type MarkdownHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

export function getMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const rawHeadings: Omit<MarkdownHeading, "id">[] = stripFrontmatter(markdown)
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap<Omit<MarkdownHeading, "id">>((block) => {
      const h2 = block.match(/^##\s+(.+)$/);
      if (h2) return [{ level: 2 as const, text: h2[1].trim() }];
      const h3 = block.match(/^###\s+(.+)$/);
      if (h3) return [{ level: 3 as const, text: h3[1].trim() }];
      return [];
    });

  return rawHeadings.map((heading, index) => ({
      ...heading,
      id: `article-heading-${index + 1}`,
  }));
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (match[2]) {
      nodes.push(<strong key={match.index} className="font-semibold text-slate-950">{match[2]}</strong>);
    } else if (match[3]) {
      nodes.push(<code key={match.index} className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-slate-800">{match[3]}</code>);
    } else if (match[4] && match[5]) {
      const href = match[5];
      const className = "font-semibold text-[var(--primary)] underline decoration-[var(--primary)]/25 underline-offset-4 hover:decoration-[var(--primary)]";
      nodes.push(
        href.startsWith("/") ? (
          <Link key={match.index} href={href} className={className}>{match[4]}</Link>
        ) : (
          <a key={match.index} href={href} className={className} target="_blank" rel="noreferrer">{match[4]}</a>
        ),
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/**
 * `:::note` 等のブロック内テキストを、太字/コード/リンク（renderInline）に加えて
 * `- ` で始まる連続行を箇条書き（<ul>）としてグルーピングして描画する。
 * 空行を含めない前提（ブロック分割は `\n\n+` 単位のため、ディレクティブ内に空行は使えない）。
 */
function renderRichLines(lines: string[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    nodes.push(
      <ul key={key} className="list-disc space-y-1 pl-5">
        {listBuffer.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}
      </ul>,
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, lineIndex) => {
    const line = rawLine.replace(/^>\s?/, "");
    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      return;
    }
    flushList(`list-${lineIndex}`);
    if (line.trim()) nodes.push(<p key={lineIndex}>{renderInline(line)}</p>);
  });
  flushList("list-end");

  return nodes;
}

type NoteType = "info" | "warning" | "success" | "tip";

const NOTE_THEME: Record<NoteType, { className: string; iconClassName: string; icon: typeof Info }> = {
  info: {
    className: "border-[var(--primary)]/20 bg-[var(--primary)]/5 text-slate-700",
    iconClassName: "text-[var(--primary)]",
    icon: Info,
  },
  warning: {
    className: "border-amber-300/70 bg-amber-50 text-amber-900",
    iconClassName: "text-amber-500",
    icon: AlertTriangle,
  },
  success: {
    className: "border-emerald-300/70 bg-emerald-50 text-emerald-900",
    iconClassName: "text-emerald-500",
    icon: CheckCircle2,
  },
  tip: {
    className: "border-sky-300/70 bg-sky-50 text-sky-900",
    iconClassName: "text-sky-500",
    icon: Lightbulb,
  },
};

function isTable(block: string) {
  const lines = block.split("\n").map((line) => line.trim());
  return lines.length >= 2 && lines[0].startsWith("|") && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1]);
}

function parseImage(block: string) {
  const match = block.match(/^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]+)")?\)$/);
  if (!match) return null;
  return { alt: match[1], src: match[2], caption: match[3] };
}

function parseDirective(block: string, name: string) {
  const trimmed = block.trim();
  const prefix = ":::" + name;
  if (!trimmed.startsWith(prefix) || !trimmed.endsWith(":::")) return null;
  return trimmed.slice(prefix.length, -3).trim();
}

function parseFields(content: string) {
  return Object.fromEntries(
    content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) return null;
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] as const;
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry)),
  );
}

function parseLinkCards(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?$/);
      if (!match) return null;
      return { label: match[1], href: match[2], description: match[3] ?? "" };
    })
    .filter((entry): entry is { label: string; href: string; description: string } => Boolean(entry));
}

function parseProsCons(content: string) {
  const pros: string[] = [];
  const cons: string[] = [];
  let current: "pros" | "cons" | null = null;

  content.split("\n").forEach((rawLine) => {
    const line = rawLine.replace(/^>\s?/, "").trim();
    if (/^pros:?$/i.test(line)) { current = "pros"; return; }
    if (/^cons:?$/i.test(line)) { current = "cons"; return; }
    if (line.startsWith("- ") && current) {
      (current === "pros" ? pros : cons).push(line.slice(2).trim());
    }
  });

  return { pros, cons };
}

function parseSteps(content: string) {
  return content
    .split("\n")
    .map((line) => line.replace(/^>\s?/, "").trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2))
    .map((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) return { title: "", text: line };
      return { title: line.slice(0, separator).trim(), text: line.slice(separator + 1).trim() };
    });
}

function renderTable(block: string, index: number) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const rows = lines.filter((_, rowIndex) => rowIndex !== 1).map((line) =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()),
  );
  const [head, ...body] = rows;

  return (
    <div key={index} className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="min-w-full divide-y divide-[var(--border)] text-sm">
        <thead className="bg-[var(--primary)]/8">
          <tr>
            {head.map((cell) => (
              <th key={cell} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-[var(--primary)]">{renderInline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-white">
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 1 ? "bg-[var(--muted)]/50" : undefined}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 leading-7 text-slate-700">{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type MarkdownAffiliateContext = Pick<AffiliateContentRef, "kind" | "targetId" | "targetSlug" | "majorCategory" | "sectionSlug" | "title">;
type MarkdownFields = Record<string, string>;

export function MarkdownRenderer({
  markdown,
  affiliateContext,
  renderAffiliateCard,
}: {
  markdown: string;
  affiliateContext?: MarkdownAffiliateContext;
  renderAffiliateCard?: (fields: MarkdownFields, context?: MarkdownAffiliateContext) => ReactNode;
}) {
  const blocks = stripFrontmatter(markdown).split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
  const headings = getMarkdownHeadings(markdown);
  let headingIndex = 0;

  return (
    <div className="space-y-7">
      {blocks.map((block, index) => {
        const officialImage = parseDirective(block, "official-image");
        if (officialImage) {
          const fields = parseFields(officialImage);
          const src = fields.src;
          const alt = fields.alt ?? fields.caption ?? "記事内画像";
          const source = fields.source;
          const sourceUrl = fields.sourceUrl;

          if (!src) return null;

          return (
            <figure key={index} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative overflow-hidden bg-slate-100">
                <ImageLightbox src={src} alt={alt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} className="h-auto max-h-[760px] w-full object-contain transition duration-500 group-hover:scale-[1.01]" loading="lazy" />
                </ImageLightbox>
                <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                  <ImageIcon className="h-3.5 w-3.5 text-[var(--primary)]" />
                  公式画像
                </div>
              </div>
              <figcaption className="space-y-2 px-4 py-4">
                {fields.caption && <p className="text-sm leading-6 text-slate-700">{renderInline(fields.caption)}</p>}
                {source && sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-[var(--primary)]">
                    画像出典: {source}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </figcaption>
            </figure>
          );
        }

        const affiliateCard = parseDirective(block, "affiliate-card");
        if (affiliateCard) {
          const fields = parseFields(affiliateCard);
          const query = fields.query;
          if (!query) return null;

          if (renderAffiliateCard) return <div key={index}>{renderAffiliateCard(fields, affiliateContext)}</div>;

          return (
            <aside key={index} className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              アフィリエイトカード: {fields.title || fields.query}
            </aside>
          );
        }

        const linkCards = parseDirective(block, "link-cards");
        if (linkCards) {
          const links = parseLinkCards(linkCards);
          if (links.length === 0) return null;

          return (
            <aside key={index} className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
                <Link2 className="h-4 w-4 text-[var(--primary)]" />
                関連コンテンツ
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {links.map((link) => {
                  const content = (
                    <>
                      <span className="text-sm font-bold text-slate-950">{renderInline(link.label)}</span>
                      {link.description && <span className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{renderInline(link.description)}</span>}
                      <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-slate-400 transition group-hover:text-[var(--primary)]" />
                    </>
                  );

                  const className = "group relative block min-h-20 rounded-lg border border-slate-200 bg-white p-4 pr-9 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md";

                  return link.href.startsWith("/") ? (
                    <Link key={link.href} href={link.href} className={className}>{content}</Link>
                  ) : (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={className}>{content}</a>
                  );
                })}
              </div>
            </aside>
          );
        }

        const steps = parseDirective(block, "steps");
        if (steps) {
          const items = parseSteps(steps);
          if (items.length === 0) return null;

          return (
            <ol key={index} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5">
              {items.map((step, stepIndex) => (
                <li key={stepIndex} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                    {stepIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5 text-sm leading-7 text-slate-700">
                    {step.title && <span className="mr-1.5 font-bold text-slate-950">{renderInline(step.title)}</span>}
                    {renderInline(step.text)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        const prosCons = parseDirective(block, "pros-cons");
        if (prosCons) {
          const { pros, cons } = parseProsCons(prosCons);
          if (pros.length === 0 && cons.length === 0) return null;

          return (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-950">メリット・デメリット</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {pros.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">メリット</p>
                    <ul className="space-y-2">
                      {pros.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-1.5 text-sm leading-6 text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {renderInline(point)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-500">デメリット</p>
                    <ul className="space-y-2">
                      {cons.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-1.5 text-sm leading-6 text-slate-700">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                          {renderInline(point)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        }

        const note = parseDirective(block, "note");
        if (note) {
          const lines = note.split("\n");
          const typeMatch = lines[0]?.match(/^type:\s*(info|warning|success|tip)\s*$/i);
          const type = (typeMatch?.[1].toLowerCase() ?? "info") as NoteType;
          if (typeMatch) lines.shift();
          const theme = NOTE_THEME[type];

          return (
            <aside key={index} className={`flex items-start gap-3 rounded-xl border px-5 py-4 text-sm leading-7 ${theme.className}`}>
              <theme.icon className={`mt-0.5 h-4 w-4 shrink-0 ${theme.iconClassName}`} />
              <div className="min-w-0 flex-1 space-y-2">{renderRichLines(lines)}</div>
            </aside>
          );
        }

        if (isTable(block)) return renderTable(block, index);

        const image = parseImage(block);
        if (image) {
          return (
            <figure key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <ImageLightbox src={image.src} alt={image.alt}>
                <Image src={image.src} alt={image.alt} width={1200} height={800} unoptimized={shouldUnoptimizeImage(image.src)} className="h-auto w-full object-cover" />
              </ImageLightbox>
              {(image.caption || image.alt) && (
                <figcaption className="px-4 py-3 text-sm leading-6 text-slate-600">{image.caption || image.alt}</figcaption>
              )}
            </figure>
          );
        }

        if (block.startsWith("# ")) {
          return <h1 key={index} className="pt-2 text-3xl font-bold leading-tight tracking-normal text-slate-950">{renderInline(block.replace(/^#\s+/, ""))}</h1>;
        }
        if (block.startsWith("## ")) {
          const id = headings[headingIndex++]?.id;
          return <h2 id={id} key={index} className="scroll-mt-28 border-b border-slate-200 pb-3 pt-4 text-2xl font-bold tracking-normal text-slate-950">{renderInline(block.replace(/^##\s+/, ""))}</h2>;
        }
        if (block.startsWith("### ")) {
          const id = headings[headingIndex++]?.id;
          return <h3 id={id} key={index} className="scroll-mt-28 pt-2 text-xl font-semibold tracking-normal text-slate-900">{renderInline(block.replace(/^###\s+/, ""))}</h3>;
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote key={index} className="border-l-4 border-[var(--primary)] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700">
              {block.split("\n").map((line, lineIndex) => <p key={lineIndex}>{renderInline(line.replace(/^>\s?/, ""))}</p>)}
            </blockquote>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 leading-8 text-slate-700">
              {block.split("\n").map((line) => <li key={line}>{renderInline(line.replace(/^-\s+/, ""))}</li>)}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-6 leading-8 text-slate-700">
              {block.split("\n").map((line) => <li key={line}>{renderInline(line.replace(/^\d+\.\s+/, ""))}</li>)}
            </ol>
          );
        }
        return <p key={index} className="whitespace-pre-line leading-6 text-sm sm:text-base sm:leading-8 text-slate-700">{renderInline(block)}</p>;
      })}
    </div>
  );
}
