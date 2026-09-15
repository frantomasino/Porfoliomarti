import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { getSiteProfile } from "@/lib/content";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteProfile();

  return {
    title: {
      default: site.seo_title || `${site.studio_name || site.full_name} — ${site.profession}`,
      template: `%s — ${site.studio_name || site.full_name}`,
    },
    description: site.seo_description || site.tagline,
    openGraph: {
      title: site.seo_title || site.full_name,
      description: site.seo_description || site.tagline,
      images: site.hero_image_url ? [site.hero_image_url] : undefined,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
