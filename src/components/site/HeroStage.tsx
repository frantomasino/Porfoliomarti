"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/site/Photo";
import { cx } from "@/lib/utils";

export function HeroStage({ photos, alt }: { photos: string[]; alt: string }) {
  const layer = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const slides = photos.filter(Boolean);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
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
    <div ref={layer} className="absolute inset-[-8%] will-change-transform">
      {slides.map((src, i) => (
        <div key={`${src}-${i}`} className={cx("hero-slide", i === index && "is-on")}>
          <Photo src={src} alt={alt} priority={i === 0} className="hero-ken h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
