"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { HeroSlides } from "@/components/admin/HeroSlides";
import { ReelSlides } from "@/components/admin/ReelSlides";
import { AdminPage, buttonClass, Field, fieldClass } from "@/components/admin/ui";
import { BRAND_ACCEPT } from "@/lib/admin/images";
import { adminQuery } from "@/lib/admin/db";
import {
  headingFonts,
  mergeLabels,
  mergeTheme,
  reelPlacements,
  sectionColorFields,
  themeSections,
} from "@/lib/appearance";
import { seedSite } from "@/lib/seed";
import type { ReelPlacement, SectionPalette, SiteLabels, SiteProfile, SiteTheme, ThemeSectionId } from "@/lib/types";

export function SiteForm({ embedded = false }: { embedded?: boolean } = {}) {
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
          banner_url: data.banner_url || "",
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
        banner_url: site.banner_url,
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

      const write = (data: Record<string, unknown>) =>
        existing.data
          ? adminQuery({
              table: "site_profile",
              op: "update",
              data,
              match: { id: existing.data.id },
            })
          : adminQuery({
              table: "site_profile",
              op: "insert",
              data,
            });

      let result = await write(payload);
      if (result.error && /banner/i.test(result.error)) {
        const { banner_url: _banner, ...withoutBanner } = payload;
        result = await write(withoutBanner);
        if (!result.error) {
          setStatus("Guardado. El banner todavía no está activo: avisale a quien armó el sitio.");
          return;
        }
      }

      if (result.error) throw new Error(result.error);
      setStatus("Guardado.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar.";
      setStatus(
        /column|theme|labels|logo|favicon|banner/i.test(message)
          ? "No se pudo guardar este campo. Avisale a quien armó el sitio."
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

  function updateSection(id: ThemeSectionId, key: keyof SectionPalette, value: string) {
    setSite((current) => {
      const next = mergeTheme(current.theme);
      return {
        ...current,
        theme: {
          ...next,
          sections: {
            ...next.sections,
            [id]: { ...next.sections[id], [key]: value },
          },
        },
      };
    });
  }

  const labels = mergeLabels(site.labels);
  const theme = mergeTheme(site.theme);

  return (
    <AdminPage
      id={embedded ? "estudio" : undefined}
      embedded={embedded}
      title="El estudio"
      description="WhatsApp, bio, retrato y datos. Guardá abajo cuando termines."
    >
      <form onSubmit={save} className="grid gap-10 pb-24">
        <div className="grid gap-5 border border-line bg-ivory px-5 py-6">
          <p className="text-sm font-medium">Lo primero</p>
          <Field label="WhatsApp" hint="Con código de país, sin espacios. Ejemplo: 54911…">
            <input
              className={fieldClass}
              value={site.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="54911..."
              inputMode="tel"
            />
          </Field>
          <Field label="Quiénes somos" hint="Un párrafo. Sale en Nosotros. Si está, también aparece en la home.">
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
              preview="contain"
              value={site.portrait_url}
              onChange={(url) => update("portrait_url", url)}
              hint="Foto de Martina o del estudio. No uses una foto de obra acá."
            />
            <HeroSlides
              slides={theme.hero_slides.length ? theme.hero_slides : [site.hero_image_url].filter(Boolean)}
              onChange={(urls) => {
                setSite((current) => ({
                  ...current,
                  hero_image_url: urls[0] ?? "",
                  theme: { ...mergeTheme(current.theme), hero_slides: urls },
                }));
              }}
            />
            <div className="md:col-span-2">
              <ImageUpload
                label="Foto del cubo / marca"
                folder="banner"
                value={site.banner_url ?? ""}
                onChange={(url) => update("banner_url", url)}
                hint="Sale al lado del texto del estudio, no sola. Abajo pueden pasar fotos o videos."
                emptyLabel="Sin marca"
              />
            </div>
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
          <Field
            label="Lema"
            className="md:col-span-2"
            hint="Frase de la home. Si lo dejás vacío, no se repite el nombre del estudio."
          >
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

        <div className="grid gap-5 border border-line bg-ivory px-5 py-6">
          <p className="text-sm font-medium">Apariencia</p>
          <Field
            label="Tipografía de títulos"
            hint="Sale en el lema de la home, obras y títulos. Elegí la que se sienta más del estudio."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {headingFonts.map((font) => {
                const active = theme.heading === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => updateTheme("heading", font.id)}
                    className={`min-h-16 border px-4 py-3 text-left transition-colors ${
                      active ? "border-ink bg-paper" : "border-line bg-ivory hover:border-ink"
                    }`}
                  >
                    <span className="block text-[1.65rem] font-light leading-none" style={{ fontFamily: font.family }}>
                      {font.name}
                    </span>
                    <span className="mt-2 block text-[11px] uppercase tracking-[0.18em] text-stone">{font.hint}</span>
                  </button>
                );
              })}
            </div>
          </Field>
          <Field
            label="Cinta de fotos"
            hint="Las fotos de las obras pasan en una tira bajo el hero. Si el cliente la quiere, acá se prende."
          >
            <select
              className={fieldClass}
              value={theme.reel}
              onChange={(e) => updateTheme("reel", e.target.value as ReelPlacement)}
            >
              {reelPlacements.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <ReelSlides
            slides={theme.reel_media}
            onChange={(urls) => updateTheme("reel_media", urls)}
          />
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

        <div className="grid gap-5">
          <Field
            label="Título SEO"
            hint={`${(site.seo_title || "").length}/60. Lo que Google muestra como título azul. Si lo dejás vacío, usa el nombre del estudio.`}
          >
            <input
              className={fieldClass}
              value={site.seo_title}
              onChange={(e) => update("seo_title", e.target.value)}
              maxLength={70}
            />
          </Field>
          <Field
            label="Descripción SEO"
            hint={`${(site.seo_description || "").length}/160. Un párrafo corto: quiénes son y qué hacen. El dominio se suma después.`}
          >
            <textarea
              rows={3}
              className={fieldClass}
              value={site.seo_description}
              onChange={(e) => update("seo_description", e.target.value)}
              maxLength={180}
            />
          </Field>
          <div className="border border-line bg-ivory px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Así se ve en Google</p>
            <p className="mt-3 text-base text-[#1a0dab]">
              {site.seo_title || site.studio_name || site.full_name || "Título del estudio"}
            </p>
            <p className="mt-1 text-sm text-stone">
              {site.seo_description || site.tagline || site.bio || "La descripción sale de este campo, o del slogan si está vacío."}
            </p>
          </div>
        </div>

        <div className="grid gap-5 border border-line bg-ivory px-5 py-6">
          <p className="text-sm font-medium">Cómo trabaja</p>
          <p className="text-sm leading-relaxed text-stone">
            Estos tres pasos salen en el sitio si no cargás servicios más abajo.
          </p>
          <Field label="1 — título">
            <input className={fieldClass} value={labels.how_1_title} onChange={(e) => updateLabel("how_1_title", e.target.value)} />
          </Field>
          <Field label="1 — texto">
            <textarea rows={2} className={fieldClass} value={labels.how_1_body} onChange={(e) => updateLabel("how_1_body", e.target.value)} />
          </Field>
          <Field label="2 — título">
            <input className={fieldClass} value={labels.how_2_title} onChange={(e) => updateLabel("how_2_title", e.target.value)} />
          </Field>
          <Field label="2 — texto">
            <textarea rows={2} className={fieldClass} value={labels.how_2_body} onChange={(e) => updateLabel("how_2_body", e.target.value)} />
          </Field>
          <Field label="3 — título">
            <input className={fieldClass} value={labels.how_3_title} onChange={(e) => updateLabel("how_3_title", e.target.value)} />
          </Field>
          <Field label="3 — texto">
            <textarea rows={2} className={fieldClass} value={labels.how_3_body} onChange={(e) => updateLabel("how_3_body", e.target.value)} />
          </Field>
        </div>

        <details className="border-t border-line pt-8">
          <summary className="cursor-pointer text-sm text-stone">Textos del menú (opcional)</summary>
          <p className="mt-3 text-sm text-stone">Solo si querés cambiar cómo se llaman las páginas.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
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
        </details>

        <div className="grid gap-6 border border-line bg-ivory px-5 py-6">
          <div>
            <p className="text-sm font-medium">Colores</p>
            <p className="mt-2 text-sm text-stone">
              La paleta general vale para todo el sitio. Después podés cambiar cada sección.
            </p>
          </div>
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
              <ColorField
                key={key}
                label={label}
                value={theme[key]}
                fallback={theme[key]}
                onChange={(value) => updateTheme(key, value)}
              />
            ))}
          </div>
          <div className="grid gap-4">
            {themeSections.map((section) => (
              <details key={section.id} className="border border-line bg-paper px-4 py-3">
                <summary className="cursor-pointer text-sm">
                  {section.name}
                  <span className="ml-2 text-stone">— {section.hint}</span>
                </summary>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {sectionColorFields.map((field) => (
                    <ColorField
                      key={field.key}
                      label={field.label}
                      value={theme.sections[section.id][field.key]}
                      fallback={
                        field.key === "bg"
                          ? theme.paper
                          : field.key === "text"
                            ? theme.ink
                            : field.key === "muted"
                              ? theme.stone
                              : field.key === "accent"
                                ? theme.bronze
                                : theme.line
                      }
                      onChange={(value) => updateSection(section.id, field.key, value)}
                    />
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 -mx-5 flex items-center gap-3 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
          {status ? <p className="min-w-0 text-sm text-stone">{status}</p> : null}
        </div>
      </form>
    </AdminPage>
  );
}

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  const swatch = /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          className="h-10 w-14 cursor-pointer border border-line bg-transparent p-0"
          value={swatch}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className={fieldClass}
          value={value}
          placeholder={fallback}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Field>
  );
}
