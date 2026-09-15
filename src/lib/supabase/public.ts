import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createPublicClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase no está configurado.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
