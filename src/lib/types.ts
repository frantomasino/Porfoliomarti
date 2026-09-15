export type SiteProfile = {
  id: string;
  full_name: string;
  studio_name: string;
  profession: string;
  tagline: string;
  bio: string;
  philosophy: string;
  location: string;
  email: string;
  phone: string;
  instagram: string;
  linkedin: string;
  hero_image_url: string;
  portrait_url: string;
  seo_title: string;
  seo_description: string;
  founded_year: number;
};

export type MediaKind = "image" | "video";

export type ProjectImage = {
  id: string;
  project_id: string;
  url: string;
  caption: string;
  sort_order: number;
  kind?: MediaKind;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  location: string;
  client: string;
  area: string;
  status: string;
  excerpt: string;
  description: string;
  cover_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  images?: ProjectImage[];
};

export type TimelineKind = "education" | "experience" | "award";

export type TimelineItem = {
  id: string;
  kind: TimelineKind;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  sort_order: number;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
};
