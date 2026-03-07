#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const absoluteMediaPattern = /(https?:\/\/|\/\/)[^"'()\s]+?\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|avif)(\?[^"'()\s]*)?/gi;

async function collectFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath, extensions));
      continue;
    }
    if (extensions.some((extension) => entry.name.endsWith(extension))) {
      files.push(entryPath);
    }
  }

  return files;
}

function getMediaLocalPath(url) {
  const absolute = url.startsWith('//') ? `https:${url}` : url;
  const parsed = new URL(absolute);
  return path.join(rootDir, 'assets/legacy/media', parsed.hostname, parsed.pathname);
}

async function downloadMedia(url) {
  const absolute = url.startsWith('//') ? `https:${url}` : url;
  const targetPath = getMediaLocalPath(absolute);
  try {
    await stat(targetPath);
    return;
  } catch {
    const response = await fetch(absolute, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });
    if (!response.ok) {
      throw new Error(`下载媒体资源失败: ${absolute} (${response.status})`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, buffer);
  }
}

function replaceMediaUrls(content, filePath) {
  const prefix = filePath.endsWith('.css') ? '../media' : './assets/legacy/media';
  let nextContent = content.replace(absoluteMediaPattern, (match) => {
    const absolute = match.startsWith('//') ? `https:${match}` : match;
    const parsed = new URL(absolute);
    return `${prefix}/${parsed.hostname}${parsed.pathname}`;
  });

  return nextContent;
}

async function main() {
  const files = [
    ...await collectFiles(path.join(rootDir, 'assets/legacy/css'), ['.css']),
    ...await collectFiles(path.join(rootDir, 'assets/legacy/js'), ['.js']),
    ...await collectFiles(path.join(rootDir, 'recovered/raw'), ['.html'])
  ];

  const mediaUrls = new Set();

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    absoluteMediaPattern.lastIndex = 0;

    let absoluteMatch = absoluteMediaPattern.exec(content);
    while (absoluteMatch) {
      mediaUrls.add(absoluteMatch[0].startsWith('//') ? `https:${absoluteMatch[0]}` : absoluteMatch[0]);
      absoluteMatch = absoluteMediaPattern.exec(content);
    }

  }

  for (const url of mediaUrls) {
    await downloadMedia(url);
  }

  for (const file of files.filter((entry) => entry.includes(`${path.sep}assets${path.sep}legacy${path.sep}`))) {
    const content = await readFile(file, 'utf8');
    const nextContent = file.endsWith('.js')
      ? content.replace(absoluteMediaPattern, (match) => {
          const absolute = match.startsWith('//') ? `https:${match}` : match;
          const parsed = new URL(absolute);
          return `./assets/legacy/media/${parsed.hostname}${parsed.pathname}`;
        })
      : replaceMediaUrls(content, file);
    await writeFile(file, nextContent, 'utf8');
  }
}

await main();
