import type { NextConfig } from "next";

const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.tomita-cocoro.jp",
      },
      {
        protocol: "https",
        hostname: "sugitaya.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "niigatacity-ramen.jp",
      },
      {
        protocol: "https",
        hostname: "naoji.jp",
      },
      {
        protocol: "https",
        hostname: "www.visityamagata.jp",
      },
      {
        protocol: "https",
        hostname: "www.sakata-mangetsu.com",
      },
      {
        protocol: "https",
        hostname: "hayashishoten.online",
      },
      {
        protocol: "https",
        hostname: "www.bannaisyokudou.jp",
      },
      {
        protocol: "https",
        hostname: "uende.jp",
      },
      {
        protocol: "https",
        hostname: "delightdesignersworks.com",
      },
      {
        protocol: "https",
        hostname: "seabyluvism.jp",
      },
      {
        protocol: "https",
        hostname: "agu-hair.com",
      },
      ...(supabaseImageHost ? [{
        protocol: "https" as const,
        hostname: supabaseImageHost,
      }] : []),
    ],
  },
};

export default nextConfig;
