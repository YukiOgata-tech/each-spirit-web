import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import type { MajorTheme } from "@/lib/major-theme";
import type { ItemField } from "@/lib/admin-item-schema";
import type { ContentSection, GenericItem } from "@/lib/types";
import { PlainHero, PosterHero, ProductHero, ProfileHero, SplitHero } from "./hero";
import {
  AttributesBlock, EditorCommentBlock, GenresBlock, HistoryBlock, KeyInfoCard,
  OfficialLinksBlock, ProsConsBlock, RelatedLinksBlock, ServiceModelBlock,
} from "./blocks";

export type LayoutCtx = {
  item: GenericItem;
  section: ContentSection;
  theme: MajorTheme;
  fields: ItemField[];
  majorLabel: string;
  sectionLabel: string;
};

function TwoCol({ main, side }: { main: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">{main}</div>
      <aside className="space-y-4 self-start lg:sticky lg:top-6">{side}</aside>
    </div>
  );
}

function Stack({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 space-y-6">{children}</div>;
}

function Faq({ item }: { item: GenericItem }) {
  return item.faqs.length > 0 ? <FaqSection faqs={item.faqs} /> : null;
}
function Sources({ item }: { item: GenericItem }) {
  return item.sources.length > 0 ? <SourceList sources={item.sources} /> : null;
}

const heroProps = (c: LayoutCtx) => ({ item: c.item, majorLabel: c.majorLabel, sectionLabel: c.sectionLabel, theme: c.theme });

/** 来店型店舗・施設：所在地サイドバー＋本文 */
export function PhysicalServiceLayout(c: LayoutCtx) {
  return (
    <>
      <SplitHero {...heroProps(c)} />
      <TwoCol
        side={<><KeyInfoCard item={c.item} theme={c.theme} /><OfficialLinksBlock item={c.item} /></>}
        main={<>
          <AttributesBlock item={c.item} fields={c.fields} theme={c.theme} />
          <GenresBlock item={c.item} />
          <HistoryBlock item={c.item} />
          <EditorCommentBlock item={c.item} theme={c.theme} />
          <RelatedLinksBlock item={c.item} />
          <Faq item={c.item} />
          <Sources item={c.item} />
        </>}
      />
    </>
  );
}

/** 非来店サービス：利用導線が主役 */
export function IntangibleServiceLayout(c: LayoutCtx) {
  return (
    <>
      <SplitHero {...heroProps(c)} />
      <TwoCol
        side={<><KeyInfoCard item={c.item} theme={c.theme} /><OfficialLinksBlock item={c.item} /></>}
        main={<>
          <ServiceModelBlock item={c.item} title="利用・申し込み" />
          <AttributesBlock item={c.item} fields={c.fields} theme={c.theme} title="サービス内容" />
          <GenresBlock item={c.item} />
          <EditorCommentBlock item={c.item} theme={c.theme} />
          <RelatedLinksBlock item={c.item} />
          <Faq item={c.item} />
          <Sources item={c.item} />
        </>}
      />
    </>
  );
}

/** 作品・メディア：視聴先＋ジャンル＋関連作 */
export function MediaLayout(c: LayoutCtx) {
  return (
    <>
      <PosterHero {...heroProps(c)} />
      <Stack>
        <ServiceModelBlock item={c.item} title="視聴できるサービス" />
        <GenresBlock item={c.item} />
        <AttributesBlock item={c.item} fields={c.fields} theme={c.theme} title="作品情報" />
        <RelatedLinksBlock item={c.item} title="関連作品" />
        <EditorCommentBlock item={c.item} theme={c.theme} />
        <OfficialLinksBlock item={c.item} />
        <Faq item={c.item} />
        <Sources item={c.item} />
      </Stack>
    </>
  );
}

/** 商品：スペック＋購入導線 */
export function ProductLayout(c: LayoutCtx) {
  return (
    <>
      <ProductHero {...heroProps(c)} />
      <TwoCol
        side={<><ServiceModelBlock item={c.item} title="購入・入手" /><OfficialLinksBlock item={c.item} /></>}
        main={<>
          <AttributesBlock item={c.item} fields={c.fields} theme={c.theme} title="スペック" />
          <GenresBlock item={c.item} />
          <ProsConsBlock item={c.item} />
          <EditorCommentBlock item={c.item} theme={c.theme} />
          <RelatedLinksBlock item={c.item} />
          <Faq item={c.item} />
          <Sources item={c.item} />
        </>}
      />
    </>
  );
}

/** 人物：経歴タイムラインが主役 */
export function PersonLayout(c: LayoutCtx) {
  return (
    <>
      <ProfileHero {...heroProps(c)} />
      <Stack>
        <HistoryBlock item={c.item} title="経歴" />
        <AttributesBlock item={c.item} fields={c.fields} theme={c.theme} title="プロフィール" />
        <GenresBlock item={c.item} title="分野・ジャンル" />
        <RelatedLinksBlock item={c.item} title="関連" />
        <EditorCommentBlock item={c.item} theme={c.theme} />
        <OfficialLinksBlock item={c.item} />
        <Sources item={c.item} />
      </Stack>
    </>
  );
}

/** その他：最小フォールバック */
export function OtherLayout(c: LayoutCtx) {
  return (
    <>
      <PlainHero {...heroProps(c)} />
      <Stack>
        <AttributesBlock item={c.item} fields={c.fields} theme={c.theme} />
        <GenresBlock item={c.item} />
        <ServiceModelBlock item={c.item} title="入手・利用" />
        <OfficialLinksBlock item={c.item} />
        <RelatedLinksBlock item={c.item} />
        <EditorCommentBlock item={c.item} theme={c.theme} />
        <Faq item={c.item} />
        <Sources item={c.item} />
      </Stack>
    </>
  );
}
