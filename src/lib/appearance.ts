import type { CSSProperties } from "react";
import type {
  HeadingFont,
  ReelPlacement,
  SectionPalette,
  SiteLabels,
  SiteProfile,
  SiteTheme,
  ThemeSectionId,
} from "@/lib/types";

export const emptySection: SectionPalette = {
  bg: "",
  text: "",
  muted: "",
  accent: "",
  line: "",
};

export const themeSections: { id: ThemeSectionId; name: string; hint: string }[] = [
  { id: "header", name: "Menú", hint: "Barra de navegación" },
  { id: "hero", name: "Banner de inicio", hint: "Foto grande y el lema" },
  { id: "works", name: "Obras", hint: "Listado de proyectos" },
  { id: "brand", name: "Franja del estudio", hint: "Cubo, texto y cinta que pasa" },
  { id: "about", name: "Nosotros", hint: "Bio y retrato" },
  { id: "contact", name: "Contacto", hint: "Formulario y datos" },
  { id: "footer", name: "Pie", hint: "Cierre de todas las páginas" },
];

export const sectionColorFields: { key: keyof SectionPalette; label: string }[] = [
  { key: "bg", label: "Fondo" },
  { key: "text", label: "Texto" },
  { key: "muted", label: "Secundario" },
  { key: "accent", label: "Acento" },
  { key: "line", label: "Líneas" },
];

function emptySections(): Record<ThemeSectionId, SectionPalette> {
  return {
    header: { ...emptySection },
    hero: { ...emptySection },
    works: { ...emptySection },
    brand: { ...emptySection },
    about: { ...emptySection },
    contact: { ...emptySection },
    footer: { ...emptySection },
  };
}

export const defaultTheme: SiteTheme = {
  paper: "#f3eee6",
  ivory: "#faf8f3",
  ink: "#1b1814",
  stone: "#746c62",
  bronze: "#9a7b52",
  line: "#ddd4c6",
  heading: "cormorant",
  reel: "off",
  hero_slides: [],
  reel_media: [],
  sections: emptySections(),
};

export const headingFonts: { id: HeadingFont; name: string; hint: string; family: string }[] = [
  { id: "cormorant", name: "Cormorant", hint: "Fina, editorial", family: "var(--font-cormorant)" },
  { id: "bodoni", name: "Bodoni", hint: "Contraste alto", family: "var(--font-bodoni)" },
  { id: "garamond", name: "Garamond", hint: "Clásica", family: "var(--font-eb-garamond)" },
  { id: "playfair", name: "Playfair", hint: "Revista", family: "var(--font-playfair)" },
];

export const reelPlacements: { id: ReelPlacement; label: string }[] = [
  { id: "off", label: "No mostrar" },
  { id: "home", label: "Solo en el inicio" },
  { id: "proyectos", label: "Solo en Proyectos" },
  { id: "both", label: "Inicio y Proyectos" },
];

export const defaultLabels: SiteLabels = {
  nav_projects: "Proyectos",
  nav_about: "Nosotros",
  nav_contact: "Contacto",
  who: "Nosotros",
  works: "Obras",
  selection: "Selección",
  archive: "Archivo",
  contact: "Contacto",
  conversemos: "Conversemos",
  see_works: "Ver obras",
  know_more: "Conocer más",
  services: "Servicios",
  how_works: "Cómo trabaja",
  practice: "Práctica",
  education: "Formación",
  notes: "Notas",
  contact_intro: "Contame el espacio y lo que necesitás. Te respondo a la brevedad por WhatsApp o mail.",
  how_1_title: "Conversación",
  how_1_body: "Contame el espacio, cómo lo usás y qué te gustaría cambiar. Definimos alcance y los siguientes pasos.",
  how_2_title: "Proyecto",
  how_2_body: "Anteproyecto e interiorismo: distribución, materialidad, iluminación y detalle, hasta cerrar el espacio.",
  how_3_title: "Obra",
  how_3_body: "Acompañamiento en compras, gremios y seguimiento, para que lo proyectado se construya como se pensó.",
};

export function mergeTheme(input?: Partial<SiteTheme> | null): SiteTheme {
  const merged = { ...defaultTheme, ...(input ?? {}) };
  const sections = emptySections();
  for (const item of themeSections) {
    sections[item.id] = { ...emptySection, ...(input?.sections?.[item.id] ?? {}) };
  }
  return {
    ...merged,
    heading: headingFonts.find((item) => item.id === merged.heading)?.id ?? defaultTheme.heading,
    reel: reelPlacements.find((item) => item.id === merged.reel)?.id ?? defaultTheme.reel,
    hero_slides: cleanUrls(merged.hero_slides),
    reel_media: cleanUrls(merged.reel_media),
    sections,
  };
}

function cleanUrls(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((url): url is string => typeof url === "string" && Boolean(url.trim()));
}

export function mergeLabels(input?: Partial<SiteLabels> | null): SiteLabels {
  return { ...defaultLabels, ...(input ?? {}) };
}

export function siteLabels(site: SiteProfile): SiteLabels {
  return mergeLabels(site.labels);
}

export function contactIntro(labels: SiteLabels) {
  const text = labels.contact_intro.trim();
  if (!text || /^escribime para mas info!?$/i.test(text)) {
    return defaultLabels.contact_intro;
  }
  return text;
}

export function processSteps(labels: SiteLabels) {
  return [
    { title: labels.how_1_title, body: labels.how_1_body },
    { title: labels.how_2_title, body: labels.how_2_body },
    { title: labels.how_3_title, body: labels.how_3_body },
  ].filter((step) => step.title.trim() && step.body.trim());
}

export function showReel(theme: SiteTheme, place: "home" | "proyectos") {
  return theme.reel === "both" || theme.reel === place;
}

export function headingFamily(theme: SiteTheme) {
  return headingFonts.find((item) => item.id === theme.heading)?.family ?? "var(--font-cormorant)";
}

export function homeHeroPhotos(site: SiteProfile, extras: string[] = []) {
  const slides = mergeTheme(site.theme).hero_slides;
  const urls = slides.length ? slides : [site.hero_image_url, ...extras];
  return urls.filter((url, index, all): url is string => Boolean(url) && all.indexOf(url) === index);
}

export function reelMedia(site: SiteProfile, extras: string[] = []) {
  const custom = mergeTheme(site.theme).reel_media;
  const urls = custom.length ? custom : extras;
  return urls.filter((url, index, all): url is string => Boolean(url) && all.indexOf(url) === index);
}

export function themeStyle(theme: SiteTheme): CSSProperties {
  return {
    "--color-paper": theme.paper,
    "--color-ivory": theme.ivory,
    "--color-ink": theme.ink,
    "--color-stone": theme.stone,
    "--color-bronze": theme.bronze,
    "--color-line": theme.line,
    "--font-serif": headingFamily(theme),
  } as CSSProperties;
}

export function sectionStyle(theme: SiteTheme, id: ThemeSectionId): CSSProperties {
  const palette = theme.sections[id];
  const style: Record<string, string> = {};
  if (id === "hero") {
    if (palette.bg) {
      style["--color-ink"] = palette.bg;
      style.backgroundColor = palette.bg;
    }
    if (palette.text) style["--color-ivory"] = palette.text;
    if (palette.accent) style["--color-bronze"] = palette.accent;
    if (palette.muted) style["--color-stone"] = palette.muted;
    if (palette.line) style["--color-line"] = palette.line;
    return style as CSSProperties;
  }
  if (palette.bg) {
    style["--color-paper"] = palette.bg;
    style.backgroundColor = palette.bg;
  }
  if (palette.text) {
    style["--color-ink"] = palette.text;
    style.color = palette.text;
  }
  if (palette.muted) style["--color-stone"] = palette.muted;
  if (palette.accent) style["--color-bronze"] = palette.accent;
  if (palette.line) style["--color-line"] = palette.line;
  return style as CSSProperties;
}
