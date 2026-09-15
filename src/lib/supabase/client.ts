import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase no está configurado.");
  }

  return createBrowserClient(url, key);
}
