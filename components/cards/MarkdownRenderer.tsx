import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
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
        return <p key={index} className="whitespace-pre-line leading-8 text-slate-700">{renderInline(block)}</p>;
      })}
    </div>
  );
}
