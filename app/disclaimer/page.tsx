import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "免責事項",
  description:
    "Each Spiritの免責事項。掲載情報の正確性、外部リンク、広告・PR表記、ランキング・比較、占い・診断、ポイント機能の取り扱いについてご説明します。",
  path: routes.disclaimer,
});

export default function DisclaimerPage() {
  return (
    <StaticPage
      title="免責事項"
      lead="Each Spirit（以下「当サイト」）の掲載情報、外部リンク、広告表記、各種機能の取り扱いについての免責事項です。"
    >
      <p className="text-sm text-slate-500">最終更新日: 2026年6月13日</p>

      <h2 className="mt-8 text-2xl font-semibold">1. 掲載情報について</h2>
      <p className="mt-3">
        当サイトでは可能な限り正確な情報の掲載に努めていますが、内容の正確性・完全性・最新性を保証するものではありません。
        掲載内容は予告なく変更・削除される場合があります。情報の利用は利用者ご自身の判断と責任において行ってください。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">2. 営業時間・料金・在庫等について</h2>
      <p className="mt-3">
        店舗・施設・商品の営業時間、料金、メニュー、サービス内容、在庫、価格等は変更される場合があります。
        ご訪問・ご利用・ご購入の前に、必ず各公式情報で最新の内容をご確認ください。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">3. 外部リンクについて</h2>
      <p className="mt-3">
        当サイトには外部サイトへのリンクが含まれます。リンク先の内容・サービス・取引や、それらに起因するトラブルについて当サイトは責任を負いません。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">4. 広告・PR・アフィリエイトについて</h2>
      <p className="mt-3">
        当サイトの記事・ランキング・店舗/商品カードには、広告・PR（提供）やアフィリエイトプログラムによるリンクを含む場合があります。
        PR を含むコンテンツには、その旨を明示するよう努めます。これらの掲載は、評価・順位の客観性を損なわない範囲で行います。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">5. ランキング・比較・レビューについて</h2>
      <p className="mt-3">
        ランキングや比較は、当サイト編集部の独自基準・主観に基づくものであり、対象の絶対的な優劣を保証するものではありません。
        将来的に利用者による投稿（レビュー等）を掲載する場合、その内容は投稿者個人の見解であり、当サイトの見解を示すものではありません。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">6. 占い・診断コンテンツについて</h2>
      <p className="mt-3">
        占いや診断はエンターテインメントを目的としたコンテンツです。結果は娯楽の範囲でお楽しみいただくものであり、医療・健康・金融・投資・その他の専門的な助言を行うものではありません。
        結果に基づく判断・行動について当サイトは一切の責任を負いません。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">7. ポイント機能について</h2>
      <p className="mt-3">
        当サイトのポイントはサイト内の機能であり、金銭的価値・換金性・第三者への譲渡性を保証するものではありません。
        ポイントの付与・利用条件は、予告なく変更・終了する場合があります。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">8. 損害の免責</h2>
      <p className="mt-3">
        当サイトの利用、または利用できなかったことにより利用者に生じたいかなる損害についても、当サイトは責任を負いかねます。
        ご不明な点は
        <Link href={routes.contact} className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline">お問い合わせ</Link>
        よりご連絡ください。
      </p>
    </StaticPage>
  );
}
