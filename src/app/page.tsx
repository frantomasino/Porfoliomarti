import Link from "next/link";
import { EmptyFrame } from "@/components/site/EmptyFrame";
import { ExtraSections } from "@/components/site/ExtraSections";
import { Photo } from "@/components/site/Photo";
import { WorksGrid } from "@/components/site/ProjectArchive";
import { PageBanner } from "@/components/site/PageBanner";
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
  const showWho = Boolean(site.bio);
  const headline = (site.tagline || "").trim();
  const kicker = site.profession || site.location;

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
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
          </>
        ) : null}
        <div
          className={`relative mx-auto flex max-w-7xl flex-col px-6 md:px-10 ${
            hasHero
              ? "min-h-[78svh] justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 md:min-h-svh md:pb-16"
              : "border-b border-line pb-10 pt-8 md:pb-16 md:pt-28"
          }`}
        >
          {headline ? (
            <>
              {kicker ? <p className="kicker reveal opacity-70">{kicker}</p> : null}
              <h1 className="display reveal reveal-delay-1 mt-5 max-w-[16ch]">{headline}</h1>
              {site.studio_name || site.location ? (
                <p className="reveal reveal-delay-1 mt-5 max-w-md text-sm leading-relaxed opacity-70">
                  {[site.studio_name, site.location].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </>
          ) : (
            <>
              {site.profession ? (
                <h1 className="display-sm reveal mt-1 max-w-[18ch]">{site.profession}</h1>
              ) : (
                <h1 className="sr-only">{site.studio_name || site.full_name || labels.works}</h1>
              )}
              {site.location ? (
                <p className="reveal reveal-delay-1 mt-5 text-sm tracking-wide opacity-70">{site.location}</p>
              ) : null}
            </>
          )}
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

      {showWho ? <WhoSection site={site} compact /> : null}

      <PageBanner src={site.banner_url} alt={labels.works} />

      <section
        className={`mx-auto max-w-7xl px-6 pb-28 md:px-10 ${
          site.banner_url || !showWho ? "pt-10 md:pt-24" : ""
        }`}
      >
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-line pb-6 md:mb-16 md:pb-12">
          <div>
            <p className="kicker text-bronze">{labels.selection}</p>
            <h2 className="mt-2 font-serif text-[clamp(2.2rem,11vw,4.2rem)] font-light leading-none tracking-tight">
              {labels.works}
            </h2>
          </div>
          <Link
            href="/proyectos"
            className="mb-1 hidden min-h-11 shrink-0 items-center text-[11px] uppercase tracking-[0.22em] text-bronze hover:text-ink md:inline-flex"
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
