"use client";

import Link from "next/link";
import { useState } from "react";
import { MediaArrow, SlideIndex, useSwipe } from "@/components/site/MediaArrow";
import { MediaBlock } from "@/components/site/MediaBlock";
import { Photo } from "@/components/site/Photo";
import type { Project, ProjectImage } from "@/lib/types";

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
  const total = Math.max(slides.length, 1);
  const current = slides[index];

  function go(step: number) {
    if (slides.length < 2) return;
    setIndex((value) => (value + step + slides.length) % slides.length);
  }

  const swipe = useSwipe(go);

  return (
    <section className="bg-paper">
      <div
        className="relative mx-auto flex w-full max-w-5xl touch-pan-y justify-center bg-paper"
        {...swipe}
      >
        <div className="relative mx-auto w-fit max-w-full">
          {current?.image ? (
            <MediaBlock item={current.image} alt={project.title} layout="natural" />
          ) : current?.cover ? (
            <Photo
              src={current.cover}
              alt={project.title}
              priority
              className="mx-auto block max-h-[62svh] w-auto max-w-full object-contain md:max-h-[68svh]"
            />
          ) : (
            <div className="h-64 w-full bg-ivory" />
          )}
          {slides.length > 1 ? (
            <>
              <MediaArrow side="left" label="Foto anterior" onClick={() => go(-1)} />
              <MediaArrow side="right" label="Foto siguiente" onClick={() => go(1)} />
              <SlideIndex index={index} total={total} />
            </>
          ) : null}
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
            {project.category} · {project.year}
          </p>
          <h1 className="display-sm mt-2 break-words">{project.title}</h1>
        </div>
        <div className="flex gap-3">
          {prev ? (
            <Link
              href={`/proyectos/${prev.slug}`}
              className="inline-flex h-11 flex-1 items-center justify-center border border-ink px-4 text-[11px] uppercase tracking-[0.18em] md:flex-none"
            >
              ← Obra
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/proyectos/${next.slug}`}
              className="inline-flex h-11 flex-1 items-center justify-center bg-ink px-4 text-[11px] uppercase tracking-[0.18em] text-ivory md:flex-none"
            >
              Obra →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
