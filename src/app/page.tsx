import Link from "next/link";
import { EmptyFrame } from "@/components/site/EmptyFrame";
import { ExtraSections } from "@/components/site/ExtraSections";
import { FilmReel } from "@/components/site/FilmReel";
import { HeroStage } from "@/components/site/HeroStage";
import { WorksGrid } from "@/components/site/ProjectArchive";
import { Reveal } from "@/components/site/Reveal";
import { HowWeWork } from "@/components/site/HowWeWork";
import { SiteShell } from "@/components/site/SiteShell";
import { WhoSection } from "@/components/site/WhoSection";
import { homeHeroPhotos, mergeTheme, sectionStyle, showReel, siteLabels } from "@/lib/appearance";
import { getPageSections, getPublishedProjects, getServices, getSiteProfile } from "@/lib/content";
import { collectionPhotoUrls } from "@/lib/media";

function splitHeroTitle(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4) return { lead: text.trim(), accent: "" };
  const cut = words.length >= 5 ? 2 : 1;
  return {
    lead: words.slice(0, cut).join(" "),
    accent: words.slice(cut).join(" "),
  };
}

export default async function HomePage() {
  const [site, projects, extra, services] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(),
    getPageSections("home"),
    getServices(),
  ]);
  const labels = siteLabels(site);
  const theme = mergeTheme(site.theme);
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const works = featured.length ? featured : projects.slice(0, 3);
  const heroPhotos = homeHeroPhotos(site, collectionPhotoUrls(works, 4));
  const hasHero = heroPhotos.length > 0;
  const showWho = Boolean(site.bio || site.portrait_url || site.philosophy);
  const headline = (site.tagline || "").trim();
  const title = splitHeroTitle(headline);

  return (
    <SiteShell site={site} home={hasHero}>
      <section
        className={`relative isolate overflow-hidden ${
          hasHero ? "min-h-[100svh] bg-ink text-ivory" : "bg-paper text-ink"
        }`}
        style={sectionStyle(theme, "hero")}
      >
        {hasHero ? (
          <>
            <HeroStage photos={heroPhotos} alt={site.studio_name || site.full_name} />
            <div className="hero-veil pointer-events-none absolute inset-0" />
          </>
        ) : null}
        <div
          className={`relative z-10 flex flex-col ${
            hasHero
              ? "min-h-[100svh] w-full justify-end px-6 pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-28 md:px-16 md:pb-20 lg:px-24"
              : "mx-auto max-w-7xl border-b border-line px-6 pb-10 pt-8 md:px-10 md:pb-16 md:pt-28"
          }`}
        >
          {headline ? (
            <>
              {site.profession ? (
                <p className={`kicker reveal ${hasHero ? "text-ivory" : "opacity-70"}`}>
                  {site.profession}
                </p>
              ) : null}
              {site.location ? (
                <p className={`reveal mt-2 text-[10px] uppercase tracking-[0.2em] ${hasHero ? "text-ivory/80" : "opacity-55"}`}>
                  {site.location}
                </p>
              ) : null}
              <h1 className={`${hasHero ? "display-hero drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]" : "display"} reveal reveal-delay-1 mt-5 max-w-[22rem] md:max-w-[28rem]`}>
                {title.accent ? (
                  <>
                    {title.lead}
                    <br />
                    <em>{title.accent}</em>
                  </>
                ) : (
                  headline
                )}
              </h1>
              {!hasHero && (site.studio_name || site.location) ? (
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
          {hasHero ? (
            <div className="reveal reveal-delay-2 mt-10 flex flex-wrap items-center gap-3 pb-4 md:mt-16 md:pb-0">
              <Link
                href="/contacto"
                className="inline-flex min-h-11 items-center bg-ivory px-6 text-[11px] uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-80"
              >
                {labels.conversemos}
              </Link>
              <a
                href="#obras"
                className="inline-flex min-h-11 items-center border border-ivory/45 px-6 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-ivory"
              >
                {labels.see_works}
              </a>
            </div>
          ) : (
            <div className="reveal reveal-delay-2 mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/contacto"
                className="inline-flex min-h-11 items-center bg-ink px-6 text-[11px] uppercase tracking-[0.22em] text-ivory transition-opacity hover:opacity-80"
              >
                {labels.conversemos}
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-ivory"
              >
                {labels.see_works}
              </Link>
            </div>
          )}
        </div>
      </section>

      {showReel(theme, "home") ? (
        <FilmReel photos={collectionPhotoUrls(works, 8)} alt={labels.works} />
      ) : null}

      <section
        id="obras"
        className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-24 pt-16 md:px-12 md:pb-36 md:pt-32 lg:px-16"
        style={sectionStyle(theme, "works")}
      >
        <Reveal>
          <div className="mb-12 flex items-end justify-between gap-6 border-b border-line pb-8 md:mb-20 md:pb-16">
            <h2 className="font-serif text-[clamp(2.2rem,11vw,4.2rem)] font-light leading-[0.92] tracking-tight">
              {labels.works}
            </h2>
            <Link
              href="/proyectos"
              className="mb-1 hidden min-h-11 shrink-0 items-center text-[11px] uppercase tracking-[0.22em] text-bronze hover:text-ink md:inline-flex"
            >
              {labels.archive}
            </Link>
          </div>
        </Reveal>
        {works.length ? (
          <WorksGrid projects={works} />
        ) : (
          <EmptyFrame kicker={labels.archive} title="El archivo se actualiza con cada encargo." />
        )}
        {works.length ? (
          <div className="mt-14 md:hidden">
            <Link
              href="/proyectos"
              className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em]"
            >
              {labels.archive}
            </Link>
          </div>
        ) : null}
      </section>

      <HowWeWork site={site} services={services} />

      {showWho ? (
        <div style={sectionStyle(theme, "about")}>
          <Reveal>
            <WhoSection site={site} compact />
          </Reveal>
        </div>
      ) : null}

      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
