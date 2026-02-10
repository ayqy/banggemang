import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
const QBTOOL_ASSET_DIR = path.join(ROOT_DIR, "assets", "mirror", "static.res.qq.com", "qbtool");

export async function patchWebpackPublicPath(filePath, localBase) {
  const source = await readFile(filePath, "utf8");
  const patched = source.replace(/([a-zA-Z_$][\w$]*\.p=)"https:\/\/static\.res\.qq\.com\/qbtool\//g, `$1"${localBase}`);
  if (patched !== source) {
    await writeFile(filePath, patched, "utf8");
    return true;
  }
  return false;
}

export async function patchAbsoluteHostReferences(filePath, hostMap) {
  let source = await readFile(filePath, "utf8");
  let changed = false;

  for (const [originHost, localHost] of Object.entries(hostMap)) {
    if (!source.includes(originHost)) continue;
    source = source.split(originHost).join(localHost);
    changed = true;
  }

  if (changed) {
    await writeFile(filePath, source, "utf8");
  }

  return changed;
}

async function listFiles(rootDir) {
  const files = [];
  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  const rootStat = await stat(rootDir);
  if (!rootStat.isDirectory()) {
    throw new Error(`资源目录不存在: ${rootDir}`);
  }

  await walk(rootDir);
  return files;
}

async function main() {
  const files = await listFiles(QBTOOL_ASSET_DIR);
  const localBase = "/assets/mirror/static.res.qq.com/qbtool/";
  const hostMap = {
    "https://static.res.qq.com": "/assets/mirror/static.res.qq.com",
    "http://static.res.qq.com": "/assets/mirror/static.res.qq.com",
    "https://m4.publicimg.browser.qq.com": "/assets/mirror/m4.publicimg.browser.qq.com",
    "http://m4.publicimg.browser.qq.com": "/assets/mirror/m4.publicimg.browser.qq.com",
    "https://tool.browser.qq.com": "",
    "http://tool.browser.qq.com": "",
  };

  let patchedCount = 0;
  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (![".js", ".css"].includes(ext)) continue;

    let changed = false;
    if (ext === ".js") {
      const publicPathChanged = await patchWebpackPublicPath(filePath, localBase);
      changed = publicPathChanged || changed;
    }

    const hostChanged = await patchAbsoluteHostReferences(filePath, hostMap);
    changed = hostChanged || changed;

    if (changed) {
      patchedCount += 1;
      console.log(`[patch-runtime] ${path.relative(ROOT_DIR, filePath)}`);
    }
  }

  console.log(`[patch-runtime] 完成，共修补 ${patchedCount} 个文件`);
}

if (import.meta.url === `file://${__filename}`) {
  main().catch((error) => {
    console.error("[patch-runtime] 执行失败", error);
    process.exitCode = 1;
  });
}
