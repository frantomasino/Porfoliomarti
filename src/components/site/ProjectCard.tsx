"use client";

import Link from "next/link";
import { Slideshow } from "@/components/site/Slideshow";
import { projectPhotoUrls } from "@/lib/media";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index?: number;
}) {
  const number = String((index ?? 0) + 1).padStart(2, "0");
  const photos = projectPhotoUrls(project);

  return (
    <article className="flex h-full min-w-0 flex-col">
      <Slideshow
        photos={photos}
        alt={project.title}
        width={1400}
        className="aspect-[4/5] w-full md:aspect-[4/3]"
        empty={
          <div className="flex h-full items-end bg-ivory px-6 py-6">
            <p className="font-serif text-4xl font-light text-line">{number}</p>
          </div>
        }
      />
      <Link
        href={`/proyectos/${project.slug}`}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
            {number} / {project.category}
            {project.year ? ` / ${project.year}` : ""}
          </p>
          <h3 className="mt-1 font-serif text-[1.55rem] font-light leading-[1.15] break-words md:text-[1.85rem]">
            {project.title}
          </h3>
          {project.location ? (
            <p className="mt-2 text-sm leading-relaxed text-stone">{project.location}</p>
          ) : null}
        </div>
        <span className="inline-flex w-fit shrink-0 border border-ink px-3 py-2 text-[11px] uppercase tracking-[0.18em]">
          Ver
        </span>
      </Link>
      {project.excerpt ? (
        <p className="mt-3 max-w-xl text-[0.82rem] font-light leading-[1.9] text-stone">{project.excerpt}</p>
      ) : null}
    </article>
  );
}
