import { Photo } from "@/components/site/Photo";
import type { PageSection } from "@/lib/types";

export function ExtraSections({ sections }: { sections: PageSection[] }) {
  if (!sections.length) return null;

  return (
    <div>
      {sections.map((section) => (
        <section key={section.id} className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
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
      ))}
    </div>
  );
}
