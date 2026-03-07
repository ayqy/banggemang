#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const renderMode = process.argv.includes('--render');

const pages = [
  { id: 'index', file: 'index.html', remoteUrl: 'https://tool.browser.qq.com/category/education' },
  { id: 'handwriting_erasure', file: 'handwriting_erasure.html', remoteUrl: 'https://tool.browser.qq.com/handwriting_erasure.html' },
  { id: 'zitie_new', file: 'zitie_new.html', remoteUrl: 'https://tool.browser.qq.com/zitie_new.html' },
  { id: 'relatives_name', file: 'relatives_name.html', remoteUrl: 'https://tool.browser.qq.com/relatives_name.html' },
  { id: 'school', file: 'school.html', remoteUrl: 'https://tool.browser.qq.com/school.html' },
  { id: 'wordcount', file: 'wordcount.html', remoteUrl: 'https://tool.browser.qq.com/wordcount.html' },
  { id: 'dynasties', file: 'dynasties.html', remoteUrl: 'https://tool.browser.qq.com/dynasties.html' },
  { id: 'capital', file: 'capital.html', remoteUrl: 'https://tool.browser.qq.com/capital.html' },
  { id: 'jielong', file: 'jielong.html', remoteUrl: 'https://tool.browser.qq.com/jielong.html' },
  { id: 'markmap', file: 'markmap.html', remoteUrl: 'https://tool.browser.qq.com/markmap.html' },
  { id: 'hanzifayin', file: 'hanzifayin.html', remoteUrl: 'https://tool.browser.qq.com/hanzifayin.html' },
  { id: 'periodic', file: 'periodic.html', remoteUrl: 'https://tool.browser.qq.com/periodic.html' },
  { id: 'translate', file: 'translate.html', remoteUrl: 'https://tool.browser.qq.com/translate.html' },
  { id: 'radical', file: 'radical.html', remoteUrl: 'https://tool.browser.qq.com/radical.html' },
  { id: 'allegory', file: 'allegory.html', remoteUrl: 'https://tool.browser.qq.com/allegory.html' },
  { id: 'explain', file: 'explain.html', remoteUrl: 'https://tool.browser.qq.com/explain.html' },
  { id: 'chengyujielong', file: 'chengyujielong.html', remoteUrl: 'https://tool.browser.qq.com/chengyujielong.html' }
];

const localPageMap = {
  '/': './index.html',
  '/category/education': './index.html',
  '/handwriting_erasure.html': './handwriting_erasure.html',
  '/zitie_new.html': './zitie_new.html',
  '/relatives_name.html': './relatives_name.html',
  '/school.html': './school.html',
  '/wordcount.html': './wordcount.html',
  '/dynasties.html': './dynasties.html',
  '/capital.html': './capital.html',
  '/jielong.html': './jielong.html',
  '/markmap.html': './markmap.html',
  '/hanzifayin.html': './hanzifayin.html',
  '/periodic.html': './periodic.html',
  '/translate.html': './translate.html',
  '/radical.html': './radical.html',
  '/allegory.html': './allegory.html',
  '/explain.html': './explain.html',
  '/chengyujielong.html': './chengyujielong.html'
};

const shimScripts = [
  './assets/data/tool-list.js',
  './assets/data/shared-stubs.js',
  './assets/data/statistics-fallback.js',
  './assets/shims/link-map.js',
  './assets/shims/runtime-bootstrap.js'
];

async function ensureDirectories() {
  await Promise.all([
    mkdir(path.join(rootDir, 'assets/legacy/css'), { recursive: true }),
    mkdir(path.join(rootDir, 'assets/legacy/js'), { recursive: true }),
    mkdir(path.join(rootDir, 'assets/legacy/media'), { recursive: true })
  ]);
}

function normalizeUrl(candidate, baseUrl) {
  if (!candidate) return null;
  const trimmed = candidate.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('javascript:') || trimmed.startsWith('#')) {
    return null;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith('/')) {
    return new URL(trimmed, 'https://tool.browser.qq.com').toString();
  }
  return new URL(trimmed, baseUrl).toString();
}

function getLocalAssetPath(url) {
  const parsed = new URL(url);
  const pathname = parsed.pathname;

  if (/\/qbtool\/css\//.test(pathname)) {
    return `assets/legacy/css/${path.basename(pathname).replace(/\.[0-9a-f]+\.css$/i, '.css')}`;
  }

  if (/\/qbtool\/manifest\//.test(pathname)) {
    return 'assets/legacy/js/manifest.js';
  }

  if (/\/qbtool\/js\//.test(pathname)) {
    return `assets/legacy/js/${path.basename(pathname).replace(/\.[0-9a-f]+\.js$/i, '.js')}`;
  }

  return `assets/legacy/media/${parsed.hostname}${pathname}`;
}

function normalizeCssUrls(content, remoteUrl) {
  return content.replace(/url\(([^)]+)\)/g, (match, rawUrl) => {
    const cleanUrl = rawUrl.trim().replace(/^['\"]|['\"]$/g, '');
    if (!cleanUrl || cleanUrl.startsWith('data:') || cleanUrl.startsWith('#')) {
      return match;
    }
    const absolute = normalizeUrl(cleanUrl, remoteUrl);
    return absolute ? `url("${absolute}")` : match;
  });
}

async function downloadTextAsset(url, localPath) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });
  if (!response.ok) {
    throw new Error(`镜像资源失败: ${url} (${response.status})`);
  }
  let content = await response.text();
  if (localPath.endsWith('.css')) {
    content = normalizeCssUrls(content, url);
  }
  await mkdir(path.dirname(path.join(rootDir, localPath)), { recursive: true });
  await writeFile(path.join(rootDir, localPath), content, 'utf8');
}

function collectAssetUrls(html, baseUrl) {
  const urls = new Set();
  const patterns = [
    /<link[^>]+href=["']([^"']+)["'][^>]*>/gi,
    /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(html);
    while (match) {
      const absolute = normalizeUrl(match[1], baseUrl);
      if (absolute && /\.(css|js)(\?|$)/i.test(absolute)) {
        urls.add(absolute);
      }
      match = pattern.exec(html);
    }
  }

  return [...urls];
}

function rewriteStaticAssets(html, assetUrlMap) {
  let nextHtml = html;
  for (const [remoteUrl, localPath] of assetUrlMap.entries()) {
    const escaped = remoteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const protocolRelative = remoteUrl.replace(/^https:/, '');
    nextHtml = nextHtml.replace(new RegExp(escaped, 'g'), `./${localPath}`);
    nextHtml = nextHtml.replace(new RegExp(protocolRelative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `./${localPath}`);
  }
  return nextHtml;
}

function rewriteAnchors(html) {
  return html.replace(/href=(["'])([^"']+)\1/gi, (match, quote, value) => {
    if (value.startsWith('javascript:') || value.startsWith('#') || value.startsWith('http://') || value.startsWith('https://')) {
      return match;
    }
    const pathname = value.startsWith('/') ? value : new URL(value, 'https://tool.browser.qq.com').pathname;
    if (localPageMap[pathname]) {
      return `href=${quote}${localPageMap[pathname]}${quote}`;
    }
    if (pathname.startsWith('/')) {
      return `href=${quote}https://tool.browser.qq.com${pathname}${quote}`;
    }
    return match;
  });
}

function rewriteMediaUrlsToLocal(html) {
  return html
    .replace(/(https?:\/\/|\/\/)([^"'()\s>]+\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|avif)(\?[^"'()\s>]*)?)/gi, (match) => {
      const absolute = match.startsWith('//') ? `https:${match}` : match;
      const parsed = new URL(absolute);
      return `./assets/legacy/media/${parsed.hostname}${parsed.pathname}`;
    })
    .replace(/(["'(])\/(.+?\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|avif))(\?[^"'()\s>]*)?(["')])/gi, (match, start, pathname, _query, end) => {
      return `${start}./assets/legacy/media/tool.browser.qq.com/${pathname}${end}`;
    });
}

function injectShims(html) {
  if (html.includes('./assets/shims/runtime-bootstrap.js')) {
    return html;
  }
  const tagBlock = shimScripts.map((source) => `<script src="${source}"></script>`).join('');
  return html.replace(/<script[^>]+src=["'][^"']+["'][^>]*><\/script>/i, (match) => `${tagBlock}${match}`);
}

function buildHandwritingShell() {
  return `<html><head><meta charset="utf-8"><title>去手写-帮小忙，腾讯QQ浏览器在线工具箱</title><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,\"PingFang SC\",\"Microsoft YaHei\",sans-serif}iframe{display:block;width:100%;height:100%;border:0}#fallback{display:none;position:fixed;left:50%;bottom:40px;transform:translateX(-50%);z-index:10;background:rgba(33,40,53,.88);color:#fff;text-decoration:none;padding:12px 16px;border-radius:12px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.24)}#fallback a{color:#9ed0ff}</style></head><body><iframe id="tool-frame" src="https://tool.browser.qq.com/handwriting_erasure.html" allow="clipboard-read; clipboard-write"></iframe><div id="fallback">线上页面加载失败，请 <a href="https://tool.browser.qq.com/handwriting_erasure.html" target="_blank" rel="noreferrer">直接打开线上页</a></div><script>const frame=document.getElementById('tool-frame');const fallback=document.getElementById('fallback');const timer=setTimeout(()=>{if(!frame.dataset.loaded){fallback.style.display='block';}},10000);frame.addEventListener('load',()=>{frame.dataset.loaded='1';clearTimeout(timer);});frame.addEventListener('error',()=>{fallback.style.display='block';});</script></body></html>`;
}

async function main() {
  await ensureDirectories();
  const assetUrlMap = new Map();

  for (const page of pages) {
    const html = await readFile(path.join(rootDir, 'recovered/raw', `${page.id}.html`), 'utf8');
    const urls = collectAssetUrls(html, page.remoteUrl);
    for (const url of urls) {
      if (assetUrlMap.has(url)) {
        continue;
      }
      const localPath = getLocalAssetPath(url);
      assetUrlMap.set(url, localPath);
      await downloadTextAsset(url, localPath);
    }
  }

  if (!renderMode) {
    return;
  }

  for (const page of pages) {
    if (page.id === 'handwriting_erasure') {
      await writeFile(path.join(rootDir, page.file), buildHandwritingShell(), 'utf8');
      continue;
    }

    let html = await readFile(path.join(rootDir, 'recovered/raw', `${page.id}.html`), 'utf8');
    html = rewriteStaticAssets(html, assetUrlMap);
    html = rewriteAnchors(html);
    html = rewriteMediaUrlsToLocal(html);
    html = injectShims(html);
    await writeFile(path.join(rootDir, page.file), html, 'utf8');
  }
}

await main();
