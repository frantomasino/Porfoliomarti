"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { MediaBlock } from "@/components/site/MediaBlock";
import { Photo } from "@/components/site/Photo";
import type { Project, ProjectImage } from "@/lib/types";
import { cx } from "@/lib/utils";

export function ProjectViewer({
  project,
  prev,
  next,
}: {
  project: Project;
  prev?: Project;
  next?: Project;
}) {
  const slides: Array<{ key: string; image?: ProjectImage; cover?: string }> = [];
  if (project.cover_url) slides.push({ key: "cover", cover: project.cover_url });
  for (const item of project.images ?? []) {
    if (item.url && item.url !== project.cover_url) slides.push({ key: item.id, image: item });
  }

  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const total = Math.max(slides.length, 1);
  const current = slides[index];

  function go(step: number) {
    if (slides.length < 2) return;
    setIndex((value) => (value + step + slides.length) % slides.length);
  }

  return (
    <section className="bg-paper">
      <div
        className="relative mx-auto w-fit max-w-full"
        onTouchStart={(event) => {
          startX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (startX.current == null) return;
          const delta = event.changedTouches[0].clientX - startX.current;
          startX.current = null;
          if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
        }}
      >
        {current?.image ? (
          <MediaBlock item={current.image} alt={project.title} layout="natural" />
        ) : current?.cover ? (
          <Photo
            src={current.cover}
            alt={project.title}
            priority
            width={1400}
            className="block h-auto max-h-[78vh] w-auto max-w-full"
          />
        ) : (
          <div className="h-64 w-full max-w-3xl bg-ivory" />
        )}
        {slides.length > 1 ? (
          <>
            <Arrow side="left" onClick={() => go(-1)} />
            <Arrow side="right" onClick={() => go(1)} />
            <span className="absolute bottom-4 left-4 z-10 bg-ink/70 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-ivory">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </>
        ) : null}
      </div>
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-6 py-8 md:px-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
            {project.category} · {project.year}
          </p>
          <h1 className="display-sm mt-2 max-w-[16ch]">{project.title}</h1>
        </div>
        <div className="flex gap-3">
          {prev ? (
            <Link
              href={`/proyectos/${prev.slug}`}
              className="inline-flex h-11 items-center border border-ink px-4 text-[11px] uppercase tracking-[0.18em]"
            >
              ← Obra
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/proyectos/${next.slug}`}
              className="inline-flex h-11 items-center bg-ink px-4 text-[11px] uppercase tracking-[0.18em] text-ivory"
            >
              Obra →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Foto anterior" : "Foto siguiente"}
      className={cx(
        "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/92 text-ink",
        side === "left" ? "left-3" : "right-3",
      )}
      onClick={onClick}
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
