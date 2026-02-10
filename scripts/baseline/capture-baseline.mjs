import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const ROUTES_FILE = path.join(ROOT_DIR, "config", "routes.json");
const BASELINE_DIR = path.join(ROOT_DIR, "artifacts", "baseline");
const REMOTE_ORIGIN = "https://tool.browser.qq.com";

async function loadRoutes() {
  return JSON.parse(await readFile(ROUTES_FILE, "utf8"));
}

export async function capturePageScreenshot(page, route) {
  const outputPath = path.join(BASELINE_DIR, "screenshots", `${route.id}-remote.png`);
  await page.goto(new URL(route.remotePath, REMOTE_ORIGIN).toString(), { waitUntil: "networkidle" });
  await page.screenshot({ path: outputPath, fullPage: true });
  return outputPath;
}

export async function captureDomSignature(page, route) {
  const signature = await page.evaluate(() => {
    const text = (selector) => Array.from(document.querySelectorAll(selector)).map((item) => item.textContent.trim()).filter(Boolean);
    return {
      title: document.title,
      bodyClass: document.body.className,
      scriptCount: document.querySelectorAll("script[src]").length,
      stylesheetCount: document.querySelectorAll("link[rel='stylesheet']").length,
      navLabels: text(".category-entry-item span"),
      toolNames: text(".tool-name").slice(0, 20),
      recommendTitles: text(".recommend-container .title").slice(0, 5),
      hasSearchInput: !!document.querySelector(".search-input"),
      hasFooter: !!document.querySelector(".footer-pc"),
    };
  });

  const outputPath = path.join(BASELINE_DIR, "dom", `${route.id}-remote.json`);
  await writeFile(outputPath, JSON.stringify(signature, null, 2), "utf8");
  return outputPath;
}

export async function captureNetworkSignature(page, route) {
  const records = [];
  const listener = (response) => {
    const url = response.url();
    if (
      url.includes("/api/") ||
      url.includes("/cgi-bin/") ||
      url.includes("static.res.qq.com") ||
      url.includes("m4.publicimg.browser.qq.com")
    ) {
      records.push({
        url,
        status: response.status(),
      });
    }
  };

  page.on("response", listener);
  await page.goto(new URL(route.remotePath, REMOTE_ORIGIN).toString(), { waitUntil: "networkidle" });
  page.off("response", listener);

  const outputPath = path.join(BASELINE_DIR, "network", `${route.id}-remote.json`);
  await writeFile(outputPath, JSON.stringify(records, null, 2), "utf8");
  return outputPath;
}

async function ensureDirs() {
  await mkdir(path.join(BASELINE_DIR, "screenshots"), { recursive: true });
  await mkdir(path.join(BASELINE_DIR, "dom"), { recursive: true });
  await mkdir(path.join(BASELINE_DIR, "network"), { recursive: true });
}

async function main() {
  await ensureDirs();
  const routes = await loadRoutes();
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of routes) {
    const screenshotPath = await capturePageScreenshot(page, route);
    const domPath = await captureDomSignature(page, route);
    const networkPath = await captureNetworkSignature(page, route);
    console.log(`[capture-baseline] ${route.id} -> ${path.relative(ROOT_DIR, screenshotPath)}, ${path.relative(ROOT_DIR, domPath)}, ${path.relative(ROOT_DIR, networkPath)}`);
  }

  await context.close();
  await browser.close();
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((error) => {
    console.error("[capture-baseline] 执行失败", error);
    process.exitCode = 1;
  });
}
