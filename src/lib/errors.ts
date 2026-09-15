export function errorMessage(error: unknown) {
  if (!(error instanceof Error)) return "Error";

  const cause =
    error.cause instanceof Error
      ? error.cause.message
      : error.cause
        ? String(error.cause)
        : "";
  const text = [error.message, cause].filter(Boolean).join(" — ");

  if (/fetch failed|ECONN|ENOTFOUND|UND_ERR|network|ENOTFOUND|dns/i.test(text)) {
    return "No se pudo conectar a Supabase: la Project URL no existe o está mal copiada. En Supabase → Settings → Data API copiá Project URL (https://xxxxx.supabase.co) y pegala en Vercel como NEXT_PUBLIC_SUPABASE_URL.";
  }

  return error.message;
}
