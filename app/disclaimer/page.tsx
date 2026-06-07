import { StaticPage } from "@/components/layout/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "免責事項",
  description: "Each Spiritの掲載情報、外部リンク、PR表記に関する免責事項です。",
  path: routes.disclaimer,
});

export default function DisclaimerPage() {
  return (
    <StaticPage title="免責事項" lead="掲載情報の正確性、最新性、外部リンク先の内容についての免責事項をまとめています。">
      <h2 className="text-2xl font-semibold">掲載情報について</h2>
      <p className="mt-3">当サイトでは可能な限り正確な情報掲載に努めますが、内容の正確性、完全性、最新性を保証するものではありません。</p>
      <h2 className="mt-8 text-2xl font-semibold">営業時間・料金について</h2>
      <p className="mt-3">営業時間、料金、メニュー、サービス内容は変更される可能性があります。訪問・利用前に公式情報をご確認ください。</p>
      <h2 className="mt-8 text-2xl font-semibold">外部リンクについて</h2>
      <p className="mt-3">外部サイトの内容、サービス、トラブルについて当サイトは責任を負いません。</p>
    </StaticPage>
  );
}
