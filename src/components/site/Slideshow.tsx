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

  function go(step: number) {
    if (total < 2) return;
    setIndex((current) => (current + step + total) % total);
  }

  const swipe = useSwipe(go);

  return (
    <div className={cx("group relative overflow-hidden bg-line touch-pan-y", className)} {...swipe}>
      {total ? (
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((src, photoIndex) => (
            <div key={`${src}-${photoIndex}`} className="relative h-full min-w-full overflow-hidden">
              <Photo
                src={src}
                alt={alt}
                priority={photoIndex === 0}
                className="slide-zoom absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
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
