import { env } from "cloudflare:workers";
import { buildVCard } from "@/lib/vcard";

/** "Save contact": a vCard that adds Yacoub to the phone's contacts. */
export async function GET(request: Request) {
  let photoJpegBase64: string | undefined;
  try {
    const photo = await env.ASSETS.fetch(new URL("/images/vcard-photo.jpg", request.url));
    if (photo.ok) {
      const bytes = new Uint8Array(await photo.arrayBuffer());
      let binary = "";
      for (const b of bytes) binary += String.fromCharCode(b);
      photoJpegBase64 = btoa(binary);
    }
  } catch {
    // The card still works without a photo.
  }

  return new Response(buildVCard({ photoJpegBase64 }), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="yacoub-altaieh.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
