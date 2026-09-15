"use client";

import { useRef, useState } from "react";
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
      className={cx(
        "relative aspect-[4/5] overflow-hidden bg-line touch-pan-y md:aspect-[4/3]",
        className,
      )}
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
        empty
      )}
      {total > 1 ? (
        <>
          <Arrow side="left" onClick={() => go(-1)} />
          <Arrow side="right" onClick={() => go(1)} />
          <span className="absolute bottom-3 left-3 z-10 bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ivory">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </>
      ) : null}
    </div>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Anterior" : "Siguiente"}
      className={cx(
        "absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-ivory/95 text-ink",
        side === "left" ? "left-2" : "right-2",
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={side === "left" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    </button>
  );
}
