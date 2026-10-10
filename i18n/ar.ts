import type { Dictionary } from "./en";

// Arabic UI strings. Technical terms (ft_ssl, ESP32, 42, ...) stay in Latin script.
export const ar: Dictionary = {
  meta: {
    ogTitle: "مرحباً، أنا يعقوب التايه",
    ogDescription: "أدرس التشفير ما بعد الكمّي، وأصنع Hardware Password Manager.",
    pages: {
      home: {
        title: "يعقوب التايه — التشفير وما بعد الكمّي | 42 عمّان",
        description:
          "يعقوب التايه طالب في 42 عمّان يبني خوارزميات التشفير من الصفر بلغة C، مثل MD5 وSHA-256 وRSA، ويتّجه الآن نحو التشفير ما بعد الكمّي بمعياري ML-KEM وML-DSA.",
      },
      roadmap: {
        title: "خارطة الطريق — يعقوب التايه",
        description:
          "خارطة طريق يعقوب التايه خطوة بخطوة: ما أنجزه، وما يعمل عليه الآن (ft_ssl والشبكات ومدير كلمات مرور على ESP32)، وما هو قادم: ML-KEM وML-DSA المقاومان للكم.",
      },
      hackathons: {
        title: "الهاكاثونات — يعقوب التايه",
        description:
          "الهاكاثونات التي شارك فيها يعقوب التايه بين 2024 و2025: أربعة مراكز أولى في عمّان، والمركز الثاني في 42 Asia Hackathon في بانكوك، ومشاركة دولية في سيول بكوريا.",
      },
    },
  },
  nav: {
    label: "القائمة الرئيسية",
    home: "الرئيسية",
    roadmap: "خارطة الطريق",
    projects: "المشاريع",
    hackathons: "الهاكاثونات",
    homeLink: "يعقوب التايه، الرئيسية",
  },
  language: {
    label: "اللغة",
    en: "EN",
    ar: "عربي",
  },
  status: {
    completed: "مكتمل",
    inProgress: "قيد التنفيذ",
    next: "التالي",
  },
  home: {
    availability: "منفتح على فرص في مجال التشفير",
    tagline: {
      before: "طالب في 42 عمّان، أبني التشفير من الصفر، ومتّجه نحو ",
      accent: "التشفير ما بعد الكمّي",
      after: ".",
    },
    credibility: "4 مراكز أولى في الهاكاثونات · مشاركات في بانكوك وسيول",
    saveContact: "حفظ جهة الاتصال",
    followJourney: "تابع الرحلة",
    followJourneyShort: "الرحلة",
    photoAlt: "صورة يعقوب التايه",
    journey: {
      eyebrow: "01 / الرحلة",
      title: "أبنيه بيدي، لا أكتفي بالقراءة عنه.",
      subtitle: "خمس محطات، من تعلّم البرمجة إلى التشفير المقاوم للحوسبة الكمّية.",
      legend: "دليل الرموز",
    },
    background: {
      eyebrow: "أيضًا",
      text: "قبل التشفير، بنيت أنظمة ويب ولوحات تحكّم، وما زالت نقطة قوة أحملها إلى كل مشروع.",
      projectsLink: "شاهد مشاريعي",
    },
    explore: {
      eyebrow: "02 / استكشف",
      title: "المزيد عن عملي",
      roadmap: "إلى أين أتّجه، خطوة بخطوة",
      projects: "ما بنيته، في التشفير والويب",
      hackathons: "حيث نافست وتعاونت",
    },
    contactEyebrow: "03 / تواصل",
    contactTitle: "التقينا للتو. لنبقَ على تواصل.",
  },
  roadmap: {
    eyebrow: "خارطة الطريق",
    title: "إلى أين أتّجه، خطوة بخطوة.",
    lastUpdated: "آخر تحديث:",
    zones: { done: "أنجزت", now: "الآن", next: "القادم" },
    timeline: "المسار الزمني",
    legend: "دليل الرموز",
    approximate: "مواعيد تقريبية",
    viewProject: "عرض المشروع",
    evolvesInto: "سيتطوّر إلى نسخة مقاومة للكم",
    evolvesFrom: "امتداد لـ",
    studying: "ما أدرسه الآن",
  },
  hackathons: {
    eyebrow: "الهاكاثونات",
    title: "حيث نافست وتعاونت.",
    list: "قائمة الهاكاثونات",
    stats: { total: "هاكاثونات", firsts: "مراكز أولى", firstsSuffix: "", countries: "دول" },
    placement: { first: "المركز الأول", second: "المركز الثاني", participated: "مشاركة" },
    international: "دولي",
    viewPost: "عرض المنشور",
    viewPostLabel: "عرض المنشور: {title} (يفتح في نافذة جديدة)",
    details: {
      problem: "المشكلة",
      built: "ما بنيناه",
      role: "دوري",
      takeaway: "ما خرجت به",
    },
  },
  contact: {
    eyebrow: "تواصل",
    title: "لنبقَ على تواصل.",
    saveContact: "حفظ جهة الاتصال",
    email: "البريد",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  footer: {
    location: "42 عمّان",
  },
};
