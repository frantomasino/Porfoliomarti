import { setDefaultResultOrder } from "node:dns";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceKey, getSupabaseUrl } from "@/lib/supabase/env";

try {
  setDefaultResultOrder("ipv4first");
} catch {
  // Edge runtime has no dns module.
}

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
      "Falta SUPABASE_SERVICE_ROLE_KEY en Vercel. Nombre exacto, Production, sin espacios, y Redeploy.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
