import Script from "next/script";

type GoogleAdSenseProps = {
  clientId?: string;
};

export function GoogleAdSense({ clientId }: GoogleAdSenseProps) {
  if (!clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
