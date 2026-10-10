# Deployment

## How deploys work

The GitHub repository is connected to Cloudflare Workers Builds. Every push builds the site on Cloudflare.

| Branch | Build command | Deploy command | Result |
|---|---|---|---|
| `main` | `pnpm run build` | `npx wrangler deploy` | Goes live (production) |
| any other branch | `pnpm run build` | `npx wrangler preview` | A [Worker Preview](https://developers.cloudflare.com/workers/previews/) with its own URL; production is untouched |

Treat every push to `main` as a release. Work happens on one branch per phase (for example `phase-1-foundation`), is reviewed on that branch's preview URL, and is merged into `main` only after approval.

Find a branch's preview URL on the GitHub commit (the "Workers Builds" check) or in the Cloudflare dashboard under **Workers & Pages → yacoub-portfolio → Deployments**.

## Production vs preview

`wrangler.jsonc` describes production at the top level and previews in its `previews` block. Previews don't inherit production settings, so every binding the code reads is listed again in `previews`.

| | Production | Preview |
|---|---|---|
| Worker | `yacoub-portfolio` | `yacoub-portfolio` (one Preview per branch) |
| D1 | `yacoub-portfolio-db` | `yacoub-portfolio-db-preview` |
| R2 | `yacoub-portfolio-media` | `yacoub-portfolio-media` (shared) |
| `APP_ENV` | `production` | `preview` |

Previews have their own secrets (see "Secrets" below).

Preview URLs are public by default. They don't hold real data, but they can be protected with Cloudflare Access if needed.

## Secrets

Secrets never go in the repo. There is one so far:

| Secret | What | Generate |
|---|---|---|
| `BETTER_AUTH_SECRET` | Signs admin session cookies. Changing it signs everyone out. | `openssl rand -base64 32` |

Set it in three places:

```sh
# Production (do this before merging the Phase 4 PR; the admin needs it)
openssl rand -base64 32 | npx wrangler secret put BETTER_AUTH_SECRET

# Every future branch Preview (applies to Previews created after this)
openssl rand -base64 32 | npx wrangler preview base-config secret put BETTER_AUTH_SECRET

# One Preview that already exists, e.g. the current branch
openssl rand -base64 32 | npx wrangler preview secret put BETTER_AUTH_SECRET --name <branch-name>
```

Locally, put it in `.dev.vars` (gitignored; copy `.dev.vars.example`).

## Bindings

| Binding | Type | Used for |
|---|---|---|
| `DB` | D1 | Links, events and (from Phase 4) auth tables |
| `MEDIA` | R2 | Photos and project images |
| `IMAGES` | Images | vinext image optimization |
| `ASSETS` | Static assets | Built client files |
| `APP_ENV` | Variable | `production` or `preview` |

After changing bindings in `wrangler.jsonc`, run `pnpm cf-typegen` and commit `worker-configuration.d.ts`.

## Database migrations

**A push does not apply migrations.** Apply them by hand, always to preview first:

1. Edit `db/schema.ts`.
2. Generate the SQL: `pnpm db:generate --name <short_description>`. Commit the new file in `db/migrations/`.
3. Try it locally: `pnpm db:migrate:local`.
4. Apply it to the preview database: `pnpm db:migrate:preview`. This uses the `preview_database_id` on the `DB` binding. Push the branch and check the preview.
5. **Before merging into `main`**, apply it to production: `pnpm db:migrate:prod`.

Never merge code that needs a migration that hasn't been applied to production. Migrations must stay backwards compatible with the code currently live, because the production migration runs before the new code deploys.

## Creating the resources (already done)

These were created on 2026-10-09 and are listed here for reference or to rebuild the setup:

```sh
npx wrangler d1 create yacoub-portfolio-db
npx wrangler d1 create yacoub-portfolio-db-preview
npx wrangler r2 bucket create yacoub-portfolio-media
```

Their IDs are in `wrangler.jsonc`.

## The admin account

Sign-up is disabled. Create (or later reset) the one admin account with `scripts/create-admin.ts`; see `docs/admin.md`. Each database (local, preview, production) has its own account.

## The domain

`altaieh.tech` is a zone on the same Cloudflare account. `altaieh.tech` and `www.altaieh.tech` are **Custom Domains** of the `yacoub-portfolio` Worker (Workers & Pages → yacoub-portfolio → Settings → Domains & Routes); Cloudflare manages their DNS records and certificates. The middleware redirects `www` to `altaieh.tech` (301), so there's one canonical host.

The zone also holds other things (email routing, `yc`, `pablo`, `mc2026`, `ayc` subdomains); leave those records alone. HSTS is sent without `includeSubDomains` for the same reason.

## Caching

- Static files get cache headers from `public/_headers`: fonts for a year (`immutable`), images, OG images and icons for a day.
- `/contact.vcf` is cacheable for an hour.
- Pages, `/` and `/l/` are rendered per request (they're fast, and tracking needs every request to reach the Worker).
