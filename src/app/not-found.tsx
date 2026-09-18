import Link from "next/link";
import { getSiteProfile } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const site = await getSiteProfile();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.24em] text-stone">404</p>
      <h1 className="mt-4 font-serif text-6xl">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-sm text-stone">
        El recinto que buscás no existe o fue retirado del archivo de {site.full_name}.
      </p>
      <Link
        href="/"
        className="mt-10 border border-ink px-8 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-ivory"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
