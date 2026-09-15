import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin/session";
import { createServiceClient } from "@/lib/supabase/service";

type Body = {
  table: string;
  op: "select" | "insert" | "update" | "delete";
  select?: string;
  data?: Record<string, unknown> | Record<string, unknown>[];
  match?: Record<string, string | number | boolean>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
};

const tables = new Set([
  "site_profile",
  "projects",
  "project_images",
  "timeline_items",
  "services",
  "contact_messages",
]);

export async function POST(request: NextRequest) {
  if (!isValidAdminToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Body;
    if (!tables.has(body.table)) {
      return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
    }

    const supabase = createServiceClient();
    let query = supabase.from(body.table);

    if (body.op === "select") {
      let requestQuery = query.select(body.select || "*");
      if (body.match) {
        Object.entries(body.match).forEach(([key, value]) => {
          requestQuery = requestQuery.eq(key, value);
        });
      }
      if (body.order) {
        requestQuery = requestQuery.order(body.order.column, {
          ascending: body.order.ascending ?? true,
        });
      }
      if (body.limit) requestQuery = requestQuery.limit(body.limit);
      const result = body.single
        ? await requestQuery.maybeSingle()
        : await requestQuery;
      return NextResponse.json({ data: result.data, error: result.error?.message ?? null });
    }

    if (body.op === "insert") {
      if (!body.data) {
        return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
      }
      const result = await query.insert(body.data).select();
      const data = body.single ? result.data?.[0] ?? null : result.data;
      return NextResponse.json({ data, error: result.error?.message ?? null });
    }

    if (body.op === "update") {
      if (!body.data) {
        return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
      }
      let requestQuery = query.update(body.data);
      Object.entries(body.match || {}).forEach(([key, value]) => {
        requestQuery = requestQuery.eq(key, value);
      });
      const result = await requestQuery.select();
      return NextResponse.json({ data: result.data, error: result.error?.message ?? null });
    }

    if (body.op === "delete") {
      let requestQuery = query.delete();
      Object.entries(body.match || {}).forEach(([key, value]) => {
        requestQuery = requestQuery.eq(key, value);
      });
      const result = await requestQuery;
      return NextResponse.json({ data: result.data, error: result.error?.message ?? null });
    }

    return NextResponse.json({ error: "Operación inválida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 },
    );
  }
}
