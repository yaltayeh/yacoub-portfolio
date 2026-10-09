import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n";
import { profile } from "@/content/profile";
import { projectsEnabled } from "@/content/site";
import { LogoMark } from "./icons";
import { LanguageToggle } from "./LanguageToggle";

export type PageKey = "home" | "roadmap" | "hackathons";

const pagePaths: Record<PageKey | "projects", string> = {
  home: "",
  roadmap: "/roadmap",
  projects: "/projects",
  hackathons: "/hackathons",
};

export function SiteHeader({ locale, page, t }: { locale: Locale; page: PageKey; t: Dictionary }) {
  const items: { key: PageKey | "projects"; label: string }[] = [
    { key: "home", label: t.nav.home },
    { key: "roadmap", label: t.nav.roadmap },
    ...(projectsEnabled ? [{ key: "projects" as const, label: t.nav.projects }] : []),
    { key: "hackathons", label: t.nav.hackathons },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href={`/${locale}`} aria-label={t.nav.homeLink} className="site-header__brand">
          <LogoMark />
          <span className="site-header__name">{profile.name[locale]}</span>
        </a>
        <nav aria-label={t.nav.label} className="site-nav">
          {items.map((item) => (
            <a
              key={item.key}
              href={`/${locale}${pagePaths[item.key]}`}
              aria-current={item.key === page ? "page" : undefined}
              className="site-nav__link"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <LanguageToggle
          locale={locale}
          path={pagePaths[page]}
          label={t.language.label}
          labels={{ en: t.language.en, ar: t.language.ar }}
        />
      </div>
    </header>
  );
}
