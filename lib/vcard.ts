// vCard 3.0 for "Save contact". Built from content/profile.ts.
import { contactLinks, isTodo, profile } from "@/content/profile";
import { SITE_HOST } from "./site";

/** Escapes a text value (RFC 2426 §5). */
const esc = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** Folds a content line at 75 octets (UTF-8), continuing with CRLF + space. */
function fold(line: string): string {
  const bytes = new TextEncoder();
  const out: string[] = [];
  let current = "";
  for (const ch of line) {
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes.encode(current + ch).length > limit) {
      out.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.join("\r\n ");
}

export function buildVCard({ photoJpegBase64 }: { photoJpegBase64?: string } = {}): string {
  const [given = "", ...rest] = profile.name.en.split(" ");
  const family = rest.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(profile.name.en)}`,
    `TITLE:${esc("Cryptography · 42 Amman")}`,
    contactLinks.email ? `EMAIL;TYPE=INTERNET,PREF:${profile.email}` : null,
    `URL;TYPE=WORK:https://${SITE_HOST}`,
    // item*.X-ABLabel gives the links readable names in Apple Contacts.
    !isTodo(profile.linkedin) ? `item1.URL:${profile.linkedin}` : null,
    !isTodo(profile.linkedin) ? "item1.X-ABLabel:LinkedIn" : null,
    !isTodo(profile.linkedin) ? `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}` : null,
    !isTodo(profile.github) ? `item2.URL:${profile.github}` : null,
    !isTodo(profile.github) ? "item2.X-ABLabel:GitHub" : null,
    photoJpegBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoJpegBase64}` : null,
    "END:VCARD",
  ];
  return lines
    .filter((l): l is string => l !== null)
    .map(fold)
    .join("\r\n")
    .concat("\r\n");
}
