import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import type { ProteinProduct } from "@/lib/types";
import { routes } from "@/lib/routes";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";
import { NutritionTypeBadge, MacroChip } from "@/components/protein/NutritionBadge";

export function ProductCard({ product }: { product: ProteinProduct }) {
  return (
    <Link href={routes.proteinProduct(product.slug)} className="protein-card group flex flex-col">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.name}`}
          fill
          unoptimized={shouldUnoptimizeImage(product.imageUrl)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{product.brand}</p>
          <p className="mt-0.5 text-sm font-black leading-tight text-white">{product.name}</p>
        </div>
        <div className="absolute right-3 top-3">
          <NutritionTypeBadge type={product.proteinType} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="grid grid-cols-4 gap-2">
          <MacroChip label="タンパク質" value={product.protein} color="#1e3a5f" />
          <MacroChip label="カロリー" value={product.calories} unit="kcal" color="#f97316" />
          <MacroChip label="炭水化物" value={product.carbs} color="#64748b" />
          <MacroChip label="脂質" value={product.fat} color="#94a3b8" />
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{product.description}</p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] text-slate-400">1kg換算</p>
            <p className="text-sm font-black text-[#1e3a5f]">¥{product.pricePerKg.toLocaleString()}<span className="text-[10px] font-normal text-slate-400">/kg</span></p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#1e3a5f] px-3 py-1.5 text-[11px] font-bold text-white">
            <Zap className="h-3 w-3" />詳細
          </span>
        </div>
      </div>
    </Link>
  );
}
