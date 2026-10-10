# altaieh.tech — Build Instructions

This file is the single source of truth for building **altaieh.tech**, the personal website of **Yacoub Altaieh** (يعقوب التايه). Read it fully before writing any code. Build in the phases below, in order, and **stop at the end of each phase** so the owner can review before you continue.

---

## 0. Before you start

1. **Read the designs.** All visual design was done in Claude Design. Open the design handoff the owner provides and treat it as the visual source of truth: colors, spacing, type scale, components, states, mobile and desktop layouts, English and Arabic. If this file and the design disagree on *visuals*, the design wins. If they disagree on *behavior or data*, this file wins. If something is missing from both, ask.
2. **The project already exists.** The owner has already created an empty vinext project, deployed it to Cloudflare, and connected the GitHub repository: **every push is built and deployed automatically**. Do not re-scaffold or create a new Cloudflare project; work inside the existing codebase and its existing Wrangler config. See section 14.0 for the deployment workflow.
3. **Verify vinext.** vinext is new. Before writing code, inspect the existing project and read vinext's current docs/README, then confirm, in a short note to the owner:
   - How the existing build/deploy is configured (build command, Wrangler config, Worker name).
   - How to access Cloudflare bindings (D1, R2, env vars) from route handlers, server components and middleware.
   - Middleware support (`middleware.ts`).
   - Whether static prerendering is supported yet, and how caching / ISR works.
   - Markdown / MDX support (needed later for Projects).
   If any of these is unsupported, stop and propose a workaround before continuing.
4. **Use the right skills and MCP servers.** Before Phase 1, check which skills and MCP servers are already available in this environment, and use them whenever they fit the work instead of guessing or working around them. Look especially for tools that cover:
   - **Cloudflare**: current documentation, Workers and Wrangler, D1, R2, deployment logs and observability.
   - **vinext / Next.js**: current docs, since vinext is new and your training data may be outdated.
   - **Better Auth** and **Drizzle**: current docs and configuration.
   - **Claude Design**: reading the design handoff directly.
   - **GitHub**: branches, pull requests, deployment status.
   - **Browser automation**: opening the deployed preview to compare it visually against the designs at 390px and desktop, in both languages.
   - **Frontend design** skills for implementing the designs faithfully.

   Then give the owner a short report: what you found and will use, and **what is missing** that would clearly help. For each missing item, say what it is, why it helps this project, and how to add it, then ask the owner to choose: **either the owner installs it, or you install it after the owner's explicit approval.** Never install skills, MCP servers or global tools without that approval. Don't block on optional items: if the owner declines, continue with what's available and note any limitation it causes.
5. **Do not invent content.** Anything marked `[TODO: ...]` must stay a clearly visible placeholder until the owner provides it.

---

## 1. What this site is

A personal site that works as a **digital extension of a business card**. People receive a printed card with a QR code after meeting Yacoub, scan it on their phone, and spend about one minute on the site.

**The one message:** Yacoub is genuinely interested in cryptography and quantum computing, and builds things in it, not just reads about it. He is a 42 Amman student looking for opportunities in cryptography.

**The story the site tells (a journey):**
42 Common Core → ft_ssl (building crypto from scratch) → Networking (how data travels) → Hardware Password Manager on ESP32 (applying crypto on a real device) → Post-Quantum Cryptography (next).

Web development is his background and is presented as a supporting strength, not his identity.

**Two halves:**
- **Public site** (bilingual EN/AR): Home, Roadmap, Hackathons, Projects (later).
- **Private admin**: a tracked-links system. Every printed card (and some digital links) has a unique URL. Yacoub names each link after the person he gives it to and sees when it was opened or shared.

---

## 2. Tech stack (fixed)

| Concern | Choice |
|---|---|
| Framework | **vinext** (Cloudflare's Vite-based implementation of the Next.js API), App Router |
| Runtime / hosting | Cloudflare Workers |
| Database | Cloudflare **D1** |
| ORM | **Drizzle** (with drizzle-kit migrations) |
| File storage | Cloudflare **R2** (photos, project images) |
| Auth | **Better Auth** with the Drizzle adapter on D1 |
| Content | TypeScript data files now; Markdown for Projects later |
| Language | TypeScript, strict |
| Fonts | IBM Plex Sans, IBM Plex Sans Arabic, IBM Plex Mono |

Do not add other frameworks, CMSs, or hosted services without asking.

---

## 3. Domain & URLs

- Domain: **altaieh.tech**
- Public pages are language-prefixed: `/en/...` and `/ar/...`
- `/` redirects to `/en` or `/ar` based on `Accept-Language` (Arabic → `/ar`, everything else → `/en`), **preserving any query string**.
- Tracked links: `/l/{CODE}` (the `l` stands for "link", not "card": links are used on cards *and* digitally).

### Routes

| Route | Purpose |
|---|---|
| `/{lang}` | Home |
| `/{lang}/roadmap` | Roadmap |
| `/{lang}/hackathons` | Hackathons |
| `/{lang}/projects`, `/{lang}/projects/{slug}` | Projects (Phase 7, hidden until content exists) |
| `/l/{code}` | Tracked link entry point |
| `/contact.vcf` | vCard for "Save contact" |
| `/admin` | Admin overview (protected) |
| `/admin/links` | Links list (protected) |
| `/admin/links/new` | New digital link (protected) |
| `/admin/generate` | Batch generation (protected) |
| `/admin/generate/print`, `/admin/generate/zip` | A4 print sheet and ZIP of SVGs for a range (protected) |
| `/admin/login` | Sign in |
| `/api/auth/*` | Better Auth handler |

---

## 4. Internationalization

- Two locales: `en` (LTR) and `ar` (RTL). Set `<html lang dir>` per locale.
- **The whole layout mirrors in Arabic**, including the journey path. Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-*`) everywhere; avoid `left`/`right`.
- Directional icons (arrows) flip in RTL.
- Technical terms stay in Latin script inside Arabic text: `ft_ssl`, `ft_ping`, `ft_traceroute`, `ML-KEM`, `ML-DSA`, `ESP32`, `42`, `Hardware Password Manager`, domain names.
- All UI strings live in dictionary files (`/i18n/en.ts`, `/i18n/ar.ts`). No hard-coded copy in components.
- Language toggle switches to the same page in the other locale and **keeps the `?l=` parameter**.
- Admin is **English only**.

---

## 5. Data model (Drizzle, D1)

```ts
// links: every tracked URL, printed or digital
export const links = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),          // uppercase, e.g. "X7K2P9Q"
  number: integer("number").unique(),             // printed card number (#017); null for digital links
  kind: text("kind", { enum: ["card", "digital"] }).notNull(),
  name: text("name"),                             // who it was given to, e.g. "Ahmad"; null = unnamed
  notes: text("notes"),                           // where we met, what we talked about
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// events: every recorded open or share
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  linkId: integer("link_id").notNull().references(() => links.id),
  type: text("type", { enum: ["visit", "share"] }).notNull(),
  platform: text("platform"),                     // for shares: whatsapp, telegram, linkedin, ...
  device: text("device"),                         // "mobile" | "tablet" | "desktop" | "unknown"
  os: text("os"),                                 // "iOS", "Android", "Windows", "macOS", ...
  country: text("country"),                       // from request.cf.country
  path: text("path"),                             // page that was requested
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

Plus the tables Better Auth requires (generate them with its CLI for the Drizzle adapter).

Indexes: `events(link_id, created_at)`, `events(created_at)`.

**Privacy:** never store full IP addresses or raw User-Agent strings. Store only the derived fields above.

---

## 6. Link tracking — exact behavior

### 6.1 Codes
- Length 7, generated with `crypto.getRandomValues` (never `Math.random`).
- Alphabet: uppercase letters and digits **excluding ambiguous characters** `0 O 1 I L`.
  → `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (31 chars, ~27.5 billion combinations).
- Retry on unique-constraint collision.
- Lookups are **case-insensitive** (uppercase the incoming code before querying).

### 6.2 Flow
1. A visitor opens `https://altaieh.tech/l/X7K2P9Q` (from a QR or a digital link).
2. `/l/[code]` route handler: if the code exists, respond with a **302** (never 301, browsers cache 301 and later opens would bypass the server) to `/{lang}/?l=X7K2P9Q`, choosing `lang` from `Accept-Language`. If the code doesn't exist, 302 to `/{lang}` with no parameter.
3. **All logging happens in `middleware.ts`**, not in the `/l/` handler: any request to a public page carrying `?l=CODE` is logged. This way the same logic records QR scans *and* opens of links people share from their browser's address bar (which still carries `?l=`).
4. The `?l=` parameter stays in the URL on purpose, so shares keep their attribution. Internal navigation does not need to propagate it.

### 6.3 Classifying an event
- If the User-Agent matches a link-preview bot → `type = "share"` with `platform` set. At minimum detect:
  `WhatsApp` → whatsapp, `TelegramBot` → telegram, `LinkedInBot` → linkedin, `facebookexternalhit` / `Facebot` → facebook, `Twitterbot` → x, `Slackbot` → slack, `Discordbot` → discord, `SkypeUriPreview` → skype, `Applebot` / iMessage preview → imessage. Keep the list in one file so it's easy to extend.
- Otherwise → `type = "visit"`, with `device` and `os` derived from the User-Agent.
- `country` from `request.cf.country`.
- **Do not log** requests from a signed-in admin session (check the Better Auth session cookie).
- Log everything else as-is: no deduplication, no filtering of visits that happened before a link was named.

### 6.4 Performance
Logging must never delay the response. Use `ctx.waitUntil(...)` (or Next's `after()` if vinext supports it) for the D1 insert.

---

## 7. Auth (Better Auth)

- Email + password, Drizzle adapter on D1.
- **`disableSignUp: true`**. The single admin account is created by a one-off seed script (`scripts/create-admin.ts`) that reads email/password from env/args. Document how to run it.
- On Workers, the D1 binding is only available per request: **create the Better Auth instance inside a factory called per request**, not at module top level.
- Protect every `/admin/*` route (except `/admin/login`) and every admin API route on the server. Redirect unauthenticated users to `/admin/login`.
- Secrets (`BETTER_AUTH_SECRET`, etc.) via Wrangler secrets, never committed.

---

## 8. Public pages — content

Match the Claude Design layouts. Content below is the source for the copy.

### 8.1 Home
- Status badge: "Open to opportunities in cryptography" / "منفتح على فرص في مجال التشفير"
- Name: **Yacoub Altaieh** / **يعقوب التايه**
- Tagline: "42 Amman student building cryptography from scratch, heading toward post-quantum cryptography." / "طالب في 42 عمّان، أبني التشفير من الصفر، ومتّجه نحو التشفير ما بعد الكمّي."
- Credibility line (links to Hackathons): "4× 1st place in hackathons · Competed in Bangkok & Seoul" / "4 مراكز أولى في الهاكاثونات · مشاركات في بانكوك وسيول"
- Buttons: Save contact (`/contact.vcf`), Follow the journey (scrolls to journey)
- Photo inside the glowing orbit: `[TODO: photo]`, served from R2 or `/public`
- Journey section — title "Building it, not just reading about it." / "أبنيه بيدي، لا أكتفي بالقراءة عنه." — subtitle "Five stations, from learning to code to quantum-resistant cryptography." / "خمس محطات، من تعلّم البرمجة إلى التشفير المقاوم للحوسبة الكمّية."
- Explore section (links to Roadmap, Projects, Hackathons) with the web-background note. **Hide the Projects card and nav item until Phase 7.**
- Contact block: "We just met. Let's stay in touch." / "التقينا للتو. لنبقَ على تواصل." with Save contact, Email, LinkedIn, GitHub.

### 8.2 Journey stations (shared by Home and Roadmap)

Keep this in one data file (`/content/journey.ts`) with EN/AR fields.

| # | Title | Status | EN | AR | Tags |
|---|---|---|---|---|---|
| 1 | 42 Common Core | completed `[TODO: month year]` | Learned to code through peer learning, no teachers. | تعلّمت البرمجة عبر التعلّم بين الأقران، دون معلّمين. | — |
| 2 | ft_ssl | in progress | Implementing hash functions and ciphers from scratch in C. | أبني دوال التجزئة وخوارزميات التشفير من الصفر بلغة C. | MD5, SHA-256, SHA-512, RSA, DSA, PBKDF2 |
| 3 | Networking / الشبكات | in progress | ft_ping and ft_traceroute: understanding how data travels. | ft_ping وft_traceroute: فهم كيف تنتقل البيانات عبر الشبكة. | ft_ping, ft_traceroute, BGP, nmap |
| 4 | Hardware Password Manager / مدير كلمات مرور على العتاد | in progress | A password manager on ESP32 that encrypts and stores passwords on the device itself. | مدير كلمات مرور على ESP32 يشفّر كلمات السر ويخزّنها داخل الجهاز نفسه. | ESP32, Embedded, Encryption, PSA Crypto API |
| 5 | Post-Quantum Cryptography / التشفير ما بعد الكمّي | next | Building quantum-resistant algorithms the same way. | بناء خوارزميات مقاومة للحوسبة الكمّية بالطريقة نفسها. | ML-KEM, ML-DSA |

The path is solid through completed and in-progress stations and dashed before "next".

### 8.3 Roadmap
- Title: "Where I'm heading, step by step." / "إلى أين أتّجه، خطوة بخطوة."
- "Last updated: October 2026" / "آخر تحديث: أكتوبر 2026" (read from the data file, not hard-coded in the component)
- Zones: Done / أنجزت, Now / الآن, Next / القادم
- Done: station 1. Now: stations 2–4.
- Next (each with a timeframe badge; the owner may adjust):

| Title | EN | AR | When |
|---|---|---|---|
| Lattice-based cryptography foundations / أساسيات التشفير القائم على الشبكيات | Studying the math behind NIST's new post-quantum standards. | دراسة الأساس الرياضي لمعايير NIST الجديدة المقاومة للكم. | Q4 2026 |
| ML-KEM from scratch / ML-KEM من الصفر | Implementing the post-quantum key encapsulation standard in C, in the same spirit as ft_ssl. | تنفيذ معيار تبادل المفاتيح المقاوم للكم بلغة C، بنفس روح ft_ssl. | Q1 2027 |
| ML-DSA | Post-quantum digital signatures. | توقيعات رقمية مقاومة للكم. | Q2 2027 |
| Quantum-resistant password manager / مدير كلمات مرور مقاوم للكم | Upgrading my ESP32 password manager with post-quantum cryptography. | ترقية مدير كلمات المرور على ESP32 بتشفير مقاوم للحوسبة الكمّية. | Q3 2027 |

The last item visually references station 4 (same project evolving).
- "Currently studying" / "ما أدرسه الآن": Lattices, Modular arithmetic, Linear algebra, NIST FIPS 203, NIST FIPS 204.
- Stations with a project page show "View project →" / "عرض المشروع ←" (only once Projects exist).
- Contact block at the bottom.

### 8.4 Hackathons
- Title: "Where I competed and collaborated." / "حيث نافست وتعاونت."
- Stats: **computed from the data**, not hard-coded: total hackathons, count of 1st places, distinct countries. (Currently 6 · 4× 1st Place · 3 Countries.)
- Placement badges: 1st Place (accent glow), 2nd Place (softer accent), Participated (dignified neutral). AR: المركز الأول / المركز الثاني / مشاركة. International tag: International / دولي.
- **"View post" / "عرض المنشور" opens the hackathon's post** (`postUrl`, usually LinkedIn, sometimes a news article) in a new tab. Posts are not embedded on the site.
- Optional fields (problem, what we built, my role, takeaway, tech tags) render only when present.

Data (`/content/hackathons.ts`), extend the owner's existing type with `country` and `international`:

```ts
export const hackathons: Hackathon[] = [
  { slug: "42-asia-hackathon-bangkok", title: "42 Asia Hackathon", year: "2025", location: "Bangkok, Thailand", country: "TH", international: true, placement: "2nd Place", postUrl: "https://cpf.jo/media_center/طلاب-42-عمّان-يحققون-المركز-الثاني-في-ها/" },
  { slug: "mena-devs-hackathon", title: "MENA Devs Hackathon", year: "2025", location: "Amman, Jordan", country: "JO", international: false, placement: "1st Place", postUrl: "https://www.linkedin.com/posts/42amman_42aehaetaepaeu-42aenaezaeqaex-aetaemaebaebaerabraewaesaeyabraepaesaehaevaex-activity-7384198569077055488-1My2" },
  { slug: "joddb-hackathon", title: "JODDB Hackathon", year: "2025", location: "Amman, Jordan", country: "JO", international: false, placement: "1st Place", postUrl: "https://www.linkedin.com/posts/42amman_42aehaetaepaeu-42aenaezaeqaex-aetaemaebaebaerabraewaesaeyabraepaesaehaevaex-activity-7371465399256772608-NyuI" },
  { slug: "dahab-hackathon", title: "Dahab Hackathon", year: "2025", location: "Amman, Jordan", country: "JO", international: false, placement: "1st Place", postUrl: "https://www.linkedin.com/posts/albattikhi_اختتمنا-بالأمس-فعالية-dahab-jo-hackathon-share-7335669999644176386-QI7j" },
  { slug: "42-asia-hackathon-seoul", title: "42 Asia Hackathon", year: "2024", location: "Seoul, Korea", country: "KR", international: true, placement: "Participated", postUrl: "https://www.linkedin.com/posts/42amman_42-asia-hackathon-activity-7245402011624423428-WH53" },
  { slug: "orange-coding-academy-hackathon", title: "Orange Coding Academy's Hackathon", year: "2024", location: "Amman, Jordan", country: "JO", international: false, placement: "1st Place", postUrl: "https://www.linkedin.com/posts/yacoub-altayeh_i-am-excited-to-share-that-i-had-the-privilege-activity-7217499033664155648-UecT" },
];
```

### 8.5 Contact details
Email `yacoubaltaieh@gmail.com`, phone `+962 78 115 7799` (in the vCard only, not shown on the site), LinkedIn `https://www.linkedin.com/in/yacoub-altaieh`, GitHub `https://github.com/yaltayeh`. No WhatsApp. Keep them in one config file (`/content/profile.ts`) used by the contact block and the vCard.

---

## 9. Admin — behavior

Match the Claude Design admin screens. Calm, dense, fast; mobile matters most (used right after meeting someone).

- **Overview**
  - "Name a link" quick action: enter a card number → opens that link in the detail overlay with the name field focused. Target: under 10 seconds to name a card.
  - Stats: links given (named), total visits, total shares, unnamed card links left.
  - Recent activity feed across all links (visits and shares visually distinct). Tapping an event opens that link's overlay.
- **Links list**: search by number or name, sort by last activity / number. Table on desktop, stacked cards on mobile. Columns: #, Name (muted "Unnamed"), Notes (truncated), Visits, Shares, Last activity. Both card links and digital links appear, with a small kind indicator.
- **Link detail overlay** (not a separate page):
  - Desktop: centered dialog (~720px), dimmed backdrop, scrolls internally; closes on X, Esc, backdrop click.
  - Mobile: full-screen sheet sliding up from the bottom, drag handle, swipe down to close.
  - Opening it updates the URL (`/admin/links?link=17` or `?link=X7K2P9Q`) so refresh / deep links reopen it.
  - Content: number (mono, large), inline-editable name and notes, full URL, QR preview with SVG/PNG download, summary (visits, shares by platform, first/last activity), full event log newest first.
  - Accessible: focus trap, returns focus on close, `aria-modal`.
- **New link**: create a single digital link with a name and notes (e.g. "CV — Company X", "LinkedIn profile").
- **Generate batch**: input a count → shows the number range (continuing from the highest existing number, zero-padded to 3 digits: #051–#100) → creates the links → preview grid of QRs with numbers → export:
  - Printable A4 sheet (print-optimized page with `@media print`)
  - ZIP of SVGs named `card-051.svg`, …
- **Empty and edge states** as designed: no links yet, number not found, link with zero activity.

### QR codes
- Encode the URL **fully uppercase**: `HTTPS://ALTAIEH.TECH/L/X7K2P9Q`. This lets the QR use alphanumeric mode, producing a smaller, easier-to-scan code. The server already handles codes case-insensitively; make sure `/L/` routes to the same handler as `/l/`.
- Generate as SVG (a small, Workers-compatible library, or client-side in the admin). Error-correction level M.
- Every printed QR has its number printed beneath it.

---

## 10. vCard, metadata, link previews

- **`/contact.vcf`**: vCard 3.0 built from `/content/profile.ts` (name, email, phone, URL `https://altaieh.tech`, LinkedIn, GitHub, title "Cryptography · 42 Amman", photo optional). `Content-Type: text/vcard; charset=utf-8`, `Content-Disposition: attachment; filename="yacoub-altaieh.vcf"`.
- **Open Graph / Twitter meta on every public page**, per locale (the share card; each page's `<title>` and meta description for search are in section 11):

| | EN | AR |
|---|---|---|
| title | Hi, I'm Yacoub Altaieh | مرحباً، أنا يعقوب التايه |
| description | I study post-quantum cryptography and build a hardware password manager. | أدرس التشفير ما بعد الكمّي، وأصنع Hardware Password Manager. |

- **OG image**: the photo-centered design from Claude Design (1200×630, face inside the glowing orbit, safe area for WhatsApp's square crop). Export as static PNG files per locale. `[TODO: final photo]`.
- `og:url` should be the canonical page URL **without** `?l=`. Add `<link rel="canonical">` without it as well, and `hreflang` alternates between `/en` and `/ar`.
- Favicon from the orbit logo mark in the design.

---

## 11. SEO & GEO

Public page content must be **server-rendered**, so it's readable without JavaScript (by search engines, AI crawlers and link previews).

### Per-page metadata
- Unique `<title>` and meta description per page and locale:
  - Home: "Yacoub Altaieh — Cryptography & Post-Quantum | 42 Amman" / "يعقوب التايه — التشفير وما بعد الكمّي | 42 عمّان"
  - Roadmap: "Roadmap — Yacoub Altaieh" / "خارطة الطريق — يعقوب التايه"
  - Hackathons: "Hackathons — Yacoub Altaieh" / "الهاكاثونات — يعقوب التايه"

  Write descriptions (150–160 characters) from each page's content.
- Keep `og:title` / `og:description` as the personal greeting on every page ("Hi, I'm Yacoub Altaieh" / "مرحباً، أنا يعقوب التايه" + the study/build line). `<title>` is for search; OG is for shares.

### Indexing
- `/sitemap.xml` generated from routes and content, both locales, with hreflang alternates and `lastmod`.
- `/robots.txt`: allow public pages; disallow `/admin`, `/api`, `/l/`; reference the sitemap.
- Canonical URLs never include `?l=`. hreflang `en`, `ar` and `x-default` (→ `/en`).
- `/admin` and `/l/` also send `X-Robots-Tag: noindex`.

### Structured data (JSON-LD)
- On Home: a `Person` schema: name "Yacoub Altaieh", `alternateName` ["Yacoub Altayeh", "يعقوب التايه"], `url` https://altaieh.tech, `image` (the photo), `jobTitle`, `description`, `affiliation` 42 Amman, `knowsAbout` (Cryptography, Post-Quantum Cryptography, ML-KEM, ML-DSA, Embedded Systems, ESP32, Networking, Web Development), `sameAs` (LinkedIn, GitHub), and `award` from the hackathon data (computed, not hard-coded).
- Plus `WebSite` and `ProfilePage` schemas linking to the `Person`.
- On Hackathons: an `ItemList` of the events.
- Validate with Google's Rich Results Test.

### GEO (generative engine optimization)
- `/llms.txt`: a concise Markdown summary of who Yacoub is, what he works on, his journey, hackathon results, and links to every page, generated from the content files so it never goes stale. Also `/llms-full.txt` with the full text of all public pages in both languages.
- Allow AI crawlers in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- Write content as clear, factual, self-contained statements (who, what, where, when) that make sense when quoted alone.
- Use semantic HTML: one `h1` per page, logical heading order, `<time>` for dates, `<article>` for stations and hackathons.
- Keep the name spelling consistent: "Yacoub Altaieh" everywhere on the site, with "Yacoub Altayeh" only as `alternateName`.

### Done when
Sitemap, `robots.txt`, `llms.txt` and JSON-LD validate; every page has a unique title and description in both languages; Lighthouse SEO = 100 on mobile.

---

## 12. Quality bar

- **Mobile-first.** Test at 390px first. The home page must be usable and fast immediately after a QR scan on a mid-range phone over mobile data.
- **Performance:** public pages cached at the edge where possible; fonts subset and preloaded (`font-display: swap`); no client JS on public pages except the hero animation, scroll reveal of the journey path, and language toggle. Target Lighthouse ≥ 95 on mobile.
- **Motion:** the hero particles and journey glow must be subtle. Respect `prefers-reduced-motion` by disabling all animation.
- **Accessibility:** contrast AA, visible focus states, tap targets ≥ 44px, semantic landmarks, alt text.
- **Security:** CSP that allows only self, and Google Fonts if used (no third-party frames). Admin pages `noindex`. Rate-limit the login endpoint.
- **Code:** strict TypeScript, no `any` in domain code, small focused modules, shared constants (code alphabet, bot list, locales) in one place.

### Documentation
Keep documentation up to date **as you go**: at the end of every phase, update the docs for whatever that phase added, so they never fall behind the code. By the end of Phase 6 the repo must contain:

- **`README.md`**: what the project is, the stack, how to run it locally, project structure, and links to the docs below.
- **`docs/architecture.md`**: how the pieces fit together: routing and i18n, the link-tracking flow (`/l/` → redirect → middleware logging), the data model, auth, and where each Cloudflare binding is used. Include a simple diagram (Mermaid).
- **`docs/deployment.md`**: the GitHub → Cloudflare auto-deploy workflow, branches and previews, environment variables and secrets, creating the D1 database and R2 bucket, applying migrations, connecting the domain.
- **`docs/content.md`**: how the owner updates content without touching components: editing the journey, roadmap (including "last updated"), hackathons, profile/contact details, adding UI strings to both dictionaries, replacing the photo and OG image, and (after Phase 7) adding a project in both languages with images.
- **`docs/admin.md`**: creating or resetting the admin account, naming links, creating digital links, generating and printing a batch, what counts as a visit vs. a share, and extending the bot/platform list.
- **`docs/decisions.md`**: a short log of notable decisions and every deviation from this BUILD.md, with the reason.

Write the docs for the owner: clear, concise, step-by-step where it's a procedure. Code comments explain *why*, not *what*.

---

## 13. Suggested structure (adapt to vinext conventions)

```
app/
  [lang]/
    page.tsx              # Home
    roadmap/page.tsx
    hackathons/page.tsx
    projects/...          # Phase 7
    layout.tsx            # sets lang/dir, fonts, nav, footer
  l/[code]/route.ts       # 302 → /{lang}/?l=CODE
  contact.vcf/route.ts
  admin/
    login/page.tsx
    page.tsx              # Overview
    links/page.tsx        # list + overlay
    generate/page.tsx
  api/auth/[...all]/route.ts
middleware.ts             # locale redirect at "/", event logging on ?l=, admin guard
content/                  # profile.ts, journey.ts, roadmap.ts, hackathons.ts
i18n/                     # en.ts, ar.ts
db/                       # schema.ts, client.ts, migrations/
lib/                      # auth.ts (per-request factory), codes.ts, ua.ts (bots/device), qr.ts
scripts/create-admin.ts
```

---

## 14. Phases

Stop at the end of each phase, summarize what was done and anything that deviated from this file, and wait for the owner.

### 14.0 Deployment workflow (already set up)
- The repo is connected to Cloudflare: **a push to the production branch deploys to the live site automatically.** Treat every push to that branch as a release.
- Work on a feature branch per phase (e.g. `phase-2-public-site`). Check whether Cloudflare's GitHub integration is producing preview deployments for non-production branches; if it is, use the preview URL for review. If not, tell the owner and propose enabling it.
- Merge into the production branch only after the owner approves the phase.
- Never commit secrets. Secrets (`BETTER_AUTH_SECRET`, admin credentials) are set with `wrangler secret put` or in the Cloudflare dashboard.
- **D1 migrations are not applied by a code push.** Decide with the owner whether to add `wrangler d1 migrations apply <db> --remote` to the Cloudflare build command, or to run it manually before merging a phase that changes the schema. Never let deployed code depend on a migration that hasn't been applied.
- The D1 database and R2 bucket may not exist yet: if they don't, give the owner the exact commands to create them and the bindings to add, rather than guessing IDs.

### Phase 1 — Foundation
- Inspect the existing project, verify vinext (section 0), and report.
- In the existing project: TypeScript strict, fonts, design tokens from the Claude Design handoff (CSS variables for colors, radii, spacing, type scale).
- Add D1 and R2 bindings to the existing Wrangler config; Drizzle schema + first migration; a temporary health-check page that reads from D1.
- Push to a feature branch, apply the migration to the remote D1, and verify on the preview (or, once approved, production) deployment.
**Done when:** the deployed health page reads from D1, the design tokens render correctly in a test page, and the migration workflow is agreed. Remove the health page in Phase 6.

### Phase 2 — Public site
- `[lang]` layout with nav, language toggle, footer, RTL support.
- Home, Roadmap, Hackathons, matching the designs on mobile and desktop, both languages.
- Content data files and dictionaries. Projects hidden.
- `/` locale redirect.
**Done when:** all three pages match the designs at 390px and desktop in EN and AR, and the toggle preserves the current page and `?l=`.

### Phase 3 — Link tracking
- Code generator, `/l/[code]` (and `/L/`) handler, middleware logging, UA classification (visit/share, platform, device, OS), country, admin-session exclusion, `waitUntil`.
- A temporary script to insert test links.
**Done when:** opening a test link logs a visit; fetching it with a WhatsApp-like User-Agent logs a share with `platform = "whatsapp"`; the redirect is a 302; nothing is logged while signed in as admin.

### Phase 4 — Auth & admin core
- Better Auth (per-request factory, sign-up disabled), seed script, login page, route protection.
- Overview (quick "Name a link", stats, activity feed), Links list, detail dialog/sheet with inline editing and URL sync, New link.
**Done when:** the owner can sign in on a phone, type a card number, name it, and see its events.

### Phase 5 — Batch generation & printing
- Batch creation with continuing numbers, uppercase-URL QR SVGs, preview grid, A4 print view, ZIP export, per-link QR download.
**Done when:** a batch of 10 can be generated, printed to PDF from the browser, and every printed QR scans to the right link.

### Phase 6 — Finishing
- vCard, OG/meta/canonical/hreflang, OG images, favicon, CSP and headers, reduced motion, performance pass, accessibility pass.
- Connect the custom domain **altaieh.tech**.
- SEO & GEO (section 11): per-page titles and descriptions, sitemap, robots.txt (AI crawlers allowed), JSON-LD (Person, WebSite, ProfilePage, hackathon ItemList), `/llms.txt` and `/llms-full.txt`, `X-Robots-Tag` on `/admin` and `/l/`, semantic HTML.
- Final documentation pass (section 12, Documentation): make sure every doc is complete and matches the final code.
**Done when:** sharing `https://altaieh.tech/en` on WhatsApp shows the photo preview with the correct title and description; "Save contact" adds the contact on iOS and Android; Lighthouse mobile ≥ 95; the owner can follow `docs/content.md` and `docs/admin.md` alone to update a hackathon and generate a batch; and section 11's "Done when" holds (sitemap, robots.txt, llms.txt and JSON-LD validate, unique titles and descriptions in both languages, Lighthouse SEO = 100 on mobile).

### Phase 7 — Projects (later, when the owner has content)
- Markdown content in `/content/projects/{slug}/en.md` and `ar.md` with frontmatter (title, summary, category: crypto / hardware / networking / web, status, tags, cover image, GitHub URL, order).
- Projects list with category filter; project detail page (what & why, how it works, hardest part, what I learned, links, images from R2).
- Unhide Projects in nav and Home; enable "View project" links on the Roadmap.
- Design: follow the Claude Design system; ask the owner for a Projects design if one exists by then.
- Update `docs/content.md` with the exact steps to add a new project.

---

## 15. Open items for the owner

- [ ] Final photo (homepage orbit + OG image)
- [x] Email, phone, LinkedIn URL, GitHub URL (no WhatsApp)
- [ ] Month/year the 42 Common Core was completed
- [ ] Confirm roadmap timeframes
- [ ] Optional details per hackathon (problem, what we built, role, takeaway)
- [ ] Projects content and images (Phase 7)