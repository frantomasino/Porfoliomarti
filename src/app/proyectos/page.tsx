import { ProjectArchive } from "@/components/site/ProjectArchive";
import { SiteShell } from "@/components/site/SiteShell";
import { getPublishedProjects, getSiteProfile } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Proyectos" };

export default async function ProjectsPage() {
  const [site, projects] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(),
  ]);

  return (
    <SiteShell site={site}>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Archivo</p>
        <h1 className="mt-3 font-serif text-6xl md:text-7xl">Proyectos</h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-stone">
          Una selección de obras construidas y proyectos en curso. El archivo se actualiza desde el estudio.
        </p>
        <ProjectArchive projects={projects} />
      </section>
    </SiteShell>
  );
}
