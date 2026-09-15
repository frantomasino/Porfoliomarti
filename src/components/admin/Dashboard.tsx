"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { SiteProfile } from "@/lib/types";

export function Dashboard({ configured }: { configured: boolean }) {
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
    });
  }, []);

  const steps = [
    {
      done: Boolean(site?.phone),
      label: "WhatsApp del estudio",
      detail: "Con código de país, tipo 54911…",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.bio),
      label: "Quiénes somos",
      detail: "La biografía que sale en Nosotros.",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.portrait_url),
      label: "Retrato",
      detail: "Foto de Martina o del estudio, no de una obra.",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.hero_image_url),
      label: "Foto de portada",
      detail: "La primera imagen grande de la home.",
      href: "/admin/sitio",
    },
    {
      done: stats.published > 0,
      label: "Obras publicadas",
      detail: "Título real, fotos y publicar.",
      href: "/admin/proyectos",
    },
  ];
  const pending = steps.filter((step) => !step.done);

  const shortcuts = [
    {
      href: "/admin/sitio",
      label: "Sitio",
      note: "WhatsApp, bio, retrato y portada",
    },
    {
      href: "/admin/proyectos",
      label: "Obras",
      note:
        stats.projects === 0
          ? "Todavía no hay obras"
          : stats.published === 1
            ? "1 publicada"
            : `${stats.published} publicadas · ${stats.projects} en total`,
    },
    {
      href: "/admin/mensajes",
      label: "Mensajes",
      note:
        stats.messages === 0
          ? "Todavía no hay consultas"
          : stats.unread
            ? `${stats.unread} sin leer`
            : `${stats.messages} guardados`,
    },
    {
      href: "/admin/trayectoria",
      label: "Nosotros",
      note: "Práctica, formación y premios",
    },
  ];

  return (
    <AdminPage
      title="Resumen"
      description="Completá lo que falta. Eso es lo que ve el visitante."
    >
      {!configured ? (
        <p className="mb-8 border border-line bg-ivory px-5 py-4 text-sm text-stone">
          Falta la clave de Supabase en Vercel. En Environment Variables, Production, tiene que estar
          `SUPABASE_SERVICE_ROLE_KEY` (la sb_secret) y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (la sb_publishable),
          sin espacios, y después Redeploy.
        </p>
      ) : null}

      <section className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
          {pending.length ? "Falta completar" : "Sitio listo"}
        </p>
        {pending.length ? (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {pending.map((step) => (
              <li key={step.label}>
                <Link
                  href={step.href}
                  className="flex min-h-16 items-center justify-between gap-4 py-4"
                >
                  <span>
                    <span className="block font-medium">{step.label}</span>
                    <span className="mt-1 block text-sm text-stone">{step.detail}</span>
                  </span>
                  <span className="shrink-0 text-sm text-bronze" aria-hidden>
                    Ir
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-stone">Lo esencial está. Cargá más obras cuando las tengas.</p>
        )}
      </section>

      <section>
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Ir a</p>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {shortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-16 items-center justify-between gap-4 py-4"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-stone">{item.label}</span>
                <span className="mt-1 block text-base">{item.note}</span>
              </span>
              <span className="shrink-0 text-sm text-bronze" aria-hidden>
                Ir
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
