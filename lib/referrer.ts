// Where an anonymous visitor came from, derived from the Referer header (or ?utm_source=).
//
// Only the host is ever kept, never the full URL: a Google referrer is just
// "www.google.com" and a search query would be stripped by the browser anyway.
//
// To recognise a new site, add a row: `hosts` match the referrer host exactly or as a
// parent domain (so "facebook.com" also matches "l.facebook.com"), `apps` are Android
// package names (Android apps send "android-app://<package>" as the referrer).
export type SourceRule = { source: string; label: string; hosts: string[]; apps?: string[] };

export const sourceRules: SourceRule[] = [
  { source: "google", label: "Google", hosts: ["google.com", "google.jo", "google.co.uk", "google.de", "google.fr", "google.ae", "google.com.sa", "google.com.eg", "googleusercontent.com"], apps: ["com.google.android.googlequicksearchbox"] },
  { source: "bing", label: "Bing", hosts: ["bing.com"] },
  { source: "duckduckgo", label: "DuckDuckGo", hosts: ["duckduckgo.com"] },
  { source: "yahoo", label: "Yahoo", hosts: ["yahoo.com", "search.yahoo.com"] },
  { source: "yandex", label: "Yandex", hosts: ["yandex.com", "yandex.ru"] },
  { source: "ecosia", label: "Ecosia", hosts: ["ecosia.org"] },
  { source: "brave", label: "Brave Search", hosts: ["search.brave.com"] },
  { source: "chatgpt", label: "ChatGPT", hosts: ["chatgpt.com", "chat.openai.com"] },
  { source: "claude", label: "Claude", hosts: ["claude.ai"] },
  { source: "perplexity", label: "Perplexity", hosts: ["perplexity.ai"] },
  { source: "linkedin", label: "LinkedIn", hosts: ["linkedin.com", "lnkd.in"], apps: ["com.linkedin.android"] },
  { source: "github", label: "GitHub", hosts: ["github.com"] },
  { source: "facebook", label: "Facebook", hosts: ["facebook.com", "fb.com", "fb.me"], apps: ["com.facebook.katana", "com.facebook.lite"] },
  { source: "instagram", label: "Instagram", hosts: ["instagram.com"], apps: ["com.instagram.android"] },
  { source: "x", label: "X", hosts: ["x.com", "twitter.com", "t.co"], apps: ["com.twitter.android"] },
  { source: "whatsapp", label: "WhatsApp", hosts: ["whatsapp.com", "wa.me"], apps: ["com.whatsapp", "com.whatsapp.w4b"] },
  { source: "telegram", label: "Telegram", hosts: ["telegram.org", "t.me", "web.telegram.org"], apps: ["org.telegram.messenger"] },
  { source: "reddit", label: "Reddit", hosts: ["reddit.com", "redd.it"] },
  { source: "youtube", label: "YouTube", hosts: ["youtube.com", "youtu.be"], apps: ["com.google.android.youtube"] },
  { source: "42", label: "42 Network", hosts: ["42.fr", "42network.org", "42amman.com"] },
  { source: "email", label: "Email", hosts: ["mail.google.com", "outlook.live.com", "outlook.office.com", "mail.yahoo.com"], apps: ["com.google.android.gm"] },
];

export type Source = {
  /** Stable key: "google", "linkedin", "direct", "other", … */
  source: string;
  /** Referrer host without "www.", or null when there was none. */
  host: string | null;
};

const matches = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

/** Classifies a Referer header value. `utm` (the ?utm_source value) is used when there's no referrer. */
export function classifyReferrer(referer: string | null, ownHost: string, utm?: string | null): Source & { internal: boolean } {
  let host: string | null = null;
  let app: string | null = null;
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.protocol === "android-app:") app = url.hostname.toLowerCase();
      else host = url.hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      // A malformed Referer is treated as no referrer.
    }
  }

  if (host && matches(host, ownHost.replace(/:\d+$/, "").replace(/^www\./, ""))) return { source: "direct", host, internal: true };

  if (app) {
    const rule = sourceRules.find((r) => r.apps?.includes(app));
    return { source: rule?.source ?? "other", host: app, internal: false };
  }
  if (host) {
    const rule = sourceRules.find((r) => r.hosts.some((d) => matches(host, d)));
    return { source: rule?.source ?? "other", host, internal: false };
  }

  const tag = (utm ?? "").trim().toLowerCase().slice(0, 40);
  if (tag) {
    const rule = sourceRules.find((r) => r.source === tag);
    return { source: rule?.source ?? "other", host: rule ? null : tag, internal: false };
  }
  return { source: "direct", host: null, internal: false };
}

const labels = new Map(sourceRules.map((r) => [r.source, r.label]));

/** Display name of a stored source key. */
export function sourceLabel(source: string | null, host?: string | null): string {
  if (!source || source === "direct") return "Direct / unknown";
  if (source === "other") return host ?? "Other site";
  return labels.get(source) ?? source;
}
