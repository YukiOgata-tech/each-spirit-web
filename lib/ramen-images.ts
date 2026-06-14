import type { Item } from "@/lib/types";

export function getRamenImageUrl(item: Item): string | undefined {
  return item.imageUrl;
}
