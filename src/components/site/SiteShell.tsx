import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import type { SiteProfile } from "@/lib/types";

export function SiteShell({
  site,
  children,
}: {
  site: SiteProfile;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header name={site.studio_name || site.full_name} profession={site.profession} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
