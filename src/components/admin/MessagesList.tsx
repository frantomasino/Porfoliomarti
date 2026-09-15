"use client";

import { useEffect, useState } from "react";
import { AdminPage, ghostButtonClass } from "@/components/admin/ui";
import { adminQuery } from "@/lib/admin/db";
import type { ContactMessage } from "@/lib/types";

export function MessagesList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error } = await adminQuery<ContactMessage[]>({
      table: "contact_messages",
      op: "select",
      order: { column: "created_at", ascending: false },
    });
    if (error) {
      setStatus(error);
      return;
    }
    setMessages(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggleRead(message: ContactMessage) {
    await adminQuery({
      table: "contact_messages",
      op: "update",
      data: { read: !message.read },
      match: { id: message.id },
    });
    setMessages((current) =>
      current.map((item) => (item.id === message.id ? { ...item, read: !item.read } : item)),
    );
  }

  async function remove(id: string) {
    await adminQuery({
      table: "contact_messages",
      op: "delete",
      match: { id },
    });
    setMessages((current) => current.filter((item) => item.id !== id));
  }

  return (
    <AdminPage
      title="Mensajes"
      description="Las consultas del formulario de Contacto. Si cargaste WhatsApp, también se abre el chat."
    >
      {status ? <p className="mb-4 text-sm text-bronze">{status}</p> : null}
      <div className="grid gap-5">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`border p-5 ${message.read ? "border-line" : "border-ink bg-ivory"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-base font-medium">{message.name}</p>
                <p className="mt-1 text-sm text-stone">
                  {message.email}
                  {message.phone ? ` · ${message.phone}` : ""}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone">
                  {new Date(message.created_at).toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex w-full gap-3 sm:w-auto">
                <button type="button" className={`${ghostButtonClass} flex-1 sm:flex-none`} onClick={() => void toggleRead(message)}>
                  {message.read ? "No leído" : "Leído"}
                </button>
                <button type="button" className={`${ghostButtonClass} flex-1 sm:flex-none`} onClick={() => void remove(message.id)}>
                  Eliminar
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{message.message}</p>
          </article>
        ))}
        {!messages.length ? <p className="text-sm text-stone">No hay mensajes todavía.</p> : null}
      </div>
    </AdminPage>
  );
}
