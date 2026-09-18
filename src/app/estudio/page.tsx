import { ExtraSections } from "@/components/site/ExtraSections";
import { JsonLd } from "@/components/site/JsonLd";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { WhoSection } from "@/components/site/WhoSection";
import { mergeTheme, sectionStyle, siteLabels } from "@/lib/appearance";
import { getPageSections, getSiteProfile, getTimeline } from "@/lib/content";
import { breadcrumbJsonLd, clipMeta, publicPageMetadata, siteDescription } from "@/lib/seo";
import type { TimelineItem } from "@/lib/types";

export async function generateMetadata() {
  const site = await getSiteProfile();
  const labels = siteLabels(site);
  return publicPageMetadata({
    site,
    title: labels.nav_about,
    description: clipMeta(siteDescription(site) || `${labels.nav_about} — ${site.studio_name || site.full_name}`),
    path: "/estudio",
    image: site.portrait_url || undefined,
  });
}

export default async function StudioPage() {
  const [site, timeline, extra] = await Promise.all([
    getSiteProfile(),
    getTimeline(),
    getPageSections("estudio"),
  ]);
  const labels = siteLabels(site);
  const theme = mergeTheme(site.theme);

  const experience = timeline.filter((item) => item.kind === "experience");
  const education = timeline.filter((item) => item.kind === "education");
  const awards = timeline.filter((item) => item.kind === "award");

  return (
    <SiteShell site={site}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.studio_name || site.full_name, path: "/" },
          { name: labels.nav_about, path: "/estudio" },
        ])}
      />
      <div style={sectionStyle(theme, "about")}>
        <Reveal>
          <WhoSection site={site} />
        </Reveal>
      </div>

      {experience.length || education.length || awards.length ? (
        <section className="border-y border-line bg-ivory">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-3 md:px-12 lg:px-16">
            <Reveal delay={0}>
            <TimelineColumn title={labels.practice} items={experience} />
            </Reveal>
            <Reveal delay={90}>
            <TimelineColumn title={labels.education} items={education} />
            </Reveal>
            <Reveal delay={180}>
            <TimelineColumn title={labels.notes} items={awards} />
            </Reveal>
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
