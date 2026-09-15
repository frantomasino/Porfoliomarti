import Link from "next/link";
import { Photo } from "@/components/site/Photo";
import { siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";
import { instagramLabel } from "@/lib/utils";

export function WhoSection({
  site,
  compact = false,
}: {
  site: SiteProfile;
  compact?: boolean;
}) {
  const labels = siteLabels(site);
  const hasPortrait = Boolean(site.portrait_url);

  return (
    <section
      className={`mx-auto grid max-w-7xl items-end gap-6 px-6 py-10 md:gap-16 md:px-10 md:py-28 ${
        hasPortrait ? "md:grid-cols-[0.9fr_1.1fr]" : ""
      }`}
    >
      {hasPortrait ? (
        <div
          className={`relative order-2 aspect-[4/5] overflow-hidden bg-line md:order-1 ${
            compact ? "max-h-[36svh] md:max-h-[28rem]" : "max-h-[38svh] md:max-h-none"
          }`}
        >
          <Photo
            src={site.portrait_url}
            alt={site.full_name}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      ) : null}
      <div className="order-1 md:order-2">
        <p className="kicker text-stone">{labels.who}</p>
        <h2 className="display-sm mt-4">{site.full_name}</h2>
        <div className="rule mt-6 max-w-[4rem]" />
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-bronze">
          {[site.profession, site.studio_name].filter(Boolean).join(" · ")}
        </p>
        {site.bio ? (
          <p className="mt-8 max-w-xl text-[0.95rem] leading-[1.75] text-stone">{site.bio}</p>
        ) : null}
        {!compact && site.philosophy ? (
          <p className="mt-5 max-w-xl text-[0.95rem] leading-[1.75] text-stone">{site.philosophy}</p>
        ) : null}
        <div className={`flex flex-wrap items-center gap-3 ${site.bio ? "mt-12" : "mt-6"}`}>
          {compact ? (
            <Link
              href="/estudio"
              className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
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
              {instagramLabel(site.instagram)}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
