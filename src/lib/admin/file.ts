const imageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const imageExt = new Set(["jpg", "jpeg", "png", "webp", "svg", "ico"]);
const videoExt = new Set(["mp4", "webm", "mov"]);

export function fileExtension(file: File) {
  const type = file.type.toLowerCase();
  if (type === "image/webp") return "webp";
  if (type === "image/png") return "png";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/x-icon" || type === "image/vnd.microsoft.icon") return "ico";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  if (type === "video/mp4") return "mp4";
  const fromName = file.name.split(".").pop()?.toLowerCase() || "";
  if (fromName === "jpeg") return "jpg";
  return fromName;
}

export function fileKind(file: File): "image" | "video" | null {
  const type = file.type.toLowerCase();
  const ext = fileExtension(file);
  if (imageTypes.has(type) || imageExt.has(ext)) return "image";
  if (videoTypes.has(type) || videoExt.has(ext)) return "video";
  return null;
}
