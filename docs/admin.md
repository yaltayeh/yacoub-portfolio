# Admin guide

The admin lives at `/admin` (English only, not indexed by search engines). Use it on your phone right after handing someone a card.

## Signing in

Go to `/admin` and sign in with the email and password of the admin account. Sessions last 30 days. Sign out from the sidebar (desktop) or the tab bar (phone).

Login attempts are limited to 5 per minute; after that, wait a minute.

## Creating or resetting the admin account

Sign-up is turned off, so the account is created from your computer. The same command resets the password if the account already exists (and signs out all sessions):

```sh
ADMIN_EMAIL=yacoubaltaieh@gmail.com ADMIN_PASSWORD='a long passphrase' node scripts/create-admin.ts --production
```

- Use `--preview` for the preview database and `--local` for local development. Each database has its own account.
- The password must be at least 12 characters. It's read from the environment, hashed on your computer (PBKDF2-SHA256), and only the hash is stored.
- Tip: start the command with a space so it isn't saved in your shell history (zsh: `setopt HIST_IGNORE_SPACE`).

## Naming a card (the 10-second flow)

1. Open `/admin` on your phone.
2. In **Name a link**, type the number printed on the card (e.g. `17`). The matching link appears under the field.
3. Tap **Open**. The link opens with the name field focused.
4. Type the person's name (and optionally where you met), then press **Done** on the keyboard. You're back on the Overview.

## Links

**Links** lists every link, printed and digital: search by number, name, notes or code; filter All / Printed / Digital; sort by last activity or number. Tap a link to open its details:

- Edit the name and notes in place (saved when you leave the field).
- Copy the link, or download its QR code as SVG or PNG.
- Visits, shares (by platform), first and last activity, and the full event log, newest first.

Each link has its own address (`/admin/links?link=X7K2P9Q` or `?link=17`), so you can bookmark or refresh it. Close with ×, Esc, a tap outside, or (phone) a swipe down.

## Digital links

**Create → New link** (`/admin/links/new`) makes a single link for your CV, LinkedIn, GitHub or one company application. Give it a name (and notes if you like), then **Create link**. The link opens straight away so you can copy it or download its QR.

## Printing business cards

1. **Create → Generate batch** (`/admin/generate`).
2. Choose how many links (presets 10 / 25 / 50 / 100, up to 500). The page shows the numbers you'll get, continuing from your highest card (the first batch starts at `#001`).
3. Press **Generate N links**. Nothing is created before this. The new links appear as a grid of QR codes.
4. Export:
   - **Print sheet (A4)** opens a print view with 24 cards per A4 page (4 × 6), each QR with its number and code, and dashed cut lines. Press **Print**, choose A4, margins **None** and scale **100%**, and print or save as PDF.
   - **Download ZIP (SVG)** gives one file per card, `card-051.svg`, `card-052.svg`, …, for a printer or designer. Each has a proper white quiet zone.
5. Hand out the cards, then name each one as you go (see "Naming a card").

To reprint or re-export cards you made earlier, use **Reprint or export a range** at the bottom of the Generate page (e.g. 51 to 100).

QR codes always point to `https://altaieh.tech/l/CODE` (encoded in capitals for a smaller, easier-to-scan code), even when you generate them on a preview site. They start working once the domain is connected (Phase 6).

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
