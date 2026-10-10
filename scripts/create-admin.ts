// Creates the single admin account, or resets its password if it already exists.
// Sign-up is disabled in the app, so this is the only way to get an account.
//
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' node scripts/create-admin.ts --local
//   ... --preview      remote preview database
//   ... --production   remote production database
//
// The password is read from the environment (not argv) so it doesn't end up in
// shell history; it is hashed here and only the hash is sent to D1.
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { hashPassword } from "../lib/password.ts";

const args = process.argv.slice(2);
const targets = { "--local": ["--local"], "--preview": ["--remote", "--preview"], "--production": ["--remote"] };
const target = (Object.keys(targets) as (keyof typeof targets)[]).find((t) => args.includes(t));
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Yacoub Altaieh";

if (!target || !email || !password) {
  console.error("usage: ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/create-admin.ts --local|--preview|--production");
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("ADMIN_EMAIL doesn't look like an email address.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const q = (value: string) => `'${value.replace(/'/g, "''")}'`;
const now = Date.now(); // Better Auth timestamps are milliseconds
const userId = randomUUID();
const hash = await hashPassword(password);

// Upsert the user by email, then replace its email/password credential.
const sql = `
INSERT INTO user (id, name, email, email_verified, created_at, updated_at)
VALUES (${q(userId)}, ${q(name)}, ${q(email)}, 1, ${now}, ${now})
ON CONFLICT(email) DO UPDATE SET name = excluded.name, updated_at = excluded.updated_at;
DELETE FROM account WHERE provider_id = 'credential' AND user_id = (SELECT id FROM user WHERE email = ${q(email)});
INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
SELECT ${q(randomUUID())}, id, 'credential', id, ${q(hash)}, ${now}, ${now} FROM user WHERE email = ${q(email)};
DELETE FROM session WHERE user_id = (SELECT id FROM user WHERE email = ${q(email)});
`;

execFileSync("npx", ["wrangler", "d1", "execute", "DB", ...targets[target], "--command", sql], { stdio: "inherit" });
console.log(`\nAdmin ${email} is ready (${target.slice(2)} database). Existing sessions were signed out.`);
