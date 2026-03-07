import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function fileUrl(file: string) {
  return pathToFileURL(path.resolve(file)).toString();
}

async function openLocal(page: import('@playwright/test').Page, file: string) {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(fileUrl(file));
  await page.waitForTimeout(1500);
}

test('字数计算：中国abc => 总字数：3', async ({ page }) => {
  await openLocal(page, 'wordcount.html');
  const textareas = page.locator('textarea:not([aria-hidden="true"])');
  await textareas.first().fill('中国abc');
  await page.getByRole('button', { name: '确认' }).click();
  await page.waitForTimeout(500);
  await expect(textareas.last()).toHaveValue('总字数：3');
});

test('汉字偏旁：明 => 日', async ({ page }) => {
  await openLocal(page, 'radical.html');
  const textareas = page.locator('textarea:not([aria-hidden="true"])');
  await textareas.first().fill('明');
  await page.getByRole('button', { name: '查询' }).click();
  await page.waitForTimeout(500);
  await expect(textareas.last()).toHaveValue('日');
});

test('亲戚关系：点击弟 => 弟弟', async ({ page }) => {
  await openLocal(page, 'relatives_name.html');
  await page.getByRole('button', { name: '弟' }).click();
  await page.waitForTimeout(300);
  await expect(page.locator('input[type="text"]').last()).toHaveValue('弟弟');
});

test('成语接龙默认词：开天辟地 => 返回地字开头接龙结果', async ({ page }) => {
  await openLocal(page, 'jielong.html');
  await page.getByRole('button', { name: '开始接龙' }).click();
  await page.waitForTimeout(700);
  const appText = (await page.locator('#app').innerText()).replace(/\s+/g, '');
  expect(appText).toMatch(/地[\u4e00-\u9fa5]{3}接龙/);
});

test('翻译页切换 5 个 vendor iframe', async ({ page }) => {
  await openLocal(page, 'translate.html');
  const vendors = [
    ['搜狗翻译', 'https://fanyi.sogou.com/text'],
    ['腾讯翻译', 'https://fanyi.qq.com'],
    ['有道翻译', 'https://fanyi.youdao.com'],
    ['微软翻译', 'https://www.bing.com/translator'],
    ['CNKI学术翻译', 'https://dict.cnki.net/index']
  ] as const;

  for (const [name, src] of vendors) {
    await page.locator('#app a').filter({ hasText: name }).first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('iframe')).toHaveAttribute('src', src);
  }
});

test('歇后语：猫 => 首条结果匹配线上', async ({ page }) => {
  await openLocal(page, 'allegory.html');
  await page.locator('input[type="text"]').nth(1).fill('猫');
  await page.getByRole('button', { name: '歇后语查询' }).click();
  await page.waitForTimeout(700);
  await expect(page.locator('#app')).toContainText('1、钻进鸟笼里的猫-嘴馋上了当');
});

test('词语注解：学习 => 返回线上同款释义', async ({ page }) => {
  await openLocal(page, 'explain.html');
  await page.locator('input[type="text"]').nth(1).fill('学习');
  await page.getByRole('button', { name: '注解查询' }).click();
  await page.waitForTimeout(1500);
  await expect(page.locator('#app')).toContainText('个体由经验或练习引起的在能力或倾向方面的变化');
});

test('成语大全：美 => 返回线上同款前列结果', async ({ page }) => {
  await openLocal(page, 'chengyujielong.html');
  await page.locator('input[type="text"]').nth(1).fill('美');
  await page.getByRole('button', { name: '查询' }).click();
  await page.waitForTimeout(700);
  await expect(page.locator('#app')).toContainText('美不胜收');
  await expect(page.locator('#app')).toContainText('美轮美奂');
});
