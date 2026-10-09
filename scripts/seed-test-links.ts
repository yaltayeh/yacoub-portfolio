// TEMPORARY (Phase 3): inserts test links so tracking can be tried before the
// admin exists. Remove in Phase 6.
//
//   node scripts/seed-test-links.ts --local   [--count 3]
//   node scripts/seed-test-links.ts --preview [--count 3]   (remote preview database)
//
// Creates digital links named "TEST link N" (no card numbers are used up) and
// prints their URLs. Refuses to touch the production database.
import { execFileSync } from "node:child_process";
import { generateCode } from "../lib/codes.ts";

const args = process.argv.slice(2);
const target = args.includes("--preview") ? "preview" : args.includes("--local") ? "local" : null;
if (!target) {
  console.error("usage: node scripts/seed-test-links.ts --local|--preview [--count N]");
  process.exit(1);
}
const countArg = args.indexOf("--count");
const count = countArg >= 0 ? Number(args[countArg + 1]) : 3;
if (!Number.isInteger(count) || count < 1 || count > 50) {
  console.error("--count must be between 1 and 50");
  process.exit(1);
}

const now = Math.floor(Date.now() / 1000);
const codes = Array.from({ length: count }, () => generateCode());
const values = codes
  .map((code, i) => `('${code}', NULL, 'digital', 'TEST link ${i + 1}', 'Created by seed-test-links', ${now})`)
  .join(",\n");
// Codes come from our own alphabet, so they're safe to inline. A collision with an
// existing code fails the unique constraint; just run the script again.
const sql = `INSERT INTO links (code, number, kind, name, notes, created_at) VALUES\n${values};`;

const flags = target === "local" ? ["--local"] : ["--remote", "--preview"];
execFileSync("npx", ["wrangler", "d1", "execute", "DB", ...flags, "--command", sql], { stdio: "inherit" });

const host = target === "local" ? "http://localhost:8787" : "https://<preview-host>";
console.log(`\nCreated ${count} test link(s) in the ${target} database:`);
for (const code of codes) console.log(`  ${code}  ${host}/l/${code}`);
