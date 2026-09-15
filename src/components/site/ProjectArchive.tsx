"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/site/ProjectCard";
import type { Project } from "@/lib/types";
import { cx } from "@/lib/utils";

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
        <div className={`grid gap-16 md:grid-cols-2 ${showFilters ? "mt-16" : "mt-12"}`}>
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-stone">Todavía no hay obras publicadas.</p>
      )}
    </>
  );
}
