import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const ROUTES_FILE = path.join(ROOT_DIR, "config", "routes.json");
const SCENARIO_DIR = path.join(ROOT_DIR, "artifacts", "baseline", "scenarios");
const REMOTE_ORIGIN = "https://tool.browser.qq.com";

async function loadRoutes() {
  return JSON.parse(await readFile(ROUTES_FILE, "utf8"));
}

function getDefaultCaseId(route) {
  if (route.id === "education-home") return "home-search-suggestion";
  if (route.id === "wordcount") return "wordcount-calc";
  return "basic-structure";
}

export async function runScenario(page, route, caseId) {
  const target = new URL(route.remotePath, REMOTE_ORIGIN).toString();
  await page.goto(target, { waitUntil: "networkidle" });

  if (caseId === "home-search-suggestion") {
    await page.locator(".search-input").first().fill("字数");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(600);
    const data = await page.evaluate(() => {
      const inputValue = document.querySelector(".search-input")?.value || "";
      const link = document.querySelector('.search-panel a, a[href="/wordcount.html"]');
      return {
        pageTitle: document.title,
        inputValue,
        suggestionText: link?.textContent?.trim().replace(/\s+/g, " ") || "",
        suggestionHref: link?.getAttribute("href") || "",
        suggestionTarget: link?.getAttribute("target") || "",
      };
    });
    return data;
  }

  if (caseId === "wordcount-calc") {
    const input = page.locator("textarea").first();
    await input.fill("天地玄黄\nabc");
    await page.getByRole("button", { name: "确认" }).first().click();
    await page.waitForTimeout(700);

    const data = await page.evaluate(() => {
      const outputs = Array.from(document.querySelectorAll("textarea")).map((item) => item.value || "");
      return {
        pageTitle: document.title,
        inputText: outputs[0] || "",
        outputText: outputs[1] || "",
      };
    });

    return data;
  }

  const basic = await page.evaluate(() => {
    const toolTitle = document.querySelector(".tool-title")?.textContent?.trim() || "";
    const title = document.title;
    const inputCount = document.querySelectorAll("input,textarea,select").length;
    const buttonTexts = Array.from(document.querySelectorAll("button")).map((btn) => btn.textContent?.trim() || "").filter(Boolean).slice(0, 6);
    const firstRecommend = document.querySelector(".recommend-container .title")?.textContent?.trim() || "";
    return {
      pageTitle: title,
      toolTitle,
      inputCount,
      buttonTexts,
      firstRecommend,
      hasToolContainer: !!document.querySelector(".tool-container"),
    };
  });

  return basic;
}

export async function saveScenarioExpected(route, caseId, expected) {
  await mkdir(SCENARIO_DIR, { recursive: true });
  const filePath = path.join(SCENARIO_DIR, `${route.id}-${caseId}.json`);
  await writeFile(
    filePath,
    JSON.stringify(
      {
        routeId: route.id,
        routeName: route.name,
        remotePath: route.remotePath,
        caseId,
        capturedAt: new Date().toISOString(),
        expected,
      },
      null,
      2,
    ),
    "utf8",
  );
  return filePath;
}

async function main() {
  const routes = await loadRoutes();
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of routes) {
    const caseId = getDefaultCaseId(route);
    const expected = await runScenario(page, route, caseId);
    const savedPath = await saveScenarioExpected(route, caseId, expected);
    console.log(`[capture-scenarios] ${route.id}:${caseId} -> ${path.relative(ROOT_DIR, savedPath)}`);
  }

  await context.close();
  await browser.close();
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((error) => {
    console.error("[capture-scenarios] 执行失败", error);
    process.exitCode = 1;
  });
}
