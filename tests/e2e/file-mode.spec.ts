import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function fileUrl(file: string) {
  return pathToFileURL(path.resolve(file)).toString();
}

test('file:// 首页工具卡片打开本地 wordcount 页面', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl('index.html'));
  await page.waitForTimeout(1500);
  const popupPromise = page.waitForEvent('popup');
  await page.locator('a.tool-item[href="./wordcount.html"]').click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(1000);
  expect(new URL(popup.url()).pathname).toMatch(/wordcount\.html$/);
  await expect(popup.locator('body')).toContainText('字数计算');
});

test('file:// 首页搜索建议打开本地 translate 页面', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl('index.html'));
  await page.waitForTimeout(1500);
  await page.locator('.search-input').fill('翻译');
  await page.waitForTimeout(1000);
  const popupPromise = page.waitForEvent('popup');
  await page.locator('.search-panel a').filter({ hasText: '翻译' }).last().click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(1000);
  expect(new URL(popup.url()).pathname).toMatch(/translate\.html$/);
  await expect(popup.locator('iframe')).toHaveAttribute('src', 'https://fanyi.sogou.com/text');
});

test('file:// 去手写壳页默认展示远端 iframe，失败提示保持隐藏', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl('handwriting_erasure.html'));
  await page.waitForTimeout(1000);
  await expect(page.locator('iframe#tool-frame')).toHaveAttribute('src', 'https://tool.browser.qq.com/handwriting_erasure.html');
  await expect(page.locator('#fallback')).toBeHidden();
});
