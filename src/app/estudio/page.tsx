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
        <section className="px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl border-b border-line pb-8 md:pb-10">
            <p className="kicker text-bronze">{labels.services}</p>
            <h2 className="mt-2 font-serif text-[clamp(2.6rem,6vw,4.2rem)] font-light leading-none tracking-tight">
              {labels.how_works}
            </h2>
          </div>
          <div className="mx-auto max-w-7xl md:border-x md:border-b md:border-line">
            <div className="grid md:grid-cols-3">
              {services.map((service, index) => (
                <article
                  key={service.id}
                  className="border-b border-line px-0 py-12 md:border-r md:px-10 md:py-14 md:[&:nth-child(3n)]:border-r-0"
                >
                  <p className="font-serif text-[2rem] font-light leading-none tracking-[0.05em] text-line">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 font-serif text-[1.5rem] tracking-wide">{service.title}</h3>
                  <p className="mt-3 max-w-sm text-[0.82rem] font-light leading-[2] text-stone">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
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
