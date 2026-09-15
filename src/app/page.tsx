import Link from "next/link";
import { Photo } from "@/components/site/Photo";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SiteShell } from "@/components/site/SiteShell";
import { WhoSection } from "@/components/site/WhoSection";
import { getPublishedProjects, getSiteProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [site, projects] = await Promise.all([
    getSiteProfile(),
    getPublishedProjects(),
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 4);
  const works = featured.length ? featured : projects.slice(0, 4);

  return (
    <SiteShell site={site}>
      <section className="relative min-h-[88vh] overflow-hidden bg-ink text-ivory">
        {site.hero_image_url ? (
          <Photo
            src={site.hero_image_url}
            alt={site.studio_name || site.full_name}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-20">
          <p className="reveal text-[11px] uppercase tracking-[0.32em] text-ivory/70">
            {site.location}
          </p>
          <h1 className="reveal reveal-delay-1 mt-4 max-w-4xl font-serif text-6xl leading-[0.9] md:text-8xl">
            {site.tagline}
          </h1>
          <div className="reveal reveal-delay-2 mt-8 flex flex-wrap items-center gap-8">
            <Link
              href="/proyectos"
              className="border border-ivory/40 px-7 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ivory hover:text-ink"
            >
              Ver obras
            </Link>
            <Link
              href="/estudio"
              className="text-[11px] uppercase tracking-[0.22em] text-ivory/75 hover:text-ivory"
            >
              Quién es
            </Link>
          </div>
        </div>
      </section>

      <WhoSection site={site} compact />

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Selección</p>
            <h2 className="mt-2 font-serif text-5xl">Obras</h2>
          </div>
          <Link
            href="/proyectos"
            className="hidden text-[11px] uppercase tracking-[0.22em] text-bronze md:block"
          >
            Archivo completo
          </Link>
        </div>
        <div className="grid gap-14">
          {works[0] ? <ProjectCard project={works[0]} index={0} large /> : null}
          <div className="grid gap-14 md:grid-cols-2">
            {works.slice(1, 3).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
          {works[3] ? <ProjectCard project={works[3]} index={3} large /> : null}
        </div>
      </section>

      <section className="border-y border-line bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-3 md:px-10">
          <Principle number="01" title="Proyecto integral" text="Arquitectura e interiorismo en un mismo proceso: del primer croquis a la obra." />
          <Principle number="02" title="Interiorismo" text="Materiales, mobiliario y luz pensados para el uso real de cada espacio." />
          <Principle number="03" title="Reformas" text="Intervenir lo existente con precisión, sin perder el carácter del lugar." />
        </div>
      </section>
    </SiteShell>
  );
}

function Principle({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article>
      <p className="text-[11px] uppercase tracking-[0.24em] text-bronze">{number}</p>
      <h3 className="mt-3 font-serif text-3xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-stone">{text}</p>
    </article>
  );
}
