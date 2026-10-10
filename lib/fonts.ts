import type { Locale } from "./i18n";

// Self-hosted IBM Plex (see app/styles/fonts.css). Preload only what the first
// screen of each locale needs, so text renders in the right font without a swap.
export const fontPreloads: Record<Locale | "admin", string[]> = {
  en: ["/fonts/plex-sans-latin.woff2", "/fonts/plex-mono-400-latin.woff2"],
  ar: ["/fonts/plex-arabic-600.woff2", "/fonts/plex-arabic-400.woff2", "/fonts/plex-sans-latin.woff2"],
  admin: ["/fonts/plex-sans-latin.woff2"],
};
