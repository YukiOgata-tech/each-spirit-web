"use client";

import dynamic from "next/dynamic";

// wasm/canvas ベースのプレイヤーはクライアント限定で読み込む（SSR/プリレンダを回避）
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false },
);

/** Each Spirit のローディング Lottie（dotLottie 形式）。public/lottie に配置。 */
export function LottieLoader({ size = 168 }: { size?: number }) {
  return (
    <div className="mx-auto" style={{ width: size, height: size }} aria-hidden="true">
      <DotLottieReact
        src="/lottie/ES_loading01_2x_transparent_256_fps18.lottie"
        autoplay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
