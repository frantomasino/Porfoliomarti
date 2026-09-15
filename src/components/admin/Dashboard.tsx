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
      detail: "Sitio → WhatsApp / teléfono, con código de país (54911…)",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.bio),
      label: "Quiénes somos",
      detail: "Sitio → Biografía. Es el texto de Nosotros.",
      href: "/admin/sitio",
    },
    {
      done: Boolean(site?.portrait_url),
      label: "Retrato",
      detail: "Una foto de Martina o del estudio, no de una obra.",
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
      label: "Obras con título real",
      detail: "Proyectos → cada obra: título, fotos, publicar.",
      href: "/admin/proyectos",
    },
  ];
  const pending = steps.filter((step) => !step.done);

  const cards = [
    { href: "/admin/proyectos", label: "Obras", value: stats.projects, note: `${stats.published} publicadas` },
    { href: "/admin/mensajes", label: "Mensajes", value: stats.messages, note: `${stats.unread} sin leer` },
    { href: "/admin/sitio", label: "Sitio", value: "Editar", note: "Nombre, logo, fotos y textos" },
    { href: "/admin/trayectoria", label: "Nosotros", value: "CV", note: "Práctica, formación y premios" },
  ];

  return (
    <AdminPage
      title="Resumen"
      description="Primero completá lo de abajo. Después el visitante ve eso en el sitio."
    >
      {!configured ? (
        <p className="mb-8 border border-line bg-ivory px-5 py-4 text-sm text-stone">
          Falta la clave de Supabase en Vercel. En Environment Variables, Production, tiene que estar
          `SUPABASE_SERVICE_ROLE_KEY` (la sb_secret) y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (la sb_publishable),
          sin espacios, y después Redeploy.
        </p>
      ) : null}

      <div className="mb-10 border border-line bg-ivory px-5 py-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Para que el sitio se vea completo</p>
        {pending.length ? (
          <ul className="mt-4 grid gap-3">
            {pending.map((step) => (
              <li key={step.label}>
                <Link href={step.href} className="block hover:text-bronze">
                  <span className="font-medium">{step.label}</span>
                  <span className="mt-1 block text-sm text-stone">{step.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-stone">Lo esencial está. Cargá más obras cuando las tengas.</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="border border-line p-6 transition-colors hover:border-ink">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">{card.label}</p>
            <p className="mt-3 font-serif text-4xl">{card.value}</p>
            <p className="mt-2 text-sm text-stone">{card.note}</p>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
