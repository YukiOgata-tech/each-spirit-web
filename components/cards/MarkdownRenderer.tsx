import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight, ExternalLink, ImageIcon, Link2 } from "lucide-react";

function stripFrontmatter(markdown: string) {
  return markdown
    // CRLF/CR を LF に正規化（管理UI保存等で混入すると :::ブロックの区切り解析が崩れるため）
    .replace(/\r\n?/g, "\n")
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
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

function renderTable(block: string, index: number) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const rows = lines.filter((_, rowIndex) => rowIndex !== 1).map((line) =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()),
  );
  const [head, ...body] = rows;

  return (
    <div key={index} className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {head.map((cell) => (
              <th key={cell} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-900">{renderInline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
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

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const blocks = stripFrontmatter(markdown).split(/\n\n+/).map((block) => block.trim()).filter(Boolean);

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
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 820px, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
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
                      <span className="text-sm font-bold text-slate-950">{link.label}</span>
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

        const note = parseDirective(block, "note");
        if (note) {
          return (
            <aside key={index} className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-5 py-4 text-sm leading-7 text-slate-700">
              {note.split("\n").map((line, lineIndex) => <p key={lineIndex}>{renderInline(line.replace(/^>\s?/, ""))}</p>)}
            </aside>
          );
        }

        if (isTable(block)) return renderTable(block, index);

        const image = parseImage(block);
        if (image) {
          return (
            <figure key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <Image src={image.src} alt={image.alt} width={1200} height={800} className="h-auto w-full object-cover" />
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
          return <h2 key={index} className="border-b border-slate-200 pb-3 pt-4 text-2xl font-bold tracking-normal text-slate-950">{renderInline(block.replace(/^##\s+/, ""))}</h2>;
        }
        if (block.startsWith("### ")) {
          return <h3 key={index} className="pt-2 text-xl font-semibold tracking-normal text-slate-900">{renderInline(block.replace(/^###\s+/, ""))}</h3>;
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
