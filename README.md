# altaieh.tech

The personal site of Yacoub Altaieh: a bilingual (English/Arabic) digital business card with a private admin for tracked links. [`docs/BUILD.md`](docs/BUILD.md) is the source of truth for what is being built.

## Stack

- [vinext](https://github.com/cloudflare/vinext): Cloudflare's Vite-based implementation of the Next.js App Router API
- Cloudflare Workers, D1 (database) and R2 (media)
- Drizzle ORM and drizzle-kit for the schema and migrations
- Better Auth for the admin (email + password, sign-up disabled)
- TypeScript (strict) and plain CSS on top of the Calm Quantum design tokens

## Run it locally

Requirements: Node 22+ and pnpm 11 (`corepack enable`).

```sh
pnpm install
cp .dev.vars.example .dev.vars   # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
pnpm db:migrate:local   # create the local D1 tables
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' node scripts/create-admin.ts --local
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
| `ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/create-admin.ts --local\|--preview\|--production` | Create or reset the admin account |
| `node scripts/seed-test-links.ts --local\|--preview` | Create test tracked links (temporary, Phase 3) |
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
  l/[code]/          tracked-link entry point (302 to /{lang}?l=CODE)
  admin/             private admin (own root layout): overview, links, new, login
  api/auth/          Better Auth handler
  (dev)/             temporary checks: /health and /design-tokens (removed in Phase 6)
  styles/            tokens.css (design tokens), site.css (public site)
  globals.css        base styles
components/          header, footer, contact block, journey, hackathon card, icons
content/             profile, journey, roadmap, hackathons (edit these to change the site)
i18n/                en.ts and ar.ts UI strings
lib/                 i18n, link codes, User-Agent and bot rules, tracking, auth, admin data, QR
db/
  schema.ts          Drizzle schema
  client.ts          per-request Drizzle client
  migrations/        SQL migrations (generated, applied with Wrangler)
middleware.ts        "/" → /en or /ar, /L/ → /l/, logging of ?l= visits and shares
public/images/       portrait
scripts/             screenshot helper, temporary test-link seeder
docs/                project documentation
wrangler.jsonc       Worker config: production at the top level, `previews` for branch previews
```

## Documentation

- [`docs/BUILD.md`](docs/BUILD.md): build instructions and phases
- [`docs/architecture.md`](docs/architecture.md): how routing, i18n, styling and data fit together
- [`docs/content.md`](docs/content.md): how to update text, the journey, roadmap, hackathons and photo
- [`docs/deployment.md`](docs/deployment.md): deploys, previews, databases and migrations
- [`docs/decisions.md`](docs/decisions.md): notable decisions and deviations from BUILD.md

- [`docs/admin.md`](docs/admin.md): signing in, the admin account, naming cards, links, digital links, what visits and shares are
