"use client";

import { MediaArrow, SlideIndex, useSwipe } from "@/components/site/MediaArrow";
import { Photo } from "@/components/site/Photo";
import { cx } from "@/lib/utils";
import { useState } from "react";

export function Slideshow({
  photos,
  alt,
  className,
  empty,
}: {
  photos: string[];
  alt: string;
  className?: string;
  empty?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const total = photos.length;
  const photo = photos[index] ?? "";

  function go(step: number) {
    if (total < 2) return;
    setIndex((current) => (current + step + total) % total);
  }

  const swipe = useSwipe(go);

  return (
    <div className={cx("relative overflow-hidden bg-line touch-pan-y", className)} {...swipe}>
      {photo ? (
        <Photo src={photo} alt={alt} priority className="absolute inset-0 h-full w-full object-cover" />
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
