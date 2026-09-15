"use client";

import { useEffect, useState } from "react";
import { AdminPage, buttonClass, Field, fieldClass, ghostButtonClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { TimelineItem, TimelineKind } from "@/lib/types";

const kinds: { id: TimelineKind; label: string }[] = [
  { id: "experience", label: "Práctica" },
  { id: "education", label: "Formación" },
  { id: "award", label: "Reconocimientos" },
];

const blank: Omit<TimelineItem, "id"> = {
  kind: "experience",
  title: "",
  subtitle: "",
  period: "",
  description: "",
  sort_order: 0,
};

export function TimelineManager() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [draft, setDraft] = useState(blank);
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error } = await adminQuery<TimelineItem[]>({
      table: "timeline_items",
      op: "select",
      order: { column: "sort_order", ascending: true },
    });
    if (error) {
      setStatus(error);
      return;
    }
    setItems(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await adminQuery({
      table: "timeline_items",
      op: "insert",
      data: draft,
    });
    if (error) {
      setStatus(error);
      return;
    }
    setDraft(blank);
    setStatus("Guardado en Supabase.");
    await load();
  }

  async function save(item: TimelineItem) {
    const { error } = await adminQuery({
      table: "timeline_items",
      op: "update",
      data: {
        title: item.title,
        subtitle: item.subtitle,
        period: item.period,
        description: item.description,
        sort_order: item.sort_order,
        kind: item.kind,
      },
      match: { id: item.id },
    });
    if (error) setStatus(error);
    else setStatus("Guardado en Supabase.");
  }

  async function remove(id: string) {
    await adminQuery({
      table: "timeline_items",
      op: "delete",
      match: { id },
    });
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <AdminPage
      title="Trayectoria"
      description="Experiencia, formación y premios que se muestran en la página Estudio."
    >
      {status ? <p className="mb-6 text-sm text-stone">{status}</p> : null}

      <form onSubmit={add} className="mb-14 grid gap-4 border border-line p-5">
        <p className="font-serif text-2xl">Nueva entrada</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tipo">
            <select
              className={fieldClass}
              value={draft.kind}
              onChange={(e) => setDraft({ ...draft, kind: e.target.value as TimelineKind })}
            >
              {kinds.map((kind) => (
                <option key={kind.id} value={kind.id}>
                  {kind.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Período">
            <input className={fieldClass} value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value })} />
          </Field>
          <Field label="Título">
            <input className={fieldClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          </Field>
          <Field label="Subtítulo">
            <input className={fieldClass} value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
          </Field>
        </div>
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

      {kinds.map((kind) => (
        <section key={kind.id} className="mb-12">
          <h2 className="font-serif text-3xl">{kind.label}</h2>
          <div className="mt-5 grid gap-5">
            {items
              .filter((item) => item.kind === kind.id)
              .map((item) => (
                <article key={item.id} className="grid gap-3 border border-line p-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      className={fieldClass}
                      value={item.title}
                      onChange={(e) =>
                        setItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id ? { ...entry, title: e.target.value } : entry,
                          ),
                        )
                      }
                    />
                    <input
                      className={fieldClass}
                      value={item.period}
                      onChange={(e) =>
                        setItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id ? { ...entry, period: e.target.value } : entry,
                          ),
                        )
                      }
                    />
                    <input
                      className={fieldClass}
                      value={item.subtitle}
                      onChange={(e) =>
                        setItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id ? { ...entry, subtitle: e.target.value } : entry,
                          ),
                        )
                      }
                    />
                    <input
                      type="number"
                      className={fieldClass}
                      value={item.sort_order}
                      onChange={(e) =>
                        setItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id ? { ...entry, sort_order: Number(e.target.value) } : entry,
                          ),
                        )
                      }
                    />
                  </div>
                  <textarea
                    rows={3}
                    className={fieldClass}
                    value={item.description}
                    onChange={(e) =>
                      setItems((current) =>
                        current.map((entry) =>
                          entry.id === item.id ? { ...entry, description: e.target.value } : entry,
                        ),
                      )
                    }
                  />
                  <div className="flex gap-3">
                    <button type="button" className={buttonClass} onClick={() => void save(item)}>
                      Guardar
                    </button>
                    <button type="button" className={ghostButtonClass} onClick={() => void remove(item.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </AdminPage>
  );
}
