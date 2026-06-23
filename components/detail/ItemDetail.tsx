import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, itemSchema, speakableWebPageSchema } from "@/lib/seo";
import { majorTheme } from "@/lib/major-theme";
import type { ContentSection, GenericItem } from "@/lib/types";
import { resolveFields } from "./shared";
import {
  IntangibleServiceLayout, MediaLayout, OtherLayout, PersonLayout,
  PhysicalServiceLayout, ProductLayout, type LayoutCtx,
} from "./layouts";

type Props = {
  item: GenericItem;
  section: ContentSection;
  majorLabel: string;
  /** 公開URL（canonical / JSON-LD / 各リンク用） */
  path: string;
  breadcrumbs: { name: string; href: string }[];
  /** ランキングの編集スコア（0-100）。JSON-LD aggregateRating に反映 */
  aggregateRating?: number;
};

/** item_class → レイアウトコンポーネント（振り分け先こそ作り込む） */
const LAYOUTS: Record<string, (c: LayoutCtx) => React.ReactNode> = {
  physical_service: PhysicalServiceLayout,
  intangible_service: IntangibleServiceLayout,
  media: MediaLayout,
  product: ProductLayout,
  person: PersonLayout,
  other: OtherLayout,
};

export function ItemDetail({ item, section, majorLabel, path, breadcrumbs, aggregateRating }: Props) {
  const theme = majorTheme(item.majorCategory);
  const fields = resolveFields(section);
  const Layout = LAYOUTS[item.itemClass] ?? OtherLayout;
  const ctx: LayoutCtx = { item, section, theme, fields, majorLabel, sectionLabel: section.label };

  return (
    <main className={`${theme.themeClass} section-shell max-w-6xl`}>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemSchema(item, path, { contentModel: section.contentModel, aggregateRating })} />
      <JsonLd data={speakableWebPageSchema(path, item.name)} />
      {item.faqs.length > 0 && <JsonLd data={faqSchema(item.faqs)} />}

      {Layout(ctx)}

      <div className="mt-10">
        <Button asChild variant="outline" size="sm">
          <Link href={section.href || `/${item.majorCategory}/${item.sectionSlug}`}>
            <ArrowRight className="h-4 w-4 rotate-180" />{majorLabel} / {section.label}の一覧へ
          </Link>
        </Button>
      </div>
    </main>
  );
}
