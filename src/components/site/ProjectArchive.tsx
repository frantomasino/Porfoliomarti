"use client";

import { useMemo, useState } from "react";
import { EmptyFrame } from "@/components/site/EmptyFrame";
import { ProjectCard } from "@/components/site/ProjectCard";
import type { Project } from "@/lib/types";
import { cx } from "@/lib/utils";

const layouts = [
  { col: "md:col-span-7", tall: true },
  { col: "md:col-span-5", tall: false },
  { col: "md:col-span-5", tall: false },
  { col: "md:col-span-7", tall: true },
];

export function WorksGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-12">
      {projects.map((project, index) => {
        const layout = projects.length === 1 ? { col: "md:col-span-12", tall: true } : layouts[index % 4];
        return (
          <div key={project.id} className={layout.col}>
            <ProjectCard project={project} index={index} tall={layout.tall} />
          </div>
        );
      })}
    </div>
  );
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const [active, setActive] = useState("Todas");
  const visible =
    active === "Todas" ? projects : projects.filter((project) => project.category === active);
  const showFilters = projects.length > 0 && categories.length > 2;

  return (
    <>
      {showFilters ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cx(
                "min-h-11 border px-4 text-[11px] uppercase tracking-[0.2em] transition-colors",
                active === category ? "border-ink bg-ink text-ivory" : "border-line text-stone hover:border-ink",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}
      {projects.length ? (
        <div className={showFilters ? "mt-12" : "mt-12"}>
          <WorksGrid projects={visible} />
        </div>
      ) : (
        <EmptyFrame kicker="Archivo" title="El archivo se actualiza con cada encargo." />
      )}
    </>
  );
}
