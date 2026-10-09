// Tracked-link codes: 7 characters from an alphabet without look-alikes
// (no 0 O 1 I L), so a code read off a printed card can't be mistyped.
export const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CODE_LENGTH = 7;

const CODE_PATTERN = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);

/** A new random code. Uses rejection sampling so every character is equally likely. */
export function generateCode(): string {
  const n = CODE_ALPHABET.length;
  // Largest multiple of n below 256; bytes at or above it would bias the result.
  const limit = 256 - (256 % n);
  let code = "";
  while (code.length < CODE_LENGTH) {
    const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH * 2));
    for (const b of bytes) {
      if (b < limit) code += CODE_ALPHABET[b % n];
      if (code.length === CODE_LENGTH) break;
    }
  }
  return code;
}

/** Uppercases an incoming code; returns null if it can't be a valid code (skips the DB). */
export function normalizeCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}
