# altaieh.tech

The personal site of Yacoub Altaieh: a bilingual (English/Arabic) digital business card with a private admin for tracked links. [`docs/BUILD.md`](docs/BUILD.md) is the source of truth for what is being built.

## Stack

- [vinext](https://github.com/cloudflare/vinext): Cloudflare's Vite-based implementation of the Next.js App Router API
- Cloudflare Workers, D1 (database) and R2 (media)
- Drizzle ORM and drizzle-kit for the schema and migrations
- Better Auth for the admin (from Phase 4)
- TypeScript (strict) and plain CSS on top of the Calm Quantum design tokens

## Run it locally

Requirements: Node 22+ and pnpm 11 (`corepack enable`).

```sh
pnpm install
pnpm db:migrate:local   # create the local D1 tables
pnpm dev                # http://localhost:5173/en
```

To run the production build in the Workers runtime:

```sh
pnpm build && pnpm start   # http://localhost:8787
```

Both commands share the same local database in `.wrangler/state`.

### Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build into `dist/` |
| `pnpm start` | Serve the built Worker locally |
| `pnpm typecheck` | Run the TypeScript type-check |
| `pnpm screenshot <url> <dir> <paths…>` | Full-page screenshots at 390px and 1440px (uses your installed Chrome) |
| `pnpm cf-typegen` | Regenerate binding types after editing `wrangler.jsonc` |
| `pnpm db:generate --name <name>` | Generate a migration from `db/schema.ts` |
| `pnpm db:migrate:local` | Apply migrations to the local database |
| `pnpm db:migrate:preview` | Apply migrations to the remote preview database |
| `pnpm db:migrate:prod` | Apply migrations to the remote production database |

## Project structure

```
app/
  [lang]/            public pages: Home, roadmap/, hackathons/ (root layout sets lang/dir)
  (dev)/             temporary checks: /health and /design-tokens (removed in Phase 6)
  styles/            tokens.css (design tokens), site.css (public site)
  globals.css        base styles
components/          header, footer, contact block, journey, hackathon card, icons
content/             profile, journey, roadmap, hackathons (edit these to change the site)
i18n/                en.ts and ar.ts UI strings
lib/                 i18n helpers, fonts
db/
  schema.ts          Drizzle schema
  client.ts          per-request Drizzle client
  migrations/        SQL migrations (generated, applied with Wrangler)
middleware.ts        "/" → /en or /ar
public/images/       portrait
scripts/             screenshot helper
docs/                project documentation
wrangler.jsonc       Worker config: production at the top level, `previews` for branch previews
```

## Documentation

- [`docs/BUILD.md`](docs/BUILD.md): build instructions and phases
- [`docs/architecture.md`](docs/architecture.md): how routing, i18n, styling and data fit together
- [`docs/content.md`](docs/content.md): how to update text, the journey, roadmap, hackathons and photo
- [`docs/deployment.md`](docs/deployment.md): deploys, previews, databases and migrations
- [`docs/decisions.md`](docs/decisions.md): notable decisions and deviations from BUILD.md

`docs/admin.md` is added with the admin in Phase 4.
