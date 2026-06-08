import { Building2, CableCar, Fish, FlaskConical, Flower2, Mountain, ShipWheel, Trees, Waves } from "lucide-react";
import type { LeisureIconKey } from "@/lib/leisure-visuals";

export function LeisureIcon({ iconKey, className }: { iconKey: LeisureIconKey; className?: string }) {
  switch (iconKey) {
    case "building":
      return <Building2 className={className} />;
    case "cableCar":
      return <CableCar className={className} />;
    case "fish":
      return <Fish className={className} />;
    case "flask":
      return <FlaskConical className={className} />;
    case "flower":
      return <Flower2 className={className} />;
    case "ship":
      return <ShipWheel className={className} />;
    case "trees":
      return <Trees className={className} />;
    case "waves":
      return <Waves className={className} />;
    case "mountain":
    default:
      return <Mountain className={className} />;
  }
}
