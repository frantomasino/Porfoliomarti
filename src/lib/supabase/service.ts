import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();

  if (!url) {
    throw new Error(
      "Falta NEXT_PUBLIC_SUPABASE_URL en Vercel. Nombre exacto, Production, sin espacios, y Redeploy.",
    );
  }

  if (!key) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en Vercel. Poné la sb_secret_ (Secret), no la publishable, y Redeploy.",
    );
  }

  if (key.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY tiene la clave pública. Pegá la Secret key (sb_secret_…).",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
