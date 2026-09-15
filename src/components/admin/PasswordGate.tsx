"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function PasswordGate() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <div className="admin-root relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0b0a] px-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(154,123,82,0.18),transparent_42%)]" />

      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-lg font-semibold tracking-[0.12em] text-ink">
          MR
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.38em] text-white/45">
          Estudio ARQ.MR
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Panel</h1>
        <p className="mt-2 text-sm text-white/50">
          Gestioná el portafolio, las obras, las fotos y los videos.
        </p>

        <form action={action} className="mt-8 w-full rounded-3xl border border-white/10 bg-white/5 p-3">
          <input
            required
            type="password"
            name="password"
            placeholder="Clave de acceso"
            className="h-12 w-full rounded-2xl border border-white/10 bg-transparent px-5 text-center text-sm text-white outline-none placeholder:text-white/35 focus:border-bronze"
          />
          {state?.error ? (
            <p className="mt-3 text-sm text-bronze">{state.error}</p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 h-12 w-full rounded-2xl bg-bronze text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
