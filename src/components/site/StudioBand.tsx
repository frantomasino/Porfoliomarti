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
  const hasIntro = Boolean(cube || brand);
  const hasReel = media.length > 1;

  if (!hasIntro && !hasReel) return null;

  return (
    <section style={sectionStyle(theme, "brand")}>
      {hasIntro ? (
        <Reveal>
          <div className="mx-auto grid max-w-7xl items-center gap-10 border-y border-line px-6 py-16 md:grid-cols-[minmax(0,0.85fr)_1.15fr] md:gap-16 md:px-12 md:py-24 lg:px-16">
            {cube ? (
              <div className="flex aspect-square items-center justify-center bg-ivory px-8 py-10 md:aspect-auto md:min-h-[22rem] md:px-12 md:py-14">
                <Photo
                  src={cube}
                  alt={brand}
                  className="h-auto max-h-[70vw] w-auto max-w-[16rem] object-contain md:max-h-[22rem] md:max-w-[20rem]"
                />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
            <div>
              {brand ? <h2 className="display-sm">{brand}</h2> : null}
              <div className="rule mt-6 max-w-[4rem]" />
              {line ? (
                <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-bronze">{line}</p>
              ) : null}
            </div>
          </div>
        </Reveal>
      ) : null}
      {hasReel ? <FilmReel photos={media} alt={brand || labels.works} /> : null}
    </section>
  );
}
