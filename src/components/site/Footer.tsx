import Link from "next/link";
import { siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";

export function Footer({ site }: { site: SiteProfile }) {
  const labels = siteLabels(site);
  const instagramLabel = site.instagram.includes("instagram.com/")
    ? `@${site.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")}`
    : "Instagram";

  return (
    <footer className="border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 md:grid md:grid-cols-[1.5fr_1fr_0.8fr] md:gap-16 md:px-10 md:py-20">
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
              <a className="block min-h-11 hover:text-ink" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            ) : null}
            {site.phone ? (
              <a className="block min-h-11 hover:text-ink" href={`tel:${site.phone}`}>
                {site.phone}
              </a>
            ) : null}
          </div>
        ) : null}
        <div className="text-sm text-stone">
          {site.instagram ? (
            <a className="inline-flex min-h-11 items-center hover:text-ink" href={site.instagram} target="_blank" rel="noreferrer">
              {instagramLabel}
            </a>
          ) : null}
          {site.linkedin ? (
            <a className="mt-2 hidden min-h-11 hover:text-ink md:block" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-t border-line px-6 py-5 text-[10px] uppercase tracking-[0.18em] text-stone md:px-10 md:text-[11px] md:tracking-[0.2em]">
        <span className="min-w-0 break-words">© {new Date().getFullYear()} {site.studio_name || site.full_name}</span>
        {site.location ? <span className="hidden text-right md:inline">{site.location}</span> : null}
      </div>
    </footer>
  );
}
