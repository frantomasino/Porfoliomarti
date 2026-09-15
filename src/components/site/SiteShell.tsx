import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";

export function SiteShell({
  site,
  home = false,
  children,
}: {
  site: SiteProfile;
  home?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header
        name={site.studio_name || site.full_name}
        profession={site.profession}
        instagram={site.instagram}
        home={home}
        labels={siteLabels(site)}
      />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
