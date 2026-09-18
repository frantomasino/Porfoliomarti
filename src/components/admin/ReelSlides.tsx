"use client";

import { useState } from "react";
import { labelClass, OrderButtons, TrashButton } from "@/components/admin/ui";
import { adminUpload } from "@/lib/admin/db";
import { GALLERY_ACCEPT, isAllowedImage, isAllowedVideo, prepareImageForUpload } from "@/lib/admin/images";
import { isFileVideo } from "@/lib/media";

export function ReelSlides({
  slides,
  onChange,
}: {
  slides: string[];
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | File[]) {
    setBusy(true);
    setError("");
    try {
      const next = [...slides];
      for (const file of Array.from(files)) {
        const ready = isAllowedVideo(file)
          ? file
          : isAllowedImage(file)
            ? await prepareImageForUpload(file)
            : null;
        if (!ready) {
          throw new Error("Fotos: JPG, PNG o WebP. Videos: MP4, MOV o WebM.");
        }
        next.push(await adminUpload(ready, "reel"));
      }
      onChange(next.filter((url, index, all) => url && all.indexOf(url) === index));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      <span className={labelClass}>Cinta que pasa (fotos o videos)</span>
      <p className="text-xs leading-relaxed text-stone">
        Van debajo del cubo, en movimiento. Si no subís nada, se usan fotos de las obras.
      </p>
      {slides.length ? (
        <div className="grid gap-3">
          {slides.map((src, index) => (
            <article
              key={`${src}-${index}`}
              className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 border border-line bg-paper p-2"
            >
              <div className="relative h-20 overflow-hidden bg-line">
                {isFileVideo(src) ? (
                  <video src={src} muted playsInline className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-cover" />
                )}
                <span className="absolute left-1.5 top-1.5 bg-ink/70 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ivory">
                  {isFileVideo(src) ? "Video" : index + 1}
                </span>
              </div>
              <p className="min-w-0 text-sm text-stone">{isFileVideo(src) ? "Video" : `Foto ${index + 1}`}</p>
              <div className="flex items-center gap-2">
                <OrderButtons
                  disableUp={index === 0}
                  disableDown={index === slides.length - 1}
                  onUp={() => move(index, -1)}
                  onDown={() => move(index, 1)}
                />
                <TrashButton
                  label="Quitar"
                  onClick={() => onChange(slides.filter((_, item) => item !== index))}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center border border-dashed border-line text-sm text-stone">
          Todavía no hay cinta propia
        </div>
      )}
      <label className="flex min-h-12 cursor-pointer items-center justify-center border border-line bg-ivory px-4 text-sm hover:border-ink">
        {busy ? "Subiendo…" : "Agregar fotos o videos"}
        <input
          type="file"
          accept={GALLERY_ACCEPT}
          multiple
          className="hidden"
          disabled={busy}
          onChange={(event) => {
            const files = event.target.files;
            if (files?.length) void upload(files);
            event.target.value = "";
          }}
        />
      </label>
      {error ? <p className="text-sm text-bronze">{error}</p> : null}
    </div>
  );
}
