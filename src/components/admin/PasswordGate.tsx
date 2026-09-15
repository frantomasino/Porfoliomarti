"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function PasswordGate() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <div className="admin-root flex min-h-svh items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-3xl">ARQ.MR</p>
        <h1 className="mt-6 text-xl">Entrar a editar el sitio</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Acá se cargan obras, fotos, WhatsApp y los textos que ve la gente.
        </p>
        <form action={action} className="mt-8 grid gap-3">
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Clave"
            className="h-12 w-full border border-line bg-ivory px-4 text-base text-ink outline-none placeholder:text-stone focus:border-ink"
          />
          {state?.error ? <p className="text-sm text-bronze">{state.error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full bg-ink text-sm text-ivory disabled:opacity-50"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
