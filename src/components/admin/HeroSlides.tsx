"use client";

import { useState } from "react";
import { labelClass, OrderButtons, TrashButton } from "@/components/admin/ui";
import { adminUpload } from "@/lib/admin/db";
import { IMAGE_ACCEPT, isAllowedImage, prepareImageForUpload } from "@/lib/admin/images";

export function HeroSlides({
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
        if (!isAllowedImage(file)) {
          throw new Error("Solo JPG, PNG o WebP.");
        }
        next.push(await adminUpload(await prepareImageForUpload(file), "hero"));
      }
      onChange(next.filter((url, index, all) => url && all.indexOf(url) === index));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
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
    <div className="grid gap-3 md:col-span-2">
      <span className={labelClass}>Fotos del banner de inicio</span>
      <p className="text-xs leading-relaxed text-stone">
        La 1 es la que se ve al entrar. Con las flechas elegís el orden. Podés subir varias.
      </p>
      {slides.length ? (
        <div className="grid gap-3">
          {slides.map((src, index) => (
            <article key={`${src}-${index}`} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 border border-line bg-paper p-2">
              <div className="relative h-20 overflow-hidden bg-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-1.5 top-1.5 bg-ink/70 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ivory">
                  {index + 1}
                </span>
              </div>
              <p className="min-w-0 text-sm text-stone">
                {index === 0 ? "Primera — se ve al entrar" : `Foto ${index + 1}`}
              </p>
              <div className="flex items-center gap-2">
                <OrderButtons
                  disableUp={index === 0}
                  disableDown={index === slides.length - 1}
                  onUp={() => move(index, -1)}
                  onDown={() => move(index, 1)}
                />
                <TrashButton
                  label="Quitar foto"
                  onClick={() => onChange(slides.filter((_, item) => item !== index))}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex h-28 items-center justify-center border border-dashed border-line text-sm text-stone">
          Todavía no hay fotos de banner
        </div>
      )}
      <label className="flex min-h-12 cursor-pointer items-center justify-center border border-line bg-ivory px-4 text-sm hover:border-ink">
        {busy ? "Subiendo…" : "Agregar fotos"}
        <input
          type="file"
          accept={IMAGE_ACCEPT}
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
