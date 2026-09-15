import Link from "next/link";
import { EmptyFrame } from "@/components/site/EmptyFrame";
import { ExtraSections } from "@/components/site/ExtraSections";
import { Photo } from "@/components/site/Photo";
import { WorksGrid } from "@/components/site/ProjectArchive";
import { SiteShell } from "@/components/site/SiteShell";
import { WhoSection } from "@/components/site/WhoSection";
import { siteLabels } from "@/lib/appearance";
import { getPageSections, getPublishedProjects, getSiteProfile } from "@/lib/content";

export default async function HomePage() {
  const [site, projects, extra] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(),
    getPageSections("home"),
  ]);
  const labels = siteLabels(site);
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const works = featured.length ? featured : projects.slice(0, 3);
  const hasHero = Boolean(site.hero_image_url);

  return (
    <SiteShell site={site} home={hasHero}>
      <section
        className={`relative isolate overflow-hidden ${
          hasHero ? "min-h-[78svh] bg-ink text-ivory md:min-h-svh" : "bg-paper text-ink"
        }`}
      >
        {hasHero ? (
          <>
            <Photo
              src={site.hero_image_url}
              alt={site.studio_name || site.full_name}
              priority
              width={1600}
              className="absolute inset-0 h-full w-full object-cover object-[center_78%] md:object-[center_70%]"
            />
            <div className="absolute inset-0 bg-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
          </>
        ) : null}
        <div
          className={`relative mx-auto flex max-w-7xl flex-col px-6 md:px-10 ${
            hasHero
              ? "min-h-[78svh] justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 md:min-h-svh md:pb-16"
              : "border-b border-line pb-14 pt-24 md:pb-16 md:pt-28"
          }`}
        >
          {site.profession ? (
            <p className="kicker reveal opacity-70">{site.profession}</p>
          ) : site.location ? (
            <p className="kicker reveal opacity-70">{site.location}</p>
          ) : null}
          <h1 className="display reveal reveal-delay-1 mt-5 max-w-[14ch]">
            {site.tagline || site.studio_name}
          </h1>
          {site.tagline && site.studio_name ? (
            <p className="reveal reveal-delay-1 mt-5 max-w-md text-sm leading-relaxed opacity-70">
              {site.studio_name}
              {site.location ? ` · ${site.location}` : ""}
            </p>
          ) : site.location && site.profession ? (
            <p className="reveal reveal-delay-1 mt-5 text-sm tracking-wide opacity-70">{site.location}</p>
          ) : null}
          <div className="reveal reveal-delay-2 mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/proyectos"
              className={`inline-flex min-h-11 items-center px-6 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-80 ${
                hasHero ? "bg-ivory text-ink" : "bg-ink text-ivory"
              }`}
            >
              {labels.see_works}
            </Link>
            <Link
              href="/estudio"
              className={`inline-flex min-h-11 items-center border px-6 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                hasHero
                  ? "border-ivory/50 text-ivory hover:border-ivory"
                  : "border-ink text-ink hover:bg-ink hover:text-ivory"
              }`}
            >
              {labels.nav_about}
            </Link>
          </div>
        </div>
      </section>

      <WhoSection site={site} compact />

      <section className="mx-auto max-w-7xl px-6 pb-28 md:px-10">
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-line pb-8 md:mb-16 md:pb-12">
          <div>
            <p className="kicker text-bronze">{labels.selection}</p>
            <h2 className="mt-2 font-serif text-[clamp(2.6rem,6vw,4.2rem)] font-light leading-none tracking-tight">
              {labels.works}
            </h2>
          </div>
          <Link
            href="/proyectos"
            className="mb-1 inline-flex min-h-11 shrink-0 items-center text-[11px] uppercase tracking-[0.22em] text-bronze hover:text-ink"
          >
            {labels.archive}
          </Link>
        </div>
        {works.length ? (
          <WorksGrid projects={works} />
        ) : (
          <EmptyFrame kicker={labels.archive} title="El archivo se actualiza con cada encargo." />
        )}
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
