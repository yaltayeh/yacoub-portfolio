export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** A value that exists in every locale. Content files use this for translated fields. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/**
 * Picks the site locale from an Accept-Language header: the visitor's most
 * preferred language decides. Arabic (any region) → "ar", anything else → "en".
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  let best: { tag: string; q: number } | undefined;
  for (const part of header.split(",")) {
    const [rawTag, ...params] = part.trim().split(";");
    const tag = rawTag?.trim().toLowerCase();
    if (!tag) continue;
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
    if (Number.isNaN(q) || q <= 0) continue;
    if (!best || q > best.q) best = { tag, q };
  }
  return best && (best.tag === "ar" || best.tag.startsWith("ar-")) ? "ar" : "en";
}

/** Swaps the locale prefix of a site path: "/en/roadmap" → "/ar/roadmap". */
export function switchLocalePath(pathname: string, to: Locale): string {
  const [, first, ...rest] = pathname.split("/");
  const tail = isLocale(first) ? rest : [first, ...rest].filter(Boolean);
  return `/${[to, ...tail].filter(Boolean).join("/")}`;
}
