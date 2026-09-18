"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/site/Photo";
import { cx } from "@/lib/utils";

export function HeroStage({ photos, alt }: { photos: string[]; alt: string }) {
  const layer = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [behind, setBehind] = useState(0);
  const slides = photos.filter(Boolean);

  function go(next: number) {
    setIndex((current) => {
      setBehind(current);
      return next;
    });
  }

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % slides.length;
        setBehind(current);
        return next;
      });
    }, 8200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const node = layer.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onScroll = () => {
      node.style.transform = `translate3d(0, ${window.scrollY * 0.14}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!slides.length) return null;

  return (
    <>
      <div ref={layer} className="absolute inset-[-8%] will-change-transform">
        {slides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={cx("hero-slide", (i === index || i === behind) && "is-on", i === index && "is-front")}
          >
            <div className="hero-ken">
              <Photo src={src} alt={alt} priority={i === 0} className="h-full w-full object-cover" />
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Foto ${i + 1}`}
              className={cx(
                "h-px border-0 transition-all duration-400",
                i === index ? "w-10 bg-ivory" : "w-6 bg-ivory/45",
              )}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
