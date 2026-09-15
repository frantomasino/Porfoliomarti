"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminPage, buttonClass, Field, fieldClass, ghostButtonClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { PageSection } from "@/lib/types";

const blank: Omit<PageSection, "id"> = {
  title: "",
  body: "",
  image_url: "",
  placement: "home",
  published: true,
  sort_order: 0,
};

export function SectionsManager() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [draft, setDraft] = useState(blank);
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error } = await adminQuery<PageSection[]>({
      table: "page_sections",
      op: "select",
      order: { column: "sort_order", ascending: true },
    });
    if (error) {
      setStatus(
        error.includes("page_sections")
          ? "Falta correr supabase/migration-appearance.sql en el SQL Editor."
          : error,
      );
      return;
    }
    setSections(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await adminQuery({
      table: "page_sections",
      op: "insert",
      data: draft,
    });
    if (error) {
      setStatus(error);
      return;
    }
    setDraft(blank);
    setStatus("Sección agregada.");
    await load();
  }

  async function save(section: PageSection) {
    const { error } = await adminQuery({
      table: "page_sections",
      op: "update",
      data: {
        title: section.title,
        body: section.body,
        image_url: section.image_url,
        placement: section.placement,
        published: section.published,
        sort_order: section.sort_order,
      },
      match: { id: section.id },
    });
    setStatus(error ? error : "Guardado en Supabase.");
  }

  async function remove(id: string) {
    await adminQuery({
      table: "page_sections",
      op: "delete",
      match: { id },
    });
    setSections((current) => current.filter((section) => section.id !== id));
  }

  return (
    <AdminPage
      title="Secciones"
      description="Agregá bloques nuevos (título, texto, foto) y elegí si van en Inicio, Nosotros, Contacto, Proyectos o en todas."
    >
      {status ? <p className="mb-6 text-sm text-stone">{status}</p> : null}
      <form onSubmit={add} className="mb-12 grid gap-4 border border-line p-5">
        <p className="font-serif text-2xl">Nueva sección</p>
        <Field label="Título">
          <input
            className={fieldClass}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            required
          />
        </Field>
        <Field label="Texto">
          <textarea
            rows={4}
            className={fieldClass}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
        </Field>
        <ImageUpload
          label="Imagen (opcional)"
          folder="sections"
          value={draft.image_url}
          onChange={(url) => setDraft({ ...draft, image_url: url })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Dónde se ve">
            <PlacementSelect
              value={draft.placement}
              onChange={(placement) => setDraft({ ...draft, placement })}
            />
          </Field>
          <Field label="Orden">
            <input
              type="number"
              className={fieldClass}
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </Field>
        </div>
        <button type="submit" className={`${buttonClass} w-fit`}>
          Agregar
        </button>
      </form>
      <div className="grid gap-5">
        {sections.map((section) => (
          <article key={section.id} className="grid gap-3 border border-line p-5">
            <input
              className={fieldClass}
              value={section.title}
              onChange={(e) =>
                setSections((current) =>
                  current.map((item) =>
                    item.id === section.id ? { ...item, title: e.target.value } : item,
                  ),
                )
              }
            />
            <textarea
              rows={4}
              className={fieldClass}
              value={section.body}
              onChange={(e) =>
                setSections((current) =>
                  current.map((item) =>
                    item.id === section.id ? { ...item, body: e.target.value } : item,
                  ),
                )
              }
            />
            <ImageUpload
              label="Imagen"
              folder="sections"
              value={section.image_url}
              onChange={(url) =>
                setSections((current) =>
                  current.map((item) => (item.id === section.id ? { ...item, image_url: url } : item)),
                )
              }
            />
            <div className="flex flex-wrap gap-3">
              <PlacementSelect
                value={section.placement}
                onChange={(placement) =>
                  setSections((current) =>
                    current.map((item) =>
                      item.id === section.id ? { ...item, placement } : item,
                    ),
                  )
                }
              />
              <input
                type="number"
                className={`${fieldClass} w-24`}
                value={section.sort_order}
                onChange={(e) =>
                  setSections((current) =>
                    current.map((item) =>
                      item.id === section.id
                        ? { ...item, sort_order: Number(e.target.value) }
                        : item,
                    ),
                  )
                }
              />
              <label className="flex items-center gap-2 text-sm text-stone">
                <input
                  type="checkbox"
                  checked={section.published}
                  onChange={(e) =>
                    setSections((current) =>
                      current.map((item) =>
                        item.id === section.id ? { ...item, published: e.target.checked } : item,
                      ),
                    )
                  }
                />
                Publicada
              </label>
              <button type="button" className={buttonClass} onClick={() => void save(section)}>
                Guardar
              </button>
              <button type="button" className={ghostButtonClass} onClick={() => void remove(section.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminPage>
  );
}

function PlacementSelect({
  value,
  onChange,
}: {
  value: PageSection["placement"];
  onChange: (value: PageSection["placement"]) => void;
}) {
  return (
    <select
      className={fieldClass}
      value={value}
      onChange={(e) => onChange(e.target.value as PageSection["placement"])}
    >
      <option value="home">Inicio</option>
      <option value="estudio">Nosotros</option>
      <option value="contacto">Contacto</option>
      <option value="proyectos">Proyectos</option>
      <option value="both">Inicio y nosotros</option>
      <option value="all">Todas las páginas</option>
    </select>
  );
}
