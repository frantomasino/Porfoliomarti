"use client";

import { useEffect, useState } from "react";

export function PageBanner({ src, alt }: { src?: string; alt: string }) {
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const image = new Image();
    const decide = () => {
      if (cancelled || !image.naturalWidth) return;
      setLandscape(image.naturalWidth > image.naturalHeight * 1.15);
    };
    image.onload = decide;
    image.src = src;
    if (image.complete) decide();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src || !landscape) return null;

  return (
    <div className="overflow-hidden bg-ink">
      <div className="relative h-[min(38svh,18rem)] w-full md:h-[min(46svh,24rem)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
}
