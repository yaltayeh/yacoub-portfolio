import type { Localized } from "@/lib/i18n";

// Contact details used by the contact block, the hero links and (Phase 6) the vCard.
// Values starting with "[TODO" are shown as visible placeholders until filled in.
export const profile = {
  name: { en: "Yacoub Altaieh", ar: "يعقوب التايه" } satisfies Localized,
  email: "[TODO: email]",
  /** International format, e.g. "+962 7X XXX XXXX". */
  whatsapp: "[TODO: WhatsApp number in international format]",
  linkedin: "[TODO: LinkedIn URL]",
  github: "[TODO: GitHub URL]",
  photo: {
    small: "/images/portrait-192.webp",
    large: "/images/portrait-400.webp",
  },
};

export function isTodo(value: string): boolean {
  return value.startsWith("[TODO");
}

/** Link targets for each contact channel; `undefined` while the value is still a TODO. */
export const contactLinks = {
  email: isTodo(profile.email) ? undefined : `mailto:${profile.email}`,
  whatsapp: isTodo(profile.whatsapp)
    ? undefined
    : `https://wa.me/${profile.whatsapp.replace(/[^\d]/g, "")}`,
  linkedin: isTodo(profile.linkedin) ? undefined : profile.linkedin,
  github: isTodo(profile.github) ? undefined : profile.github,
};

/** "in/handle" from a LinkedIn profile URL, for the short hero link. */
export function linkedinHandle(): string {
  if (isTodo(profile.linkedin)) return profile.linkedin;
  const match = profile.linkedin.match(/linkedin\.com\/(in\/[^/?#]+)/);
  return match?.[1] ?? profile.linkedin;
}
