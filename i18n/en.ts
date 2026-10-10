// English UI strings. Every key here must also exist in ar.ts (enforced by the Dictionary type).
export const en = {
  meta: {
    // The share card (Open Graph / Twitter): the same personal greeting on every page.
    ogTitle: "Hi, I'm Yacoub Altaieh",
    ogDescription: "I study post-quantum cryptography and build a hardware password manager.",
    // Search results: a unique <title> and description per page (descriptions 150–160 characters).
    pages: {
      home: {
        title: "Yacoub Altaieh — Cryptography & Post-Quantum | 42 Amman",
        description:
          "Yacoub Altaieh is a 42 Amman student building cryptography from scratch in C, including MD5, SHA-256 and RSA, on his way to post-quantum ML-KEM and ML-DSA.",
      },
      roadmap: {
        title: "Roadmap — Yacoub Altaieh",
        description:
          "Yacoub Altaieh's roadmap, step by step: done, in progress (ft_ssl, networking, a hardware password manager on ESP32) and next, post-quantum ML-KEM and ML-DSA.",
      },
      hackathons: {
        title: "Hackathons — Yacoub Altaieh",
        description:
          "Hackathons Yacoub Altaieh competed in from 2024 to 2025: four 1st places in Amman and a 2nd place at the 42 Asia Hackathon in Bangkok, plus Seoul in 2024.",
      },
    },
  },
  nav: {
    label: "Main",
    home: "Home",
    roadmap: "Roadmap",
    projects: "Projects",
    hackathons: "Hackathons",
    homeLink: "Yacoub Altaieh, home",
  },
  language: {
    label: "Language",
    en: "EN",
    ar: "عربي",
  },
  status: {
    completed: "Completed",
    inProgress: "In progress",
    next: "Next",
  },
  home: {
    availability: "Open to opportunities in cryptography",
    tagline: {
      before: "42 Amman student building cryptography from scratch, heading toward ",
      accent: "post-quantum cryptography",
      after: ".",
    },
    credibility: "4× 1st place in hackathons · Competed in Bangkok & Seoul",
    saveContact: "Save contact",
    followJourney: "Follow the journey",
    followJourneyShort: "The journey",
    photoAlt: "Portrait of Yacoub Altaieh",
    journey: {
      eyebrow: "01 / The journey",
      title: "Building it, not just reading about it.",
      subtitle: "Five stations, from learning to code to quantum-resistant cryptography.",
      legend: "Legend",
    },
    background: {
      eyebrow: "Also",
      text: "Before cryptography, I built web systems and dashboards. It's still a strength I bring to every project.",
      projectsLink: "See my projects",
    },
    explore: {
      eyebrow: "02 / Explore",
      title: "More about the work",
      roadmap: "Where I'm heading, step by step",
      projects: "What I've built, crypto and web",
      hackathons: "Where I've competed and collaborated",
    },
    contactEyebrow: "03 / Contact",
    contactTitle: "We just met. Let's stay in touch.",
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "Where I'm heading, step by step.",
    lastUpdated: "Last updated:",
    zones: { done: "Done", now: "Now", next: "Next" },
    timeline: "Timeline",
    legend: "Legend",
    approximate: "Approximate timeframes",
    viewProject: "View project",
    evolvesInto: "Evolves into a quantum-resistant version",
    evolvesFrom: "Evolves from",
    studying: "Currently studying",
  },
  hackathons: {
    eyebrow: "Hackathons",
    title: "Where I competed and collaborated.",
    list: "Hackathon list",
    stats: { total: "Hackathons", firsts: "1st Place", firstsSuffix: "×", countries: "Countries" },
    placement: { first: "1st Place", second: "2nd Place", participated: "Participated" },
    international: "International",
    viewPost: "View post",
    viewPostLabel: "View post: {title} (opens in a new tab)",
    details: {
      problem: "The problem",
      built: "What we built",
      role: "My role",
      takeaway: "What I took away",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's stay in touch.",
    saveContact: "Save contact",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  footer: {
    location: "42 Amman",
  },
};

export type Dictionary = typeof en;
