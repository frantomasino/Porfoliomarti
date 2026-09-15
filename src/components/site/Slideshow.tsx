"use client";

import { useRef, useState } from "react";
import { MediaArrow, SlideIndex } from "@/components/site/MediaArrow";
import { Photo } from "@/components/site/Photo";
import { cx } from "@/lib/utils";

export function Slideshow({
  photos,
  alt,
  className,
  width = 1400,
  empty,
}: {
  photos: string[];
  alt: string;
  className?: string;
  width?: number;
  empty?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const total = photos.length;
  const photo = photos[index] ?? "";

  function go(step: number) {
    if (total < 2) return;
    setIndex((current) => (current + step + total) % total);
  }

  return (
    <div
      className={cx("relative overflow-hidden bg-line touch-pan-y", className)}
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (startX.current == null) return;
        const delta = event.changedTouches[0].clientX - startX.current;
        startX.current = null;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
      }}
    >
      {photo ? (
        <Photo
          src={photo}
          alt={alt}
          width={width}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0">{empty}</div>
      )}
      {total > 1 ? (
        <>
          <MediaArrow side="left" label="Anterior" onClick={() => go(-1)} />
          <MediaArrow side="right" label="Siguiente" onClick={() => go(1)} />
          <SlideIndex index={index} total={total} />
        </>
      ) : null}
    </div>
  );
}
