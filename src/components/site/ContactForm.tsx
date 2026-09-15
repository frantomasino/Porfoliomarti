"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setError("El formulario se activa cuando el sitio está conectado a Supabase.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("contact_messages").insert({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        message: String(data.get("message") || ""),
      });

      if (insertError) throw insertError;
      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudo enviar el mensaje.");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line bg-ivory px-8 py-12">
        <p className="font-serif text-3xl">Gracias.</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
          Recibimos tu mensaje y te responderemos a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Nombre
        <input
          required
          name="name"
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Email
        <input
          required
          type="email"
          name="email"
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Teléfono
        <input
          name="phone"
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Mensaje
        <textarea
          required
          name="message"
          rows={5}
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none"
        />
      </label>
      {error ? <p className="text-sm text-bronze">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-fit border border-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory disabled:opacity-50"
      >
        {status === "sending" ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
