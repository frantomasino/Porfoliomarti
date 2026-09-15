import { PasswordGate } from "@/components/admin/PasswordGate";
import { Dashboard } from "@/components/admin/Dashboard";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const ok = await isAdminAuthenticated();
  if (!ok) return <PasswordGate />;
  return <Dashboard />;
}
