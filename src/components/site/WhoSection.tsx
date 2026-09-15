import Link from "next/link";
import { Photo } from "@/components/site/Photo";
import type { SiteProfile } from "@/lib/types";

export function WhoSection({
  site,
  compact = false,
}: {
  site: SiteProfile;
  compact?: boolean;
}) {
  const instagramLabel = site.instagram.includes("instagram.com/")
    ? `@${site.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")}`
    : "Instagram";

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-[0.95fr_1.05fr] md:px-10">
      <div className="relative min-h-[420px] overflow-hidden bg-line md:min-h-[520px]">
        {site.portrait_url ? (
          <Photo
            src={site.portrait_url}
            alt={site.full_name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Quién es</p>
        <h2 className="mt-3 font-serif text-6xl md:text-7xl">{site.full_name}</h2>
        <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-bronze">
          {site.profession}
          {site.studio_name ? ` · ${site.studio_name}` : ""}
        </p>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-stone">{site.bio}</p>
        {!compact ? (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone">{site.philosophy}</p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          {compact ? (
            <Link
              href="/estudio"
              className="border border-ink px-7 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-ivory"
            >
              Conocer más
            </Link>
          ) : null}
          {site.instagram ? (
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-[0.22em] text-bronze hover:text-ink"
            >
              {instagramLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
