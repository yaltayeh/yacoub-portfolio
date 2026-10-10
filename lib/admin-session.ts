import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuth } from "./auth";

async function requestOrigin(): Promise<{ origin: string; headers: Headers }> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return { origin: `${proto}://${host}`, headers: h };
}

/** The signed-in admin's session, or null. Validated against D1 by Better Auth. */
export async function getAdminSession() {
  const { origin, headers: h } = await requestOrigin();
  return createAuth(origin).api.getSession({ headers: h });
}

/**
 * Guard for every admin page and server action. The middleware already sends
 * visitors without a session cookie to the login page; this checks the session
 * is real (not just a cookie with that name).
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
