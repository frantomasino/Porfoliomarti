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
  children,
}: {
  photos: string[];
  alt: string;
  className?: string;
  width?: number;
  empty?: React.ReactNode;
  children?: React.ReactNode;
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
      className={cx("group/slide relative overflow-hidden bg-ink touch-pan-y", className)}
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
          className="absolute inset-0 h-full w-full object-cover opacity-100 transition duration-700 ease-out md:opacity-[0.84] md:group-hover:opacity-100 md:group-hover:scale-[1.04]"
        />
      ) : (
        empty
      )}
      {children}
      {total > 1 ? (
        <>
          <Arrow side="left" onClick={() => go(-1)} />
          <Arrow side="right" onClick={() => go(1)} />
          <span className="pointer-events-none absolute left-4 top-4 z-10 bg-ink/40 px-2.5 py-1 text-[8px] uppercase tracking-[0.16em] text-ivory/80 backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 opacity-100 transition-opacity md:bottom-14 md:opacity-0 md:group-hover:opacity-100">
            {photos.map((_, dot) => (
              <button
                key={dot}
                type="button"
                aria-label={`Foto ${dot + 1}`}
                className={cx(
                  "h-[5px] w-[5px] rounded-full transition",
                  dot === index ? "scale-125 bg-bronze" : "bg-ivory/35",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIndex(dot);
                }}
              />
            ))}
          </div>
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
        "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/45 text-[13px] text-ivory/85 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}
