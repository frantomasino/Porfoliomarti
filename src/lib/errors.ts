export function errorMessage(error: unknown) {
  if (!(error instanceof Error)) return "Error";

  const cause =
    error.cause instanceof Error
      ? error.cause.message
      : error.cause
        ? String(error.cause)
        : "";
  const text = [error.message, cause].filter(Boolean).join(" — ");

  if (/fetch failed|ECONN|ENOTFOUND|UND_ERR|network/i.test(text)) {
    return "No se pudo conectar a Supabase. Abrí el proyecto en supabase.com (a veces está en pausa) y esperá 30 segundos.";
  }

  return error.message;
}
