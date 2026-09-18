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
  const hasPortrait = Boolean(site.portrait_url);

  return (
    <section
      className={`mx-auto grid max-w-7xl items-end gap-10 px-6 py-16 md:gap-20 md:px-12 md:py-32 lg:px-16 ${
        hasPortrait ? "md:grid-cols-[0.9fr_1.1fr]" : ""
      }`}
    >
      {hasPortrait ? (
        <div
          className={`group relative aspect-[4/5] overflow-hidden bg-line ${
            compact ? "max-h-[42svh] md:max-h-[28rem]" : "max-h-[48svh] md:max-h-none"
          }`}
        >
          <Photo
            src={site.portrait_url}
            alt={site.full_name}
            className="slide-zoom absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      ) : null}
      <div>
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
        <div className={`flex flex-wrap items-center gap-3 ${site.bio ? "mt-10" : "mt-6"}`}>
          {compact ? (
            <Link
              href="/estudio"
              className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
            >
              {labels.know_more}
            </Link>
          ) : (
            <Link
              href="/proyectos"
              className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
            >
              {labels.see_works}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
