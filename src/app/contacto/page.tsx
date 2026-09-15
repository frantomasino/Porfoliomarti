import { ContactForm } from "@/components/site/ContactForm";
import { SiteShell } from "@/components/site/SiteShell";
import { getSiteProfile } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contacto" };

export default async function ContactPage() {
  const site = await getSiteProfile();
  const instagramLabel = site.instagram.includes("instagram.com/")
    ? `@${site.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")}`
    : "Instagram";

  return (
    <SiteShell site={site}>
      <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-16 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Conversemos</p>
          <h1 className="mt-3 font-serif text-6xl md:text-7xl">Contacto</h1>
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-stone">
            {site.full_name} recibe encargos de proyectos integrales, interiorismo y reformas.
            Escribí con una breve descripción del lugar y lo que imaginás.
          </p>
          <div className="mt-10 space-y-3 text-sm">
            <p>{site.location}</p>
            {site.email ? (
              <a className="block hover:text-bronze" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            ) : null}
            {site.phone ? (
              <a className="block hover:text-bronze" href={`tel:${site.phone}`}>
                {site.phone}
              </a>
            ) : null}
            {site.instagram ? (
              <a className="block hover:text-bronze" href={site.instagram} target="_blank" rel="noreferrer">
                {instagramLabel}
              </a>
            ) : null}
          </div>
        </div>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
