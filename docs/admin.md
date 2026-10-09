# Admin guide

> The admin screens arrive in Phase 4. This page already covers how tracking works, and grows with each phase.

## What gets recorded

Each tracked link (`altaieh.tech/l/CODE`) records an event every time a page is opened with its `?l=CODE`:

| Event | When | What's stored |
|---|---|---|
| **Visit** | A person opens the link: scanning the card's QR, or tapping a shared link | device (mobile / tablet / desktop), OS, country, page |
| **Share** | A chat or social app fetches the link to build a preview, which happens when someone pastes it into WhatsApp, Telegram, LinkedIn, iMessage, … | the platform, country, page |

Notes:

- Every open counts. There is no de-duplication, so the same person reloading counts twice.
- Opens before you name a link still count, and show up once you name it.
- Your own visits are not recorded while you're signed in to the admin.
- No IP addresses or raw browser strings are stored, only the derived fields above.

## Adding a sharing app

Share detection is a list in `lib/bots.ts`. To recognise a new app, add a row with the platform name and a pattern that matches its preview bot's User-Agent, e.g.:

```ts
{ platform: "mastodon", match: /mastodon/i },
```

and add the name to the `Platform` type at the top of the file. Put more specific patterns first: the first match wins (iMessage's preview bot also mentions Facebook and Twitter, so its rule comes before theirs).

## Test links (temporary, until the admin exists)

`scripts/seed-test-links.ts` creates digital links named "TEST link N" and prints their URLs:

```sh
node scripts/seed-test-links.ts --local            # local database (pnpm dev / pnpm start)
node scripts/seed-test-links.ts --preview --count 2 # remote preview database
```

It never writes to production. To see what was recorded:

```sh
npx wrangler d1 execute DB --local --command "SELECT l.code, e.type, e.platform, e.device, e.os, e.country, e.path FROM events e JOIN links l ON l.id = e.link_id ORDER BY e.id DESC LIMIT 20"
```

Use `--remote --preview` instead of `--local` for the preview database. The script is removed in Phase 6.
