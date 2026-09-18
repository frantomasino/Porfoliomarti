import { ContactForm } from "@/components/site/ContactForm";
import { ExtraSections } from "@/components/site/ExtraSections";
import { JsonLd } from "@/components/site/JsonLd";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { contactIntro, mergeTheme, sectionStyle, siteLabels } from "@/lib/appearance";
import { getPageSections, getSiteProfile } from "@/lib/content";
import { breadcrumbJsonLd, clipMeta, publicPageMetadata } from "@/lib/seo";
import { mailtoUrl, whatsappUrl } from "@/lib/utils";

export async function generateMetadata() {
  const site = await getSiteProfile();
  const labels = siteLabels(site);
  const brand = site.studio_name || site.full_name;
  return publicPageMetadata({
    site,
    title: labels.nav_contact,
    description: clipMeta(
      contactIntro(labels) || `${labels.nav_contact} de ${brand}${site.location ? ` · ${site.location}` : ""}`,
    ),
    path: "/contacto",
  });
}

export default async function ContactPage() {
  const [site, extra] = await Promise.all([getSiteProfile(), getPageSections("contacto")]);
  const labels = siteLabels(site);
  const theme = mergeTheme(site.theme);
  const intro = contactIntro(labels);
  const whatsapp = whatsappUrl(site.phone);
  const mail = mailtoUrl(site.email);
  const hasAside = Boolean(intro) || Boolean(site.location) || Boolean(mail) || Boolean(site.phone);

  return (
    <SiteShell site={site}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.studio_name || site.full_name, path: "/" },
          { name: labels.nav_contact, path: "/contacto" },
        ])}
      />
      <section
        className={
          hasAside
            ? "mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:px-12 md:pb-32 md:pt-24 lg:px-16"
            : "mx-auto max-w-3xl px-6 pb-32 pt-14 md:px-12 md:pb-32 md:pt-24"
        }
        style={sectionStyle(theme, "contact")}
      >
        <Reveal>
          <div>
          <h1 className="display-sm">{labels.contact}</h1>
          <div className="rule mt-6 max-w-[4rem]" />
          {intro ? (
            <p className="mt-8 max-w-lg text-[0.95rem] leading-[1.75] text-stone">{intro}</p>
          ) : null}
          {site.location ? <p className="mt-4 text-sm text-stone">{site.location}</p> : null}
          {mail || whatsapp ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {mail ? (
                <a
                  href={mail}
                  className="inline-flex min-h-11 items-center bg-ink px-6 text-[11px] uppercase tracking-[0.22em] text-ivory"
                >
                  Escribir por mail
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
          ) : null}
          </div>
        </Reveal>
        <Reveal delay={120}>
        <div className={`border border-line bg-ivory px-5 py-6 md:px-8 md:py-10 ${hasAside ? "" : "mt-8"}`}>
          <ContactForm studioPhone={site.phone} studioEmail={site.email} />
        </div>
        </Reveal>
      </section>
      <ExtraSections sections={extra} />
    </SiteShell>
  );
}
