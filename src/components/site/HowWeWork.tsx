import { processSteps, siteLabels } from "@/lib/appearance";
import type { Service, SiteProfile } from "@/lib/types";
import { Reveal } from "@/components/site/Reveal";

export function HowWeWork({
  site,
  services = [],
}: {
  site: SiteProfile;
  services?: Service[];
}) {
  const labels = siteLabels(site);
  const steps = services.length
    ? services.map((service) => ({ title: service.title, body: service.description }))
    : processSteps(labels);
  if (!steps.length) return null;

  return (
    <section id="servicios" className="scroll-mt-24 px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-7xl border-b border-line pb-8 md:pb-12">
        <h2 className="font-serif text-[clamp(2.2rem,6vw,4.2rem)] font-light leading-none tracking-tight">
          {labels.how_works}
        </h2>
      </div>
      <div className="mx-auto max-w-7xl md:border-x md:border-b md:border-line">
        <div className="grid md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal
              key={`${step.title}-${index}`}
              delay={index * 90}
              className="border-b border-line md:border-r md:[&:nth-child(3n)]:border-r-0"
            >
              <article className="px-0 py-12 md:px-10 md:py-14">
                <p className="font-serif text-[2rem] font-light leading-none tracking-[0.05em] text-line">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 font-serif text-[1.5rem] tracking-wide">{step.title}</h3>
                <p className="mt-3 max-w-sm text-[0.82rem] font-light leading-[2] text-stone">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
