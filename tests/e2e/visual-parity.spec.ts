import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const cases = [
  { file: 'index.html', baseline: 'docs/audit/screenshots/live/index.png', marker: '去手写' },
  { file: 'wordcount.html', baseline: 'docs/audit/screenshots/live/wordcount.png', marker: '字数计算' },
  { file: 'translate.html', baseline: 'docs/audit/screenshots/live/translate.png', marker: '搜狗翻译' },
  { file: 'relatives_name.html', baseline: 'docs/audit/screenshots/live/relatives_name.png', marker: '亲戚关系计算' },
  { file: 'explain.html', baseline: 'docs/audit/screenshots/live/explain.png', marker: '注解查询' }
] as const;

function fileUrl(file: string) {
  return pathToFileURL(path.resolve(file)).toString();
}

function pngSize(buffer: Buffer) {
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

test.describe('视觉基线采样', () => {
  for (const item of cases) {
    test(item.file, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await page.goto(fileUrl(item.file));
      await page.waitForTimeout(1800);
      if (item.file === 'explain.html') {
        await page.locator('input[type="text"]').nth(1).fill('学习');
        await page.getByRole('button', { name: '注解查询' }).click();
        await page.waitForTimeout(1200);
      }
      await expect(page.locator('body')).toContainText(item.marker);
      const localBuffer = await page.screenshot({ path: testInfo.outputPath(path.basename(item.file, '.html') + '.png') });
      const liveBuffer = fs.readFileSync(path.resolve(item.baseline));
      const localSize = pngSize(localBuffer);
      const liveSize = pngSize(liveBuffer);
      expect(localSize.width).toBe(1440);
      expect(localSize.height).toBe(1200);
      expect(liveSize.width).toBe(1440);
      expect(localBuffer.length).toBeGreaterThan(Math.floor(liveBuffer.length * 0.2));
      expect(localBuffer.length).toBeLessThan(Math.floor(liveBuffer.length * 2.5));
    });
  }
});
