"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { SiteProfile } from "@/lib/types";

export function Dashboard({ configured }: { configured: boolean }) {
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    published: 0,
    messages: 0,
    unread: 0,
  });
  const [site, setSite] = useState<SiteProfile | null>(null);

  useEffect(() => {
    void Promise.all([
      adminQuery<{ id: string; published: boolean }[]>({
        table: "projects",
        op: "select",
        select: "id, published",
      }),
      adminQuery<{ id: string; read: boolean }[]>({
        table: "contact_messages",
        op: "select",
        select: "id, read",
      }),
      adminQuery<SiteProfile>({
        table: "site_profile",
        op: "select",
        limit: 1,
        single: true,
      }),
    ]).then(([projects, messages, profile]) => {
      const projectRows = projects.data ?? [];
      const messageRows = messages.data ?? [];
      setStats({
        projects: projectRows.length,
        published: projectRows.filter((item) => item.published).length,
        messages: messageRows.length,
        unread: messageRows.filter((item) => !item.read).length,
      });
      if (profile.data) setSite(profile.data);
    }).finally(() => {
      setReady(true);
    });
  }, []);

  const steps = [
    {
      done: Boolean(site?.phone),
      label: "WhatsApp",
      detail: "Para que las consultas del sitio te lleguen al celular.",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.bio),
      label: "Quiénes somos",
      detail: "Un párrafo. Sale en Nosotros y, si está, también en la home.",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.portrait_url),
      label: "Retrato",
      detail: "Foto tuya o del estudio, no de una obra.",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.hero_image_url),
      label: "Foto de portada",
      detail: "La imagen grande del inicio.",
      href: "/admin/sitio",
    },
    {
      done: stats.published > 0,
      label: "Una obra publicada",
      detail: "Título real, al menos una foto, y marcar Visible en el sitio.",
      href: "/admin/proyectos",
    },
  ];
  const pending = steps.filter((step) => !step.done);

  return (
    <AdminPage
      title="Inicio"
      description="Completá esta lista. Eso es lo que ve quien entra al sitio."
    >
      {!configured ? (
        <p className="mb-8 border border-line bg-ivory px-5 py-4 text-sm leading-relaxed text-stone">
          El panel todavía no está conectado. Avisale a quien publicó el sitio.
        </p>
      ) : null}

      {stats.unread ? (
        <Link
          href="/admin/mensajes"
          className="mb-8 flex min-h-14 items-center justify-between gap-3 border border-ink bg-ivory px-4 py-3"
        >
          <span className="text-sm">
            {stats.unread === 1 ? "Hay 1 consulta nueva." : `Hay ${stats.unread} consultas nuevas.`}
          </span>
          <span className="shrink-0 text-sm text-bronze">Ver</span>
        </Link>
      ) : null}

      <section>
        {!ready ? (
          <p className="text-sm text-stone">Cargando…</p>
        ) : (
          <>
            <p className="text-sm text-stone">{pending.length ? "Falta completar" : "Lo esencial está"}</p>
            {pending.length ? (
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {pending.map((step) => (
                  <li key={step.label}>
                    <Link href={step.href} className="flex min-h-16 items-center justify-between gap-4 py-4">
                      <span>
                        <span className="block text-base">{step.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-stone">{step.detail}</span>
                      </span>
                      <span className="shrink-0 text-sm text-bronze">Abrir</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-stone">
                Cargá más obras cuando las tengas. Arriba, Ver sitio para controlar cómo quedó.
              </p>
            )}
          </>
        )}
      </section>
    </AdminPage>
  );
}
