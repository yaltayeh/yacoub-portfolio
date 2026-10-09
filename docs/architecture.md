# Architecture

> Grows phase by phase. Covered so far: routing, i18n, styling, data and link tracking (Phases 1–3).

## Overview

```mermaid
flowchart LR
  V[Visitor] -->|"/"| MW[middleware.ts]
  MW -->|"302 by Accept-Language"| P["/en or /ar pages"]
  V -->|"/en/... /ar/..."| P
  P --> C[content/*.ts + i18n/*.ts]
  Q[QR / tracked link] -->|"/l/CODE or /L/CODE"| LH["app/l/[code]/route.ts"]
  LH -->|"302 /{lang}?l=CODE"| P
  MW -.->|"?l=CODE: log after response"| DB[(D1: DB)]
  H["/health (temporary)"] --> DB
```

The site is a vinext (Next.js App Router API on Vite) app running as one Cloudflare Worker. Public pages are server components rendered from TypeScript content files; the only client JavaScript is the language toggle.

## Routing and i18n

| Path | What |
|---|---|
| `/` | `middleware.ts` redirects (302) to `/en` or `/ar` from `Accept-Language` (any `ar*` as the top preference → Arabic), keeping the query string, so `/?l=CODE` lands on `/ar?l=CODE`. The response varies by `Accept-Language` and is not cached. |
| `/{lang}` | Home |
| `/{lang}/roadmap` | Roadmap |
| `/{lang}/hackathons` | Hackathons |
| any other `/{lang}` | 404 (`dynamicParams = false`) |

- `app/[lang]/layout.tsx` is a **root layout**: it renders `<html lang dir>` per locale, so the whole page mirrors in Arabic. The temporary dev pages have their own root layout in `app/(dev)/layout.tsx`, and the admin will get its own in Phase 4.
- Locales, `dir`, `Accept-Language` parsing and path switching live in `lib/i18n.ts`.
- UI strings are in `i18n/en.ts` and `i18n/ar.ts`; `ar.ts` is typed against `en.ts`, so a missing key fails the type-check.
- `components/RichText.tsx` renders content text: backticks mark mono code names, and in Arabic every run of Latin text (ft_ssl, ESP32, 42) is wrapped in a left-to-right span so it doesn't reorder. Latin titles inside RTL cards use `<bdi>`.
- The language toggle (`components/LanguageToggle.tsx`, a client component) links to the same page in the other language and appends `?l=` from the current URL, so tracked-link attribution survives a language switch.

## Styling

- `app/styles/tokens.css`: the Calm Quantum design tokens as CSS variables (from the Claude Design system and canvas).
- `app/globals.css`: reset, focus ring, reduced-motion rules.
- `app/styles/site.css`: the public site. Mobile first (390px design); the desktop layout (1440px design) starts at 900px. Only logical properties (`margin-inline`, `inset-inline-start`, ...), so RTL needs almost no special rules; directional icons carry a `flip` class mirrored under `[dir="rtl"]`.
- Motion is CSS only: nebula drift, twinkling stars, particle pairs, waves, the in-progress pulse, and the journey rail drawing in on scroll (`animation-timeline: view()` inside `@supports`). `prefers-reduced-motion: reduce` stops all of it.

## Link tracking

Every printed card and some digital links carry a unique URL, `https://altaieh.tech/l/CODE`.

1. **`/l/CODE`** (`app/l/[code]/route.ts`): uppercases the code, checks it exists in D1, and answers **302** (never 301, which browsers cache) to `/{lang}?l=CODE`, choosing the language from `Accept-Language`. An unknown code goes to `/{lang}` without `?l=`. The handler never logs.
2. **`/L/CODE`**: printed QR codes encode the whole URL in uppercase so the QR can use the smaller alphanumeric mode. The middleware rewrites `/L/` to the same handler.
3. **Logging** (`middleware.ts` → `lib/tracking.ts`): any GET of a public page with `?l=CODE` records one event. This catches QR scans (after the redirect) and opens of links people copied from their address bar and shared, since those still carry `?l=`. The insert runs in `waitUntil(...)` after the response is sent, so it never slows the page. It's a single `INSERT … SELECT … FROM links WHERE code = ?`, so unknown codes insert nothing.
4. **Classification** (`lib/ua.ts`, `lib/bots.ts`): a link-preview bot's User-Agent (WhatsApp, Telegram, LinkedIn, iMessage, …) makes it a **share** with that platform; anything else is a **visit** with device and OS. Country comes from Cloudflare (`request.cf.country`, else the `CF-IPCountry` header). The raw User-Agent and IP are never stored.
5. **Not logged:** requests carrying the Better Auth session cookie (the signed-in admin), non-GET requests, and codes that don't exist. Everything else is logged as is: no de-duplication.

Codes (`lib/codes.ts`) are 7 characters from `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (no look-alikes 0 O 1 I L), generated with `crypto.getRandomValues` and rejection sampling so every character is equally likely.

## Content and data

| File | Holds |
|---|---|
| `content/profile.ts` | Name, contact details, photo paths |
| `content/journey.ts` | The five journey stations (Home + Roadmap) |
| `content/roadmap.ts` | Zones, Next items, "last updated", topics being studied |
| `content/hackathons.ts` | Hackathons and their computed stats |
| `content/site.ts` | Feature switches (Projects hidden until Phase 7) |
| `db/schema.ts` | D1 tables for tracked links and events (used from Phase 3) |

How to edit these is in `docs/content.md`.

## LinkedIn posts

Hackathon posts are not embedded. "View post" in `components/HackathonCard.tsx` is a plain link that opens the post on LinkedIn in a new tab, so the page loads nothing from LinkedIn and needs no third-party frames in its CSP.

## Cloudflare bindings

| Binding | Used by |
|---|---|
| `DB` (D1) | Link lookups (`/l/`), event logging (middleware), `/health`; auth from Phase 4 |
| `MEDIA` (R2) | Reserved for project images (Phase 7) |
| `ASSETS` | Static files from `public/` (the portrait) and the build |

Bindings are read with `import { env } from "cloudflare:workers"`; `db/client.ts` creates the Drizzle client per request.
