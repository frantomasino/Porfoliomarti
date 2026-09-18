import type { Metadata } from "next";
import type { Project, SiteProfile } from "@/lib/types";

function trimSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function siteOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (explicit) return trimSlash(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${trimSlash(vercel.replace(/^https?:\/\//, ""))}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  const origin = siteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clipMeta(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function firstText(...values: Array<string | undefined | null>) {
  return values.map((value) => (value || "").replace(/\s+/g, " ").trim()).find(Boolean) || "";
}

export function siteDescription(site: SiteProfile) {
  return clipMeta(firstText(site.seo_description, site.tagline, site.bio, site.profession));
}

export function projectDescription(project: Project, site: SiteProfile) {
  return clipMeta(
    firstText(
      project.excerpt,
      project.description,
      [project.title, project.location, site.studio_name || site.full_name].filter(Boolean).join(" · "),
    ),
  );
}

export function publicPageMetadata({
  site,
  title,
  description,
  path,
  image,
  type = "website",
}: {
  site: SiteProfile;
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const desc = clipMeta(description || siteDescription(site));
  const ogImage = image || site.hero_image_url || site.logo_url || site.portrait_url;
  const brand = site.studio_name || site.full_name;

  return {
    title,
    description: desc || undefined,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "es_AR",
      url,
      siteName: brand,
      title,
      description: desc || undefined,
      images: ogImage ? [{ url: ogImage, alt: title }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description: desc || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function studioJsonLd(site: SiteProfile) {
  const url = siteOrigin();
  const name = site.studio_name || site.full_name;
  const image = site.logo_url || site.hero_image_url || site.portrait_url;
  const sameAs = [site.instagram, site.linkedin].filter(Boolean);

  const studio: Record<string, unknown> = {
    "@type": "ProfessionalService",
    "@id": `${url}#studio`,
    name,
    url,
    inLanguage: "es-AR",
    description: siteDescription(site) || undefined,
    image: image || undefined,
    email: site.email || undefined,
    telephone: site.phone || undefined,
    foundingDate: site.founded_year ? String(site.founded_year) : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    founder: site.full_name
      ? {
          "@type": "Person",
          name: site.full_name,
          jobTitle: site.profession || undefined,
        }
      : undefined,
    address: site.location
      ? {
          "@type": "PostalAddress",
          addressLocality: site.location,
          addressCountry: "AR",
        }
      : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name,
        description: siteDescription(site) || undefined,
        inLanguage: "es-AR",
        publisher: { "@id": `${url}#studio` },
      },
      studio,
    ],
  };
}

export function projectJsonLd(project: Project, site: SiteProfile) {
  const url = absoluteUrl(`/proyectos/${project.slug}`);
  const image = project.cover_url || project.images?.[0]?.url;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url,
    description: projectDescription(project, site) || undefined,
    image: image || undefined,
    dateCreated: project.year ? String(project.year) : undefined,
    contentLocation: project.location || undefined,
    creator: {
      "@type": "ProfessionalService",
      name: site.studio_name || site.full_name,
      url: siteOrigin(),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
