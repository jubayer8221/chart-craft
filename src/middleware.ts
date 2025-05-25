// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "bn", "es", "ar"];
const DEFAULT_LOCALE = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
