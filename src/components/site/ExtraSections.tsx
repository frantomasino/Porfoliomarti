import { Photo } from "@/components/site/Photo";
import { Reveal } from "@/components/site/Reveal";
import type { PageSection } from "@/lib/types";

export function ExtraSections({ sections }: { sections: PageSection[] }) {
  if (!sections.length) return null;

  return (
    <div>
      {sections.map((section, index) => (
        <Reveal key={section.id} delay={index * 80}>
          <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
            {section.image_url ? (
              <div className="relative mb-8 aspect-[16/10] max-h-[28rem] overflow-hidden bg-line">
                <Photo
                  src={section.image_url}
                  alt={section.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ) : null}
            {section.title ? <h2 className="display-sm">{section.title}</h2> : null}
            {section.title ? <div className="rule mt-5 max-w-[4rem]" /> : null}
            {section.body ? (
              <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-stone">
                {section.body}
              </p>
            ) : null}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
