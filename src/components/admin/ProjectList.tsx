"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPage, buttonClass, ghostButtonClass, OrderButtons } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { Project } from "@/lib/types";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

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

  async function persistOrder(next: Project[]) {
    setProjects(next);
    const results = await Promise.all(
      next.map((project, index) =>
        adminQuery({
          table: "projects",
          op: "update",
          data: { sort_order: index + 1 },
          match: { id: project.id },
        }),
      ),
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setStatus(failed.error);
      await load();
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (busy || target < 0 || target >= projects.length) return;
    setBusy(true);
    setStatus("");
    const next = [...projects];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    await persistOrder(next);
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta obra y sus fotos?")) return;
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
      title="Obras"
      description="El orden de esta lista es el que se ve en el sitio. Flechas para subir o bajar."
      actions={
        <Link href="/admin/proyectos/nuevo" className={buttonClass}>
          Nueva obra
        </Link>
      }
    >
      {status ? <p className="mb-4 text-sm text-bronze">{status}</p> : null}
      <div className="divide-y divide-line border-y border-line">
        {projects.map((project, index) => (
          <article key={project.id} className="flex flex-col gap-4 py-5">
            <div className="flex min-w-0 items-start gap-3">
              <OrderButtons
                disableUp={busy || index === 0}
                disableDown={busy || index === projects.length - 1}
                onUp={() => void move(index, -1)}
                onDown={() => void move(index, 1)}
              />
              {project.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.cover_url}
                  alt=""
                  className="h-14 w-14 shrink-0 bg-ivory object-contain"
                />
              ) : (
                <div className="h-14 w-14 shrink-0 bg-ivory" />
              )}
              <div className="min-w-0">
                <p className="break-words text-base font-medium">{project.title || "Sin título"}</p>
                <p className="mt-1 text-sm text-stone">
                  {project.published ? "Publicada" : "Borrador"}
                  {project.year ? ` · ${project.year}` : ""}
                  {project.category ? ` · ${project.category}` : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/proyectos/${project.id}`} className={`${ghostButtonClass} flex-1 md:flex-none`}>
                Editar
              </Link>
              <button type="button" className={`${ghostButtonClass} flex-1 md:flex-none`} onClick={() => void remove(project.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {!projects.length ? (
          <p className="py-10 text-sm leading-relaxed text-stone">
            Todavía no hay obras. Tocá Nueva obra para cargar la primera.
          </p>
        ) : null}
      </div>
    </AdminPage>
  );
}
