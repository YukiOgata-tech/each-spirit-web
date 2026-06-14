import type { Item } from "@/lib/types";

const RAMEN_IMAGE_BY_KIND = {
  miso: "https://images.unsplash.com/photo-1623341214825-9f4f963727da",
  niboshi: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
  shoyu: "https://images.unsplash.com/photo-1615341428002-1d4a5f2abb32",
  tsukemen: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1",
  hiyashi: "https://images.unsplash.com/photo-1557872943-16a5ac26437e",
  spicy: "https://images.unsplash.com/photo-1637024698421-533d83c7b883",
  shop: "https://images.unsplash.com/photo-1552611052-33e04de081de",
  default: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
} as const;

export function getRamenImageUrl(item: Item): string {
  if (item.imageUrl) return item.imageUrl;

  const text = [item.genre, item.recommendedMenu, ...item.tags].join(" ");
  if (/味噌|みそ|からみそ/.test(text)) return RAMEN_IMAGE_BY_KIND.miso;
  if (/煮干|にぼ|魚介|酒田|貝だし/.test(text)) return RAMEN_IMAGE_BY_KIND.niboshi;
  if (/背脂|辛|濃厚/.test(text)) return RAMEN_IMAGE_BY_KIND.spicy;
  if (/冷やし|冷し/.test(text)) return RAMEN_IMAGE_BY_KIND.hiyashi;
  if (/つけ麺/.test(text)) return RAMEN_IMAGE_BY_KIND.tsukemen;
  if (/夜営業|食堂|老舗/.test(text)) return RAMEN_IMAGE_BY_KIND.shop;
  if (/醤油|中華そば|支那そば/.test(text)) return RAMEN_IMAGE_BY_KIND.shoyu;
  return RAMEN_IMAGE_BY_KIND.default;
}
