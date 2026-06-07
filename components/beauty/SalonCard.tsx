import Image from "next/image";
import Link from "next/link";
import { Car, Clock, MapPin, Users } from "lucide-react";
import type { Salon, AgeGroup } from "@/lib/types";
import { routes } from "@/lib/routes";
import { TreatmentBadge } from "@/components/beauty/TreatmentBadge";

const AGE_LABEL: Record<AgeGroup, string> = {
  teens:    "10代",
  twenties: "20代",
  thirties: "30代",
  forties:  "40代",
  fifties:  "50代〜",
};

export function SalonCard({ salon, region }: { salon: Salon; region: string }) {
  return (
    <Link href={routes.beautySalon(region, salon.slug)} className="beauty-card group block">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={salon.imageUrl}
          alt={salon.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">{salon.area}</p>
          <p className="mt-0.5 text-lg font-bold leading-tight text-white">{salon.name}</p>
        </div>
        {salon.parking && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
            <Car className="h-3 w-3" />P
          </span>
        )}
        {salon.childrenWelcome && (
          <span className="absolute right-3 top-8 flex items-center gap-1 rounded-full bg-pink-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
            <Users className="h-3 w-3" />子連れ
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] font-semibold leading-5 text-[#8b3a7e]">{salon.tagline}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{salon.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {salon.treatments.slice(0, 4).map((t) => (
            <TreatmentBadge key={t} treatment={t} size="xs" />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {salon.ageGroups.map((g) => (
            <span key={g} className="rounded-full bg-[#fef0f6] px-2 py-0.5 text-[10px] font-semibold text-[#8b3a7e]">
              {AGE_LABEL[g]}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#f2d5e8] pt-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{salon.area}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />カット {salon.cutPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
