import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, EB_Garamond, Outfit, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/site/JsonLd";
import { getSiteProfile } from "@/lib/content";
import { mergeTheme, themeStyle } from "@/lib/appearance";
import { siteDescription, siteOrigin, studioJsonLd } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
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
  const brand = site.studio_name || site.full_name;
  const brandIcon = site.favicon_url || site.logo_url;
  const description = siteDescription(site);
  const ogImage = site.hero_image_url || site.logo_url || site.portrait_url;

  return {
    metadataBase: new URL(siteOrigin()),
    applicationName: brand,
    title: {
      default: site.seo_title || `${brand}${site.profession ? ` — ${site.profession}` : ""}`,
      template: `%s — ${brand}`,
    },
    description: description || undefined,
    icons: brandIcon
      ? {
          icon: [{ url: brandIcon }],
          shortcut: brandIcon,
          apple: [{ url: brandIcon }],
        }
      : undefined,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: brand,
      title: site.seo_title || brand,
      description: description || undefined,
      images: ogImage ? [{ url: ogImage, alt: brand }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: site.seo_title || brand,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteProfile();

  return (
    <html
      lang="es"
      className={`${outfit.variable} ${cormorant.variable} ${bodoni.variable} ${garamond.variable} ${playfair.variable} h-full antialiased`}
      style={themeStyle(mergeTheme(site.theme))}
    >
      <body className="min-h-full bg-paper text-ink">
        <JsonLd data={studioJsonLd(site)} />
        {children}
      </body>
    </html>
  );
}
