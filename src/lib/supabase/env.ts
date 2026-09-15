function readEnv(name: string) {
  return (process.env[name] ?? "").trim();
}

export function getSupabaseUrl() {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL") || readEnv("SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  );
}

export function getSupabaseServiceKey() {
  return (
    readEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    readEnv("SUPABASE_SECRET_KEY") ||
    getSupabaseAnonKey()
  );
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
