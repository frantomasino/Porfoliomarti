"use client";

import { useEffect, useState } from "react";
import { AdminPage, buttonClass, Field, fieldClass, ghostButtonClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { Service } from "@/lib/types";

const blank: Omit<Service, "id"> = {
  title: "",
  description: "",
  sort_order: 0,
};

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [draft, setDraft] = useState(blank);
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error } = await adminQuery<Service[]>({
      table: "services",
      op: "select",
      order: { column: "sort_order", ascending: true },
    });
    if (error) {
      setStatus(error);
      return;
    }
    setServices(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await adminQuery({
      table: "services",
      op: "insert",
      data: draft,
    });
    if (error) {
      setStatus(error);
      return;
    }
    setDraft(blank);
    await load();
  }

  async function save(service: Service) {
    const { error } = await adminQuery({
      table: "services",
      op: "update",
      data: {
        title: service.title,
        description: service.description,
        sort_order: service.sort_order,
      },
      match: { id: service.id },
    });
    setStatus(error ? error : "Guardado en Supabase.");
  }

  async function remove(id: string) {
    await adminQuery({
      table: "services",
      op: "delete",
      match: { id },
    });
    setServices((current) => current.filter((service) => service.id !== id));
  }

  return (
    <AdminPage title="Servicios" description="Los servicios aparecen en la página Estudio.">
      {status ? <p className="mb-6 text-sm text-stone">{status}</p> : null}
      <form onSubmit={add} className="mb-12 grid gap-4 border border-line p-5">
        <p className="font-serif text-2xl">Nuevo servicio</p>
        <Field label="Título">
          <input className={fieldClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
        </Field>
        <Field label="Descripción">
          <textarea
            rows={3}
            className={fieldClass}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </Field>
        <button type="submit" className={`${buttonClass} w-fit`}>
          Agregar
        </button>
      </form>
      <div className="grid gap-5">
        {services.map((service) => (
          <article key={service.id} className="grid gap-3 border border-line p-5">
            <input
              className={fieldClass}
              value={service.title}
              onChange={(e) =>
                setServices((current) =>
                  current.map((item) => (item.id === service.id ? { ...item, title: e.target.value } : item)),
                )
              }
            />
            <textarea
              rows={3}
              className={fieldClass}
              value={service.description}
              onChange={(e) =>
                setServices((current) =>
                  current.map((item) =>
                    item.id === service.id ? { ...item, description: e.target.value } : item,
                  ),
                )
              }
            />
            <div className="flex gap-3">
              <input
                type="number"
                className={`${fieldClass} w-24`}
                value={service.sort_order}
                onChange={(e) =>
                  setServices((current) =>
                    current.map((item) =>
                      item.id === service.id ? { ...item, sort_order: Number(e.target.value) } : item,
                    ),
                  )
                }
              />
              <button type="button" className={buttonClass} onClick={() => void save(service)}>
                Guardar
              </button>
              <button type="button" className={ghostButtonClass} onClick={() => void remove(service.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminPage>
  );
}
