import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectViewer } from "@/components/site/ProjectViewer";
import { SiteShell } from "@/components/site/SiteShell";
import { siteLabels } from "@/lib/appearance";
import { getProjectBySlug, getPublishedProjects, getSiteProfile } from "@/lib/content";
import { breadcrumbJsonLd, projectDescription, projectJsonLd, publicPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyecto" };
  const site = await getSiteProfile();
  return publicPageMetadata({
    site,
    title: project.title,
    description: projectDescription(project, site),
    path: `/proyectos/${project.slug}`,
    image: project.cover_url || project.images?.[0]?.url,
    type: "article",
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, project, projects] = await Promise.all([
    getSiteProfile(),
    getProjectBySlug(slug),
    getPublishedProjects(),
  ]);

  if (!project) notFound();

  const labels = siteLabels(site);

  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : undefined;

  return (
    <SiteShell site={site}>
      <JsonLd data={projectJsonLd(project, site)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.studio_name || site.full_name, path: "/" },
          { name: labels.nav_projects, path: "/proyectos" },
          { name: project.title, path: `/proyectos/${project.slug}` },
        ])}
      />
      <ProjectViewer project={project} prev={prev} next={next} />

      <section
        className={
          project.area || project.client || project.year
            ? "mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:py-20"
            : "mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20"
        }
      >
        {project.area || project.client || project.year ? (
        <dl className="grid gap-6 text-sm">
          <Meta label="Superficie" value={project.area} />
          <Meta label="Cliente" value={project.client} />
          {project.year ? <Meta label="Año" value={String(project.year)} /> : null}
        </dl>
        ) : null}
        <div>
          {project.excerpt ? (
            <p className="font-serif text-3xl leading-snug md:text-4xl">{project.excerpt}</p>
          ) : null}
          {project.description ? (
            <div className="mt-8 max-w-2xl space-y-5 text-sm leading-relaxed text-stone whitespace-pre-line">
              {project.description}
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
