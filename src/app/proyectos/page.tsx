import { ExtraSections } from "@/components/site/ExtraSections";
import { FilmReel } from "@/components/site/FilmReel";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectArchive } from "@/components/site/ProjectArchive";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { mergeTheme, reelMedia, sectionStyle, showReel, siteLabels } from "@/lib/appearance";
import { getPageSections, getPublishedProjects, getSiteProfile } from "@/lib/content";
import { collectionMediaUrls } from "@/lib/media";
import { breadcrumbJsonLd, clipMeta, publicPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSiteProfile();
  const labels = siteLabels(site);
  const brand = site.studio_name || site.full_name;
  return publicPageMetadata({
    site,
    title: labels.nav_projects,
    description: clipMeta(`${labels.nav_projects} de ${brand}${site.location ? ` en ${site.location}` : ""}.`),
    path: "/proyectos",
  });
}

export default async function ProjectsPage() {
  const [site, projects, extra] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(),
    getPageSections("proyectos"),
  ]);
  const labels = siteLabels(site);
  const theme = mergeTheme(site.theme);
  const brand = site.studio_name || site.full_name;
  const reelPhotos = reelMedia(site, collectionMediaUrls(projects));
  const reel = showReel(theme, "proyectos");

  return (
    <SiteShell site={site}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: brand, path: "/" },
          { name: labels.nav_projects, path: "/proyectos" },
        ])}
      />
      {reel && reelPhotos.length > 1 ? (
        <FilmReel photos={reelPhotos} alt={labels.nav_projects} />
      ) : null}
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-14 md:px-12 md:pb-36 md:pt-24 lg:px-16" style={sectionStyle(theme, "works")}>
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-line pb-8 md:pb-16">
            <div>
              <p className="kicker text-bronze">{labels.archive}</p>
              <h1 className="mt-4 font-serif text-[clamp(2.2rem,11vw,4.2rem)] font-light leading-[0.92] tracking-tight">
                {labels.nav_projects}
              </h1>
            </div>
            {projects.length ? (
              <p className="mb-1 hidden text-[11px] text-stone md:block">
                {projects.length} {projects.length === 1 ? "obra" : "obras"}
              </p>
            ) : null}
          </div>
        </Reveal>
        <ProjectArchive projects={projects} />
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
