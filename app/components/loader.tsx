"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2, LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-start h-screen">
      <Loader2 className="animate-spin text-blue-500" size={40}/>
    </div>
  );
}