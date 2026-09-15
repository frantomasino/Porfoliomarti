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
  large?: boolean;
}) {
  const number = String((index ?? 0) + 1).padStart(2, "0");
  const photos = projectPhotoUrls(project);

  return (
    <article>
      <Slideshow
        photos={photos}
        alt={project.title}
        width={1100}
        empty={
          <div className="flex h-full items-end bg-ivory px-6 py-6">
            <p className="font-serif text-4xl text-line">{number}</p>
          </div>
        }
      />
      <Link href={`/proyectos/${project.slug}`} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
            {number} / {project.category} / {project.year}
          </p>
          <h3 className="mt-1 font-serif text-[1.55rem] leading-[1.15] break-all md:text-[2.1rem] md:break-words">
            {project.title}
          </h3>
          {project.location ? (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">{project.location}</p>
          ) : null}
        </div>
        <span className="inline-flex w-fit shrink-0 border border-ink px-3 py-2 text-[11px] uppercase tracking-[0.18em]">
          Ver
        </span>
      </Link>
    </article>
  );
}
