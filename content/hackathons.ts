import type { Localized } from "@/lib/i18n";

export type Placement = "1st Place" | "2nd Place" | "Participated";

export type Hackathon = {
  slug: string;
  title: string;
  year: string;
  location: Localized;
  /** ISO 3166-1 alpha-2 code; the country name is derived from it per locale. */
  country: string;
  international: boolean;
  placement: Placement;
  /** The post or article that "View post" opens (LinkedIn, a news page, …). */
  postUrl: string;
  /** Optional story. Each part renders only when present. */
  problem?: Localized;
  built?: Localized;
  role?: Localized;
  takeaway?: Localized;
  tech?: string[];
};

const amman: Localized = { en: "Amman, Jordan", ar: "عمّان، الأردن" };

export const hackathons: Hackathon[] = [
  {
    slug: "42-asia-hackathon-bangkok",
    title: "42 Asia Hackathon",
    year: "2025",
    location: { en: "Bangkok, Thailand", ar: "بانكوك، تايلاند" },
    country: "TH",
    international: true,
    placement: "2nd Place",
    postUrl: "https://cpf.jo/media_center/طلاب-42-عمّان-يحققون-المركز-الثاني-في-ها/",
  },
  {
    slug: "mena-devs-hackathon",
    title: "MENA Devs Hackathon",
    year: "2025",
    location: amman,
    country: "JO",
    international: false,
    placement: "1st Place",
    postUrl:
      "https://www.linkedin.com/posts/42amman_42aehaetaepaeu-42aenaezaeqaex-aetaemaebaebaerabraewaesaeyabraepaesaehaevaex-activity-7384198569077055488-1My2",
  },
  {
    slug: "joddb-hackathon",
    title: "JODDB Hackathon",
    year: "2025",
    location: amman,
    country: "JO",
    international: false,
    placement: "1st Place",
    postUrl:
      "https://www.linkedin.com/posts/42amman_42aehaetaepaeu-42aenaezaeqaex-aetaemaebaebaerabraewaesaeyabraepaesaehaevaex-activity-7371465399256772608-NyuI",
  },
  {
    slug: "dahab-hackathon",
    title: "Dahab Hackathon",
    year: "2025",
    location: amman,
    country: "JO",
    international: false,
    placement: "1st Place",
    postUrl:
      "https://www.linkedin.com/posts/albattikhi_اختتمنا-بالأمس-فعالية-dahab-jo-hackathon-share-7335669999644176386-QI7j",
  },
  {
    slug: "42-asia-hackathon-seoul",
    title: "42 Asia Hackathon",
    year: "2024",
    location: { en: "Seoul, Korea", ar: "سيول، كوريا" },
    country: "KR",
    international: true,
    placement: "Participated",
    postUrl:
      "https://www.linkedin.com/posts/42amman_42-asia-hackathon-activity-7245402011624423428-WH53",
  },
  {
    slug: "orange-coding-academy-hackathon",
    title: "Orange Coding Academy's Hackathon",
    year: "2024",
    location: amman,
    country: "JO",
    international: false,
    placement: "1st Place",
    postUrl:
      "https://www.linkedin.com/posts/yacoub-altayeh_i-am-excited-to-share-that-i-had-the-privilege-activity-7217499033664155648-UecT",
  },
];

export function hackathonStats(list: Hackathon[] = hackathons) {
  return {
    total: list.length,
    firsts: list.filter((h) => h.placement === "1st Place").length,
    countries: new Set(list.map((h) => h.country)).size,
  };
}
