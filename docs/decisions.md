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
