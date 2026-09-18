"use client";

import { useSearchParams } from "next/navigation";
import { MessagesList } from "@/components/admin/MessagesList";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { ProjectList } from "@/components/admin/ProjectList";
import { SectionsManager } from "@/components/admin/SectionsManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { SiteForm } from "@/components/admin/SiteForm";
import { TimelineManager } from "@/components/admin/TimelineManager";

export function AdminDesk({ configured }: { configured: boolean }) {
  const searchParams = useSearchParams();
  const obra = searchParams.get("obra");

  return (
    <div className="grid gap-2">
      <div className="mb-4 md:mb-6">
        <h1 className="font-serif text-[1.85rem] leading-tight text-ink md:text-4xl">Editar el sitio</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone">
          Todo está en esta página, en orden. Guardá en cada bloque.
        </p>
      </div>
      {!configured ? (
        <p className="mb-6 border border-line bg-ivory px-5 py-4 text-sm leading-relaxed text-stone">
          El panel todavía no está conectado. Avisale a quien publicó el sitio.
        </p>
      ) : null}
      <SiteForm embedded />
      {obra ? (
        <ProjectEditor projectId={obra === "nuevo" ? undefined : obra} embedded />
      ) : (
        <ProjectList embedded />
      )}
      <ServicesManager embedded />
      <TimelineManager embedded />
      <MessagesList embedded />
      <SectionsManager embedded />
    </div>
  );
}
