import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const ROUTES_FILE = path.join(ROOT_DIR, "config", "routes.json");
const RAW_HTML_DIR = path.join(ROOT_DIR, "artifacts", "baseline", "raw-html");
const ASSET_MANIFEST_FILE = path.join(ROOT_DIR, "artifacts", "baseline", "asset-manifest.json");
const ORIGIN = "https://tool.browser.qq.com";

const ATTR_PATTERN = /(?:src|href|content)=("|')([^"']+)\1/gi;
const CSS_URL_PATTERN = /url\(([^)]+)\)/gi;

function looksLikeAsset(pathname) {
  return /\.(css|js|png|jpe?g|webp|gif|ico|svg|woff2?|ttf|otf|eot|json|map)$/.test(pathname.toLowerCase()) || pathname === "/favicon.ico";
}

function isIgnorable(raw) {
  return (
    !raw ||
    raw.startsWith("#") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("javascript:") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  );
}

async function loadRoutes() {
  return JSON.parse(await readFile(ROUTES_FILE, "utf8"));
}

async function loadAssetManifest() {
  return JSON.parse(await readFile(ASSET_MANIFEST_FILE, "utf8"));
}

function buildRouteMap(routes) {
  const routeMap = new Map();
  for (const route of routes) {
    routeMap.set(route.remotePath, route.localPath);
  }
  routeMap.set("/", "/index.html");
  routeMap.set("/category/education", "/index.html");
  return routeMap;
}

function normalizeWithOrigin(raw, route) {
  if (isIgnorable(raw)) return null;
  const trimmed = raw.trim().replace(/^['"]|['"]$/g, "");
  if (trimmed.startsWith("//")) {
    return new URL(`https:${trimmed}`);
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return new URL(trimmed);
  }
  if (trimmed.startsWith("/")) {
    return new URL(trimmed, ORIGIN);
  }
  const base = route?.remotePath ? new URL(route.remotePath, ORIGIN) : new URL(ORIGIN);
  return new URL(trimmed, base);
}

function rewriteAssetLinks(html, route, manifest) {
  const rewrittenByAttr = html.replace(ATTR_PATTERN, (full, quote, value) => {
    const absolute = normalizeWithOrigin(value, route);
    if (!absolute) return full;

    const manifestItem = manifest[absolute.toString()];
    if (manifestItem) {
      return full.replace(value, manifestItem.webPath);
    }

    if (absolute.hostname === "tool.browser.qq.com" && looksLikeAsset(absolute.pathname)) {
      return full.replace(value, `/assets/mirror/tool.browser.qq.com${absolute.pathname}`);
    }

    return full;
  });

  const rewrittenCssUrl = rewrittenByAttr.replace(CSS_URL_PATTERN, (full, rawUrl) => {
    const absolute = normalizeWithOrigin(rawUrl, route);
    if (!absolute) return full;

    const manifestItem = manifest[absolute.toString()];
    if (manifestItem) {
      return `url(${manifestItem.webPath})`;
    }

    if (absolute.hostname === "tool.browser.qq.com" && looksLikeAsset(absolute.pathname)) {
      return `url(/assets/mirror/tool.browser.qq.com${absolute.pathname})`;
    }

    return full;
  });

  return rewrittenCssUrl;
}

function rewritePageLinks(html, routeMap) {
  return html.replace(/href=("|')([^"']+)\1/gi, (full, quote, value) => {
    if (isIgnorable(value)) return full;

    let target = value;
    const tryUrl = (() => {
      try {
        return normalizeWithOrigin(value, { remotePath: "/" });
      } catch {
        return null;
      }
    })();

    if (tryUrl && tryUrl.hostname === "tool.browser.qq.com") {
      const mapped = routeMap.get(tryUrl.pathname);
      if (mapped) {
        target = `${mapped}${tryUrl.search}${tryUrl.hash}`;
      }
    } else if (routeMap.has(value)) {
      target = routeMap.get(value);
    }

    return full.replace(value, target);
  });
}

async function writeRecoveredHtml(route, html) {
  const outputFile = path.join(ROOT_DIR, route.localFile);
  await writeFile(outputFile, html, "utf8");
  return outputFile;
}

async function main() {
  const [routes, manifest] = await Promise.all([loadRoutes(), loadAssetManifest()]);
  const routeMap = buildRouteMap(routes);

  for (const route of routes) {
    const rawFile = path.join(RAW_HTML_DIR, route.localFile.replace(/\.html$/, ".raw.html"));
    const html = await readFile(rawFile, "utf8");

    const withAssets = rewriteAssetLinks(html, route, manifest);
    const withLinks = rewritePageLinks(withAssets, routeMap);
    const written = await writeRecoveredHtml(route, withLinks);

    console.log(`[rewrite-html] ${route.remotePath} -> ${path.relative(ROOT_DIR, written)}`);
  }
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((error) => {
    console.error("[rewrite-html] 执行失败", error);
    process.exitCode = 1;
  });
}

export { rewriteAssetLinks, rewritePageLinks, writeRecoveredHtml };
