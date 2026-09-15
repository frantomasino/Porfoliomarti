import type { MediaKind, Project } from "@/lib/types";

export function mediaKindFromFile(file: File): MediaKind {
  return file.type.startsWith("video/") ? "video" : "image";
}

export function mediaKindFromUrl(url: string): MediaKind {
  if (youtubeId(url) || vimeoId(url) || isFileVideo(url)) return "video";
  return "image";
}

export function isFileVideo(url: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

function youtubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

function vimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

export function videoEmbedUrl(url: string) {
  const youtube = youtubeId(url);
  if (youtube) return `https://www.youtube.com/embed/${youtube}`;
  const vimeo = vimeoId(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  return null;
}

export function projectPhotoUrls(project: Project) {
  const urls: string[] = [];
  const add = (url?: string) => {
    if (!url || mediaKindFromUrl(url) === "video") return;
    if (!urls.includes(url)) urls.push(url);
  };
  add(project.cover_url);
  for (const item of project.images ?? []) add(item.url);
  return urls;
}
