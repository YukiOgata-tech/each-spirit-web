import type { NextConfig } from "next";
import { ALLOWED_IMAGE_HOSTS } from "./lib/image-hosts";

const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const hosts = [...ALLOWED_IMAGE_HOSTS, ...(supabaseImageHost ? [supabaseImageHost] : [])];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default nextConfig;
