import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "opsstay_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // serbest sayfalar
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login")
  ) {
    return NextResponse.next();
  }

  // sadece /panel korunsun
  if (!pathname.startsWith("/panel")) return NextResponse.next();

  const hasSession = req.cookies.get(COOKIE_NAME)?.value;
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
