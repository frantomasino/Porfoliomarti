import { SiteShell } from "@/components/site/SiteShell";
import { WhoSection } from "@/components/site/WhoSection";
import { getServices, getSiteProfile, getTimeline } from "@/lib/content";
import type { TimelineItem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quién es" };

export default async function StudioPage() {
  const [site, timeline, services] = await Promise.all([
    getSiteProfile(),
    getTimeline(),
    getServices(),
  ]);

  const experience = timeline.filter((item) => item.kind === "experience");
  const education = timeline.filter((item) => item.kind === "education");
  const awards = timeline.filter((item) => item.kind === "award");

  return (
    <SiteShell site={site}>
      <WhoSection site={site} />

      {experience.length || education.length || awards.length ? (
        <section className="border-y border-line bg-ivory">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-3 md:px-10">
            <TimelineColumn title="Práctica" items={experience} />
            <TimelineColumn title="Formación" items={education} />
            <TimelineColumn title="Notas" items={awards} />
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Servicios</p>
        <h2 className="mt-3 font-serif text-5xl">Cómo trabaja</h2>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <article key={service.id} className="grid gap-4 py-8 md:grid-cols-[120px_1fr_1.4fr]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bronze">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-serif text-3xl">{service.title}</h3>
              <p className="text-sm leading-relaxed text-stone">{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function TimelineColumn({ title, items }: { title: string; items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="font-serif text-3xl">{title}</h2>
      <div className="mt-8 space-y-8">
        {items.map((item) => (
          <article key={item.id}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-bronze">{item.period}</p>
            <h3 className="mt-2 text-base">{item.title}</h3>
            <p className="text-sm text-stone">{item.subtitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
