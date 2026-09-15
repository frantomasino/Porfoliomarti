import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin/session";
import { errorMessage } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const maxDuration = 120;

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const imageExt = new Set(["jpg", "jpeg", "png", "webp"]);
const videoExt = new Set(["mp4", "webm", "mov"]);

function extensionOf(file: File) {
  const type = file.type.toLowerCase();
  if (type === "image/webp") return "webp";
  if (type === "image/png") return "png";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  if (type === "video/mp4") return "mp4";
  const fromName = file.name.split(".").pop()?.toLowerCase() || "";
  if (fromName === "jpeg") return "jpg";
  return fromName;
}

function isAllowed(file: File) {
  const type = file.type.toLowerCase();
  const ext = extensionOf(file);
  if (imageTypes.has(type) || imageExt.has(ext)) return "image";
  if (videoTypes.has(type) || videoExt.has(ext)) return "video";
  return null;
}

export async function POST(request: NextRequest) {
  if (!isValidAdminToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "general").replace(/[^a-z0-9/_-]/gi, "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
    }

    const kind = isAllowed(file);
    if (!kind) {
      return NextResponse.json(
        { error: "Solo JPG, PNG o WebP. Videos: MP4, MOV o WebM." },
        { status: 400 },
      );
    }

    const maxBytes = kind === "video" ? 80 * 1024 * 1024 : 12 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: kind === "video" ? "El video supera 80 MB." : "La foto es demasiado pesada." },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const ext = extensionOf(file) || (kind === "video" ? "mp4" : "jpg");
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file, {
      upsert: false,
      contentType: file.type || (kind === "video" ? "video/mp4" : `image/${ext === "jpg" ? "jpeg" : ext}`),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
