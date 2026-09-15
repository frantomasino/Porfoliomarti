import Link from "next/link";
import { Photo } from "@/components/site/Photo";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
  large = false,
}: {
  project: Project;
  index?: number;
  large?: boolean;
}) {
  const number = String((index ?? 0) + 1).padStart(2, "0");

  return (
    <Link href={`/proyectos/${project.slug}`} className="group block">
      <article>
        <div className={`relative overflow-hidden bg-line ${large ? "aspect-[4/5] md:aspect-[16/10]" : "aspect-[4/5] md:aspect-[4/3]"}`}>
          {project.cover_url ? (
            <Photo
              src={project.cover_url}
              alt={project.title}
              className="img-zoom h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone">Sin imagen</div>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
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
        </div>
      </article>
    </Link>
  );
}
