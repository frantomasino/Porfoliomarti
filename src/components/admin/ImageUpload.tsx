"use client";

import { useState } from "react";
import { adminUpload } from "@/lib/admin/db";
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
      const url = await adminUpload(file, folder);
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
          Sin imagen
        </div>
      )}
      <input
        className={fieldClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="URL de la imagen"
      />
      <label className="w-fit cursor-pointer border border-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] hover:border-ink">
        {busy ? "Subiendo a Supabase…" : "Subir archivo"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onFile(file);
            event.target.value = "";
          }}
        />
      </label>
      {error ? <p className="text-sm text-bronze">{error}</p> : null}
    </div>
  );
}
