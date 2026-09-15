import { ContactForm } from "@/components/site/ContactForm";
import { ExtraSections } from "@/components/site/ExtraSections";
import { SiteShell } from "@/components/site/SiteShell";
import { siteLabels } from "@/lib/appearance";
import { getPageSections, getSiteProfile } from "@/lib/content";
import { whatsappUrl } from "@/lib/utils";

export async function generateMetadata() {
  const site = await getSiteProfile();
  return { title: siteLabels(site).nav_contact };
}

export default async function ContactPage() {
  const [site, extra] = await Promise.all([getSiteProfile(), getPageSections("contacto")]);
  const labels = siteLabels(site);
  const instagramLabel = site.instagram.includes("instagram.com/")
    ? `@${site.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")}`
    : "Instagram";
  const whatsapp = whatsappUrl(site.phone);

  return (
    <SiteShell site={site}>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-10 md:pt-16">
        <div>
          <p className="kicker text-stone">{labels.conversemos}</p>
          <h1 className="display mt-4">{labels.contact}</h1>
          <div className="rule mt-6 max-w-[4rem]" />
          {labels.contact_intro ? (
            <p className="mt-8 max-w-lg text-[0.95rem] leading-[1.75] text-stone">{labels.contact_intro}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {site.instagram ? (
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center bg-ink px-6 text-[11px] uppercase tracking-[0.22em] text-ivory"
              >
                {instagramLabel}
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em]"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
          <div className="mt-10 space-y-3 text-sm text-stone">
            {site.location ? <p>{site.location}</p> : null}
            {site.email ? (
              <a className="block min-h-11 hover:text-bronze" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            ) : null}
            {site.phone ? (
              <a className="block min-h-11 hover:text-bronze" href={`tel:${site.phone}`}>
                {site.phone}
              </a>
            ) : null}
          </div>
        </div>
        <div className="border border-line bg-ivory px-6 py-8 md:px-8 md:py-10">
          <ContactForm />
        </div>
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
