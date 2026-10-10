import { waitUntil } from "cloudflare:workers";
import { NextResponse, type NextRequest } from "next/server";
import { localeFromAcceptLanguage } from "@/lib/i18n";
import { normalizeCode } from "@/lib/codes";
import { isAdminRequest, recordEvent } from "@/lib/tracking";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // One canonical host: www.altaieh.tech → altaieh.tech (permanent, path and query kept).
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const target = new URL(`${url.pathname}${url.search}`, `https://${host.slice(4)}`);
    return NextResponse.redirect(target, 301);
  }

  // "/" → "/en" or "/ar" from Accept-Language, keeping the query string (?l= etc.).
  if (url.pathname === "/") {
    const target = url.clone();
    target.pathname = `/${localeFromAcceptLanguage(request.headers.get("accept-language"))}`;
    // 302 + Vary: the target depends on the visitor's language, so it must not be cached as one answer.
    const response = NextResponse.redirect(target, 302);
    response.headers.set("Vary", "Accept-Language");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  // Printed QR codes encode the URL in uppercase (HTTPS://ALTAIEH.TECH/L/CODE) for a
  // smaller QR; serve /L/ with the same handler as /l/.
  if (url.pathname.startsWith("/L/")) {
    const target = url.clone();
    target.pathname = `/l/${url.pathname.slice(3)}`;
    return NextResponse.rewrite(target);
  }

  // Admin: without a session cookie, go straight to sign-in. Pages and server
  // actions still validate the session itself (requireAdmin).
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    if (url.pathname !== "/admin/login" && !isAdminRequest(request)) {
      const login = url.clone();
      login.pathname = "/admin/login";
      login.search = "";
      login.searchParams.set("next", `${url.pathname}${url.search}`);
      return NextResponse.redirect(login, 302);
    }
    return NextResponse.next();
  }

  // Every public page opened with ?l=CODE is logged here, whether it came from a
  // QR scan (via /l/) or from a link someone copied and shared. Logging runs after
  // the response is sent, so it never slows the page down.
  if (request.method === "GET") {
    const code = normalizeCode(url.searchParams.get("l"));
    if (code && !isAdminRequest(request)) {
      waitUntil(
        recordEvent(request, code).catch((error: unknown) => {
          console.error("[tracking] failed to record event", error);
        }),
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/L/:path*", "/l/:path*", "/en", "/en/:path*", "/ar", "/ar/:path*", "/admin", "/admin/:path*", "/contact.vcf"],
};
