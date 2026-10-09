// Password hashing with PBKDF2-SHA256 via WebCrypto. Better Auth's default
// (scrypt in JavaScript) is CPU-heavy for Workers; WebCrypto runs natively.
// Works unchanged in Node (the admin seed script) and in the Worker.
//
// Stored format: pbkdf2-sha256$<iterations>$<salt b64>$<hash b64>

const ALGORITHM = "pbkdf2-sha256";
const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return [ALGORITHM, ITERATIONS, toB64(salt), toB64(hash)].join("$");
}

export async function verifyPassword({ hash, password }: { hash: string; password: string }): Promise<boolean> {
  const [algorithm, iterations, salt, expected] = hash.split("$");
  if (algorithm !== ALGORITHM || !iterations || !salt || !expected) return false;
  const actual = await derive(password, fromB64(salt), Number(iterations));
  const want = fromB64(expected);
  if (actual.length !== want.length) return false;
  // Constant-time comparison.
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= (actual[i] ?? 0) ^ (want[i] ?? 0);
  return diff === 0;
}
