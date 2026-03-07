#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function toJsAssignment(name, value) {
  return `window.__QBTOOL_FIXTURES__ = window.__QBTOOL_FIXTURES__ || {};\nwindow.__QBTOOL_FIXTURES__.${name} = ${JSON.stringify(value, null, 2)};\n`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });
  if (!response.ok) {
    throw new Error(`抓取 fixture 失败: ${url} (${response.status})`);
  }
  return response.json();
}

async function captureStatisticsFallback() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://tool.browser.qq.com/category/education', { waitUntil: 'networkidle' });
  const text = await page.locator('body').innerText();
  await browser.close();

  const matched = text.match(/工具箱已累计帮助了\s*(\d+)\s*人次/);
  return {
    date: '2026-03-06',
    count: matched ? matched[1] : '367174539'
  };
}

async function main() {
  await mkdir(path.join(rootDir, 'assets/data'), { recursive: true });

  const toolList = await fetchJson('https://tool.browser.qq.com/api/get_tool_list');
  const token = await fetchJson('https://tool.browser.qq.com/api/getToken');
  const loginInfo = await fetchJson('https://tool.browser.qq.com/api/getLoginInfo?userInfo=%7B%22guid%22:%22aaaa11s1bunt0wthu20q5d8rcmz788cb%22,%22qua2%22:%22PR%3DPC%26CO%3DWBK%26QV%3D3%26PL%3DMAC%26PB%3DGE%26PPVN%3D%26COVC%3D049400%26CHID%3D43653%26RL%3D2560*1440%26MO%3DQB%26VE%3DB1%26BIT%3D64%26OS%3D10.0.18362%22%7D');
  const statisticsFallback = await captureStatisticsFallback();

  await writeFile(path.join(rootDir, 'assets/data/tool-list.js'), toJsAssignment('toolList', toolList), 'utf8');
  await writeFile(path.join(rootDir, 'assets/data/shared-stubs.js'), toJsAssignment('sharedStubs', {
    token,
    loginInfo,
    emptySuccess: { ret: 0, msg: 'succ' },
    emptyText: 'succ'
  }), 'utf8');
  await writeFile(path.join(rootDir, 'assets/data/statistics-fallback.js'), toJsAssignment('statisticsFallback', statisticsFallback), 'utf8');
}

await main();
