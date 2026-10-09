import { ADMIN_TIME_ZONE } from "./site";

/** "#017" for card links. */
export function cardNumber(n: number | null | undefined): string {
  return n == null ? "" : `#${String(n).padStart(3, "0")}`;
}

/** "Just now", "5m ago", "2h ago", "Yesterday", "3 days ago", else "12 Sep". */
export function relativeTime(date: Date | null, now = new Date()): string {
  if (!date) return "—";
  const s = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const days = Math.floor(s / 86400);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return shortDate(date);
}

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: ADMIN_TIME_ZONE });
const fullFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: ADMIN_TIME_ZONE });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ADMIN_TIME_ZONE });
const todayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: ADMIN_TIME_ZONE });
const todayLongFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: ADMIN_TIME_ZONE });

export const shortDate = (d: Date) => dayFmt.format(d);
export const fullDate = (d: Date | null) => (d ? fullFmt.format(d) : "—");
/** "09 Oct, 14:12" for the event log. */
export const logTime = (d: Date) => `${dayFmt.format(d)}, ${timeFmt.format(d)}`;
/** "Fri 9 Oct" / "Fri, 9 Oct 2026" for the page header. */
export const today = (long = false) => (long ? todayLongFmt : todayFmt).format(new Date());

const regions = new Intl.DisplayNames(["en"], { type: "region" });
export function countryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
}

/** "iPhone", "iPad", "Android", "Desktop", … from the stored device/os. */
export function deviceLabel(device: string | null, os: string | null): string {
  if (os === "iOS") return device === "tablet" ? "iPad" : "iPhone";
  if (os === "Android") return device === "tablet" ? "Android tablet" : "Android";
  if (device === "desktop") return os && os !== "Linux" ? `Desktop · ${os}` : "Desktop";
  if (device === "mobile") return "Mobile";
  if (device === "tablet") return "Tablet";
  return "Unknown device";
}

const platformNames: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  x: "X",
  slack: "Slack",
  discord: "Discord",
  skype: "Skype",
  imessage: "iMessage",
};
export const platformName = (p: string | null) => (p ? (platformNames[p] ?? p) : "a preview");
