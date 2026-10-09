import { defineConfig } from "drizzle-kit";

// drizzle-kit only generates SQL here; Wrangler applies it (see docs/deployment.md).
export default defineConfig({
  dialect: "sqlite",
  schema: ["./db/schema.ts", "./db/auth-schema.ts"],
  out: "./db/migrations",
});
