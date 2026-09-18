"use client";

import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { Slideshow } from "@/components/site/Slideshow";
import { projectPhotoUrls } from "@/lib/media";
import type { Project } from "@/lib/types";
import { statusLabel } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index?: number;
}) {
  const number = String((index ?? 0) + 1).padStart(2, "0");
  const photos = projectPhotoUrls(project);
  const href = `/proyectos/${project.slug}`;
  const meta = [statusLabel(project.status), project.location].filter(Boolean).join(" · ");

  return (
    <Reveal className="h-full" delay={(index ?? 0) * 110}>
      <article className="flex h-full min-w-0 flex-col">
        <Slideshow
          photos={photos}
          alt={project.title}
          className="work-shot aspect-[4/5] w-full bg-ink md:aspect-[4/3]"
          empty={
            <div className="flex h-full items-end bg-ivory px-6 py-6">
              <p className="font-serif text-4xl font-light text-line">{number}</p>
            </div>
          }
        >
          <Link href={href} className="absolute inset-0 z-[8] flex flex-col justify-end">
            <span className="work-veil pointer-events-none absolute inset-x-0 bottom-0" />
            <span className="relative z-[1] px-5 pb-5 md:px-6 md:pb-6 md:pr-28">
              {project.category ? (
                <span className="block text-[8px] uppercase tracking-[0.25em] text-ivory/90">{project.category}</span>
              ) : null}
              <span className="mt-1 block font-serif text-[1.35rem] font-light leading-[1.15] text-ivory md:text-[1.5rem]">
                {project.title}
              </span>
              {meta ? <span className="mt-1 block text-[9px] text-ivory/85">{meta}</span> : null}
            </span>
            <span className="work-ver absolute bottom-4 right-4 z-[1] inline-flex items-center gap-2 border border-ivory/35 bg-ink/25 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-ivory backdrop-blur-[4px] md:bottom-5 md:right-5">
              Ver obra
              <span className="work-ver-line" aria-hidden />
            </span>
          </Link>
        </Slideshow>
        {project.excerpt ? (
          <p className="mt-6 max-w-xl border-l-2 border-bronze pl-5 text-[0.82rem] font-light leading-[1.9] text-stone">
            {project.excerpt}
          </p>
        ) : null}
      </article>
    </Reveal>
  );
}
