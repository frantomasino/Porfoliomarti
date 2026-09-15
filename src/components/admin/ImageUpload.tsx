"use client";

import { useState } from "react";
import { adminUpload } from "@/lib/admin/db";
import { IMAGE_ACCEPT, prepareImageForUpload } from "@/lib/admin/images";
import { labelClass, TrashButton } from "@/components/admin/ui";
import { cx } from "@/lib/utils";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
  emptyLabel?: string;
  preview?: "cover" | "contain";
  accept?: string;
  maxEdge?: number;
  brand?: boolean;
};

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Imagen",
  hint = "JPG, PNG o WebP, desde el celular o la computadora. Se achica sola al subir.",
  emptyLabel = "Todavía no hay foto",
  preview = "cover",
  accept = IMAGE_ACCEPT,
  maxEdge,
  brand = false,
}: ImageUploadProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const prepared = await prepareImageForUpload(file, { maxEdge, brand });
      const url = await adminUpload(prepared, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <span className={labelClass}>{label}</span>
      {value ? (
        <div
          className={cx(
            "relative overflow-hidden border border-line bg-ivory",
            preview === "contain" ? "flex min-h-48 items-center justify-center bg-ivory p-3 md:min-h-56" : "h-48 bg-line",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className={preview === "contain" ? "max-h-full max-w-full object-contain" : "h-full w-full object-cover"}
          />
          <TrashButton
            label="Eliminar foto"
            className="absolute right-2 top-2 z-10"
            onClick={() => onChange("")}
          />
        </div>
      ) : (
        <div
          className={cx(
            "flex items-center justify-center border border-dashed border-line text-sm text-stone",
            preview === "contain" ? "h-48 md:h-56" : "h-48",
          )}
        >
          {emptyLabel}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-h-12 w-full cursor-pointer items-center justify-center border border-ink bg-ink px-4 text-sm text-ivory md:w-fit">
          {busy ? "Subiendo…" : value ? "Cambiar foto" : "Elegir foto"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onFile(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="text-xs leading-relaxed text-stone">{hint}</p>
      {error ? <p className="text-sm text-bronze">{error}</p> : null}
    </div>
  );
}
