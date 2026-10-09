# Updating content

All site content lives in small TypeScript files. You never need to touch a component to change text, data or the photo. After editing, push to a branch, check the preview, and merge (see `docs/deployment.md`).

Every translated field has an `en` and an `ar` value. Technical terms (ft_ssl, ESP32, ML-KEM, 42, ...) stay in Latin script in the Arabic text too; the site keeps them left-to-right automatically.

Anything written as `[TODO: ...]` shows on the site as a visible placeholder until you replace it.

## Contact details — `content/profile.ts`

`email`, `linkedin` (full profile URL) and `github` (full URL). They feed the contact block, the short links in the Home hero, and (Phase 6) the "Save contact" card. There is deliberately no phone or WhatsApp. If a value is set back to `"[TODO: ...]"`, its button shows greyed out.

## The journey — `content/journey.ts`

The five stations shown on Home and Roadmap, in order. For each station:

| Field | What it does |
|---|---|
| `title` | Station name. Wrap code names in backticks to show them in mono: `` "`ft_ssl`" ``. |
| `status` | `"completed"`, `"inProgress"` or `"next"`. It sets the node, the card style and the rail (solid up to the last in-progress station, dashed into "next"). |
| `completedOn` | Shown on the Roadmap as "Completed · October 2025". Currently a TODO for 42 Common Core. |
| `description` | One line. |
| `tags` | Technology chips, exactly as written. |
| `command` | Optional terminal line under the description (ft_ssl has one). |
| `projectSlug` | Leave empty until Phase 7; then the Roadmap shows "View project". |

## The roadmap — `content/roadmap.ts`

- **`lastUpdated`**: change both languages whenever you update the roadmap, e.g. `{ en: "January 2027", ar: "يناير 2027" }`.
- **`doneStationIds` / `nowStationIds`**: which journey stations sit under "Done" and "Now" (by `id`). When a station is finished, move its id from `nowStationIds` to `doneStationIds` and set its `status` to `"completed"` in `journey.ts`.
- **`next`**: the upcoming items, each with a `when` badge (e.g. `"Q1 2027"`). Set `evolvesFrom` to a station id to link the two (as the quantum-resistant password manager does with the Hardware Password Manager).
- **`currentlyStudying`**: the topic chips. Set `mono: true` for code-like names such as `NIST FIPS 203`.

The Done / Now / Next counts are computed.

## Hackathons — `content/hackathons.ts`

Add or edit an entry in the `hackathons` list (newest first):

```ts
{
  slug: "my-hackathon-2026",          // unique, lowercase
  title: "My Hackathon",
  year: "2026",
  location: { en: "Amman, Jordan", ar: "عمّان، الأردن" },
  country: "JO",                      // two-letter country code
  international: false,               // true shows the "International" tag
  placement: "1st Place",             // "1st Place" | "2nd Place" | "Participated"
  linkedInUrl: "https://www.linkedin.com/posts/...", // opened by "View post"
  // Optional, each shows only when present:
  problem: { en: "...", ar: "..." },
  built: { en: "...", ar: "..." },
  role: { en: "...", ar: "..." },
  takeaway: { en: "...", ar: "..." },
  tech: ["Python", "FastAPI"],
}
```

"View post" opens `linkedInUrl` in a new tab: copy the post's link from LinkedIn ("Copy link to post"). The story fields show inside the card, under the title.

The stats at the top of the page (total, 1st places, countries) are computed from this list.

## UI text — `i18n/en.ts` and `i18n/ar.ts`

Every label, button and heading is in these two files. To add a new string, add it to `en.ts` first, then add the same key to `ar.ts`. The type-check (`pnpm typecheck`) fails if a key is missing from Arabic.

## The photo

The portrait is a background-removed cut-out stored in `public/images/`:

- `portrait.png`: the original (560×560, transparent background)
- `portrait-192.webp`: mobile hero
- `portrait-400.webp`: desktop orbit

To replace it, export a new square cut-out, then regenerate the two web sizes (requires `cwebp`):

```sh
cwebp -q 82 -alpha_q 90 -resize 192 192 public/images/portrait.png -o public/images/portrait-192.webp
cwebp -q 82 -alpha_q 90 -resize 400 400 public/images/portrait.png -o public/images/portrait-400.webp
```

The link-preview (OG) images are added in Phase 6; this section will cover them then.

## Hidden until Phase 7

Projects (nav item, Home card, "See my projects", "View project") are switched off in `content/site.ts` (`projectsEnabled = false`).
