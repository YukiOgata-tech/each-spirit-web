import type { LeisureSpot } from "@/lib/types";
import { isAllowedImageSrc } from "@/lib/image-hosts";

export type LeisureIconKey = "building" | "cableCar" | "fish" | "flask" | "flower" | "mountain" | "ship" | "trees" | "waves";

export type LeisureVisual = {
  imageUrl: string;
  imageAlt: string;
  iconKey: LeisureIconKey;
};

const visuals: Record<string, LeisureVisual> = {
  "kiyotsu-gorge-tunnel": {
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "渓谷と山の自然風景",
    iconKey: "mountain",
  },
  "yuzawa-kogen-panorama-park": {
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "高原と山並みの風景",
    iconKey: "cableCar",
  },
  "yahiko-ropeway": {
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "山頂から見下ろす景色",
    iconKey: "cableCar",
  },
  "echigo-hillside-park": {
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "花が咲く公園の風景",
    iconKey: "flower",
  },
  "shinano-river-water-shuttle": {
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "水辺を進む船旅のイメージ",
    iconKey: "ship",
  },
  "marinepia-nihonkai": {
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "水族館を想起させる海の生きもの",
    iconKey: "fish",
  },
  "niigata-science-museum": {
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "科学展示を想起させる実験器具",
    iconKey: "flask",
  },
  "niitsu-railway-museum": {
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "鉄道車両のイメージ",
    iconKey: "building",
  },
  "niigata-furusato-mura": {
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "新潟観光を想起させる水辺と街の風景",
    iconKey: "building",
  },
  "ikutopia-shoku-hana": {
    imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "花と緑に囲まれた体験施設のイメージ",
    iconKey: "flower",
  },
  "view-fukushimagata": {
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "湖と湿地の自然風景",
    iconKey: "waves",
  },
  "niigata-botanical-garden": {
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "温室や植物園を想起させる緑の風景",
    iconKey: "flower",
  },
  "yahiko-park": {
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "木々に囲まれた公園散策のイメージ",
    iconKey: "trees",
  },
  "kodomo-shizen-okoku": {
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "子どもと自然体験を想起させる森の風景",
    iconKey: "trees",
  },
  "aqua-park-niigata": {
    imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "屋内プールや運動施設のイメージ",
    iconKey: "waves",
  },
  "toyano-sports-park": {
    imageUrl: "https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "芝生広場と公園のイメージ",
    iconKey: "trees",
  },
  "teradomari-aquarium": {
    imageUrl: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "水族館の魚の展示イメージ",
    iconKey: "fish",
  },
  "umigatari-joetsu": {
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "海と水族館を想起させる青い水中風景",
    iconKey: "fish",
  },
};

const fallbackByKind: Record<LeisureSpot["kind"], LeisureVisual> = {
  outdoor: {
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "アウトドアレジャーを想起させる自然風景",
    iconKey: "mountain",
  },
  indoor: {
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "インドアレジャーを想起させる展示空間",
    iconKey: "building",
  },
  hybrid: {
    imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "屋内外で楽しめる複合レジャーのイメージ",
    iconKey: "trees",
  },
};

export function getLeisureVisual(spot: LeisureSpot): LeisureVisual {
  const base = visuals[spot.slug] ?? fallbackByKind[spot.kind];
  // DB（es.items.image）に実画像が入っていればそれを最優先。未設定時のみ厳選ストック画像へフォールバック。
  if (isAllowedImageSrc(spot.imageUrl)) {
    return { ...base, imageUrl: spot.imageUrl as string, imageAlt: spot.name };
  }
  return base;
}
