import { Suspense } from "react";
import { PasswordGate } from "@/components/admin/PasswordGate";
import { AdminDesk } from "@/components/admin/AdminDesk";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { isAdminDatabaseReady } from "@/lib/supabase/env";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const ok = await isAdminAuthenticated();
  if (!ok) return <PasswordGate />;
  return (
    <Suspense fallback={<p className="text-sm text-stone">Cargando…</p>}>
      <AdminDesk configured={isAdminDatabaseReady()} />
    </Suspense>
  );
}
