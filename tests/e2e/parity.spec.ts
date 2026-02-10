import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const ROUTES = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "config", "routes.json"), "utf8"));
const REMOTE_ORIGIN = "https://tool.browser.qq.com";
const SCENARIO_DIR = path.join(ROOT_DIR, "artifacts", "baseline", "scenarios");
const VISUAL_DIR = path.join(ROOT_DIR, "artifacts", "test-results", "visual-diff");

if (!fs.existsSync(VISUAL_DIR)) {
  fs.mkdirSync(VISUAL_DIR, { recursive: true });
}

type Route = {
  id: string;
  name: string;
  remotePath: string;
  localPath: string;
  localFile: string;
};

async function getDomSignature(page: Page) {
  return page.evaluate(() => {
    const text = (selector: string) =>
      Array.from(document.querySelectorAll(selector))
        .map((item) => item.textContent?.trim() || "")
        .filter(Boolean);

    return {
      title: document.title,
      navLabels: text(".category-entry-item span"),
      toolNames: text(".tool-name").slice(0, 20),
      recommendTitles: text(".recommend-container .title").slice(0, 5),
      hasSearchInput: !!document.querySelector(".search-input"),
      hasFooter: !!document.querySelector(".footer-pc"),
    };
  });
}

async function runLocalScenario(page: Page, route: Route, caseId: string) {
  await page.goto(route.localPath, { waitUntil: "networkidle" });

  if (caseId === "home-search-suggestion") {
    await page.locator(".search-input").first().fill("字数");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(600);
    return page.evaluate(() => {
      const link = document.querySelector('.search-panel a, a[href="/wordcount.html"]');
      return {
        pageTitle: document.title,
        inputValue: (document.querySelector(".search-input") as HTMLInputElement | null)?.value || "",
        suggestionText: link?.textContent?.trim().replace(/\s+/g, " ") || "",
        suggestionHref: link?.getAttribute("href") || "",
        suggestionTarget: link?.getAttribute("target") || "",
      };
    });
  }

  if (caseId === "wordcount-calc") {
    await page.locator("textarea").first().fill("天地玄黄\nabc");
    await page.getByRole("button", { name: "确认" }).first().click();
    await page.waitForTimeout(700);
    return page.evaluate(() => {
      const outputs = Array.from(document.querySelectorAll("textarea")).map((item) => (item as HTMLTextAreaElement).value || "");
      return {
        pageTitle: document.title,
        inputText: outputs[0] || "",
        outputText: outputs[1] || "",
      };
    });
  }

  return page.evaluate(() => {
    const toolTitle = document.querySelector(".tool-title")?.textContent?.trim() || "";
    const title = document.title;
    const inputCount = document.querySelectorAll("input,textarea,select").length;
    const buttonTexts = Array.from(document.querySelectorAll("button"))
      .map((btn) => btn.textContent?.trim() || "")
      .filter(Boolean)
      .slice(0, 6);
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
}

function getCaseId(routeId: string) {
  if (routeId === "education-home") return "home-search-suggestion";
  if (routeId === "wordcount") return "wordcount-calc";
  return "basic-structure";
}

async function assertVisualParity(page: Page, route: Route, threshold = 0.1) {
  const remoteUrl = new URL(route.remotePath, REMOTE_ORIGIN).toString();
  await page.goto(remoteUrl, { waitUntil: "networkidle" });
  const remoteBuffer = await page.screenshot({
    fullPage: false,
    mask: [page.locator(".statistics-container")],
  });

  await page.goto(route.localPath, { waitUntil: "networkidle" });
  const localBuffer = await page.screenshot({
    fullPage: false,
    mask: [page.locator(".statistics-container")],
  });

  const remotePng = PNG.sync.read(remoteBuffer);
  const localPng = PNG.sync.read(localBuffer);

  if (remotePng.width !== localPng.width || remotePng.height !== localPng.height) {
    throw new Error(`截图尺寸不一致: remote=${remotePng.width}x${remotePng.height}, local=${localPng.width}x${localPng.height}`);
  }

  const diff = new PNG({ width: remotePng.width, height: remotePng.height });
  const mismatchPixels = pixelmatch(remotePng.data, localPng.data, diff.data, remotePng.width, remotePng.height, {
    threshold: 0.2,
  });
  const totalPixels = remotePng.width * remotePng.height;
  const ratio = mismatchPixels / totalPixels;

  if (ratio > threshold) {
    const diffPath = path.join(VISUAL_DIR, `${route.id}-diff.png`);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }

  expect(ratio, `${route.id} 视觉差异超阈值`).toBeLessThanOrEqual(threshold);
}

async function assertDomParity(page: Page, route: Route) {
  await page.goto(new URL(route.remotePath, REMOTE_ORIGIN).toString(), { waitUntil: "networkidle" });
  const remoteDom = await getDomSignature(page);

  await page.goto(route.localPath, { waitUntil: "networkidle" });
  const localDom = await getDomSignature(page);

  expect(localDom.title).toBe(remoteDom.title);
  expect(localDom.hasSearchInput).toBe(remoteDom.hasSearchInput);
  expect(localDom.hasFooter).toBe(remoteDom.hasFooter);
  expect(localDom.navLabels).toEqual(remoteDom.navLabels);
  expect(localDom.toolNames).toEqual(remoteDom.toolNames);
  expect(localDom.recommendTitles).toEqual(remoteDom.recommendTitles);
}

async function assertScenarioParity(page: Page, route: Route, caseId: string) {
  const expectedPath = path.join(SCENARIO_DIR, `${route.id}-${caseId}.json`);
  const baseline = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
  const actual = await runLocalScenario(page, route, caseId);

  if (caseId === "home-search-suggestion") {
    expect(actual.pageTitle).toBe(baseline.expected.pageTitle);
    expect(actual.inputValue).toBe(baseline.expected.inputValue);
    expect(actual.suggestionHref).toBe(baseline.expected.suggestionHref);
    expect(actual.suggestionTarget).toBe(baseline.expected.suggestionTarget);
    return;
  }

  if (caseId === "wordcount-calc") {
    expect(actual.pageTitle).toBe(baseline.expected.pageTitle);
    expect(actual.inputText).toBe(baseline.expected.inputText);
    expect(actual.outputText).toBe(baseline.expected.outputText);
    return;
  }

  expect(actual.pageTitle).toBe(baseline.expected.pageTitle);
  expect(actual.toolTitle).toBe(baseline.expected.toolTitle);
  expect(actual.hasToolContainer).toBe(baseline.expected.hasToolContainer);
}

test.describe("线上与本地一致性", () => {
  for (const route of ROUTES as Route[]) {
    test(`${route.id} 一致性验证`, async ({ page }) => {
      await assertVisualParity(page, route, 0.12);
      await assertDomParity(page, route);
      const caseId = getCaseId(route.id);
      await assertScenarioParity(page, route, caseId);
    });
  }
});
