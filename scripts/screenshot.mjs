// Full-page screenshots of the site at mobile (390px) and desktop (1440px),
// for comparing against the Claude Design artboards.
//
//   node scripts/screenshot.mjs <base-url> <out-dir> [path ...]
//   node scripts/screenshot.mjs http://localhost:8787 ./shots /en /ar /en/roadmap
//
// Uses the locally installed Google Chrome, so no browser download is needed.
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const [baseUrl, outDir, ...paths] = process.argv.slice(2);
if (!baseUrl || !outDir) {
  console.error("usage: node scripts/screenshot.mjs <base-url> <out-dir> [path ...]");
  process.exit(1);
}

const viewports = [
  { name: "390", width: 390, height: 844, isMobile: true },
  { name: "1440", width: 1440, height: 900, isMobile: false },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      reducedMotion: "reduce", // stable frames: ambient animation off
    });
    const page = await context.newPage();
    for (const path of paths.length ? paths : ["/"]) {
      await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const file = join(outDir, `${path.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "root"}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`${file}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ""}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
