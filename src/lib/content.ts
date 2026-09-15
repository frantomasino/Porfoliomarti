import { unstable_cache } from "next/cache";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/config";
import { seedProjects, seedServices, seedSite, seedTimeline } from "@/lib/seed";
import { createPublicClient } from "@/lib/supabase/public";
import { mediaKindFromUrl } from "@/lib/media";
import { mergeLabels, mergeTheme } from "@/lib/appearance";
import { slugify } from "@/lib/utils";
import type {
  PageSection,
  Project,
  ProjectImage,
  Service,
  SiteProfile,
  TimelineItem,
} from "@/lib/types";

const cacheOptions: { tags: string[]; revalidate: number } = {
  tags: ["site"],
  revalidate: 120,
};

function withPublicSlug(project: Project): Project {
  return {
    ...project,
    slug: project.slug || slugify(project.title) || project.id,
  };
}

function sortImages(images: ProjectImage[] | null | undefined) {
  return [...(images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      ...item,
      kind: item.kind || mediaKindFromUrl(item.url),
    }));
}

const loadSiteProfile = unstable_cache(
  async (): Promise<SiteProfile> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_profile").select("*").limit(1).maybeSingle();

    if (error || !data) return seedSite;
    const row = data as SiteProfile;
    return {
      ...seedSite,
      ...row,
      studio_name: row.studio_name || seedSite.studio_name,
      logo_url: row.logo_url || "",
      favicon_url: row.favicon_url || "",
      theme: mergeTheme(row.theme),
      labels: mergeLabels(row.labels),
    };
  },
  ["site-profile"],
  cacheOptions,
);

const loadPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, title, slug, category, year, location, client, area, status, excerpt, cover_url, featured, published, sort_order, images:project_images(id, url, caption, sort_order, kind)",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (!error && data) {
      return (data as Project[]).map((project) =>
        withPublicSlug({
          ...project,
          images: sortImages(project.images),
        }),
      );
    }

    const fallback = await supabase
      .from("projects")
      .select(
        "id, title, slug, category, year, location, client, area, status, excerpt, cover_url, featured, published, sort_order",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (fallback.error || !fallback.data) return [];
    return (fallback.data as Project[]).map(withPublicSlug);
  },
  ["published-projects"],
  cacheOptions,
);

const loadProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    const supabase = createPublicClient();
    const bySlug = await supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    const row = bySlug.data
      ? bySlug.data
      : (
          await supabase
            .from("projects")
            .select("*, images:project_images(*)")
            .eq("id", slug)
            .eq("published", true)
            .maybeSingle()
        ).data;

    if (!row) return null;
    const project = row as Project;
    return withPublicSlug({ ...project, images: sortImages(project.images) });
  },
  ["project-by-slug"],
  cacheOptions,
);

const loadTimeline = unstable_cache(
  async (): Promise<TimelineItem[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("timeline_items")
      .select("id, kind, title, subtitle, period, description, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as TimelineItem[];
  },
  ["timeline"],
  cacheOptions,
);

const loadServices = unstable_cache(
  async (): Promise<Service[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, title, description, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as Service[];
  },
  ["services"],
  cacheOptions,
);

type SectionPage = "home" | "estudio" | "contacto" | "proyectos";

function sectionPlacementFilter(placement: SectionPage) {
  const both =
    placement === "home" || placement === "estudio" ? ",placement.eq.both" : "";
  return `placement.eq.${placement},placement.eq.all${both}`;
}

const loadPageSections = unstable_cache(
  async (placement: SectionPage): Promise<PageSection[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("id, title, body, image_url, placement, published, sort_order")
      .eq("published", true)
      .or(sectionPlacementFilter(placement))
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as PageSection[];
  },
  ["page-sections"],
  cacheOptions,
);

export const getSiteProfile = cache(async function getSiteProfile(): Promise<SiteProfile> {
  if (!isSupabaseConfigured()) return seedSite;
  try {
    return await loadSiteProfile();
  } catch {
    return seedSite;
  }
});

export const getPublishedProjects = cache(async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return seedProjects.filter((project) => project.published);
  try {
    return await loadPublishedProjects();
  } catch {
    return [];
  }
});

export const getProjectBySlug = cache(async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    const project = seedProjects.find((item) => item.slug === slug && item.published) ?? null;
    return project ? { ...project, images: sortImages(project.images) } : null;
  }

  try {
    return await loadProjectBySlug(slug);
  } catch {
    return null;
  }
});

export const getTimeline = cache(async function getTimeline(): Promise<TimelineItem[]> {
  if (!isSupabaseConfigured()) {
    return [...seedTimeline].sort((a, b) => a.sort_order - b.sort_order);
  }

  try {
    return await loadTimeline();
  } catch {
    return [];
  }
});

export const getServices = cache(async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return [...seedServices].sort((a, b) => a.sort_order - b.sort_order);
  }

  try {
    return await loadServices();
  } catch {
    return [];
  }
});

export const getPageSections = cache(async function getPageSections(
  placement: SectionPage,
): Promise<PageSection[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    return await loadPageSections(placement);
  } catch {
    return [];
  }
});
