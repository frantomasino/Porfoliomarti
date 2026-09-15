import Link from "next/link";
import { Photo } from "@/components/site/Photo";
import { siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";

export function WhoSection({
  site,
  compact = false,
}: {
  site: SiteProfile;
  compact?: boolean;
}) {
  const labels = siteLabels(site);
  const instagramLabel = site.instagram.includes("instagram.com/")
    ? `@${site.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")}`
    : "Instagram";

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 py-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-10 md:py-24">
      {site.portrait_url ? (
        <div className="relative aspect-[4/5] overflow-hidden bg-line md:aspect-auto md:min-h-[520px]">
          <Photo
            src={site.portrait_url}
            alt={site.full_name}
            className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
          />
        </div>
      ) : null}
      <div className={`px-6 md:px-0 ${site.portrait_url ? "" : "md:col-span-2 md:max-w-2xl"}`}>
        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">{labels.who}</p>
        <h2 className="display mt-3">{site.full_name}</h2>
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-bronze">
          {site.profession}
          {site.studio_name ? ` · ${site.studio_name}` : ""}
        </p>
        {site.bio ? (
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-stone">{site.bio}</p>
        ) : null}
        {!compact && site.philosophy ? (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone">{site.philosophy}</p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {compact ? (
            <Link
              href="/estudio"
              className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-ivory"
            >
              {labels.know_more}
            </Link>
          ) : null}
          {site.instagram ? (
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.22em] text-bronze hover:text-ink"
            >
              {instagramLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
