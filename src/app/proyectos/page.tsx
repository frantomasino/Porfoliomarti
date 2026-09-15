import { ExtraSections } from "@/components/site/ExtraSections";
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
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10 md:pt-16">
        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">{labels.archive}</p>
        <h1 className="display mt-3">{labels.nav_projects}</h1>
        <ProjectArchive projects={projects} />
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
