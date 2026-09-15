import { NextResponse, type NextRequest } from "next/server";
import { errorMessage } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

function text(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = text(body.name, 120);
    const email = text(body.email, 180);
    const phone = text(body.phone, 60);
    const message = text(body.message, 4000);

    if (!name || !message) {
      return NextResponse.json({ error: "Completá nombre y mensaje." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      phone,
      message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
