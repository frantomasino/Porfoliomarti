"use client";

import { useState } from "react";
import { fieldClass, ghostButtonClass, labelClass, OrderButtons, TrashButton } from "@/components/admin/ui";
import { adminUpload } from "@/lib/admin/db";
import { GALLERY_ACCEPT, isAllowedImage, isAllowedVideo, prepareImageForUpload } from "@/lib/admin/images";
import { mediaKindFromFile, mediaKindFromUrl, videoEmbedUrl } from "@/lib/media";
import type { MediaKind, ProjectImage } from "@/lib/types";

type MediaGalleryProps = {
  items: ProjectImage[];
  onAdd: (url: string, caption: string, kind: MediaKind) => Promise<void>;
  onChange: (item: ProjectImage) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onMove?: (index: number, direction: -1 | 1) => Promise<void>;
};

export function MediaGallery({ items, onAdd, onChange, onRemove, onMove }: MediaGalleryProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  async function uploadFiles(files: FileList | File[]) {
    setBusy(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const ready =
          isAllowedVideo(file)
            ? file
            : isAllowedImage(file)
              ? await prepareImageForUpload(file)
              : null;
        if (!ready) {
          throw new Error("Fotos: JPG, PNG o WebP. Videos: MP4, MOV o WebM.");
        }
        const url = await adminUpload(ready, "projects/gallery");
        await onAdd(url, "", mediaKindFromFile(file));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo a Supabase.");
    } finally {
      setBusy(false);
    }
  }

  async function addLink() {
    const url = link.trim();
    if (!url) return;
    setBusy(true);
    setError("");
    try {
      await onAdd(url, "", mediaKindFromUrl(url));
      setLink("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el enlace.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="font-serif text-3xl">Fotos y videos</h2>
      <p className="mt-2 max-w-2xl text-sm text-stone">
        Estas son las que el visitante pasa con las flechas, sin entrar a la obra. Subí JPG, PNG o WebP
        (varias a la vez). La preview muestra la foto entera, no recortada. Tachito para borrar, flechas
        para el orden.
      </p>

      <div className="mt-8 grid gap-5">
        {items.map((item, index) => (
          <article key={item.id} className="grid gap-4 border border-line p-4 md:grid-cols-[minmax(0,280px)_1fr]">
            <div className="relative bg-ivory">
              <MediaPreview item={item} />
              <TrashButton
                label="Eliminar"
                className="absolute right-2 top-2 z-10"
                onClick={() => void onRemove(item.id)}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-bronze">
                  {item.kind === "video" ? "Video" : "Foto"}
                </p>
                {onMove ? (
                  <OrderButtons
                    disableUp={index === 0}
                    disableDown={index === items.length - 1}
                    onUp={() => void onMove(index, -1)}
                    onDown={() => void onMove(index, 1)}
                  />
                ) : null}
              </div>
              <input
                className={fieldClass}
                value={item.caption}
                placeholder="Epígrafe"
                onChange={(e) => void onChange({ ...item, caption: e.target.value })}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-5 border border-dashed border-line p-5">
        <span className={labelClass}>Subir varios archivos</span>
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 bg-ivory px-6 py-10 text-center hover:bg-paper">
          <span className="text-sm">
            {busy ? "Subiendo a Supabase…" : "Elegir fotos o videos"}
          </span>
          <span className="text-xs text-stone">JPG, PNG, WebP · MP4, MOV, WebM · varias a la vez</span>
          <input
            type="file"
            accept={GALLERY_ACCEPT}
            multiple
            className="hidden"
            disabled={busy}
            onChange={(event) => {
              const files = event.target.files;
              if (files?.length) void uploadFiles(files);
              event.target.value = "";
            }}
          />
        </label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className={fieldClass}
            value={link}
            placeholder="O pegá URL de YouTube, Vimeo o un video"
            onChange={(event) => setLink(event.target.value)}
          />
          <button type="button" className={ghostButtonClass} disabled={busy} onClick={() => void addLink()}>
            Agregar link
          </button>
        </div>
        {error ? <p className="text-sm text-bronze">{error}</p> : null}
      </div>
    </section>
  );
}

function MediaPreview({ item }: { item: ProjectImage }) {
  const embed = videoEmbedUrl(item.url);
  const isVideo = item.kind === "video" || Boolean(embed);

  if (isVideo && embed) {
    return (
      <iframe
        src={embed}
        title={item.caption || "Video"}
        className="h-48 w-full bg-ink"
      />
    );
  }

  if (isVideo) {
    return <video src={item.url} className="h-48 w-full object-contain bg-ink" muted />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.url} alt="" className="mx-auto max-h-56 w-full object-contain" />
  );
}
