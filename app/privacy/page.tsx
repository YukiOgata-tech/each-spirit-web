import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description:
    "Each Spiritのプライバシーポリシー。アカウント情報・利用状況データの取得目的、Cookie・セッション、アクセス解析・第三者配信広告、外部サービス（認証・ホスティング）の利用、第三者提供についてご説明します。",
  path: routes.privacy,
});

export default function PrivacyPage() {
  return (
    <StaticPage
      title="プライバシーポリシー"
      lead="Each Spirit（以下「当サイト」）における、利用者情報の取得・利用・管理に関する方針です。アカウント機能の提供にあたり取得する情報と、その取り扱いについて定めます。"
    >
      <p className="text-sm text-slate-500">最終更新日: 2026年7月10日</p>

      <h2 className="mt-8 text-2xl font-semibold">1. 事業者情報</h2>
      <p className="mt-3">
        当サイトは「Each Spirit 編集部」が運営しています。本ポリシーに関するお問い合わせは
        <Link href={routes.contact} className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline">お問い合わせ</Link>
        よりご連絡ください。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">2. 取得する情報</h2>
      <p className="mt-3">当サイトは、アカウント登録・ログインや各種機能のご利用に伴い、以下の情報を取得します。</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-6">
        <li><strong>アカウント情報</strong>: メールアドレス、パスワード（暗号化・ハッシュ化のうえ認証基盤が管理し、当サイトが平文を保持することはありません）、表示名。任意でアバター画像・生年月日。</li>
        <li><strong>利用状況データ</strong>: いいね・ブックマーク・「行きたい」などの操作、ポイント残高および増減履歴、占い・診断の結果、通知の既読状況。</li>
        <li><strong>Cookie・セッション情報</strong>: ログイン状態を維持するための認証用 Cookie・トークン。</li>
        <li>
          <strong>アクセス情報</strong>: Google Analytics（Google社が提供するアクセス解析サービス）により、閲覧ページ・参照元・端末/ブラウザ情報等を取得しています。
          取得した情報の Google 社における取り扱いについては
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
          >
            Google プライバシーポリシー
          </a>
          をご確認ください。
        </li>
      </ul>
      <p className="mt-3 text-sm text-slate-500">※ ログインせずに閲覧・お試しで占いを利用する場合、当該データはアカウントに保存されません。</p>

      <h2 className="mt-8 text-2xl font-semibold">3. 利用目的</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-6">
        <li>アカウントの認証およびログイン状態の維持</li>
        <li>いいね・ブックマーク・マイページ等のパーソナライズ機能の提供</li>
        <li>ポイント、占い・診断などの機能提供および記録</li>
        <li>お問い合わせへの回答・本人確認・必要な連絡</li>
        <li>不正利用の防止およびサービスの維持・改善</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">4. 認証・データの保管（外部サービスの利用）</h2>
      <p className="mt-3">
        当サイトは、利用者認証およびデータの保管に外部のクラウドサービス（Supabase）を、サイトのホスティングに外部サービス（Vercel）を利用しています。
        取得した情報はこれらの委託先が管理するサーバーに保存されます。各サービスは適切なアクセス制御のもとで運用されます。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">5. アカウント基盤の共有</h2>
      <p className="mt-3">
        当サイトは、運営者が提供する他のサービスと、認証基盤（ログイン）および基本プロフィール情報（表示名・アバター・生年月日等）を共有する場合があります。
        これにより、同一のアカウントで複数のサービスをご利用いただけます。各サービス固有の利用状況データ（いいね・ポイント・占い結果等）は、当サイト専用の領域に分離して管理します。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">6. Cookie・セッションについて</h2>
      <p className="mt-3">
        ログイン機能の提供のため、認証用 Cookie を使用します。ブラウザの設定でこれらを無効化できますが、その場合ログインや一部機能がご利用いただけません。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">7. 広告について（第三者配信広告）</h2>
      <p className="mt-3">
        当サイトは、Google 等の第三者配信事業者による広告を利用する場合があります。これらの広告配信事業者は、
        利用者に適した広告を表示するために Cookie 等を使用し、当サイトや他サイトへのアクセス情報に基づいて広告を配信することがあります。
      </p>
      <p className="mt-3">
        Google のパーソナライズ広告について、利用者は
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
        >
          Google 広告設定
        </a>
        で無効にできます。また
        <a
          href="https://optout.aboutads.info/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
        >
          www.aboutads.info
        </a>
        から、第三者配信事業者によるパーソナライズ広告を無効にすることもできます。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">8. 第三者提供</h2>
      <p className="mt-3">
        法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。ただし、前述の業務委託先（認証・保管・ホスティング等）への取り扱いの委託は、これに該当しません。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">9. SNS共有による外部送信</h2>
      <p className="mt-3">
        占い結果などを利用者ご自身が SNS（X・LINE 等）で共有する操作を行った場合、その内容は各 SNS 事業者へ送信されます。送信先での取り扱いは各 SNS のポリシーに従います。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">10. 開示・訂正・削除等の請求／退会</h2>
      <p className="mt-3">
        ご自身の情報の確認・訂正・削除や、アカウントの削除（退会）をご希望の場合は
        <Link href={routes.contact} className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline">お問い合わせ</Link>
        よりご連絡ください。アカウント削除に伴い、当サイト専用領域の利用状況データは削除または匿名化されます。
      </p>

      <h2 className="mt-8 text-2xl font-semibold">11. 本ポリシーの改定</h2>
      <p className="mt-3">
        本ポリシーは、法令の変更やサービス内容の変更に応じて改定することがあります。重要な変更がある場合は当サイト上でお知らせします。
      </p>
    </StaticPage>
  );
}
