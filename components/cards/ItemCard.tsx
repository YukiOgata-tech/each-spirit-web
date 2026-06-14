import Link from "next/link";
import { ArrowRight, Car, MapPin, Soup } from "lucide-react";
import type { Item } from "@/lib/types";
import { routes } from "@/lib/routes";
import { getRamenImageUrl } from "@/lib/ramen-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { RamenImagePlaceholder } from "@/components/ramen/RamenImagePlaceholder";

export function ItemCard({ item }: { item: Item }) {
  const imageUrl = getRamenImageUrl(item);

  return (
    <Link
      href={routes.ramenItem(item.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius)]"
    >
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-orange-200">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100">
          {imageUrl ? (
            <AttributedImage
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
              credit={resolveCredit(imageUrl, item.name, item.officialUrl)}
              variant="hover"
              wrapperClassName="absolute inset-0"
            />
          ) : (
            <RamenImagePlaceholder />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-3">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">
              {item.genre}
            </span>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            <MapPin className="h-4 w-4" />
            {item.area}
          </div>
          <CardTitle className="transition-colors duration-200 group-hover:text-[var(--primary)]">
            {item.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="line-clamp-3 text-sm leading-7 text-slate-600">{item.description}</p>
          <div className="rounded-md bg-orange-50 p-3 text-sm text-orange-950">
            <Soup className="mr-1 inline h-4 w-4" />
            おすすめ: {item.recommendedMenu}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{item.genre}</Badge>
            <Badge className={item.parking ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}>
              <Car className="mr-1 h-3 w-3" />
              {item.parking ? "駐車場あり" : "駐車場要確認"}
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
