import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const ROUTES_FILE = path.join(ROOT_DIR, "config", "routes.json");
const RAW_HTML_DIR = path.join(ROOT_DIR, "artifacts", "baseline", "raw-html");
const ASSET_ROOT = path.join(ROOT_DIR, "assets", "mirror");
const ORIGIN = "https://tool.browser.qq.com";
const ASSET_MANIFEST_FILE = path.join(ROOT_DIR, "artifacts", "baseline", "asset-manifest.json");

const ALLOWED_HOSTS = new Set([
  "static.res.qq.com",
  "m4.publicimg.browser.qq.com",
  "tool.browser.qq.com",
]);

const URL_ATTR_PATTERN = /(?:src|href|content)=("|')([^"']+)\1/gi;
const CSS_URL_PATTERN = /url\(([^)]+)\)/gi;

const TEXT_EXTENSIONS = new Set([".css", ".js", ".html", ".txt", ".svg", ".json", ".map"]);

function sanitizeQuery(search) {
  if (!search) return "";
  return `__q_${createHash("md5").update(search).digest("hex").slice(0, 10)}`;
}

function isIgnorableUrl(rawUrl) {
  return (
    !rawUrl ||
    rawUrl.startsWith("#") ||
    rawUrl.startsWith("data:") ||
    rawUrl.startsWith("blob:") ||
    rawUrl.startsWith("javascript:") ||
    rawUrl.startsWith("mailto:") ||
    rawUrl.startsWith("tel:") ||
    rawUrl.startsWith("/assets/mirror/") ||
    rawUrl.includes("assets/mirror/")
  );
}

function looksLikeAsset(absoluteUrl) {
  const pathname = absoluteUrl.pathname.toLowerCase();
  return /\.(css|js|png|jpe?g|webp|gif|ico|svg|woff2?|ttf|otf|eot|json|map)$/.test(pathname) || pathname === "/favicon.ico";
}

function toAssetLocalPath(absoluteUrl) {
  const hostPart = absoluteUrl.hostname;
  const cleanPath = absoluteUrl.pathname.replace(/^\//, "") || "index";
  const ext = path.extname(cleanPath);
  const withQuery = sanitizeQuery(absoluteUrl.search);
  const fileName = withQuery
    ? cleanPath.replace(new RegExp(`${ext}$`), `${withQuery}${ext}`)
    : cleanPath;
  return path.join(ASSET_ROOT, hostPart, fileName);
}

function toAssetWebPath(absoluteUrl) {
  const hostPart = absoluteUrl.hostname;
  const cleanPath = absoluteUrl.pathname.replace(/^\//, "") || "index";
  const ext = path.extname(cleanPath);
  const withQuery = sanitizeQuery(absoluteUrl.search);
  const fileName = withQuery
    ? cleanPath.replace(new RegExp(`${ext}$`), `${withQuery}${ext}`)
    : cleanPath;
  return `/assets/mirror/${hostPart}/${fileName}`;
}

async function readRoutes() {
  const raw = await readFile(ROUTES_FILE, "utf8");
  return JSON.parse(raw);
}

function normalizeAssetUrl(rawUrl, route) {
  const trimmed = (rawUrl || "").trim().replace(/^['"]|['"]$/g, "");
  if (isIgnorableUrl(trimmed)) return null;
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

function extractAssetUrls(html) {
  const found = [];
  let match;
  while ((match = URL_ATTR_PATTERN.exec(html)) !== null) {
    found.push(match[2]);
  }
  while ((match = CSS_URL_PATTERN.exec(html)) !== null) {
    found.push(match[1]);
  }
  return found;
}

async function downloadAsset(assetUrl, localPath) {
  await mkdir(path.dirname(localPath), { recursive: true });
  const response = await fetch(assetUrl.toString(), {
    headers: {
      "user-agent": "banggemang-recovery/1.0",
      referer: ORIGIN,
    },
  });
  if (!response.ok) {
    throw new Error(`下载资源失败: ${assetUrl} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(localPath, buffer);
  return buffer;
}

function decodeText(buffer, localPath) {
  const ext = path.extname(localPath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) return null;
  return buffer.toString("utf8");
}

function extractCssUrls(cssText) {
  const urls = [];
  let match;
  while ((match = CSS_URL_PATTERN.exec(cssText)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function main() {
  const routes = await readRoutes();
  const queue = [];
  const visited = new Set();
  const manifest = {};

  for (const route of routes) {
    const rawFile = path.join(RAW_HTML_DIR, route.localFile.replace(/\.html$/, ".raw.html"));
    const html = await readFile(rawFile, "utf8");
    const assets = extractAssetUrls(html);
    for (const rawUrl of assets) {
      const normalized = normalizeAssetUrl(rawUrl, route);
      if (!normalized) continue;
      if (!ALLOWED_HOSTS.has(normalized.hostname)) continue;
      if (!looksLikeAsset(normalized)) continue;
      queue.push({ url: normalized, routeRemotePath: route.remotePath });
    }
  }

  while (queue.length > 0) {
    const { url, routeRemotePath } = queue.shift();
    const key = url.toString();
    if (visited.has(key)) continue;
    visited.add(key);

    if (!ALLOWED_HOSTS.has(url.hostname) || !looksLikeAsset(url)) {
      continue;
    }

    const localPath = toAssetLocalPath(url);
    let buffer;
    if (fs.existsSync(localPath)) {
      buffer = await readFile(localPath);
    } else {
      try {
        buffer = await downloadAsset(url, localPath);
        console.log(`[download-assets] ${url} -> ${path.relative(ROOT_DIR, localPath)}`);
      } catch (error) {
        console.warn(`[download-assets] 跳过失败资源: ${url} (${error.message})`);
        continue;
      }
    }

    manifest[key] = {
      localPath: path.relative(ROOT_DIR, localPath),
      webPath: toAssetWebPath(url),
      routeRemotePath,
    };

    const text = decodeText(buffer, localPath);
    if (!text || path.extname(localPath).toLowerCase() !== ".css") {
      continue;
    }

    const cssUrls = extractCssUrls(text);
    for (const cssRawUrl of cssUrls) {
      const normalized = normalizeAssetUrl(cssRawUrl, { remotePath: url.pathname });
      if (!normalized) continue;
      if (!ALLOWED_HOSTS.has(normalized.hostname)) continue;
      if (!looksLikeAsset(normalized)) continue;
      queue.push({ url: normalized, routeRemotePath });
    }
  }

  await writeFile(ASSET_MANIFEST_FILE, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[download-assets] 总资源数: ${Object.keys(manifest).length}`);
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((error) => {
    console.error("[download-assets] 执行失败", error);
    process.exitCode = 1;
  });
}

export { extractAssetUrls, normalizeAssetUrl, downloadAsset };
