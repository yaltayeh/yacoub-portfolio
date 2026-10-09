import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

// Runs of Latin letters/digits (with inner spaces and punctuation) inside Arabic text.
const LATIN_RUN = /([A-Za-z0-9](?:[A-Za-z0-9 _.,:'’&+\-/]*[A-Za-z0-9])?)/;

/**
 * Renders content text:
 * - `backticks` mark code identifiers, set in mono (e.g. "`ft_ssl`").
 * - In Arabic, Latin terms (ft_ssl, ESP32, 42, ...) are isolated as LTR so they
 *   don't reorder the surrounding RTL text.
 */
export function RichText({ text, locale }: { text: string; locale: Locale }) {
  const parts = text.split(/(`[^`]+`)/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return (
            <span key={i} className="mono" dir="ltr">
              {part.slice(1, -1)}
            </span>
          );
        }
        return locale === "ar" ? <IsolateLatin key={i} text={part} /> : part;
      })}
    </>
  );
}

function IsolateLatin({ text }: { text: string }): ReactNode {
  const pieces = text.split(LATIN_RUN);
  return pieces.map((piece, i) =>
    i % 2 === 1 ? (
      <span key={i} dir="ltr">
        {piece}
      </span>
    ) : (
      piece
    ),
  );
}

/** Text with backticks removed, for attributes like aria-label and alt. */
export function plainText(text: string): string {
  return text.replace(/`/g, "");
}
