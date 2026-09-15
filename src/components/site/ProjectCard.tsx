"use client";

import Link from "next/link";
import { Slideshow } from "@/components/site/Slideshow";
import { projectPhotoUrls } from "@/lib/media";
import { cx } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
  tall = false,
}: {
  project: Project;
  index?: number;
  tall?: boolean;
}) {
  const number = String((index ?? 0) + 1).padStart(2, "0");
  const photos = projectPhotoUrls(project);
  const meta = [project.location, project.year].filter(Boolean).join(" · ");

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Slideshow
        photos={photos}
        alt={project.title}
        width={1400}
        className={cx(
          "h-[min(68svh,26rem)] w-full",
          tall ? "md:h-[36rem]" : "md:h-[23.75rem]",
        )}
        empty={
          <div className="flex h-full items-end bg-ink px-6 py-6">
            <p className="font-serif text-4xl font-light text-ivory/15">{number}</p>
          </div>
        }
      >
        <Link href={`/proyectos/${project.slug}`} className="absolute inset-0 z-[5]">
          <span className="sr-only">Ver {project.title}</span>
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] bg-gradient-to-t from-ink/80 via-ink/25 to-transparent px-5 pb-5 pt-16">
          {project.category ? (
            <p className="text-[8px] uppercase tracking-[0.25em] text-bronze">{project.category}</p>
          ) : null}
          <h3 className="mt-1 font-serif text-[1.35rem] font-light leading-[1.15] text-ivory break-words md:text-[1.5rem]">
            {project.title}
          </h3>
          {meta ? <p className="mt-1 text-[9px] tracking-wide text-ivory/45">{meta}</p> : null}
        </div>
        <Link
          href={`/proyectos/${project.slug}`}
          className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 border border-ivory/25 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-ivory/85 backdrop-blur-sm transition-colors hover:border-bronze hover:text-bronze md:translate-y-1.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Ver más
        </Link>
      </Slideshow>
      {project.excerpt ? (
        <div className="border-l-2 border-bronze bg-ivory px-5 py-5">
          <p className="text-[8px] uppercase tracking-[0.22em] text-bronze">
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </p>
          <p className="mt-3 text-[0.82rem] font-light leading-[2] text-stone">{project.excerpt}</p>
        </div>
      ) : null}
    </article>
  );
}
