import Link from "next/link";
import { ExtraSections } from "@/components/site/ExtraSections";
import { Photo } from "@/components/site/Photo";
import { ProjectCard } from "@/components/site/ProjectCard";
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

  return (
    <SiteShell site={site} home={Boolean(site.hero_image_url)}>
      <section
        className={`relative isolate min-h-[78svh] overflow-hidden md:min-h-svh ${
          site.hero_image_url ? "bg-ink text-ivory" : "bg-paper text-ink"
        }`}
      >
        {site.hero_image_url ? (
          <>
            <Photo
              src={site.hero_image_url}
              alt={site.studio_name || site.full_name}
              priority
              className="absolute inset-0 h-full w-full object-cover object-[center_78%] md:object-[center_70%]"
            />
            <div className="absolute inset-0 bg-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
          </>
        ) : null}
        <div className="relative mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-end px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 md:min-h-svh md:px-10 md:pb-16">
          {site.location ? (
            <p className="reveal text-[11px] uppercase tracking-[0.28em] opacity-70">
              {site.location}
            </p>
          ) : null}
          <h1 className="display reveal reveal-delay-1 mt-4 max-w-[16ch]">
            {site.tagline || site.studio_name}
          </h1>
          <div className="reveal reveal-delay-2 mt-8 flex flex-wrap items-center gap-3 pb-6">
            <Link
              href="/proyectos"
              className={`inline-flex min-h-11 items-center px-6 text-[11px] uppercase tracking-[0.22em] ${
                site.hero_image_url
                  ? "bg-ivory text-ink"
                  : "bg-ink text-ivory"
              }`}
            >
              {labels.see_works}
            </Link>
            <Link
              href="/estudio"
              className={`inline-flex min-h-11 items-center border px-6 text-[11px] uppercase tracking-[0.22em] ${
                site.hero_image_url
                  ? "border-ivory/50 text-ivory"
                  : "border-ink text-ink"
              }`}
            >
              {labels.nav_about}
            </Link>
          </div>
        </div>
      </section>

      <WhoSection site={site} compact />

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone">{labels.selection}</p>
            <h2 className="display-sm mt-2">{labels.works}</h2>
          </div>
          <Link
            href="/proyectos"
            className="min-h-11 text-[11px] uppercase tracking-[0.22em] text-bronze"
          >
            {labels.archive}
          </Link>
        </div>
        {works.length ? (
          <div className="grid gap-12">
            {works[0] ? <ProjectCard project={works[0]} index={0} large /> : null}
            {works.length > 1 ? (
              <div className="grid gap-12 md:grid-cols-2">
                {works.slice(1).map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index + 1} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-stone">Todavía no hay obras publicadas.</p>
        )}
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
