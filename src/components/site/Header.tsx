"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx, mailtoUrl, whatsappUrl } from "@/lib/utils";
import type { SiteLabels } from "@/lib/types";
import type { CSSProperties } from "react";

type HeaderProps = {
  name: string;
  profession: string;
  instagram?: string;
  logoUrl?: string;
  home?: boolean;
  phone?: string;
  email?: string;
  labels: SiteLabels;
  palette?: CSSProperties;
};

export function Header({ name, profession, instagram, logoUrl, home = false, phone = "", email = "", labels, palette }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [live, setLive] = useState(false);
  const overHero = Boolean(live && home && !scrolled && !open);
  const wa = whatsappUrl(phone);
  const mail = mailtoUrl(email);
  const links = [
    { href: "/proyectos", label: labels.nav_projects },
    { href: "/estudio", label: labels.nav_about },
    { href: "/contacto", label: labels.nav_contact },
  ];

  useEffect(() => {
    setLive(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <header
        className={cx(
          "site-header",
          home ? "fixed inset-x-0 top-0" : "sticky top-0 border-b",
          open
            ? "z-[80] border-white/10 bg-ink text-ivory"
            : overHero
              ? "z-50 border-transparent bg-transparent text-ivory"
              : home
                ? "z-50 border-b border-line bg-paper text-ink"
                : "z-50 border-line bg-paper/92 text-ink backdrop-blur-md",
        )}
        style={{ viewTransitionName: "site-header", ...(overHero || open ? undefined : palette) }}
      >
        <div
          className={cx(
            "mx-auto flex items-center justify-between",
            home ? "w-full px-6 md:px-12 lg:px-16" : "max-w-7xl px-6 md:px-12 lg:px-16",
            overHero ? "py-6 md:py-7" : "py-3 md:py-4",
          )}
        >
          <Link href="/" className="min-w-0 leading-tight" onClick={() => setOpen(false)}>
            {logoUrl ? (
              <span
                className={cx(
                  "inline-flex max-w-[11rem] items-center md:max-w-[13rem]",
                  open ? "rounded-sm bg-ivory px-2 py-1" : "",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={name} className="h-8 w-auto max-h-8 object-contain md:h-9 md:max-h-9" />
              </span>
            ) : (
              <>
                <span
                  className={cx(
                    "block tracking-[0.16em] uppercase",
                    overHero
                      ? "font-serif text-[0.95rem] font-light md:text-[1.05rem]"
                      : "max-w-[11.5rem] truncate font-serif text-[1.25rem] tracking-[0.02em] normal-case md:max-w-none md:text-[1.65rem]",
                  )}
                >
                  {name}
                </span>
                {profession && !overHero && !open ? (
                  <span className="mt-0.5 hidden truncate text-[10px] uppercase tracking-[0.24em] opacity-70 sm:block">
                    {profession}
                  </span>
                ) : null}
              </>
            )}
          </Link>

          <nav
            className={cx(
              "items-center gap-7 text-[11px] uppercase tracking-[0.24em]",
              open ? "hidden" : "hidden md:flex",
            )}
          >
            {links.map((link) => {
              const current = pathname.startsWith(link.href);
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
            className={cx("menu-toggle relative h-11 w-11 shrink-0", open ? "flex" : "flex md:hidden", open && "is-open")}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {open ? (
        <nav className="fixed inset-0 z-[70] flex flex-col justify-between bg-ink px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+5.75rem)] text-ivory">
          <div className="flex flex-col gap-1">
            <Link href="/" className="display-sm py-3" onClick={() => setOpen(false)}>
              Inicio
            </Link>
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
          <div className="flex flex-col gap-2 pb-2">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.22em] text-ivory/70"
              >
                WhatsApp
              </a>
            ) : null}
            {mail ? (
              <a
                href={mail}
                className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.22em] text-ivory/70"
              >
                Email
              </a>
            ) : null}
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
          </div>
        </nav>
      ) : null}
    </>
  );
}
