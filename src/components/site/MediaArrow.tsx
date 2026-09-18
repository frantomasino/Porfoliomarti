"use client";

import { useRef, type TouchEvent } from "react";
import { cx } from "@/lib/utils";

export function useSwipe(go: (step: number) => void) {
  const startX = useRef<number | null>(null);
  return {
    onTouchStart(event: TouchEvent) {
      startX.current = event.changedTouches[0]?.clientX ?? null;
    },
    onTouchEnd(event: TouchEvent) {
      if (startX.current == null) return;
      const delta = event.changedTouches[0].clientX - startX.current;
      startX.current = null;
      if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    },
  };
}

export function MediaArrow({
  side,
  onClick,
  label,
  always = false,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
  always?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        "absolute top-1/2 z-20 h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center transition-opacity duration-300",
        side === "left" ? "left-1.5 md:left-2.5" : "right-1.5 md:right-2.5",
        always
          ? "flex opacity-100"
          : "hidden md:flex md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/45 text-ivory backdrop-blur-[4px] transition-colors hover:bg-ink/70">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d={side === "left" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export function SlideIndex({
  index,
  total,
  placement = "bottom",
}: {
  index: number;
  total: number;
  placement?: "top" | "bottom";
}) {
  return (
    <span
      className={cx(
        "pointer-events-none absolute left-3 z-10 bg-ink/40 px-2 py-1 text-[8px] uppercase tracking-[0.18em] text-ivory/80 backdrop-blur-[4px] md:left-4",
        placement === "top" ? "top-3 md:top-4" : "bottom-3 md:bottom-4",
      )}
    >
      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </span>
  );
}
