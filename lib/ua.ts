import { previewBots, type Platform } from "./bots";

export type Device = "mobile" | "tablet" | "desktop" | "unknown";

export type Classified =
  | { type: "share"; platform: Platform; device: null; os: null }
  | { type: "visit"; platform: null; device: Device; os: string | null };

/**
 * Turns a User-Agent into the derived fields we store. The raw string is never
 * stored (privacy), only: share vs visit, the sharing platform, device and OS.
 */
export function classifyUserAgent(ua: string | null): Classified {
  const agent = ua ?? "";
  const bot = previewBots.find((b) => b.match.test(agent));
  if (bot) return { type: "share", platform: bot.platform, device: null, os: null };
  return { type: "visit", platform: null, device: deviceOf(agent), os: osOf(agent) };
}

function deviceOf(ua: string): Device {
  if (!ua) return "unknown";
  if (/ipad|tablet|kindle|silk|playbook/i.test(ua)) return "tablet";
  // Android phones say "Mobile"; Android tablets don't.
  if (/android/i.test(ua)) return /mobile/i.test(ua) ? "mobile" : "tablet";
  if (/iphone|ipod|mobi|windows phone/i.test(ua)) return "mobile";
  if (/windows|macintosh|mac os x|x11|linux|cros/i.test(ua)) return "desktop";
  return "unknown";
}

function osOf(ua: string): string | null {
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/windows/i.test(ua)) return "Windows";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux|x11/i.test(ua)) return "Linux";
  return null;
}
