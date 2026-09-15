export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
export const BRAND_ACCEPT = `${IMAGE_ACCEPT},image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.svg,.ico`;
export const GALLERY_ACCEPT = `${IMAGE_ACCEPT},video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov`;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function isHeic(file: File) {
  return /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

function isSvg(file: File) {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

function isIco(file: File) {
  return (
    file.type === "image/x-icon" ||
    file.type === "image/vnd.microsoft.icon" ||
    /\.ico$/i.test(file.name)
  );
}

export function isAllowedImage(file: File) {
  if (isHeic(file)) return false;
  const type = file.type.toLowerCase();
  if (IMAGE_TYPES.has(type)) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

export function isAllowedBrand(file: File) {
  return isAllowedImage(file) || isSvg(file) || isIco(file);
}

export function isAllowedVideo(file: File) {
  return VIDEO_TYPES.has(file.type.toLowerCase()) || /\.(mp4|webm|mov)$/i.test(file.name);
}

function rename(name: string, ext: string) {
  return `${name.replace(/\.[^.]+$/, "") || "imagen"}.${ext}`;
}

export async function prepareImageForUpload(
  file: File,
  options: { maxEdge?: number; brand?: boolean } = {},
): Promise<File> {
  if (isHeic(file)) {
    throw new Error("El celular envió HEIC. Elegí JPG, PNG o WebP (en iPhone, compartir como JPG).");
  }
  if (options.brand ? !isAllowedBrand(file) : !isAllowedImage(file)) {
    throw new Error(options.brand ? "Usá JPG, PNG, WebP, SVG o ICO." : "Solo JPG, PNG o WebP.");
  }
  if (isSvg(file) || isIco(file)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = options.maxEdge ?? 1600;
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

    const keepAlpha = file.type === "image/png" || /\.png$/i.test(file.name) || Boolean(options.brand);
    const qualities = keepAlpha ? [0.82, 0.7] : [0.72, 0.6, 0.5];
    let last: File | null = null;
    for (const quality of qualities) {
      const webp = await blobFromCanvas(canvas, "image/webp", quality);
      if (webp && webp.size > 0) {
        last = new File([webp], rename(file.name, "webp"), { type: "image/webp" });
        if (webp.size <= 420_000) return last;
      }
    }
    if (last) return last;
    if (keepAlpha) {
      const png = await blobFromCanvas(canvas, "image/png", 1);
      if (png && png.size > 0) {
        return new File([png], rename(file.name, "png"), { type: "image/png" });
      }
    }
    const jpeg = await blobFromCanvas(canvas, "image/jpeg", 0.62);
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
