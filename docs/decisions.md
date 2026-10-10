# Decisions

A short log of notable decisions and every deviation from `BUILD.md`, with the reason.

## 2026-10-09 — Phase 1

- **Two D1 databases, one R2 bucket.** Production uses `yacoub-portfolio-db`, branch previews use `yacoub-portfolio-db-preview`, so testing never touches real link data. Photos are read-only content, so both share one bucket, `yacoub-portfolio-media`.
- **Previews use Cloudflare's Worker Previews** (`npx wrangler preview`, the Workers Builds default for non-production branches) with a `previews` block in `wrangler.jsonc`. A first attempt with a Wrangler `env.preview` failed on Workers Builds, because `wrangler preview` requires the `previews` block. The native approach also gives previews their own secrets and needs no branch logic in the build.
- **Migrations are applied by hand**, preview first, then production before merging (agreed with the owner). See `docs/deployment.md`.
- **Kept the Wrangler config file** instead of vinext's newer `cloudflare.config.ts` setup. BUILD.md says to keep the existing config, and vinext still supports it.
- **Removed Tailwind.** The scaffold included it, but it isn't in the BUILD.md stack, and the Calm Quantum design ships as plain CSS on CSS variables. Styling is plain CSS with the tokens in `app/styles/tokens.css`.
- **Pinned every dependency** to an exact version. The scaffold used `"latest"`, which made builds unpredictable.
- **Drizzle stays on the stable 0.45 line**, not the 1.0 release candidate.
- **Fonts load from Google Fonts** with `display=swap`, as the design specifies. Self-hosting subsets can be revisited in the Phase 6 performance pass.
- **The design canvas wins over the design-system notes where they differ.** For example, the link dialog is 720px wide (the canvas, which matches BUILD.md), not 520px (the system's Sheet notes). Canvas-only values were added as tokens: `surface-dialog`, `line-dialog`, `radius-dialog`.
- **`/health` and `/design-tokens` are temporary** and live in `app/(dev)/`, with `noindex`. They are removed in Phase 6.

## 2026-10-09 — Phase 2

- **Journey tags include the design's extra tags** (ft_ssl: DSA, PBKDF2; Networking: BGP, nmap; Hardware Password Manager: PSA Crypto API). They first followed the shorter BUILD.md lists; the owner asked to add them, and BUILD.md was updated to match.
- **ft_ssl has one description everywhere.** The Roadmap artboard words it differently ("Implementing MD5, SHA-256, SHA-512 and RSA from scratch"), but BUILD.md asks for one shared journey file, so both pages use the BUILD.md line.
- **The design's terminal line for ft_ssl is kept** (`$ ./ft_ssl sha256 -s "42 Amman"`), as an optional `command` field on a station.
- **Hero button copy:** desktop says "Follow the journey" (BUILD.md); mobile says "The journey", as in the mobile design, to fit the half-width button.
- **`location` on hackathons is translated** (`{ en, ar }`) instead of one English string, so Arabic pages show "عمّان، الأردن". Country names in tooltips come from the two-letter code via `Intl.DisplayNames`.
- **"View post" links to LinkedIn instead of embedding the post** (owner's request; BUILD.md updated). The cards no longer expand, the page loads nothing from LinkedIn, and `urnType` / `linkedInEmbedId` were dropped from the data. The optional story fields (problem, built, role, takeaway, tech) show inside the card when filled in.
- **No WhatsApp or phone** in the contact block or vCard (owner's request; BUILD.md updated). The contact block has Email, LinkedIn and GitHub in one row of three.
- **Arabic shows "4" instead of "4×"** for 1st places, following the Arabic artboards.
- **Separate root layouts.** `app/[lang]/layout.tsx` owns `<html lang dir>`; the dev pages have their own root layout. This avoids making every page dynamic just to read the locale.
- **Desktop breakpoint at 900px.** The design has 390px and 1440px artboards; at 900px the two-column layouts fit comfortably.
- **"Save contact" links to `/contact.vcf`,** which is built in Phase 6 as planned. Until then the button leads to a 404.
- **Screenshots with Playwright** (`pnpm screenshot <url> <dir> <paths…>`), using the installed Chrome, for 390px/1440px comparisons against the design.

## 2026-10-09 — Phase 3

- **Redirect target is `/{lang}?l=CODE`**, not `/{lang}/?l=CODE` as written in BUILD.md: the site has no trailing slashes, and the slash would cost an extra redirect.
- **`/L/` is a middleware rewrite** to the `/l/` handler instead of a second route folder: `app/l` and `app/L` can't coexist on case-insensitive file systems (macOS).
- **`waitUntil` from `cloudflare:workers`** runs the logging insert after the response, so it doesn't depend on how vinext wires `after()` into middleware.
- **Admin exclusion checks that the Better Auth session cookie is present**, without validating it. That costs no database lookup on every tracked request. Someone faking the cookie could only hide their own visit.
- **Requests to `/` with `?l=` are not logged there;** they are logged once on the `/en` or `/ar` page they redirect to.
- **Test links are digital links named "TEST link N"**, so they don't use up printed card numbers. The seed script refuses to touch the production database.
- **Local development uses the preview database's local copy.** Adding `preview_database_id` makes Wrangler key the local D1 state by that ID, so run `pnpm db:migrate:local` once after pulling.

## 2026-10-10 — Phase 4

- **PBKDF2-SHA256 (WebCrypto, 100,000 iterations) instead of Better Auth's default scrypt.** Scrypt runs in JavaScript and can exceed the Workers CPU limit; WebCrypto's PBKDF2 is native. Stored as `pbkdf2-sha256$iterations$salt$hash`, so the iteration count can be raised later without breaking existing hashes.
- **Login rate limit with database storage** (5/minute on `/sign-in/email`), so the limit holds across Worker isolates instead of per isolate (memory).
- **Sessions last 30 days** (refreshed daily), with a 5-minute signed cookie cache to avoid a D1 read on every admin request.
- **The link detail sheet is server-rendered from `?link=`**, and the client component only handles dialog behaviour, editing and downloads. Refresh, back/forward and deep links work without an extra API.
- **"Name a link" previews the match while typing** from a list of card numbers sent with the page, so there's no round trip before tapping Open. Unnamed links open in "naming mode" (labelled fields + Save, Done on the keyboard saves and returns to the Overview); named links show inline editing.
- **QR preview and SVG/PNG downloads are in the sheet already** (BUILD.md lists per-link QR download under Phase 5); Phase 5 reuses `lib/qr.ts`.
- **"Generate batch" links are hidden until Phase 5** (Overview, Links, Create), so no button leads to a missing page.
- **New link reserves nothing:** the code shown in the form is a preview; on create it is used if still free, otherwise a fresh code is generated.
- **Admin timestamps use Asia/Amman.**

## 2026-10-10 — Phase 5

- **New link moved to `/admin/links/new`, without the "Used for" presets** (owner's request). BUILD.md's route table was updated.
- **"Create" has two tabs:** New link (`/admin/links/new`) and Generate batch (`/admin/generate`), as in the design.
- **Batches are capped at 500** (the design's input maximum) and created in a single D1 transaction.
- **The preview grid shows the first 23 cards** plus a "+N more in the export" tile, as in the design; the print view and the ZIP always contain every card in the range.
- **Reprinting** is a small "from / to" form on the Generate page, so any earlier range can be printed or exported again.
- **Print QR codes are pure black on white with no extra margin** (each card cell is white space already); the ZIP's standalone SVGs keep the standard 4-module quiet zone.

## 2026-10-10 — Phase 6

- **The domain was already connected** (Custom Domains for `altaieh.tech` and `www`); added a `www` → apex 301 so there's one canonical host.
- **Metadata always in `<head>`** (`htmlLimitedBots: /.*/`): vinext, like Next.js 15, streams `generateMetadata` into `<body>` by default, even for WhatsApp and LinkedIn's bots in our tests. The pages are small, so blocking on metadata costs nothing visible.
- **Fonts are self-hosted** (IBM Plex, OFL) instead of loaded from Google Fonts: removes two render-blocking cross-origin round trips, lets the CSP allow only `'self'`, and gives preloads per locale. Only Latin and Arabic subsets are kept.
- **CSP allows `'unsafe-inline'` scripts**: vinext writes the React Server Components payload as inline scripts and doesn't support nonces yet. Everything else is locked to `'self'`.
- **HSTS without `includeSubDomains`**, because other projects live on subdomains of the same zone.
- **OG images are rendered from the design artboards with Playwright** (`scripts/render-og.mjs`), so changing the photo means one command.
- **Favicon:** the two-circle logo mark on a dark rounded square (it disappears on light browser tabs otherwise).
- **vCard:** phone number included (`TEL;TYPE=CELL`) but not shown anywhere on the site, no WhatsApp (by request), LinkedIn and GitHub as labelled URLs plus `X-SOCIALPROFILE`, photo on the disc colour.
- **Hackathon `linkedInUrl` renamed `postUrl`**, because the Bangkok entry now links to the CPF news article (owner's request). BUILD.md updated.
- **Removed:** the temporary `/health` and `/design-tokens` pages and `scripts/seed-test-links.ts`.
