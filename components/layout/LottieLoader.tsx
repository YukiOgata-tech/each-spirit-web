"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/** Each Spirit のローディング Lottie（dotLottie 形式・背景透過）。public/lottie に配置。 */
export function LottieLoader({ size = 200 }: { size?: number }) {
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
