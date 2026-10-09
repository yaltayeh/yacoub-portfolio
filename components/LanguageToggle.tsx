"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  /** Page path without the locale prefix: "" for Home, "/roadmap", ... */
  path: string;
  label: string;
  labels: Record<Locale, string>;
};

/**
 * EN / عربي pill. Links to the same page in each language and carries the
 * tracked-link parameter (?l=) along, so a visitor who switches language keeps
 * their attribution. Without JS the links still work, just without ?l=.
 */
export function LanguageToggle({ locale, path, label, labels }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("l");
    if (code) setQuery(`?l=${encodeURIComponent(code)}`);
  }, []);

  return (
    <nav aria-label={label} className="lang-toggle">
      {(["en", "ar"] as const).map((l) => (
        <a
          key={l}
          href={`/${l}${path}${query}`}
          lang={l}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={`lang-toggle__option lang-toggle__option--${l}`}
        >
          {labels[l]}
        </a>
      ))}
    </nav>
  );
}
