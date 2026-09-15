"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPage, buttonClass, ghostButtonClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { Project } from "@/lib/types";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error } = await adminQuery<Project[]>({
      table: "projects",
      op: "select",
      order: { column: "sort_order", ascending: true },
    });
    if (error) {
      setStatus(error);
      return;
    }
    setProjects(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("¿Eliminar este proyecto y sus imágenes?")) return;
    const { error } = await adminQuery({
      table: "projects",
      op: "delete",
      match: { id },
    });
    if (error) {
      setStatus(error);
      return;
    }
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  return (
    <AdminPage
      title="Proyectos"
      description="Las obras y las fotos se guardan en Supabase."
      actions={
        <Link href="/admin/proyectos/nuevo" className={buttonClass}>
          Nueva obra
        </Link>
      }
    >
      {status ? <p className="mb-4 text-sm text-bronze">{status}</p> : null}
      <div className="divide-y divide-line border-y border-line">
        {projects.map((project) => (
          <article key={project.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="font-serif text-2xl">{project.title}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone">
                {project.year} · {project.category} · {project.published ? "Publicado" : "Borrador"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/proyectos/${project.id}`} className={ghostButtonClass}>
                Editar
              </Link>
              <button type="button" className={ghostButtonClass} onClick={() => void remove(project.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {!projects.length ? (
          <p className="py-10 text-sm text-stone">Todavía no hay proyectos en Supabase.</p>
        ) : null}
      </div>
    </AdminPage>
  );
}
