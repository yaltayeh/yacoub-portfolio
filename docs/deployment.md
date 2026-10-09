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

Previews have their own secrets. When secrets are added in Phase 4, set them for production with `wrangler secret put` and for previews with the Previews secret commands (documented then).

Preview URLs are public by default. They don't hold real data, but they can be protected with Cloudflare Access if needed.

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

## Not yet covered

- Secrets (`BETTER_AUTH_SECRET`, admin seed): Phase 4
- Connecting the `altaieh.tech` domain: Phase 6
