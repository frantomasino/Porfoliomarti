import { ExtraSections } from "@/components/site/ExtraSections";
import { PageBanner } from "@/components/site/PageBanner";
import { ProjectArchive } from "@/components/site/ProjectArchive";
import { SiteShell } from "@/components/site/SiteShell";
import { siteLabels } from "@/lib/appearance";
import { getPageSections, getPublishedProjects, getSiteProfile } from "@/lib/content";

export async function generateMetadata() {
  const site = await getSiteProfile();
  return { title: siteLabels(site).nav_projects };
}

export default async function ProjectsPage() {
  const [site, projects, extra] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(),
    getPageSections("proyectos"),
  ]);
  const labels = siteLabels(site);

  return (
    <SiteShell site={site}>
      <PageBanner src={site.banner_url} alt={labels.nav_projects} />
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-12 md:px-10 md:pt-16">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-8 md:pb-12">
          <div>
            <p className="kicker text-bronze">{labels.archive}</p>
            <h1 className="mt-2 font-serif text-[clamp(2.6rem,6vw,4.2rem)] font-light leading-none tracking-tight">
              {labels.nav_projects}
            </h1>
          </div>
          {projects.length ? (
            <p className="mb-1 hidden text-[11px] text-stone md:block">
              {projects.length} {projects.length === 1 ? "obra" : "obras"}
            </p>
          ) : null}
        </div>
        <ProjectArchive projects={projects} />
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
