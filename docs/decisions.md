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
