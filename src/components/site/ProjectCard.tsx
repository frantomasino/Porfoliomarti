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
        <div className={`relative overflow-hidden bg-line ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
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
        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {number} / {project.category} / {project.year}
            </p>
            <h3 className="mt-1 font-serif text-3xl leading-none md:text-4xl">{project.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">{project.location}</p>
          </div>
          <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-bronze opacity-0 transition-opacity group-hover:opacity-100">
            Ver obra
          </span>
        </div>
      </article>
    </Link>
  );
}
