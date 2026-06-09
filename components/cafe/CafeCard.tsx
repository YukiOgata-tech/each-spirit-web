import Link from "next/link";
import { ArrowRight, Coffee, MapPin, Wifi, Car, Plug } from "lucide-react";
import type { CafeItem } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";

export function CafeCard({ region, cafe }: { region: string; cafe: CafeItem }) {
  return (
    <Link
      href={routes.cafeItem(region, cafe.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[14px]"
    >
      <Card className="h-full overflow-hidden border-[var(--border)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-[var(--accent)]">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[var(--muted)] to-[#f0e4cc]">
          {cafe.imageUrl ? (
            <AttributedImage
              src={cafe.imageUrl}
              alt={cafe.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
              credit={resolveCredit(cafe.imageUrl, cafe.name, cafe.officialUrl)}
              variant="hover"
              wrapperClassName="absolute inset-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Coffee className="h-12 w-12 text-[var(--border)]" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-3">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">
              {cafe.style}
            </span>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
            <MapPin className="h-3.5 w-3.5" />
            {cafe.area}
          </div>
          <CardTitle className="text-base leading-snug transition-colors duration-200 group-hover:text-[var(--primary)]">
            {cafe.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{cafe.highlight}</p>

          <div className="rounded-md bg-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--primary)]">
            {cafe.priceRange}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {cafe.wifi && (
              <Badge className="border-sky-200 bg-sky-50 text-sky-700 text-[11px]">
                <Wifi className="mr-1 h-3 w-3" />WiFi
              </Badge>
            )}
            {cafe.power && (
              <Badge className="border-amber-200 bg-amber-50 text-amber-800 text-[11px]">
                <Plug className="mr-1 h-3 w-3" />電源あり
              </Badge>
            )}
            {cafe.parking && (
              <Badge className="border-slate-200 bg-slate-50 text-slate-600 text-[11px]">
                <Car className="mr-1 h-3 w-3" />駐車場あり
              </Badge>
            )}
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
