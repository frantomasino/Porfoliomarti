import { ExtraSections } from "@/components/site/ExtraSections";
import { SiteShell } from "@/components/site/SiteShell";
import { WhoSection } from "@/components/site/WhoSection";
import { siteLabels } from "@/lib/appearance";
import { getPageSections, getServices, getSiteProfile, getTimeline } from "@/lib/content";
import type { TimelineItem } from "@/lib/types";

export async function generateMetadata() {
  const site = await getSiteProfile();
  return { title: siteLabels(site).nav_about };
}

export default async function StudioPage() {
  const [site, timeline, services, extra] = await Promise.all([
    getSiteProfile(),
    getTimeline(),
    getServices(),
    getPageSections("estudio"),
  ]);
  const labels = siteLabels(site);

  const experience = timeline.filter((item) => item.kind === "experience");
  const education = timeline.filter((item) => item.kind === "education");
  const awards = timeline.filter((item) => item.kind === "award");

  return (
    <SiteShell site={site}>
      <WhoSection site={site} />

      {experience.length || education.length || awards.length ? (
        <section className="border-y border-line bg-ivory">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-3 md:px-10">
            <TimelineColumn title={labels.practice} items={experience} />
            <TimelineColumn title={labels.education} items={education} />
            <TimelineColumn title={labels.notes} items={awards} />
          </div>
        </section>
      ) : null}

      {services.length ? (
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone">{labels.services}</p>
          <h2 className="display-sm mt-3">{labels.how_works}</h2>
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
      ) : null}

      <ExtraSections sections={extra} />
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
