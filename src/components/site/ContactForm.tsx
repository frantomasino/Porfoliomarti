"use client";

import { useState } from "react";
import { contactWhatsAppText, whatsappUrl } from "@/lib/utils";

export function ContactForm({ studioPhone }: { studioPhone: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    const url = whatsappUrl(studioPhone, contactWhatsAppText(payload));

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error || "No se pudo guardar el mensaje.");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudo guardar el mensaje.");
      return;
    }

    if (url) {
      window.location.assign(url);
      return;
    }

    form.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div>
        <p className="font-serif text-3xl">Gracias.</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
          Recibimos tu consulta. Queda guardada en el estudio.
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
          autoComplete="name"
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Teléfono
        <input
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>
      <label className="grid gap-2 text-[11px] uppercase tracking-[0.2em] text-stone">
        Mensaje
        <textarea
          required
          name="message"
          rows={5}
          className="border-b border-line bg-transparent py-3 text-base tracking-normal text-ink outline-none transition-colors focus:border-ink"
        />
      </label>
      {error ? <p className="text-sm text-bronze">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-fit bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Enviando…" : urlLabel(studioPhone)}
      </button>
    </form>
  );
}

function urlLabel(studioPhone: string) {
  return whatsappUrl(studioPhone) ? "Enviar por WhatsApp" : "Enviar";
}
