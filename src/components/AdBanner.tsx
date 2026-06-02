"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_PUB_ID, ADS_ENABLED } from "@/lib/ads";

interface Props {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdBanner({ slot, format = "auto", className = "" }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  if (!ADS_ENABLED) {
    // Placeholder while ads aren't active
    return (
      <div className={`bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl flex items-center justify-center py-3 ${className}`}>
        <span className="text-xs font-bold text-pink-300">Ad Space</span>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_PUB_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
