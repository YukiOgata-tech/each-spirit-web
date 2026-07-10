import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Car, CloudSun, MapPin } from "lucide-react";
import type { LeisureSpot } from "@/lib/types";
import { routes } from "@/lib/routes";
import { getLeisureVisual } from "@/lib/leisure-visuals";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";
import { LeisureIcon } from "@/components/leisure/LeisureIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kindLabel: Record<LeisureSpot["kind"], string> = {
  outdoor: "アウトドア",
  indoor: "インドア",
  hybrid: "複合型",
};

export function LeisureSpotCard({ region, spot }: { region: string; spot: LeisureSpot }) {
  const visual = getLeisureVisual(spot);

  return (
    <Link
      href={routes.leisureSpot(region, spot.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius)]"
    >
      <Card className="h-full overflow-hidden border-[var(--border)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-cyan-300">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={visual.imageUrl}
            alt={visual.imageAlt}
            fill
            unoptimized={shouldUnoptimizeImage(visual.imageUrl)}
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/8 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-white/92 px-3 py-2 text-xs font-bold text-slate-900 shadow-sm">
            <LeisureIcon iconKey={visual.iconKey} className="h-4 w-4 text-[var(--primary)]" />
            {kindLabel[spot.kind]}
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            <MapPin className="h-4 w-4" />
            {spot.area}
          </div>
          <CardTitle className="transition-colors duration-200 group-hover:text-[var(--primary)]">
            {spot.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="line-clamp-3 text-sm leading-7 text-slate-600">{spot.description}</p>
          <div className="rounded-md bg-cyan-50 p-3 text-sm leading-6 text-cyan-950">
            <CloudSun className="mr-1 inline h-4 w-4" />
            {spot.highlight}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{spot.genre}</Badge>
            <Badge className={spot.parking ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}>
              <Car className="mr-1 h-3 w-3" />
              {spot.parking ? "駐車場あり" : "駐車場要確認"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
            詳しく見る
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
