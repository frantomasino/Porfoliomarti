function trim(value: string | undefined) {
  return (value ?? "").trim();
}

export function getSupabaseUrl() {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_URL) || trim(process.env.SUPABASE_URL);
}

export function getSupabaseAnonKey() {
  return (
    trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    trim(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  );
}

export function getSupabaseServiceKey() {
  return trim(process.env.SUPABASE_SERVICE_ROLE_KEY) || trim(process.env.SUPABASE_SECRET_KEY);
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isAdminDatabaseReady() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}
