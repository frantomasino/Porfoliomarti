"use client";

import { useState } from "react";
import { adminUpload } from "@/lib/admin/db";
import { IMAGE_ACCEPT, prepareImageForUpload } from "@/lib/admin/images";
import { fieldClass, labelClass } from "@/components/admin/ui";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
};

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Imagen",
}: ImageUploadProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const prepared = await prepareImageForUpload(file);
      const url = await adminUpload(prepared, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen a Supabase.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <span className={labelClass}>{label}</span>
      {value ? (
        <div className="relative h-48 overflow-hidden border border-line bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center border border-dashed border-line text-sm text-stone">
          JPG, PNG o WebP
        </div>
      )}
      <label className="flex min-h-14 w-full cursor-pointer items-center justify-center border border-ink bg-ink px-4 text-[11px] uppercase tracking-[0.18em] text-ivory md:w-fit">
        {busy ? "Subiendo…" : "Elegir foto"}
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onFile(file);
            event.target.value = "";
          }}
        />
      </label>
      <p className="text-xs leading-relaxed text-stone">
        JPG, PNG o WebP. Desde la computadora o el celular, siempre acá en el admin. La imagen se
        optimiza sola al subir.
      </p>
      {error ? <p className="text-sm text-bronze">{error}</p> : null}
    </div>
  );
}
