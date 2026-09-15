export type AdminQuery = {
  table: string;
  op: "select" | "insert" | "update" | "delete";
  select?: string;
  data?: unknown;
  match?: Record<string, string | number | boolean>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
};

export async function adminQuery<T>(query: AdminQuery): Promise<{ data: T | null; error: string | null }> {
  const response = await fetch("/api/admin/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  const json = (await response.json()) as { data: T | null; error: string | null };
  if (!response.ok) {
    return { data: null, error: json.error || "No autorizado" };
  }
  return { data: json.data, error: json.error };
}

export async function adminUpload(file: File, folder: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !json.url) {
    throw new Error(json.error || "No se pudo subir el archivo.");
  }
  return json.url;
}
