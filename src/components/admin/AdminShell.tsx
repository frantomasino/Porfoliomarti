"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { cx } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/sitio", label: "Sitio" },
  { href: "/admin/secciones", label: "Secciones" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/trayectoria", label: "Trayectoria" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/mensajes", label: "Mensajes" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-root flex min-h-screen bg-paper">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink px-6 py-8 text-ivory md:flex">
        <Link href="/" className="font-serif text-2xl">
          ARQ.MR
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-ivory/50">
          Contenido en Supabase
        </p>
        <nav className="mt-12 flex flex-col gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "px-3 py-2 text-[12px] uppercase tracking-[0.16em] transition-colors",
                  active ? "bg-ivory/10 text-ivory" : "text-ivory/55 hover:text-ivory",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 pt-10">
          <Link href="/" className="block text-[11px] uppercase tracking-[0.18em] text-ivory/50 hover:text-ivory">
            Ver sitio
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="text-[11px] uppercase tracking-[0.18em] text-ivory/50 hover:text-ivory"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-4 md:hidden">
          <span className="font-serif text-xl">ARQ.MR</span>
          <form action={logoutAdmin}>
            <button type="submit" className="text-[11px] uppercase tracking-[0.16em]">
              Salir
            </button>
          </form>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-b border-line px-4 py-3 text-[11px] uppercase tracking-[0.16em] md:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap text-stone">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 px-5 py-8 md:px-12 md:py-12">{children}</div>
      </div>
    </div>
  );
}
