import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin/session";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const loggedIn = isValidAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (path.startsWith("/admin") && path !== "/admin" && !loggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
