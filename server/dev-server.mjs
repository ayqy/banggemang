import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PROXY_RULES_FILE = path.join(ROOT_DIR, "config", "proxy-rules.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function safeJoin(rootDir, requestPath) {
  const safePath = path
    .normalize(requestPath)
    .replace(/^\.+/, "")
    .replace(/^\//, "");
  return path.join(rootDir, safePath);
}

function sendNotFound(res) {
  res.statusCode = 404;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.end("Not Found");
}

export function createStaticServer(rootDir) {
  return async (req, res, urlInfo) => {
    let pathname = urlInfo.pathname;
    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = safeJoin(rootDir, pathname);
    if (!existsSync(filePath)) {
      return false;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.statusCode = 200;
    res.setHeader("content-type", contentType);
    createReadStream(filePath).pipe(res);
    return true;
  };
}

async function collectRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function createReverseProxy(upstream) {
  return async (req, res, urlInfo) => {
    const targetUrl = new URL(urlInfo.pathname + urlInfo.search, upstream);
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : await collectRequestBody(req);

    const headers = { ...req.headers };
    delete headers.host;
    if (body) {
      headers["content-length"] = String(body.length);
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    res.statusCode = upstreamResponse.status;
    upstreamResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "content-encoding") return;
      res.setHeader(key, value);
    });

    const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
    res.end(responseBuffer);
  };
}

async function loadProxyRules() {
  const raw = await readFile(PROXY_RULES_FILE, "utf8");
  return JSON.parse(raw);
}

export async function startServer(port = 8080) {
  const proxyRules = await loadProxyRules();
  const staticHandler = createStaticServer(ROOT_DIR);
  const proxyHandler = createReverseProxy(proxyRules.upstream);

  const server = http.createServer(async (req, res) => {
    try {
      const urlInfo = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
      const shouldProxy = proxyRules.prefixes.some((prefix) => urlInfo.pathname.startsWith(prefix));

      if (shouldProxy) {
        await proxyHandler(req, res, urlInfo);
        return;
      }

      const served = await staticHandler(req, res, urlInfo);
      if (!served) {
        sendNotFound(res);
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end(`Server Error: ${error.message}`);
    }
  });

  await new Promise((resolve) => {
    server.listen(port, () => resolve());
  });

  console.log(`[dev-server] 已启动: http://127.0.0.1:${port}`);
  return server;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  const port = Number(process.env.PORT || 8080);
  startServer(port).catch((error) => {
    console.error("[dev-server] 启动失败", error);
    process.exitCode = 1;
  });
}
