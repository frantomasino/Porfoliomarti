"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";

export function Dashboard({ configured }: { configured: boolean }) {
  const [stats, setStats] = useState({
    projects: 0,
    published: 0,
    messages: 0,
    unread: 0,
  });

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
    ]).then(([projects, messages]) => {
      const projectRows = projects.data ?? [];
      const messageRows = messages.data ?? [];
      setStats({
        projects: projectRows.length,
        published: projectRows.filter((item) => item.published).length,
        messages: messageRows.length,
        unread: messageRows.filter((item) => !item.read).length,
      });
    });
  }, []);

  const cards = [
    { href: "/admin/proyectos", label: "Obras", value: stats.projects, note: `${stats.published} publicadas` },
    { href: "/admin/mensajes", label: "Mensajes", value: stats.messages, note: `${stats.unread} sin leer` },
    { href: "/admin/sitio", label: "Sitio", value: "Editar", note: "Perfil, textos e imágenes" },
    { href: "/admin/trayectoria", label: "Nosotros", value: "CV", note: "Práctica, formación y premios" },
  ];

  return (
    <AdminPage
      title="Resumen"
      description="Todo lo que edites acá se guarda en Supabase y se publica en el portafolio."
    >
      {!configured ? (
        <p className="mb-8 border border-line bg-ivory px-5 py-4 text-sm text-stone">
          Falta la clave de Supabase en Vercel. En Environment Variables, Production, tiene que estar
          `SUPABASE_SERVICE_ROLE_KEY` (la sb_secret) y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (la sb_publishable),
          sin espacios, y después Redeploy.
        </p>
      ) : null}
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
