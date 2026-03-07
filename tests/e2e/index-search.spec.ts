import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function fileUrl(file: string) {
  return pathToFileURL(path.resolve(file)).toString();
}

test('首页 16 个工具卡片可见', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl('index.html'));
  await page.waitForTimeout(1500);
  await expect(page.locator('a.tool-item')).toHaveCount(16);
  await expect(page.locator('body')).toContainText('去手写');
  await expect(page.locator('body')).toContainText('成语大全');
});

test('首页工具卡片点击后在 file:// 下打开本地页面', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl('index.html'));
  await page.waitForTimeout(1500);
  const popupPromise = page.waitForEvent('popup');
  await page.locator('a.tool-item[href="./wordcount.html"]').click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(1000);
  await expect(popup).toHaveTitle('字数计算-帮小忙，腾讯QQ浏览器在线工具箱');
  expect(new URL(popup.url()).pathname).toMatch(/wordcount\.html$/);
});

test('首页搜索“翻译”展示线上同款建议并重写到本地页', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl('index.html'));
  await page.waitForTimeout(1500);
  await page.locator('.search-input').fill('翻译');
  await page.waitForTimeout(1000);
  const panel = page.locator('.search-panel');
  await expect(panel).toContainText('英语识别');
  await expect(panel).toContainText('搜狗百宝箱');
  await expect(panel).toContainText('英文创业公司/项目名生成');
  await expect(panel).toContainText('火星文翻译器');
  await expect(panel).toContainText('翻译');
  await expect(page.locator('.search-panel a')).toHaveCount(5);

  const popupPromise = page.waitForEvent('popup');
  await page.locator('.search-panel a').filter({ hasText: '翻译' }).last().click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(1000);
  await expect(popup).toHaveTitle('翻译-帮小忙，腾讯QQ浏览器在线工具箱');
  expect(new URL(popup.url()).pathname).toMatch(/translate\.html$/);
});
