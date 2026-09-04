import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";

const links = [
  { href: routes.about, label: "運営者情報" },
  { href: routes.contact, label: "お問い合わせ" },
  { href: routes.privacy, label: "プライバシーポリシー" },
  { href: routes.disclaimer, label: "免責事項" },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-md bg-white">
              <Image
                src="/brand/each-spirit-mark-96.webp"
                alt=""
                width={36}
                height={36}
                unoptimized
                className="h-8 w-8 object-contain"
              />
            </span>
            <span className="text-lg font-bold">Each Spirit <span className="text-sm font-semibold text-slate-400">イーチスピリット</span></span>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-300">
            Each Spirit（イーチスピリット）は、複数ジャンルのおすすめ情報、ランキング、比較、地域情報を整理する情報メディアです。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/10 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © 2026 Each Spirit 編集部
      </div>
    </footer>
  );
}
