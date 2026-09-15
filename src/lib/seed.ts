import { defaultLabels, defaultTheme } from "@/lib/appearance";
import type {
  Project,
  Service,
  SiteProfile,
  TimelineItem,
} from "@/lib/types";

export const SITE_ID = "11111111-1111-4111-8111-111111111111";

export const seedSite: SiteProfile = {
  id: SITE_ID,
  full_name: "Martina",
  studio_name: "Estudio ARQ.MR",
  profession: "Arquitecta e interiorista",
  tagline: "",
  bio: "",
  philosophy: "",
  location: "",
  email: "",
  phone: "",
  instagram: "https://www.instagram.com/estudioarq.mr/",
  linkedin: "",
  hero_image_url: "",
  portrait_url: "",
  seo_title: "Estudio ARQ.MR",
  seo_description: "",
  founded_year: 2020,
  theme: defaultTheme,
  labels: defaultLabels,
};

export const seedProjects: Project[] = [];
export const seedTimeline: TimelineItem[] = [];
export const seedServices: Service[] = [];
