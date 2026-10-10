import { env } from "cloudflare:workers";
import { classifyUserAgent } from "./ua";

// Better Auth's session cookie (the __Secure- prefix is used over HTTPS).
// Shared with the admin in Phase 4.
export const ADMIN_SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

type RequestLike = {
  headers: Headers;
  cookies: { has(name: string): boolean };
  nextUrl: { pathname: string };
};

/** Signed-in admin traffic is never logged, so the owner can check links freely. */
export function isAdminRequest(request: RequestLike): boolean {
  return ADMIN_SESSION_COOKIES.some((name) => request.cookies.has(name));
}

/** Country from Cloudflare: request.cf when present, else the CF-IPCountry header. */
export function countryOf(request: RequestLike): string | null {
  const cf = (request as { cf?: { country?: unknown } }).cf;
  const country = typeof cf?.country === "string" ? cf.country : request.headers.get("cf-ipcountry");
  return country && country !== "XX" ? country.toUpperCase() : null;
}

/**
 * Records one open or share of a tracked link. Unknown codes insert nothing:
 * the INSERT … SELECT only matches an existing link, in one round trip.
 */
export async function recordEvent(request: RequestLike, code: string): Promise<void> {
  const c = classifyUserAgent(request.headers.get("user-agent"));
  await env.DB.prepare(
    `INSERT INTO events (link_id, type, platform, device, os, country, path, created_at)
     SELECT id, ?1, ?2, ?3, ?4, ?5, ?6, ?7 FROM links WHERE code = ?8`,
  )
    .bind(
      c.type,
      c.platform,
      c.device,
      c.os,
      countryOf(request),
      request.nextUrl.pathname,
      Math.floor(Date.now() / 1000), // Drizzle "timestamp" mode stores seconds
      code,
    )
    .run();
}
