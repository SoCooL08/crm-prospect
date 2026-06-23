import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/login" || path === "/api/login" || path === "/api/debug") {
    return NextResponse.next();
  }

  const autentificat = req.cookies.get("crm_auth")?.value === process.env.CRM_PAROLA;

  if (!autentificat) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
