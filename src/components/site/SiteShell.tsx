import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { mergeTheme, sectionStyle, siteLabels } from "@/lib/appearance";
import type { SiteProfile } from "@/lib/types";
import { ViewTransition } from "react";

export function SiteShell({
  site,
  home = false,
  children,
}: {
  site: SiteProfile;
  home?: boolean;
  children: React.ReactNode;
}) {
  const theme = mergeTheme(site.theme);
  return (
    <div className="relative flex min-h-svh flex-col">
      <Header
        name={site.studio_name || site.full_name}
        profession={site.profession}
        instagram={site.instagram}
        logoUrl={site.logo_url}
        phone={site.phone}
        email={site.email}
        home={home}
        labels={siteLabels(site)}
        palette={sectionStyle(theme, "header")}
      />
      <ViewTransition>
        <main className="flex-1">{children}</main>
      </ViewTransition>
      <Footer site={site} palette={sectionStyle(theme, "footer")} />
      <WhatsAppFab phone={site.phone} />
    </div>
  );
}
