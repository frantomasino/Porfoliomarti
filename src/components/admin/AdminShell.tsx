"use client";

import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

const sections = [
  { id: "estudio", label: "Estudio" },
  { id: "obras", label: "Obras" },
  { id: "proceso", label: "Cómo trabaja" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "mensajes", label: "Mensajes" },
  { id: "extras", label: "Extras" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root flex min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-paper">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink px-6 py-8 text-ivory md:flex">
        <Link href="/admin" className="font-serif text-2xl">
          ARQ.MR
        </Link>
        <p className="mt-1 text-[11px] text-ivory/50">Editar el sitio</p>
        <nav className="mt-10 flex flex-col gap-1">
          {sections.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3 py-2.5 text-sm text-ivory/55 transition-colors hover:text-ivory"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pt-10">
          <Link href="/" className="block text-sm text-ivory/50 hover:text-ivory">
            Ver el sitio
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="text-sm text-ivory/50 hover:text-ivory">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 bg-paper md:hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <span className="font-serif text-xl">Editar sitio</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-stone">
                Ver sitio
              </Link>
              <form action={logoutAdmin}>
                <button type="submit" className="text-sm">
                  Salir
                </button>
              </form>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 px-3 py-2 text-[13px] text-stone"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex-1 px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-12 md:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
