"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "@/lib/utils";
import type { SiteLabels } from "@/lib/types";

type HeaderProps = {
  name: string;
  profession: string;
  instagram?: string;
  logoUrl?: string;
  home?: boolean;
  labels: SiteLabels;
};

export function Header({ name, profession, instagram, logoUrl, home = false, labels }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState("");
  const dark = home && !scrolled && !open;
  const links = [
    { href: "/proyectos", label: labels.nav_projects },
    { href: "/estudio", label: labels.nav_about },
    { href: "/contacto", label: labels.nav_contact },
  ];

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 20;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setPath(pathname);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cx(
          "site-header sticky top-0 border-b",
          open ? "z-[80]" : "z-50",
          dark
            ? "border-white/10 bg-ink/80 text-ivory backdrop-blur-md"
            : "border-line bg-paper/92 text-ink backdrop-blur-md",
          open && "border-white/10 bg-ink text-ivory",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10 md:py-4">
          <Link href="/" className="min-w-0 leading-tight" onClick={() => setOpen(false)}>
            {logoUrl ? (
              <span
                className={cx(
                  "inline-flex max-w-[11rem] items-center md:max-w-[13rem]",
                  dark || open ? "rounded-sm bg-ivory px-2 py-1" : "",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={name} className="h-8 w-auto max-h-8 object-contain md:h-9 md:max-h-9" />
              </span>
            ) : (
              <>
                <span className="block max-w-[11.5rem] truncate font-serif text-[1.25rem] tracking-[0.02em] md:max-w-none md:text-[1.65rem]">{name}</span>
                {profession ? (
                  <span className="mt-0.5 hidden truncate text-[10px] uppercase tracking-[0.24em] opacity-70 sm:block">
                    {profession}
                  </span>
                ) : null}
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.24em] md:flex">
            {links.map((link) => {
              const current = path.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cx(
                    "inline-flex min-h-11 items-center border-b border-transparent transition-colors",
                    current ? "border-current opacity-100" : "opacity-60 hover:opacity-100",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={cx(
                "absolute block h-[1.5px] w-5 bg-current transition-transform duration-200",
                open ? "rotate-45" : "-translate-y-[5px]",
              )}
            />
            <span
              className={cx(
                "absolute block h-[1.5px] w-5 bg-current transition-transform duration-200",
                open ? "-rotate-45" : "translate-y-[5px]",
              )}
            />
          </button>
        </div>
      </header>

      {open ? (
        <nav className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+5.75rem)] text-ivory md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="display-sm py-3"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.22em] text-ivory/70"
            >
              Instagram
            </a>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
