import Link from "next/link";
import { FilmReel } from "@/components/site/FilmReel";
import { Photo } from "@/components/site/Photo";
import { Reveal } from "@/components/site/Reveal";
import { mergeTheme, sectionStyle, siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";

export function StudioBand({ site, media }: { site: SiteProfile; media: string[] }) {
  const labels = siteLabels(site);
  const theme = mergeTheme(site.theme);
  const cube = site.banner_url;
  const brand = site.studio_name || site.full_name;
  const line = [site.profession, site.location].filter(Boolean).join(" · ");
  const hasIntro = Boolean(cube || brand || line);
  const hasReel = media.length > 1;

  if (!hasIntro && !hasReel) return null;

  return (
    <section style={sectionStyle(theme, "brand")}>
      {hasIntro ? (
        <Reveal>
          <div className="mx-auto grid max-w-7xl items-center gap-12 border-y border-line px-6 py-20 md:grid-cols-2 md:gap-20 md:px-12 md:py-28 lg:px-16">
            {cube ? (
              <div className="flex justify-center bg-ivory px-10 py-12 md:px-14 md:py-16">
                <Photo
                  src={cube}
                  alt={brand}
                  className="h-auto w-full max-w-[18rem] object-contain md:max-w-[22rem]"
                />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
            <div>
              <p className="kicker text-bronze">{labels.conversemos}</p>
              {brand ? <h2 className="display-sm mt-4">{brand}</h2> : null}
              <div className="rule mt-6 max-w-[4rem]" />
              {line ? (
                <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-bronze">{line}</p>
              ) : null}
              <p className="mt-8 max-w-md text-[0.95rem] leading-[1.75] text-stone">
                Si estás pensando un espacio, escribime. Coordinamos una primera conversación.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex min-h-11 items-center bg-ink px-6 text-[11px] uppercase tracking-[0.22em] text-ivory transition-opacity hover:opacity-80"
                >
                  {labels.conversemos}
                </Link>
                <Link
                  href="/estudio"
                  className="inline-flex min-h-11 items-center border border-ink px-6 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  {labels.nav_about}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      ) : null}
      {hasReel ? <FilmReel photos={media} alt={brand || labels.works} /> : null}
    </section>
  );
}
