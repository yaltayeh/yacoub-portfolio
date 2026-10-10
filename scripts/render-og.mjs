// Renders the link-preview images from scripts/og/og-{en,ar}.html into
// public/og/og-{en,ar}.png (1200x630). Run after changing the photo or the design:
//
//   node scripts/render-og.mjs
//
// Uses the locally installed Google Chrome (Playwright), and needs the internet
// for the IBM Plex fonts.
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
mkdirSync(`${root}public/og`, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const lang of ["en", "ar"]) {
  await page.goto(new URL(`og/og-${lang}.html`, import.meta.url).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const out = `${root}public/og/og-${lang}.png`;
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  // Shrink the PNG (fewer colours, same look) so chat apps fetch it quickly.
  try {
    execFileSync("magick", [out, "-strip", "-colors", "256", "-define", "png:compression-level=9", out]);
  } catch {
    // ImageMagick is optional; the unoptimised PNG still works.
  }
  console.log(`public/og/og-${lang}.png  ${Math.round(statSync(out).size / 1024)} KB`);
}
await browser.close();
