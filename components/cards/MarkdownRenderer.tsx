export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return <h2 key={index} className="pt-2 text-2xl font-semibold tracking-normal text-slate-950">{block.replace("## ", "")}</h2>;
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-slate-700">
              {block.split("\n").map((line) => <li key={line}>{line.replace("- ", "")}</li>)}
            </ul>
          );
        }
        return <p key={index} className="leading-8 text-slate-700">{block}</p>;
      })}
    </div>
  );
}
