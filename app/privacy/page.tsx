import { StaticPage } from "@/components/layout/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description: "Each Spiritのプライバシーポリシー雛形です。",
  path: routes.privacy,
});

export default function PrivacyPage() {
  return (
    <StaticPage title="プライバシーポリシー" lead="Each Spiritにおける個人情報、アクセス解析、外部サービス利用に関する方針です。">
      <h2 className="text-2xl font-semibold">個人情報の利用目的</h2>
      <p className="mt-3">お問い合わせ時に取得した情報は、回答、本人確認、必要な連絡のために利用します。</p>
      <h2 className="mt-8 text-2xl font-semibold">アクセス解析</h2>
      <p className="mt-3">将来的にアクセス解析ツールを導入する場合があります。取得情報はサイト改善のために利用します。</p>
      <h2 className="mt-8 text-2xl font-semibold">第三者提供</h2>
      <p className="mt-3">法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。</p>
    </StaticPage>
  );
}
