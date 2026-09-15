import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { getSiteProfile } from "@/lib/content";
import { mergeTheme, themeStyle } from "@/lib/appearance";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const revalidate = 120;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteProfile();
  const brandIcon = site.favicon_url || site.logo_url;

  return {
    title: {
      default: site.seo_title || `${site.studio_name || site.full_name} — ${site.profession}`,
      template: `%s — ${site.studio_name || site.full_name}`,
    },
    description: site.seo_description || site.tagline,
    icons: brandIcon
      ? {
          icon: [{ url: brandIcon }],
          shortcut: brandIcon,
          apple: [{ url: brandIcon }],
        }
      : undefined,
    openGraph: {
      title: site.seo_title || site.full_name,
      description: site.seo_description || site.tagline,
      images: site.hero_image_url ? [site.hero_image_url] : site.logo_url ? [site.logo_url] : undefined,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteProfile();

  return (
    <html
      lang="es"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
      style={themeStyle(mergeTheme(site.theme))}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
