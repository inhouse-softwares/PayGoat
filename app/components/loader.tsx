"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <DotLottieReact
        src="/Loading-animation-blue.lottie"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
}