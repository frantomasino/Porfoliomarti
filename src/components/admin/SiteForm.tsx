"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminPage, buttonClass, Field, fieldClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import { seedSite } from "@/lib/seed";
import type { SiteProfile } from "@/lib/types";

export function SiteForm() {
  const [site, setSite] = useState<SiteProfile>(seedSite);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void adminQuery<SiteProfile>({
      table: "site_profile",
      op: "select",
      limit: 1,
      single: true,
    }).then(({ data }) => {
      if (data) {
        setSite({
          ...seedSite,
          ...data,
          studio_name: data.studio_name || seedSite.studio_name,
        });
      }
    });
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    try {
      const payload = {
        full_name: site.full_name,
        studio_name: site.studio_name,
        profession: site.profession,
        tagline: site.tagline,
        bio: site.bio,
        philosophy: site.philosophy,
        location: site.location,
        email: site.email,
        phone: site.phone,
        instagram: site.instagram,
        linkedin: site.linkedin,
        hero_image_url: site.hero_image_url,
        portrait_url: site.portrait_url,
        seo_title: site.seo_title,
        seo_description: site.seo_description,
        founded_year: Number(site.founded_year) || 2014,
      };

      const existing = await adminQuery<{ id: string }>({
        table: "site_profile",
        op: "select",
        select: "id",
        limit: 1,
        single: true,
      });

      const result = existing.data
        ? await adminQuery({
            table: "site_profile",
            op: "update",
            data: payload,
            match: { id: existing.data.id },
          })
        : await adminQuery({
            table: "site_profile",
            op: "insert",
            data: payload,
          });

      if (result.error) throw new Error(result.error);
      setStatus("Guardado en Supabase.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  function update<K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) {
    setSite((current) => ({ ...current, [key]: value }));
  }

  return (
    <AdminPage
      title="Sitio"
      description="Nombre, textos de portada, contacto e imágenes principales. Todo se publica en el portafolio."
    >
      <form onSubmit={save} className="grid gap-10">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Estudio">
            <input className={fieldClass} value={site.studio_name ?? ""} onChange={(e) => update("studio_name", e.target.value)} />
          </Field>
          <Field label="Quién es (nombre)">
            <input className={fieldClass} value={site.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </Field>
          <Field label="Profesión">
            <input className={fieldClass} value={site.profession} onChange={(e) => update("profession", e.target.value)} />
          </Field>
          <Field label="Lema" className="md:col-span-2">
            <input className={fieldClass} value={site.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </Field>
          <Field label="Ubicación">
            <input className={fieldClass} value={site.location} onChange={(e) => update("location", e.target.value)} />
          </Field>
          <Field label="Año de fundación">
            <input
              type="number"
              className={fieldClass}
              value={site.founded_year}
              onChange={(e) => update("founded_year", Number(e.target.value))}
            />
          </Field>
          <Field label="Email">
            <input className={fieldClass} value={site.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Teléfono">
            <input className={fieldClass} value={site.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field label="Instagram">
            <input className={fieldClass} value={site.instagram} onChange={(e) => update("instagram", e.target.value)} />
          </Field>
          <Field label="LinkedIn">
            <input className={fieldClass} value={site.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
          </Field>
        </div>

        <Field label="Biografía">
          <textarea
            rows={5}
            className={fieldClass}
            value={site.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </Field>
        <Field label="Filosofía del estudio">
          <textarea
            rows={4}
            className={fieldClass}
            value={site.philosophy}
            onChange={(e) => update("philosophy", e.target.value)}
          />
        </Field>

        <div className="grid gap-8 md:grid-cols-2">
          <ImageUpload
            label="Imagen de portada"
            folder="hero"
            value={site.hero_image_url}
            onChange={(url) => update("hero_image_url", url)}
          />
          <ImageUpload
            label="Retrato"
            folder="portrait"
            value={site.portrait_url}
            onChange={(url) => update("portrait_url", url)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Título SEO">
            <input className={fieldClass} value={site.seo_title} onChange={(e) => update("seo_title", e.target.value)} />
          </Field>
          <Field label="Descripción SEO">
            <input
              className={fieldClass}
              value={site.seo_description}
              onChange={(e) => update("seo_description", e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Guardando…" : "Guardar sitio"}
          </button>
          {status ? <p className="text-sm text-stone">{status}</p> : null}
        </div>
      </form>
    </AdminPage>
  );
}
