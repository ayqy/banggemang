import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const ROUTES_FILE = path.join(ROOT_DIR, "config", "routes.json");
const RAW_HTML_DIR = path.join(ROOT_DIR, "artifacts", "baseline", "raw-html");
const ORIGIN = "https://tool.browser.qq.com";

export async function loadRouteConfig() {
  const raw = await readFile(ROUTES_FILE, "utf8");
  const routes = JSON.parse(raw);
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("config/routes.json 未包含有效路由");
  }
  return routes;
}

export async function fetchRouteHtml(route) {
  const url = new URL(route.remotePath, ORIGIN).toString();
  const response = await fetch(url, {
    headers: {
      "user-agent": "banggemang-recovery/1.0",
    },
  });
  if (!response.ok) {
    throw new Error(`抓取失败: ${route.remotePath} -> ${response.status}`);
  }
  return response.text();
}

export async function saveRawHtml(route, html) {
  await mkdir(RAW_HTML_DIR, { recursive: true });
  const rawName = route.localFile.replace(/\.html$/, ".raw.html");
  const htmlPath = path.join(RAW_HTML_DIR, rawName);
  const metaPath = path.join(RAW_HTML_DIR, route.localFile.replace(/\.html$/, ".meta.json"));
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  await writeFile(htmlPath, html, "utf8");
  await writeFile(
    metaPath,
    JSON.stringify(
      {
        id: route.id,
        name: route.name,
        remotePath: route.remotePath,
        localFile: route.localFile,
        fetchedAt: new Date().toISOString(),
        title: titleMatch ? titleMatch[1].trim() : "",
      },
      null,
      2,
    ),
    "utf8",
  );
  return htmlPath;
}

async function main() {
  const routes = await loadRouteConfig();
  for (const route of routes) {
    const html = await fetchRouteHtml(route);
    const savedPath = await saveRawHtml(route, html);
    console.log(`[fetch-pages] ${route.remotePath} -> ${path.relative(ROOT_DIR, savedPath)}`);
  }
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((error) => {
    console.error("[fetch-pages] 执行失败", error);
    process.exitCode = 1;
  });
}
