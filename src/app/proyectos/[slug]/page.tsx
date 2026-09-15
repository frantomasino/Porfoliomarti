import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaBlock } from "@/components/site/MediaBlock";
import { Photo } from "@/components/site/Photo";
import { SiteShell } from "@/components/site/SiteShell";
import { getProjectBySlug, getPublishedProjects, getSiteProfile } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyecto" };
  return {
    title: project.title,
    description: project.excerpt,
  };
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

  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const next = projects[(currentIndex + 1) % projects.length];
  const images = project.images ?? [];

  return (
    <SiteShell site={site}>
      <section className="relative min-h-[70svh] overflow-hidden bg-ink">
        {project.cover_url ? (
          <Photo
            src={project.cover_url}
            alt={project.title}
            priority
            className="absolute inset-0 h-full w-full object-cover object-[center_70%] opacity-80"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
        <div className="relative mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-10 md:px-10 md:pb-14">
          <div className="text-ivory">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ivory/70">
              {project.category} · {project.year}
            </p>
            <h1 className="display mt-3 max-w-[14ch]">{project.title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-10">
        <dl className="grid gap-6 text-sm">
          <Meta label="Ubicación" value={project.location} />
          <Meta label="Año" value={String(project.year)} />
          <Meta label="Superficie" value={project.area} />
          <Meta label="Estado" value={project.status} />
          <Meta label="Cliente" value={project.client} />
        </dl>
        <div>
          <p className="font-serif text-3xl leading-snug md:text-4xl">{project.excerpt}</p>
          <div className="mt-8 max-w-2xl space-y-5 text-sm leading-relaxed text-stone whitespace-pre-line">
            {project.description}
          </div>
        </div>
      </section>

      {images.length ? (
        <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:px-10">
          {images.map((item, index) => (
            <figure
              key={item.id}
              className={
                index === 0
                  ? "relative aspect-video overflow-hidden bg-ink"
                  : "relative aspect-[4/3] overflow-hidden bg-ink md:aspect-video"
              }
            >
              <MediaBlock item={item} alt={item.caption || project.title} />
              {item.caption ? (
                <figcaption className="absolute bottom-0 left-0 bg-ink/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ivory">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </section>
      ) : null}

      {next && next.id !== project.id ? (
        <section className="border-t border-line">
          <Link href={`/proyectos/${next.slug}`} className="group mx-auto flex max-w-7xl items-end justify-between px-6 py-16 md:px-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Siguiente obra</p>
              <p className="display-sm mt-2">{next.title}</p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-bronze">Continuar</span>
          </Link>
        </section>
      ) : null}
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
