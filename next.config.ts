import type { NextConfig } from "next";
import { ALLOWED_IMAGE_HOSTS } from "./lib/image-hosts";

const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const hosts = [...ALLOWED_IMAGE_HOSTS, ...(supabaseImageHost ? [supabaseImageHost] : [])];

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Keep the remaining Vercel transformations to widths the site actually renders.
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [32, 48, 64, 96, 128, 192, 256, 320],
    remotePatterns: hosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default nextConfig;
