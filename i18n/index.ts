import type { Locale } from "@/lib/i18n";
import { ar } from "./ar";
import { en, type Dictionary } from "./en";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
