export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
export const GALLERY_ACCEPT = `${IMAGE_ACCEPT},video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov`;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export function isHeic(file: File) {
  return /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

export function isAllowedImage(file: File) {
  if (isHeic(file)) return false;
  const type = file.type.toLowerCase();
  if (IMAGE_TYPES.has(type)) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

export function isAllowedVideo(file: File) {
  return VIDEO_TYPES.has(file.type.toLowerCase()) || /\.(mp4|webm|mov)$/i.test(file.name);
}

export function extensionForUpload(file: File) {
  const type = file.type.toLowerCase();
  if (type === "image/webp") return "webp";
  if (type === "image/png") return "png";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  if (type === "video/mp4") return "mp4";
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName === "jpeg") return "jpg";
  return fromName || "jpg";
}

function rename(name: string, ext: string) {
  return `${name.replace(/\.[^.]+$/, "") || "imagen"}.${ext}`;
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (isHeic(file)) {
    throw new Error("El celular envió HEIC. Elegí JPG, PNG o WebP (en iPhone, compartir como JPG).");
  }
  if (!isAllowedImage(file)) {
    throw new Error("Solo JPG, PNG o WebP.");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 2400;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const webp = await blobFromCanvas(canvas, "image/webp", 0.84);
    if (webp && webp.size > 0) {
      return new File([webp], rename(file.name, "webp"), { type: "image/webp" });
    }
    const jpeg = await blobFromCanvas(canvas, "image/jpeg", 0.84);
    if (jpeg && jpeg.size > 0) {
      return new File([jpeg], rename(file.name, "jpg"), { type: "image/jpeg" });
    }
  } catch {
    return file;
  }

  return file;
}

function blobFromCanvas(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
