import Link from "next/link";
import { siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";
import { formatPhoneDisplay, instagramLabel, mailtoUrl, telUrl } from "@/lib/utils";
import type { CSSProperties } from "react";

export function Footer({ site, palette }: { site: SiteProfile; palette?: CSSProperties }) {
  const labels = siteLabels(site);
  return (
    <footer
      className="border-t border-line bg-paper pb-[max(5.5rem,env(safe-area-inset-bottom))] md:pb-[env(safe-area-inset-bottom)]"
      style={{ viewTransitionName: "site-footer", ...palette }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:grid md:grid-cols-[1.5fr_1fr_0.8fr] md:gap-16 md:px-12 md:py-24 lg:px-16">
        <div>
          {site.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.logo_url}
              alt={site.studio_name || site.full_name}
              className="h-10 w-auto max-w-[12rem] object-contain"
            />
          ) : (
            <p className="font-serif text-3xl leading-none md:text-[2.6rem]">
              {site.studio_name || site.full_name}
            </p>
          )}
          <p className="mt-3 text-sm text-stone md:uppercase md:tracking-[0.18em]">
            {[site.full_name, site.profession].filter(Boolean).join(" · ")}
          </p>
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-stone">
            <Link href="/proyectos" className="inline-flex min-h-11 items-center hover:text-ink">
              {labels.nav_projects}
            </Link>
            <Link href="/estudio" className="inline-flex min-h-11 items-center hover:text-ink">
              {labels.nav_about}
            </Link>
            <Link href="/contacto" className="inline-flex min-h-11 items-center hover:text-ink">
              {labels.nav_contact}
            </Link>
          </nav>
        </div>
        {site.location || site.email || site.phone ? (
          <div className="space-y-2 text-sm text-stone">
            {site.location ? <p>{site.location}</p> : null}
            {site.email ? (
              <a className="inline-flex min-h-11 items-center hover:text-ink" href={mailtoUrl(site.email)}>
                {site.email.trim()}
              </a>
            ) : null}
            {site.phone ? (
              <a className="block min-h-11 hover:text-ink" href={telUrl(site.phone)}>
                {formatPhoneDisplay(site.phone)}
              </a>
            ) : null}
          </div>
        ) : null}
        <div className="space-y-3 text-sm text-stone">
          {site.instagram ? (
            <a className="flex min-h-11 items-center hover:text-ink" href={site.instagram} target="_blank" rel="noreferrer">
              {instagramLabel(site.instagram)}
            </a>
          ) : null}
          {site.linkedin ? (
            <a className="hidden min-h-11 items-center hover:text-ink md:flex" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-line px-6 py-5 text-[10px] uppercase tracking-[0.18em] text-stone md:px-12 md:text-[11px] md:tracking-[0.2em] lg:px-16">
        <span className="min-w-0 break-words">© {new Date().getFullYear()} {site.studio_name || site.full_name}</span>
      </div>
    </footer>
  );
}
