import Link from "next/link";
import { ArrowRight, Car, MapPin, Soup } from "lucide-react";
import type { Item } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={routes.ramenItem(item.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius)]"
    >
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-orange-200">
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
