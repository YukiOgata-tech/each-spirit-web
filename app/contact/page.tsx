import { StaticPage } from "@/components/layout/StaticPage";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { initialContactFormState } from "@/app/contact/form-state";

export const metadata = pageMetadata({
  title: "お問い合わせ",
  description: "Each Spirit 編集部へのお問い合わせ、情報提供、掲載内容の修正依頼はこちらから。",
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <StaticPage title="お問い合わせ" lead="情報提供、掲載内容の修正依頼、取材相談、広告・提携のご相談はこちらからお送りください。">
      <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7">
        <p><strong>掲載内容の修正依頼:</strong> 対象ページURL、店舗名・施設名、修正したい項目、確認できる参照元を添えてください。</p>
        <p><strong>取材・掲載相談:</strong> 地域、ジャンル、希望内容、公開可能な公式情報や写真素材の有無をお知らせください。</p>
        <p><strong>返信について:</strong> すべての内容に返信を保証するものではありませんが、必要に応じて編集部より連絡します。</p>
      </div>
      <ContactForm initialState={initialContactFormState} />
    </StaticPage>
  );
}
