import Link from "next/link";
import { ArrowRight, Bus, MapPin, Users } from "lucide-react";
import type { TravelAgency } from "@/lib/types";
import { routes } from "@/lib/routes";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TravelAgencyCard({ region, agency }: { region: string; agency: TravelAgency }) {
  return (
    <Link
      href={routes.travelAgency(region, agency.slug)}
      className="group block h-full rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <Card className="h-full overflow-hidden border-[var(--border)] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[var(--accent)] group-hover:shadow-lg">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--muted)] to-[#f2e5d2]">
          <AttributedImage
            src={agency.imageUrl}
            alt={agency.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
            credit={resolveCredit(agency.imageUrl, agency.name, agency.officialUrl)}
            variant="hover"
            wrapperClassName="absolute inset-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-3">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">
              {agency.area}
            </span>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
            <MapPin className="h-3.5 w-3.5" />
            {agency.consultationStyle}
          </div>
          <CardTitle className="text-base leading-snug transition-colors duration-200 group-hover:text-[var(--primary)]">
            {agency.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{agency.highlight}</p>

          <div className="flex flex-wrap gap-1.5">
            {agency.services.slice(0, 3).map((service) => (
              <Badge key={service} className="border-sky-200 bg-sky-50 text-sky-800 text-[11px]">
                {service}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
            <span className="rounded-md bg-[var(--muted)] px-2 py-1.5">
              <Users className="mr-1 inline h-3 w-3" />団体相談
            </span>
            <span className="rounded-md bg-[var(--muted)] px-2 py-1.5">
              <Bus className="mr-1 inline h-3 w-3" />地元発着
            </span>
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
