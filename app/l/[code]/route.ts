import { env } from "cloudflare:workers";
import { localeFromAcceptLanguage } from "@/lib/i18n";
import { normalizeCode } from "@/lib/codes";

export const dynamic = "force-dynamic";

/**
 * Entry point of every tracked link (/l/CODE, and /L/CODE via the middleware).
 * Only redirects: the visit itself is logged by the middleware when the
 * target page is requested with ?l=CODE.
 *
 * Always 302, never 301: browsers cache 301s, and later opens would skip the server.
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const lang = localeFromAcceptLanguage(request.headers.get("accept-language"));
  const code = normalizeCode(raw);

  const exists = code
    ? await env.DB.prepare("SELECT 1 FROM links WHERE code = ?1").bind(code).first()
    : null;

  const target = new URL(`/${lang}`, request.url);
  if (code && exists) target.searchParams.set("l", code);

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      "Cache-Control": "private, no-store",
      Vary: "Accept-Language",
      // A tracked link is a personal redirect, never a search result.
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
