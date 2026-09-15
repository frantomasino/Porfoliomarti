"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MediaGallery } from "@/components/admin/MediaGallery";
import { AdminPage, buttonClass, Field, fieldClass, ghostButtonClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { MediaKind, Project, ProjectImage } from "@/lib/types";
import { slugify } from "@/lib/utils";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  slug: "",
  category: "Residencial",
  year: new Date().getFullYear(),
  location: "",
  client: "",
  area: "",
  status: "Proyecto",
  excerpt: "",
  description: "",
  cover_url: "",
  featured: true,
  published: true,
  sort_order: 0,
};

export function ProjectEditor({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const [project, setProject] = useState(emptyProject);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(projectId));

  const derivedSlug = useMemo(
    () => (slugTouched ? project.slug : slugify(project.title)),
    [project.slug, project.title, slugTouched],
  );

  useEffect(() => {
    if (!projectId) return;
    void Promise.all([
      adminQuery<Project>({
        table: "projects",
        op: "select",
        match: { id: projectId },
        single: true,
      }),
      adminQuery<ProjectImage[]>({
        table: "project_images",
        op: "select",
        match: { project_id: projectId },
        order: { column: "sort_order", ascending: true },
      }),
    ]).then(([projectRes, imagesRes]) => {
      if (projectRes.data) {
        const data = projectRes.data;
        setProject({
          title: data.title,
          slug: data.slug,
          category: data.category,
          year: data.year,
          location: data.location,
          client: data.client,
          area: data.area,
          status: data.status,
          excerpt: data.excerpt,
          description: data.description,
          cover_url: data.cover_url,
          featured: data.featured,
          published: data.published,
          sort_order: data.sort_order,
        });
      }
      if (imagesRes.data) setImages(imagesRes.data);
    });
  }, [projectId]);

  function update<K extends keyof typeof emptyProject>(key: K, value: (typeof emptyProject)[K]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    try {
      const payload = {
        ...project,
        slug: derivedSlug || slugify(project.title) || `obra-${Date.now()}`,
        year: Number(project.year),
        sort_order: Number(project.sort_order),
      };

      if (projectId) {
        const { error } = await adminQuery({
          table: "projects",
          op: "update",
          data: payload,
          match: { id: projectId },
        });
        if (error) throw new Error(error);
        setStatus("Guardado en Supabase.");
      } else {
        const existing = await adminQuery<Pick<Project, "sort_order">[]>({
          table: "projects",
          op: "select",
          select: "sort_order",
        });
        payload.sort_order = Math.max(0, ...(existing.data ?? []).map((item) => item.sort_order)) + 1;
        const { data, error } = await adminQuery<{ id: string }>({
          table: "projects",
          op: "insert",
          data: payload,
          single: true,
        });
        if (error || !data) throw new Error(error || "No se pudo crear.");
        router.push(`/admin/proyectos/${data.id}`);
        router.refresh();
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function addMedia(url: string, caption = "", kind: MediaKind = "image") {
    if (!projectId || !url) return;
    const payload = {
      project_id: projectId,
      url,
      caption,
      kind,
      sort_order: images.length + 1,
    };
    let result = await adminQuery<ProjectImage>({
      table: "project_images",
      op: "insert",
      data: payload,
      single: true,
    });
    if (result.error?.includes("kind")) {
      const { kind: _kind, ...withoutKind } = payload;
      result = await adminQuery<ProjectImage>({
        table: "project_images",
        op: "insert",
        data: withoutKind,
        single: true,
      });
    }
    const { data, error } = result;
    if (error || !data) {
      throw new Error(error || "No se pudo agregar el archivo.");
    }
    setImages((current) => [...current, data]);
  }

  async function updateImage(image: ProjectImage) {
    await adminQuery({
      table: "project_images",
      op: "update",
      data: {
        caption: image.caption,
        sort_order: image.sort_order,
        url: image.url,
        kind: image.kind,
      },
      match: { id: image.id },
    });
    setImages((current) => current.map((item) => (item.id === image.id ? image : item)));
  }

  async function removeImage(id: string) {
    await adminQuery({
      table: "project_images",
      op: "delete",
      match: { id },
    });
    setImages((current) => current.filter((item) => item.id !== id));
  }

  async function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    const reindexed = next.map((item, order) => ({ ...item, sort_order: order + 1 }));
    setImages(reindexed);
    await Promise.all(
      reindexed.map((item) =>
        adminQuery({
          table: "project_images",
          op: "update",
          data: { sort_order: item.sort_order },
          match: { id: item.id },
        }),
      ),
    );
  }

  return (
    <AdminPage
      title={projectId ? "Editar obra" : "Nueva obra"}
      description="Portada, fotos y videos se guardan en Supabase. Cada proyecto puede tener una galería larga."
      actions={
        <Link href="/admin/proyectos" className={ghostButtonClass}>
          Volver
        </Link>
      }
    >
      <form onSubmit={save} className="grid gap-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Título" className="md:col-span-2">
            <input className={fieldClass} value={project.title} onChange={(e) => update("title", e.target.value)} required />
          </Field>
          <Field label="Slug">
            <input
              className={fieldClass}
              value={derivedSlug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", e.target.value);
              }}
              required
            />
          </Field>
          <Field label="Categoría">
            <select className={fieldClass} value={project.category} onChange={(e) => update("category", e.target.value)}>
              {["Residencial", "Cultural", "Comercial", "Interiorismo", "Institucional", "Urbano"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Año">
            <input
              type="number"
              className={fieldClass}
              value={project.year}
              onChange={(e) => update("year", Number(e.target.value))}
            />
          </Field>
          <Field label="Ubicación">
            <input className={fieldClass} value={project.location} onChange={(e) => update("location", e.target.value)} />
          </Field>
          <Field label="Cliente">
            <input className={fieldClass} value={project.client} onChange={(e) => update("client", e.target.value)} />
          </Field>
          <Field label="Superficie">
            <input className={fieldClass} value={project.area} onChange={(e) => update("area", e.target.value)} />
          </Field>
          <Field label="Estado">
            <select className={fieldClass} value={project.status} onChange={(e) => update("status", e.target.value)}>
              {["Proyecto", "En obra", "Construido"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Extracto">
          <textarea rows={3} className={fieldClass} value={project.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </Field>
        <Field label="Memoria descriptiva">
          <textarea
            rows={8}
            className={fieldClass}
            value={project.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <ImageUpload
          label="Imagen de portada"
          folder="projects"
          value={project.cover_url}
          onChange={(url) => update("cover_url", url)}
        />

        <div className="flex gap-8 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) => update("featured", e.target.checked)}
            />
            Destacado en inicio
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={project.published}
              onChange={(e) => update("published", e.target.checked)}
            />
            Publicado
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Guardando…" : "Guardar proyecto"}
          </button>
          {status ? <p className="text-sm text-stone">{status}</p> : null}
        </div>
      </form>

      {projectId ? (
        <MediaGallery
          items={images}
          onAdd={addMedia}
          onChange={updateImage}
          onRemove={removeImage}
          onMove={moveImage}
        />
      ) : (
        <p className="mt-10 text-sm text-stone">
          Guardá el proyecto para cargar la galería: varias fotos y videos.
        </p>
      )}
    </AdminPage>
  );
}

