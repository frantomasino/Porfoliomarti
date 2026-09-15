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
        className="aspect-[4/3]"
        empty={
          <div className="flex h-full items-end bg-ivory px-6 py-6">
            <p className="font-serif text-4xl text-line">{number}</p>
          </div>
        }
      />
      <Link href={`/proyectos/${project.slug}`} className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
            {number} / {project.category} / {project.year}
          </p>
          <h3 className="display-sm mt-1">{project.title}</h3>
          {project.location ? (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">{project.location}</p>
          ) : null}
        </div>
        <span className="mt-1 shrink-0 text-[11px] uppercase tracking-[0.18em] text-bronze">
          Ver
        </span>
      </Link>
    </article>
  );
}
