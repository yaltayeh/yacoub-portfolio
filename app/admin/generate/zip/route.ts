import { strToU8, zipSync } from "fflate";
import { getAdminSession } from "@/lib/admin-session";
import { getCardRange, parseRange } from "@/lib/admin-data";
import { qrLinkUrl } from "@/lib/site";
import { qrSvg } from "@/lib/qr";

export const dynamic = "force-dynamic";

/** ZIP of one SVG per printed link: card-051.svg, card-052.svg, … */
export async function GET(request: Request) {
  if (!(await getAdminSession())) return new Response("Sign in first.", { status: 401 });

  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("from") ?? undefined, url.searchParams.get("to") ?? undefined);
  if (!range) return new Response("Invalid range.", { status: 400 });
  const cards = await getCardRange(range.from, range.to);
  if (cards.length === 0) return new Response("No printed links in that range.", { status: 404 });

  const files: Record<string, Uint8Array> = {};
  for (const card of cards) {
    const n = String(card.number).padStart(3, "0");
    // Quiet zone of 4 modules, as the QR spec asks, since these files may be placed anywhere.
    files[`card-${n}.svg`] = strToU8(qrSvg(qrLinkUrl(card.code), { margin: 4, dark: "#000000" }));
  }
  const zip = zipSync(files, { level: 6 });
  const first = String(range.from).padStart(3, "0");
  const last = String(range.to).padStart(3, "0");

  return new Response(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="cards-${first}-${last}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
