import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// The D1 binding only exists inside a request on Workers, so callers create
// the client per request instead of at module top level.
export function getDb() {
  return drizzle(env.DB, { schema });
}
