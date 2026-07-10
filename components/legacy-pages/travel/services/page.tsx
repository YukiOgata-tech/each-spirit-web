import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bus, Map, Smartphone } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getTravelAgencies, getTravelApps, getTravelServiceRankings, getTravelServiceRegions } from "@/lib/content";
import { RegionlessItems } from "@/components/generic/RegionlessItems";
import { routes } from "@/lib/routes";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

const HERO_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828";

export const metadata = pageMetadata({
  title: "旅行会社・旅行アプリおすすめ比較ガイド｜予約サイト・ツアーのランキングと選び方",
  description: "旅行計画に使えるアプリと、県ごとの地域密着型旅行会社を比較。地元発着ツアー、団体手配、移動アプリを実用目線で整理します。",
  path: routes.travelServices,
  keywords: ["旅行アプリ", "旅行会社", "地域旅行会社", "団体旅行", "バスツアー", "旅行計画"],
});

export default async function TravelServicesIndexPage() {
  const regions = await getTravelServiceRegions();
  const [apps, regionStats] = await Promise.all([
    getTravelApps(),
    Promise.all(
      regions.map(async (region) => ({
        region,
        agencies: await getTravelAgencies(region.slug),
        rankings: await getTravelServiceRankings(region.slug),
      }))
    ),
  ]);

  return (
    <div className="travel-services-theme">
      <JsonLd data={breadcrumbSchema([{ name: "旅行アプリ・旅行会社", href: routes.travelServices }])} />

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <Image
          src={HERO_IMAGE}
          alt="旅行計画とスマートフォン"
          fill
          priority
          unoptimized={shouldUnoptimizeImage(HERO_IMAGE)}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,53,69,0.94)_0%,rgba(40,90,111,0.88)_50%,rgba(224,143,62,0.58)_100%)]" />
        <div className="relative z-10 mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-14 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-20 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Badge className="border-white/20 bg-white/12 text-white">Travel Services</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
              旅行アプリと地元旅行会社を、<span className="text-[var(--accent)]">旅程づくりの実用目線</span>で選ぶ。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
              アプリは用途別、旅行会社は県別に整理。大手予約サイトだけでは拾いにくい地元発着ツアー、団体旅行、交通会社系の相談先まで確認します。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="border-0 bg-[var(--accent)] text-white hover:bg-orange-500">
                <Link href="#regions">県別の旅行会社を見る<ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href={routes.travelApps}>旅行アプリを見る</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/12 p-5 text-white backdrop-blur-sm">
            <Map className="h-10 w-10 text-[var(--accent)]" />
            <h2 className="mt-4 text-xl font-bold">調査の分け方</h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/80">
              <div className="rounded-md bg-black/20 p-4">
                <strong className="block text-white">旅行会社</strong>
                県ごとに7件前後。地域密着型、旅行業登録、公式情報、地元発着ツアーを重視します。
              </div>
              <div className="rounded-md bg-black/20 p-4">
                <strong className="block text-white">旅行アプリ</strong>
                都道府県ではなく、移動計画・旅程管理・予約など用途別に整理します。
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="regions" className="section-shell mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href={routes.travelApps} className="rounded-lg border border-[var(--border)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Smartphone className="h-8 w-8 text-[var(--primary)]" />
            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">APPS</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">旅行アプリ</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">移動計画、乗換検索、旅程整理など、旅行前後の用途別に比較します。</p>
            <p className="mt-4 text-sm font-bold text-[var(--primary)]">{apps.length}件掲載 <ArrowRight className="inline h-4 w-4" /></p>
          </Link>

          {regionStats.map(({ region, agencies, rankings }) => (
            <Link
              key={region.slug}
              href={routes.travelServicesRegion(region.slug)}
              className={`rounded-lg border border-[var(--border)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${region.status !== "live" ? "pointer-events-none opacity-60" : ""}`}
            >
              <Bus className="h-8 w-8 text-[var(--primary)]" />
              <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">LOCAL AGENCIES</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{region.name}の旅行会社</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{region.description}</p>
              <div className="mt-4 flex gap-2 text-center">
                <span className="rounded-md bg-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--primary)]">{agencies.length}社</span>
                <span className="rounded-md bg-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--primary)]">{rankings.length}ランキング</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <RegionlessItems majorCategory="travel" sectionSlug="services" itemPathSegment="agencies" itemClass="intangible_service" heading="エリアを問わず掲載の旅行会社" />
    </div>
  );
}
