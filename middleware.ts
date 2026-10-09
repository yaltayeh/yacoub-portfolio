import { NextResponse, type NextRequest } from "next/server";
import { localeFromAcceptLanguage } from "@/lib/i18n";

// "/" → "/en" or "/ar" from Accept-Language, keeping the query string (?l= etc.).
// Phase 3 adds tracked-link logging here.
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/") {
    url.pathname = `/${localeFromAcceptLanguage(request.headers.get("accept-language"))}`;
    // 302 + Vary: the target depends on the visitor's language, so it must not be cached as one answer.
    const response = NextResponse.redirect(url, 302);
    response.headers.set("Vary", "Accept-Language");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
