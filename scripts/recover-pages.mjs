#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const isAuditMode = process.argv.includes('--audit');

const pages = [
  { id: 'index', file: 'index.html', remoteUrl: 'https://tool.browser.qq.com/category/education', title: '帮小忙，腾讯QQ浏览器在线工具箱平台' },
  { id: 'handwriting_erasure', file: 'handwriting_erasure.html', remoteUrl: 'https://tool.browser.qq.com/handwriting_erasure.html', title: '去手写-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'zitie_new', file: 'zitie_new.html', remoteUrl: 'https://tool.browser.qq.com/zitie_new.html', title: '字帖生成-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'relatives_name', file: 'relatives_name.html', remoteUrl: 'https://tool.browser.qq.com/relatives_name.html', title: '亲戚关系计算-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'school', file: 'school.html', remoteUrl: 'https://tool.browser.qq.com/school.html', title: '高校查询-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'wordcount', file: 'wordcount.html', remoteUrl: 'https://tool.browser.qq.com/wordcount.html', title: '字数计算-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'dynasties', file: 'dynasties.html', remoteUrl: 'https://tool.browser.qq.com/dynasties.html', title: '历史朝代查询-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'capital', file: 'capital.html', remoteUrl: 'https://tool.browser.qq.com/capital.html', title: '各国首都-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'jielong', file: 'jielong.html', remoteUrl: 'https://tool.browser.qq.com/jielong.html', title: '成语接龙-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'markmap', file: 'markmap.html', remoteUrl: 'https://tool.browser.qq.com/markmap.html', title: '便捷思维导图-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'hanzifayin', file: 'hanzifayin.html', remoteUrl: 'https://tool.browser.qq.com/hanzifayin.html', title: '汉字标准发音-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'periodic', file: 'periodic.html', remoteUrl: 'https://tool.browser.qq.com/periodic.html', title: '元素周期表-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'translate', file: 'translate.html', remoteUrl: 'https://tool.browser.qq.com/translate.html', title: '翻译-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'radical', file: 'radical.html', remoteUrl: 'https://tool.browser.qq.com/radical.html', title: '汉字偏旁-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'allegory', file: 'allegory.html', remoteUrl: 'https://tool.browser.qq.com/allegory.html', title: '歇后语-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'explain', file: 'explain.html', remoteUrl: 'https://tool.browser.qq.com/explain.html', title: '词语注解-帮小忙，腾讯QQ浏览器在线工具箱' },
  { id: 'chengyujielong', file: 'chengyujielong.html', remoteUrl: 'https://tool.browser.qq.com/chengyujielong.html', title: '成语大全-帮小忙，腾讯QQ浏览器在线工具箱' }
];

const pageStrategies = {
  index: '本地镜像恢复',
  handwriting_erasure: '本地壳页 + 全屏 iframe',
  zitie_new: '本地镜像恢复',
  relatives_name: '本地镜像恢复',
  school: '本地镜像恢复',
  wordcount: '本地镜像恢复',
  dynasties: '本地镜像恢复',
  capital: '本地镜像恢复',
  jielong: '本地镜像恢复',
  markmap: '本地镜像恢复（保留 quirks mode）',
  hanzifayin: '本地镜像恢复',
  periodic: '本地镜像恢复',
  translate: '本地镜像恢复 + 第三方 iframe',
  radical: '本地镜像恢复',
  allegory: '本地镜像恢复',
  explain: '本地镜像恢复',
  chengyujielong: '本地镜像恢复'
};

async function ensureDirectories() {
  const directories = [
    'recovered/raw',
    'assets/legacy/html',
    'docs/audit',
    'docs/audit/screenshots/live',
    'docs/audit/dom',
    'docs/audit/network'
  ];
  await Promise.all(directories.map((directory) => mkdir(path.join(rootDir, directory), { recursive: true })));
}

function fetchWithHeaders(url) {
  return fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });
}

async function recoverPages() {
  for (const page of pages) {
    const response = await fetchWithHeaders(page.remoteUrl);
    if (!response.ok) {
      throw new Error(`抓取页面失败: ${page.remoteUrl} (${response.status})`);
    }
    const html = await response.text();
    await writeFile(path.join(rootDir, 'recovered/raw', `${page.id}.html`), html, 'utf8');
    await writeFile(path.join(rootDir, 'assets/legacy/html', `${page.id}.html`), html, 'utf8');
  }
}

async function runAuditAction(pageId, page) {
  switch (pageId) {
    case 'index':
      await page.getByRole('textbox').fill('翻译');
      await page.waitForTimeout(400);
      break;
    case 'radical':
      await page.getByRole('textbox', { name: '输入需要查询偏旁文字' }).fill('明');
      await page.getByRole('button', { name: '查询' }).click();
      await page.waitForTimeout(300);
      break;
    case 'wordcount':
      await page.getByRole('textbox', { name: '请输入' }).fill('中国abc');
      await page.getByRole('button', { name: '确认' }).click();
      await page.waitForTimeout(300);
      break;
    case 'chengyujielong':
      await page.getByRole('textbox', { name: '成语查询' }).fill('美');
      await page.getByRole('button', { name: '查询' }).click();
      await page.waitForTimeout(300);
      break;
    case 'allegory':
      await page.getByRole('textbox', { name: '歇后语' }).fill('猫');
      await page.getByRole('button', { name: '歇后语查询' }).click();
      await page.waitForTimeout(300);
      break;
    case 'explain':
      await page.getByRole('textbox', { name: '请输入查询汉词' }).fill('学习');
      await page.getByRole('button', { name: '注解查询' }).click();
      await page.waitForTimeout(300);
      break;
    case 'jielong':
      await page.getByRole('button', { name: '开始接龙' }).click();
      await page.waitForTimeout(300);
      break;
    case 'relatives_name':
      await page.getByRole('button', { name: '弟' }).click();
      await page.waitForTimeout(300);
      break;
    case 'hanzifayin':
      await page.getByRole('textbox', { name: '请输入需要练习发音文字' }).fill('中国');
      await page.getByRole('button', { name: '标准发音' }).click();
      await page.waitForTimeout(300);
      break;
    case 'markmap':
      await page.getByRole('button', { name: '渲染导图' }).click();
      await page.waitForTimeout(300);
      break;
    case 'school':
      await page.getByRole('radio', { name: '985' }).check();
      await page.waitForTimeout(300);
      break;
    case 'translate':
      await page.getByText('腾讯翻译', { exact: true }).click();
      await page.waitForTimeout(300);
      break;
    default:
      await page.waitForTimeout(150);
      break;
  }
}

async function performAudit() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

  for (const pageDef of pages) {
    const page = await context.newPage();
    const networkEntries = [];

    page.on('response', (response) => {
      const request = response.request();
      networkEntries.push({
        url: response.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        status: response.status(),
        postData: request.postData() || ''
      });
    });

    await page.goto(pageDef.remoteUrl, { waitUntil: 'networkidle' });
    await runAuditAction(pageDef.id, page);

    await page.screenshot({ path: path.join(rootDir, 'docs/audit/screenshots/live', `${pageDef.id}.png`), fullPage: true });
    const a11y = await page.evaluate(() => {
      const selector = 'a,button,input,textarea,select,h1,h2,h3,[role],label';
      return Array.from(document.querySelectorAll(selector)).slice(0, 400).map((node) => ({
        tag: node.tagName.toLowerCase(),
        role: node.getAttribute('role') || '',
        type: node.getAttribute('type') || '',
        name: node.getAttribute('aria-label') || node.getAttribute('placeholder') || node.textContent.replace(/\s+/g, ' ').trim(),
        href: node.getAttribute('href') || '',
        disabled: 'disabled' in node ? !!node.disabled : false
      }));
    });
    const dom = await page.content();

    await writeFile(path.join(rootDir, 'docs/audit/dom', `${pageDef.id}.a11y.json`), JSON.stringify(a11y, null, 2), 'utf8');
    await writeFile(path.join(rootDir, 'docs/audit/dom', `${pageDef.id}.html`), dom, 'utf8');
    await writeFile(path.join(rootDir, 'docs/audit/network', `${pageDef.id}.json`), JSON.stringify(networkEntries, null, 2), 'utf8');
    await page.close();
  }

  await browser.close();

  const baselineLines = [
    '# 线上基线审计（2026-03-06）',
    '',
    '- 审计日期：2026-03-06',
    '- 审计来源：`https://tool.browser.qq.com/category/education` 及 16 个教育工具二级页',
    '- 恢复总策略：主页与 15 个可静态镜像页面采用本地镜像恢复；`handwriting_erasure.html` 采用本地壳页 + 全屏 iframe。',
    '',
    '## 页面清单',
    ''
  ];

  for (const page of pages) {
    baselineLines.push(`- 页面：\`${page.file}\`；线上：${page.remoteUrl}；标题：${page.title}；恢复策略：${pageStrategies[page.id]}`);
  }

  baselineLines.push('', '## 例外说明', '', '- `handwriting_erasure.html` 的上传与处理链路调用非 `file://` 可恢复的上传接口，因此本地交付采用线上 iframe 壳页。');
  await writeFile(path.join(rootDir, 'docs/audit/live-baseline-2026-03-06.md'), `${baselineLines.join('\n')}\n`, 'utf8');
}

await ensureDirectories();
await recoverPages();

if (isAuditMode) {
  await performAudit();
}
