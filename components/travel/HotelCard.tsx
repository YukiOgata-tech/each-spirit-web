import Link from "next/link";
import { ArrowRight, Building2, Car, Droplets, MapPin, UtensilsCrossed } from "lucide-react";
import type { Hotel } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";

const mealLabel: Record<Hotel["meals"], string> = {
  両食: "2食付",
  朝食のみ: "朝食付",
  素泊まり: "素泊まり",
  選択可: "食事選択可",
};

export function HotelCard({ region, hotel }: { region: string; hotel: Hotel }) {
  return (
    <Link
      href={routes.travelHotel(region, hotel.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius)]"
    >
      <Card className="h-full overflow-hidden border-[var(--border)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-[var(--accent)]">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--muted)] to-[#e8dcc8]">
          {hotel.imageUrl ? (
            <AttributedImage
              src={hotel.imageUrl}
              alt={hotel.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
              credit={resolveCredit(hotel.imageUrl, hotel.name, hotel.officialUrl)}
              variant="hover"
              wrapperClassName="absolute inset-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-[var(--border)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">
              {hotel.style}
            </span>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
            <MapPin className="h-3.5 w-3.5" />
            {hotel.area}
          </div>
          <CardTitle className="text-base leading-snug transition-colors duration-200 group-hover:text-[var(--primary)]">
            {hotel.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{hotel.highlight}</p>

          <div className="rounded-md bg-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--primary)]">
            {hotel.pricePerPerson}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {hotel.onsen && (
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
                <Droplets className="mr-1 h-3 w-3" />温泉あり
              </Badge>
            )}
            <Badge className="border-amber-200 bg-amber-50 text-amber-800 text-[11px]">
              <UtensilsCrossed className="mr-1 h-3 w-3" />{mealLabel[hotel.meals]}
            </Badge>
            {hotel.parking && (
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
