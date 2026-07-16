import Image, { type ImageProps } from "next/image";

export function MysteryImage({ alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} unoptimized />;
}
