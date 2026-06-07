import { StaticPage } from "@/components/layout/StaticPage";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "お問い合わせ",
  description: "Each Spirit 編集部へのお問い合わせ、情報提供、掲載内容の修正依頼はこちらから。",
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <StaticPage title="お問い合わせ" lead="情報提供、掲載内容の修正依頼、取材相談はこちらからお送りください。送信処理は今後API連携します。">
      <form className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold">お名前<input className="rounded-md border border-slate-300 px-3 py-2" placeholder="山田 太郎" /></label>
        <label className="grid gap-2 text-sm font-semibold">メールアドレス<input type="email" className="rounded-md border border-slate-300 px-3 py-2" placeholder="mail@example.com" /></label>
        <label className="grid gap-2 text-sm font-semibold">種別<select className="rounded-md border border-slate-300 px-3 py-2"><option>情報提供</option><option>修正依頼</option><option>取材相談</option><option>その他</option></select></label>
        <label className="grid gap-2 text-sm font-semibold">内容<textarea className="min-h-36 rounded-md border border-slate-300 px-3 py-2" placeholder="お問い合わせ内容を入力してください" /></label>
        <Button type="button" className="w-fit">送信UIを確認</Button>
      </form>
    </StaticPage>
  );
}
