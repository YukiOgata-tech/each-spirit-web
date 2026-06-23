"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroBackgroundSlideshowProps = {
  images: string[];
  intervalMs?: number;
};

export function HeroBackgroundSlideshow({
  images,
  intervalMs = 6000,
}: HeroBackgroundSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          } ${
            index === 0
              ? "object-[58%_center] sm:object-center"
              : index === 2
                ? "object-[55%_center] sm:object-center"
                : "object-center"
          }`}
        />
      ))}
    </div>
  );
}
