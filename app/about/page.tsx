import { StaticPage } from "@/components/layout/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "運営者情報",
  description: "Each Spirit 編集部の運営方針、情報収集方針、掲載基準、更新方針をまとめています。",
  path: routes.about,
});

export default function AboutPage() {
  return (
    <StaticPage title="運営者情報" lead="Each Spiritは、読者が選択前に比較しやすい情報を届ける編集部運営の情報メディアです。">
      <h2 className="text-2xl font-semibold">運営者</h2>
      <p className="mt-3">Each Spirit 編集部</p>
      <h2 className="mt-8 text-2xl font-semibold">サイトの目的</h2>
      <p className="mt-3">ランキング、比較、地域情報、実体験に基づく要点整理を通じて、読者の意思決定を助けることを目的とします。</p>
      <h2 className="mt-8 text-2xl font-semibold">情報収集方針</h2>
      <ul className="mt-3 list-disc pl-6">
        <li>公式サイト、地図情報、現地確認、編集部調査を組み合わせます。</li>
        <li>外部記事の本文コピーではなく、独自の分類、比較、評価軸として再構成します。</li>
        <li>情報ソース、確認日、更新日をページ内に明示します。</li>
      </ul>
      <h2 className="mt-8 text-2xl font-semibold">掲載基準と更新方針</h2>
      <p className="mt-3">読者の比較に役立つこと、基本情報の追跡が可能なこと、PR掲載時に明示できることを掲載基準とします。営業時間や料金など変更されやすい情報は、更新時に再確認します。</p>
    </StaticPage>
  );
}
