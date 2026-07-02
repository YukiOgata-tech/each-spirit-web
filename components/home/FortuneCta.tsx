import Link from "next/link";
import { ArrowRight, Moon, Orbit } from "lucide-react";
import { routes } from "@/lib/routes";

const fortuneAxes = ["総合運", "恋愛運", "金運", "仕事運", "健康運", "対人運", "おでかけ運"];

/**
 * トップページの占いコンテンツへの大型CTA。
 * FortuneReveal と同じコズミック（violet/indigo＋amber）の世界観に合わせたダークセクション。
 */
export function FortuneCta() {
  return (
    <section className="section-shell">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#160e30] p-6 shadow-[0_24px_70px_rgba(76,29,149,0.35)] sm:p-10 lg:p-12">
        {/* コズミックなグラデーション背景 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 560px at 78% -20%, rgba(124,58,237,0.55) 0%, transparent 60%)," +
              "radial-gradient(760px 520px at 6% 12%, rgba(99,102,241,0.38) 0%, transparent 56%)," +
              "radial-gradient(640px 460px at 92% 96%, rgba(244,194,91,0.20) 0%, transparent 58%)",
          }}
        />
        {/* 星の粒 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
          <span className="absolute left-[12%] top-[22%] h-1 w-1 rounded-full bg-white/80" />
          <span className="absolute left-[28%] top-[64%] h-0.5 w-0.5 rounded-full bg-white/60" />
          <span className="absolute left-[68%] top-[18%] h-0.5 w-0.5 rounded-full bg-white/70" />
          <span className="absolute left-[84%] top-[52%] h-1 w-1 rounded-full bg-amber-200/70" />
          <span className="absolute left-[46%] top-[12%] h-0.5 w-0.5 rounded-full bg-white/50" />
          <span className="absolute left-[58%] top-[80%] h-0.5 w-0.5 rounded-full bg-white/55" />
        </div>

        <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="font-cinzel inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-violet-200">
              <Orbit className="h-4 w-4" />Daily Fortune
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-4xl">
              今日の運勢を、無料で占う
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-violet-100/80 sm:text-base">
              誕生日と性別を入れるだけ。あなただけの運勢を、7つの軸で毎日チェックできます。結果画像はそのままシェアできます。
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {fortuneAxes.map((axis) => (
                <span
                  key={axis}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] font-semibold text-violet-50"
                >
                  {axis}
                </span>
              ))}
            </div>

            <Link
              href={routes.fortune}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-900/40 transition hover:scale-[1.02] hover:from-violet-400 hover:to-indigo-400 active:scale-95"
            >
              今日の運勢を占う
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 装飾の月アイコン（大画面のみ） */}
          <div className="relative hidden aspect-square max-w-xs place-self-center lg:grid lg:place-items-center">
            <div className="absolute inset-6 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative grid h-40 w-40 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
              <Moon className="h-16 w-16 text-violet-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
