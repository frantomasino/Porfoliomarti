import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/proyectos"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/estudio"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contacto"), changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...projects.map((project) => ({
      url: absoluteUrl(`/proyectos/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
