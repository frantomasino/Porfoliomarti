import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSite() {
  revalidateTag("site", { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/proyectos");
  revalidatePath("/estudio");
  revalidatePath("/contacto");
  revalidatePath("/sitemap.xml");
}
