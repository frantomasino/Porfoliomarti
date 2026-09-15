"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/utils";

const links = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/estudio", label: "Quién es" },
  { href: "/contacto", label: "Contacto" },
];

type HeaderProps = {
  name: string;
  profession: string;
};

export function Header({ name, profession }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b",
        isHome
          ? "border-white/10 bg-ink text-ivory"
          : "border-line bg-paper/90 text-ink backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="leading-tight" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl tracking-wide md:text-2xl">{name}</span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.28em] opacity-70">
            {profession}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.24em] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                "transition-opacity hover:opacity-100",
                pathname.startsWith(link.href) ? "opacity-100" : "opacity-70",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block h-px w-6 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </button>
      </div>

      {open ? (
        <nav className="border-t border-current/10 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5 text-sm uppercase tracking-[0.22em]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
