"use client";

import { useEffect, useState } from "react";
import { displayImageUrl } from "@/lib/media";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
};

export function Photo({ src, alt, className, priority, width = 1400 }: PhotoProps) {
  const optimized = displayImageUrl(src, width);
  const [current, setCurrent] = useState(optimized);

  useEffect(() => {
    setCurrent(displayImageUrl(src, width));
  }, [src, width]);

  if (!src) return null;

  return (
    // Native img: Next optimizer failed on some Supabase URLs; we serve a resized copy instead.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      sizes="(max-width: 768px) 100vw, 900px"
      onError={() => {
        if (current !== src) setCurrent(src);
      }}
    />
  );
}
