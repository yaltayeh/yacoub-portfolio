// The canonical domain. Printed QR codes always point here, even when the
// admin runs on a preview URL, because the cards outlive any preview.
export const SITE_HOST = "altaieh.tech";

/** Owner's time zone for admin timestamps. */
export const ADMIN_TIME_ZONE = "Asia/Amman";

/** Short form shown in the admin: "altaieh.tech/l/X7K2P9Q". */
export function displayLinkUrl(code: string): string {
  return `${SITE_HOST}/l/${code}`;
}

/**
 * The URL encoded in QR codes, fully uppercase ("HTTPS://ALTAIEH.TECH/L/X7K2P9Q")
 * so the QR can use alphanumeric mode: fewer modules, easier to scan.
 * The server treats /L/ and codes case-insensitively.
 */
export function qrLinkUrl(code: string): string {
  return `https://${SITE_HOST}/l/${code}`.toUpperCase();
}

/** The normal, clickable form for copying: "https://altaieh.tech/l/X7K2P9Q". */
export function shareLinkUrl(code: string): string {
  return `https://${SITE_HOST}/l/${code}`;
}
