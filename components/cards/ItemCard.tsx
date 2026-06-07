import Link from "next/link";
import { Car, MapPin, Soup } from "lucide-react";
import type { Item } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
          <MapPin className="h-4 w-4" />
          {item.area}
        </div>
        <CardTitle>
          <Link href={routes.ramenItem(item.slug)} className="hover:text-[var(--primary)]">{item.name}</Link>
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
      </CardContent>
    </Card>
  );
}
