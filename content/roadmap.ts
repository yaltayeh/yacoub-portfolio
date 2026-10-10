import type { Localized } from "@/lib/i18n";

// Update both whenever the roadmap changes: the words shown on the page, and the
// same month as YYYY-MM (for <time> and the sitemap's lastmod).
export const lastUpdated: Localized = { en: "October 2026", ar: "أكتوبر 2026" };
export const lastUpdatedISO = "2026-10";

// Which journey stations (content/journey.ts) appear in each zone.
export const doneStationIds = ["common-core"];
export const nowStationIds = ["ft-ssl", "networking", "hardware-password-manager"];

export type NextItem = {
  id: string;
  /** Wrap code identifiers in backticks to set them in mono. */
  title: Localized;
  description: Localized;
  /** Timeframe badge, e.g. "Q4 2026". */
  when: string;
  /** A journey station this item grows out of; both get a link to each other. */
  evolvesFrom?: string;
};

export const next: NextItem[] = [
  {
    id: "lattice-foundations",
    title: {
      en: "Lattice-based cryptography foundations",
      ar: "أساسيات التشفير القائم على الشبكيات",
    },
    description: {
      en: "Studying the math behind NIST's new post-quantum standards.",
      ar: "دراسة الأساس الرياضي لمعايير NIST الجديدة المقاومة للكم.",
    },
    when: "Q4 2026",
  },
  {
    id: "ml-kem",
    title: { en: "`ML-KEM` from scratch", ar: "`ML-KEM` من الصفر" },
    description: {
      en: "Implementing the post-quantum key encapsulation standard in C, in the same spirit as ft_ssl.",
      ar: "تنفيذ معيار تبادل المفاتيح المقاوم للكم بلغة C، بنفس روح ft_ssl.",
    },
    when: "Q1 2027",
  },
  {
    id: "ml-dsa",
    title: { en: "`ML-DSA`", ar: "`ML-DSA`" },
    description: {
      en: "Post-quantum digital signatures.",
      ar: "توقيعات رقمية مقاومة للكم.",
    },
    when: "Q2 2027",
  },
  {
    id: "quantum-resistant-password-manager",
    title: {
      en: "Quantum-resistant password manager",
      ar: "مدير كلمات مرور مقاوم للكم",
    },
    description: {
      en: "Upgrading my ESP32 password manager with post-quantum cryptography.",
      ar: "ترقية مدير كلمات المرور على ESP32 بتشفير مقاوم للحوسبة الكمّية.",
    },
    when: "Q3 2027",
    evolvesFrom: "hardware-password-manager",
  },
];

export type StudyTopic = { label: Localized; mono?: boolean };

export const currentlyStudying: StudyTopic[] = [
  { label: { en: "Lattices", ar: "الشبكيات" } },
  { label: { en: "Modular arithmetic", ar: "الحساب المعياري" } },
  { label: { en: "Linear algebra", ar: "الجبر الخطي" } },
  { label: { en: "NIST FIPS 203", ar: "NIST FIPS 203" }, mono: true },
  { label: { en: "NIST FIPS 204", ar: "NIST FIPS 204" }, mono: true },
];
