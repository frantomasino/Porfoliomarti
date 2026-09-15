import { isSupabaseConfigured } from "@/lib/config";
import { seedProjects, seedServices, seedSite, seedTimeline } from "@/lib/seed";
import { createClient } from "@/lib/supabase/server";
import { mediaKindFromUrl } from "@/lib/media";
import type { Project, ProjectImage, Service, SiteProfile, TimelineItem } from "@/lib/types";

function sortImages(images: ProjectImage[] | null | undefined) {
  return [...(images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      ...item,
      kind: item.kind || mediaKindFromUrl(item.url),
    }));
}

export async function getSiteProfile(): Promise<SiteProfile> {
  if (!isSupabaseConfigured()) return seedSite;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return seedSite;
    const row = data as SiteProfile;
    return {
      ...seedSite,
      ...row,
      studio_name: row.studio_name || seedSite.studio_name,
    };
  } catch {
    return seedSite;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return seedProjects
      .filter((project) => project.published)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((project) => ({
        ...project,
        images: sortImages(project.images),
      }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return (data as Project[]).map((project) => ({
      ...project,
      images: sortImages(project.images),
    }));
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getTimeline(): Promise<TimelineItem[]> {
  if (!isSupabaseConfigured()) {
    return [...seedTimeline].sort((a, b) => a.sort_order - b.sort_order);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("timeline_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as TimelineItem[];
  } catch {
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return [...seedServices].sort((a, b) => a.sort_order - b.sort_order);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as Service[];
  } catch {
    return [];
  }
}
