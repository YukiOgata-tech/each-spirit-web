import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GlobalRouteLoader } from "@/components/layout/GlobalRouteLoader";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/content/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// ISR: 全ルートのデフォルト再生成間隔（1時間）。content/** を seed したら最大1時間で
// 本番に反映される。cookies を使う動的ページ（/account など）は自動的に動的のまま。
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s | " + site.name,
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
  icons: {
    icon: [
      { url: "/brand/each-spirit-mark.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/brand/each-spirit-mark.png", type: "image/png" }],
  },
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
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <GlobalRouteLoader />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
