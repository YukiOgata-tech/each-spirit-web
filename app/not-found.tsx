import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "ページが見つかりません｜" + site.title,
  robots: {
    index: false,
    follow: false,
  },
};

const primaryLinks = [
  {
    href: routes.home,
    label: "トップページへ",
    description: "Each Spirit の最新記事、ランキング、カテゴリ一覧へ戻ります。",
    icon: Home,
  },
  {
    href: routes.fortune,
    label: "今日の運勢を見る",
    description: "誕生日と性別から、今日の運勢を確認できます。",
    icon: Compass,
  },
];

export default function NotFoundPage() {
  return (
    <main className="hero-surface border-b border-slate-200">
      <section className="mx-auto grid min-h-[62vh] w-[min(1040px,calc(100%-32px))] place-items-center py-4 sm:w-[min(1040px,calc(100%-40px))] sm:py-9 lg:py-12 xl:py-[72px]">
        <div className="w-full">
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="animate-rise">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200 sm:h-10 sm:w-10">
                  <Image
                    src="/brand/each-spirit-mark.png"
                    alt=""
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                    priority
                  />
                </span>
                <span>
                  <span className="block text-sm font-bold leading-5 text-slate-950">Each Spirit</span>
                  <span className="section-kicker block">404 Not Found</span>
                </span>
              </div>
              <h1 className="mt-2 text-[1.75rem] font-bold leading-[1.15] tracking-normal text-slate-950 sm:mt-3 sm:text-4xl lg:text-5xl">
                お探しのページが
                <br />
                見つかりませんでした
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-5 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
                URLが変更されたか、公開が終了した可能性があります。トップページから探し直すか、今日の運勢ページへ進んでください。
              </p>
              <div className="mt-4 grid gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={routes.home}>
                    トップページへ
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={routes.fortune}>今日の運勢を見る</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-1.5 sm:gap-3">
              <div className="media-card overflow-hidden p-3 max-sm:border-0 max-sm:bg-transparent max-sm:shadow-none sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:gap-4 sm:pb-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 sm:text-sm">Page status</p>
                    <p className="mt-1 text-4xl font-black leading-none tracking-normal text-slate-950 sm:text-6xl">404</p>
                  </div>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white sm:h-12 sm:w-12">
                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div className="mt-3 grid gap-1.5 sm:mt-5 sm:gap-3">
                  {primaryLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm sm:gap-3 sm:p-4"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-800 sm:h-10 sm:w-10">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold leading-5 text-slate-950 sm:text-base sm:leading-6">{item.label}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-600 sm:mt-1 sm:text-sm sm:leading-6">{item.description}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-800" />
                      </Link>
                    );
                  })}
                </div>
              </div>
              <p className="px-1 text-xs leading-6 text-slate-500">
                検索エンジンや外部サイトの古いリンクから来た場合は、トップページから最新の公開情報を確認してください。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
