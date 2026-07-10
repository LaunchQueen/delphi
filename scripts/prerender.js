// scripts/prerender.js
//
// Runs automatically after "npm run build" (see the "postbuild" script in package.json).
// It serves the freshly-built dist/ folder locally, opens each real page in headless
// Chrome, waits for React to finish rendering, and saves the actual rendered HTML back
// into dist/. That way, search engine crawlers (and anything else that doesn't run
// JavaScript) see real content immediately instead of an empty <div id="root"></div>.
//
// Safety rule: if any page doesn't render enough visible text, the whole build fails
// (non-zero exit code) instead of silently deploying broken or blank HTML.

import { createServer } from "http";
import { readFile, writeFile, mkdir, stat } from "fs/promises";
import path from "path";

// Vercel's build servers are a stripped-down Linux environment that's missing
// system libraries the regular Puppeteer-bundled Chrome needs. @sparticuz/chromium
// is a Chromium build made specifically to run there. Locally (on your Mac), we
// just use regular Puppeteer, which already works fine.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const puppeteerCore = (await import("puppeteer-core")).default;
    const chromium = (await import("@sparticuz/chromium")).default;
    const executablePath = await chromium.executablePath();
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  } else {
    const puppeteer = (await import("puppeteer")).default;
    return puppeteer.launch({ headless: "new" });
  }
}

const DIST = path.resolve("dist");
const PORT = 4173;
const MIN_TEXT_LENGTH = 400; // a real page has way more than this; a blank shell has ~0

// Pages to prerender: [ route path, output file relative to dist/ ]
const PAGES = [
  ["/", "index.html"],
  ["/about", "about/index.html"],
  ["/sample", "sample/index.html"],
];

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      let urlPath = decodeURIComponent(req.url.split("?")[0]);
      // For any app route (e.g. /about, /sample), serve the built index.html
      // so client-side JS can boot and figure out what to render — same as
      // production, where vercel.json rewrites everything to /index.html.
      let filePath = path.join(DIST, urlPath);
      try {
        const s = await stat(filePath);
        if (s.isDirectory()) filePath = path.join(filePath, "index.html");
      } catch {
        filePath = path.join(DIST, "index.html");
      }
      try {
        const data = await readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function prerenderPage(browser, route) {
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    consoleErrors.push("pageerror: " + err.message);
  });

  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 30000 });

  // Give React a moment past network-idle in case of client-side data fetches.
  await new Promise((r) => setTimeout(r, 800));

  const html = await page.content();
  const bodyText = await page.evaluate(() => document.body.innerText || "");
  await page.close();

  return { html, textLength: bodyText.trim().length, consoleErrors };
}

async function main() {
  console.log("Prerender: starting local static server...");
  const server = await startStaticServer();

  console.log("Prerender: launching headless Chrome...");
  const browser = await launchBrowser();

  const failures = [];

  for (const [route, outFile] of PAGES) {
    process.stdout.write(`Prerender: rendering ${route} ... `);
    let result;
    try {
      result = await prerenderPage(browser, route);
    } catch (err) {
      failures.push(`${route}: failed to load (${err.message})`);
      console.log("FAILED (load error)");
      continue;
    }

    if (result.textLength < MIN_TEXT_LENGTH) {
      failures.push(`${route}: only rendered ${result.textLength} characters of text (expected at least ${MIN_TEXT_LENGTH})`);
      console.log(`FAILED (only ${result.textLength} chars)`);
      if (result.consoleErrors.length > 0) {
        console.log(`  Browser errors on ${route}:`);
        result.consoleErrors.forEach((e) => console.log("    " + e));
      } else {
        console.log(`  (no browser console errors were captured)`);
      }
      continue;
    }

    const outPath = path.join(DIST, outFile);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, result.html, "utf-8");
    console.log(`OK (${result.textLength} chars) -> dist/${outFile}`);
  }

  await browser.close();
  server.close();

  if (failures.length > 0) {
    console.error("\nPrerender FAILED for one or more pages:");
    failures.forEach((f) => console.error("  - " + f));
    console.error("\nBuild is being stopped so nothing broken gets deployed.");
    process.exit(1);
  }

  console.log("\nPrerender: all pages rendered successfully.");
}

main().catch((err) => {
  console.error("Prerender script crashed:", err);
  process.exit(1);
});
