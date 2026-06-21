import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GlobalRouteLoader } from "@/components/layout/GlobalRouteLoader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/content/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// ISR: 全ルートのデフォルト再生成間隔（30日）。content/** を seed したら最大30日で
// 本番に反映される。cookies を使う動的ページ（/account など）は自動的に動的のまま。
export const revalidate = 2592000;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s | " + site.titleSuffix,
  },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.editor, url: site.url + "/about" }],
  creator: site.editor,
  publisher: site.editor,
  category: "information media",
  alternates: { canonical: site.url },
  manifest: "/site.webmanifest",
  // favicon は app/icon.png（透明背景）/ app/apple-icon.png を Next が自動採用
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "ja_JP",
    type: "website",
    images: [{ url: site.url + site.ogImage, width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.url + site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={geistSans.variable + " " + geistMono.variable}>
        {/* ローディング Lottie(JSON) を先読みし、ローダー表示と同時に再生が始まるようにする */}
        <link rel="prefetch" href="/lottie/es-loading.json" as="fetch" crossOrigin="anonymous" />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <GlobalRouteLoader />
        <SmoothScroll />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
