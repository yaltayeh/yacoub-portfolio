import type { Localized } from "@/lib/i18n";

export type StationStatus = "completed" | "inProgress" | "next";

export type Station = {
  id: string;
  /** Wrap code identifiers in backticks to set them in mono: "`ft_ssl`". */
  title: Localized;
  status: StationStatus;
  /** Shown on the Roadmap next to "Completed". */
  completedOn?: Localized;
  description: Localized;
  tags: string[];
  /** Optional one-line terminal command shown under the description. */
  command?: string;
  /** Slug of the project page (Phase 7). The "View project" link appears only when set. */
  projectSlug?: string;
};

// The five stations shared by Home and Roadmap, in order.
export const journey: Station[] = [
  {
    id: "common-core",
    title: { en: "42 Common Core", ar: "42 Common Core" },
    status: "completed",
    completedOn: { en: "[TODO: month year]", ar: "[TODO: الشهر السنة]" },
    description: {
      en: "Learned to code through peer learning, no teachers.",
      ar: "تعلّمت البرمجة عبر التعلّم بين الأقران، دون معلّمين.",
    },
    tags: [],
  },
  {
    id: "ft-ssl",
    title: { en: "`ft_ssl`", ar: "`ft_ssl`" },
    status: "inProgress",
    description: {
      en: "Implementing hash functions and ciphers from scratch in C.",
      ar: "أبني دوال التجزئة وخوارزميات التشفير من الصفر بلغة C.",
    },
    tags: ["MD5", "SHA-256", "SHA-512", "RSA", "DSA", "PBKDF2"],
    command: './ft_ssl sha256 -s "42 Amman"',
  },
  {
    id: "networking",
    title: { en: "Networking", ar: "الشبكات" },
    status: "inProgress",
    description: {
      en: "ft_ping and ft_traceroute: understanding how data travels.",
      ar: "ft_ping وft_traceroute: فهم كيف تنتقل البيانات عبر الشبكة.",
    },
    tags: ["ft_ping", "ft_traceroute", "BGP", "nmap"],
  },
  {
    id: "hardware-password-manager",
    title: { en: "Hardware Password Manager", ar: "مدير كلمات مرور على العتاد" },
    status: "inProgress",
    description: {
      en: "A password manager on ESP32 that encrypts and stores passwords on the device itself.",
      ar: "مدير كلمات مرور على ESP32 يشفّر كلمات السر ويخزّنها داخل الجهاز نفسه.",
    },
    tags: ["ESP32", "Embedded", "Encryption", "PSA Crypto API"],
  },
  {
    id: "post-quantum",
    title: { en: "Post-Quantum Cryptography", ar: "التشفير ما بعد الكمّي" },
    status: "next",
    description: {
      en: "Building quantum-resistant algorithms the same way.",
      ar: "بناء خوارزميات مقاومة للحوسبة الكمّية بالطريقة نفسها.",
    },
    tags: ["ML-KEM", "ML-DSA"],
  },
];
