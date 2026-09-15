import type { SiteProfile } from "@/lib/types";

export function Footer({ site }: { site: SiteProfile }) {
  const instagramLabel = site.instagram.includes("instagram.com/")
    ? `@${site.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")}`
    : "Instagram";

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-serif text-4xl leading-none md:text-5xl">
            {site.studio_name || site.full_name}
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-stone">
            {site.full_name} · {site.profession}
          </p>
        </div>
        <div className="space-y-2 text-sm text-stone">
          <p>{site.location}</p>
          {site.email ? (
            <a className="block hover:text-ink" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          ) : null}
          {site.phone ? (
            <a className="block hover:text-ink" href={`tel:${site.phone}`}>
              {site.phone}
            </a>
          ) : null}
        </div>
        <div className="space-y-2 text-sm text-stone">
          {site.instagram ? (
            <a className="block hover:text-ink" href={site.instagram} target="_blank" rel="noreferrer">
              {instagramLabel}
            </a>
          ) : null}
          {site.linkedin ? (
            <a className="block hover:text-ink" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl justify-between border-t border-line px-6 py-6 text-[11px] uppercase tracking-[0.2em] text-stone md:px-10">
        <span>© {new Date().getFullYear()} {site.studio_name || site.full_name}</span>
        <span>Buenos Aires</span>
      </div>
    </footer>
  );
}
