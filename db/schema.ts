import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const linkKinds = ["card", "digital"] as const;
export const eventTypes = ["visit", "share"] as const;

// Every tracked URL, printed or digital.
export const links = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(), // uppercase, e.g. "X7K2P9Q"
  number: integer("number").unique(), // printed card number (#017); null for digital links
  kind: text("kind", { enum: linkKinds }).notNull(),
  name: text("name"), // who it was given to; null = unnamed
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Every recorded open or share. Privacy: only derived fields, never IPs or raw User-Agents.
export const events = sqliteTable(
  "events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    linkId: integer("link_id")
      .notNull()
      .references(() => links.id),
    type: text("type", { enum: eventTypes }).notNull(),
    platform: text("platform"), // shares only: whatsapp, telegram, linkedin, ...
    device: text("device"), // "mobile" | "tablet" | "desktop" | "unknown"
    os: text("os"),
    country: text("country"),
    path: text("path"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    index("events_link_id_created_at_idx").on(t.linkId, t.createdAt),
    index("events_created_at_idx").on(t.createdAt),
  ],
);

export type Link = typeof links.$inferSelect;
export type LinkEvent = typeof events.$inferSelect;
