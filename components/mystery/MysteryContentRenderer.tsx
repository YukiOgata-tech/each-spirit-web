import type { ComponentType } from "react";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { StagedMysteryRunner } from "@/components/mystery/StagedMysteryRunner";
import { UndatedArchiveEvidence } from "@/components/mystery/UndatedArchiveEvidence";
import type { MysteryPuzzle } from "@/lib/mystery";

const customMysteryRenderers: Record<string, ComponentType> = {
  undated_archive_v1: UndatedArchiveEvidence,
};

export function MysteryContentRenderer({ puzzle, closed }: { puzzle: MysteryPuzzle; closed: boolean }) {
  const CustomRenderer = puzzle.customRendererKey
    ? customMysteryRenderers[puzzle.customRendererKey]
    : null;

  return (
    <>
      {puzzle.bodyMd && (
        <div className="mystery-markdown mt-8">
          <MarkdownRenderer markdown={puzzle.bodyMd} />
        </div>
      )}

      {puzzle.contentModel === "custom" && (
        CustomRenderer
          ? <CustomRenderer />
          : <p className="mt-8 border-l-2 border-red-700 pl-4 text-sm text-stone-600">専用資料を表示できません。</p>
      )}

      {puzzle.contentModel === "staged" && (
        <StagedMysteryRunner slug={puzzle.slug} closed={closed} />
      )}
    </>
  );
}
