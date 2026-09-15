"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminPage, buttonClass, Field, fieldClass } from "@/components/admin/ui";
import { BRAND_ACCEPT } from "@/lib/admin/images";
import { adminQuery } from "@/lib/admin/db";
import { mergeLabels, mergeTheme } from "@/lib/appearance";
import { seedSite } from "@/lib/seed";
import type { SiteLabels, SiteProfile, SiteTheme } from "@/lib/types";

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
          logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "",
          theme: mergeTheme(data.theme),
          labels: mergeLabels(data.labels),
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
        logo_url: site.logo_url,
        favicon_url: site.favicon_url,
        seo_title: site.seo_title,
        seo_description: site.seo_description,
        founded_year: Number(site.founded_year) || 2014,
        theme: site.theme,
        labels: site.labels,
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
      const message = err instanceof Error ? err.message : "No se pudo guardar.";
      setStatus(
        /column|theme|labels|logo|favicon/i.test(message)
          ? "Falta correr un SQL en Supabase. Pegá supabase/migration-brand.sql (logo y favicon) o migration-appearance.sql y dale Run."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  function update<K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) {
    setSite((current) => ({ ...current, [key]: value }));
  }

  function updateLabel<K extends keyof SiteLabels>(key: K, value: SiteLabels[K]) {
    setSite((current) => ({
      ...current,
      labels: { ...mergeLabels(current.labels), [key]: value },
    }));
  }

  function updateTheme<K extends keyof SiteTheme>(key: K, value: SiteTheme[K]) {
    setSite((current) => ({
      ...current,
      theme: { ...mergeTheme(current.theme), [key]: value },
    }));
  }

  const labels = mergeLabels(site.labels);
  const theme = mergeTheme(site.theme);

  return (
    <AdminPage
      title="Sitio"
      description="Empezá por WhatsApp, biografía, retrato y portada. Después las obras."
    >
      <form onSubmit={save} className="grid gap-10 pb-24">
        <div className="grid gap-5 border border-line bg-ivory px-5 py-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Lo primero</p>
          <Field label="WhatsApp / teléfono">
            <input
              className={fieldClass}
              value={site.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="54911..."
              inputMode="tel"
            />
          </Field>
          <Field label="Biografía">
            <textarea
              rows={5}
              className={fieldClass}
              value={site.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Quiénes somos. Sale en Nosotros y en la home."
            />
          </Field>
          <div className="grid gap-8 md:grid-cols-2">
            <ImageUpload
              label="Retrato"
              folder="portrait"
              value={site.portrait_url}
              onChange={(url) => update("portrait_url", url)}
              hint="Foto de Martina o del estudio. No uses una foto de obra acá."
            />
            <ImageUpload
              label="Imagen de portada"
              folder="hero"
              value={site.hero_image_url}
              onChange={(url) => update("hero_image_url", url)}
              hint="La primera imagen grande de la home. Si no hay, la home arranca más corta."
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Estudio">
            <input className={fieldClass} value={site.studio_name ?? ""} onChange={(e) => update("studio_name", e.target.value)} />
          </Field>
          <Field label="Nombre">
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
          <Field label="Instagram">
            <input className={fieldClass} value={site.instagram} onChange={(e) => update("instagram", e.target.value)} />
          </Field>
          <Field label="LinkedIn">
            <input className={fieldClass} value={site.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          <ImageUpload
            label="Logo"
            folder="brand"
            preview="contain"
            brand
            maxEdge={1600}
            accept={BRAND_ACCEPT}
            value={site.logo_url ?? ""}
            onChange={(url) => update("logo_url", url)}
            hint="JPG, PNG, WebP o SVG. Si lo subís, reemplaza el nombre en el menú y el pie. Si no, se sigue viendo el texto."
            emptyLabel="Sin logo — se usa el nombre"
          />
          <ImageUpload
            label="Favicon"
            folder="brand"
            preview="contain"
            brand
            maxEdge={256}
            accept={BRAND_ACCEPT}
            value={site.favicon_url ?? ""}
            onChange={(url) => update("favicon_url", url)}
            hint="Ícono de la pestaña del navegador. PNG, WebP, SVG o ICO. Cuadrado, lo más simple posible."
            emptyLabel="Sin favicon"
          />
        </div>

        <Field label="Filosofía del estudio">
          <textarea
            rows={4}
            className={fieldClass}
            value={site.philosophy}
            onChange={(e) => update("philosophy", e.target.value)}
          />
        </Field>

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

        <div className="grid gap-5 border-t border-line pt-10">
          <p className="font-serif text-3xl">Textos del sitio</p>
          <p className="text-sm text-stone">Estos textos salen en el menú y en cada página: Nosotros, Contacto, Proyectos.</p>
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Menú — proyectos">
              <input className={fieldClass} value={labels.nav_projects} onChange={(e) => updateLabel("nav_projects", e.target.value)} />
            </Field>
            <Field label="Menú — nosotros">
              <input className={fieldClass} value={labels.nav_about} onChange={(e) => updateLabel("nav_about", e.target.value)} />
            </Field>
            <Field label="Menú — contacto">
              <input className={fieldClass} value={labels.nav_contact} onChange={(e) => updateLabel("nav_contact", e.target.value)} />
            </Field>
            <Field label="Título Nosotros">
              <input className={fieldClass} value={labels.who} onChange={(e) => updateLabel("who", e.target.value)} />
            </Field>
            <Field label="Título obras">
              <input className={fieldClass} value={labels.works} onChange={(e) => updateLabel("works", e.target.value)} />
            </Field>
            <Field label="Selección">
              <input className={fieldClass} value={labels.selection} onChange={(e) => updateLabel("selection", e.target.value)} />
            </Field>
            <Field label="Archivo">
              <input className={fieldClass} value={labels.archive} onChange={(e) => updateLabel("archive", e.target.value)} />
            </Field>
            <Field label="Botón ver obras">
              <input className={fieldClass} value={labels.see_works} onChange={(e) => updateLabel("see_works", e.target.value)} />
            </Field>
            <Field label="Botón conocer más">
              <input className={fieldClass} value={labels.know_more} onChange={(e) => updateLabel("know_more", e.target.value)} />
            </Field>
            <Field label="Título contacto">
              <input className={fieldClass} value={labels.contact} onChange={(e) => updateLabel("contact", e.target.value)} />
            </Field>
            <Field label="Antetítulo contacto">
              <input className={fieldClass} value={labels.conversemos} onChange={(e) => updateLabel("conversemos", e.target.value)} />
            </Field>
            <Field label="Servicios">
              <input className={fieldClass} value={labels.services} onChange={(e) => updateLabel("services", e.target.value)} />
            </Field>
            <Field label="Cómo trabaja">
              <input className={fieldClass} value={labels.how_works} onChange={(e) => updateLabel("how_works", e.target.value)} />
            </Field>
            <Field label="Práctica">
              <input className={fieldClass} value={labels.practice} onChange={(e) => updateLabel("practice", e.target.value)} />
            </Field>
            <Field label="Formación">
              <input className={fieldClass} value={labels.education} onChange={(e) => updateLabel("education", e.target.value)} />
            </Field>
            <Field label="Notas">
              <input className={fieldClass} value={labels.notes} onChange={(e) => updateLabel("notes", e.target.value)} />
            </Field>
            <Field label="Texto de contacto" className="md:col-span-3">
              <textarea
                rows={3}
                className={fieldClass}
                value={labels.contact_intro}
                onChange={(e) => updateLabel("contact_intro", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="grid gap-5 border-t border-line pt-10">
          <p className="font-serif text-3xl">Colores</p>
          <p className="text-sm text-stone">Se aplican en todo el sitio público.</p>
          <div className="grid gap-5 md:grid-cols-3">
            {(
              [
                ["paper", "Fondo"],
                ["ivory", "Marfil"],
                ["ink", "Texto / negro"],
                ["stone", "Gris"],
                ["bronze", "Acento"],
                ["line", "Líneas"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="h-10 w-14 cursor-pointer border border-line bg-transparent p-0"
                    value={theme[key]}
                    onChange={(e) => updateTheme(key, e.target.value)}
                  />
                  <input
                    className={fieldClass}
                    value={theme[key]}
                    onChange={(e) => updateTheme(key, e.target.value)}
                  />
                </div>
              </Field>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 -mx-5 flex items-center gap-4 border-t border-line bg-paper/95 px-5 py-4 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Guardando…" : "Guardar sitio"}
          </button>
          {status ? <p className="text-sm text-stone">{status}</p> : null}
        </div>
      </form>
    </AdminPage>
  );
}
