import type { CSSProperties } from "react";
import type { SiteLabels, SiteProfile, SiteTheme } from "@/lib/types";

export const defaultTheme: SiteTheme = {
  paper: "#f3eee6",
  ivory: "#faf8f3",
  ink: "#1b1814",
  stone: "#746c62",
  bronze: "#9a7b52",
  line: "#ddd4c6",
};

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
  contact_intro: "",
};

export function mergeTheme(input?: Partial<SiteTheme> | null): SiteTheme {
  return { ...defaultTheme, ...(input ?? {}) };
}

export function mergeLabels(input?: Partial<SiteLabels> | null): SiteLabels {
  return { ...defaultLabels, ...(input ?? {}) };
}

export function siteLabels(site: SiteProfile): SiteLabels {
  return mergeLabels(site.labels);
}

export function themeStyle(theme: SiteTheme): CSSProperties {
  return {
    "--color-paper": theme.paper,
    "--color-ivory": theme.ivory,
    "--color-ink": theme.ink,
    "--color-stone": theme.stone,
    "--color-bronze": theme.bronze,
    "--color-line": theme.line,
  } as CSSProperties;
}
