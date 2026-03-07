import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const cases = [
  { file: 'index.html', title: '帮小忙，腾讯QQ浏览器在线工具箱平台', marker: '去手写' },
  { file: 'handwriting_erasure.html', title: '去手写-帮小忙，腾讯QQ浏览器在线工具箱', marker: '' },
  { file: 'zitie_new.html', title: '字帖生成-帮小忙，腾讯QQ浏览器在线工具箱', marker: '字帖生成' },
  { file: 'relatives_name.html', title: '亲戚关系计算-帮小忙，腾讯QQ浏览器在线工具箱', marker: '亲戚关系计算' },
  { file: 'school.html', title: '高校查询-帮小忙，腾讯QQ浏览器在线工具箱', marker: '清华大学' },
  { file: 'wordcount.html', title: '字数计算-帮小忙，腾讯QQ浏览器在线工具箱', marker: '字数计算' },
  { file: 'dynasties.html', title: '历史朝代查询-帮小忙，腾讯QQ浏览器在线工具箱', marker: '夏朝' },
  { file: 'capital.html', title: '各国首都-帮小忙，腾讯QQ浏览器在线工具箱', marker: '北京_Beijing' },
  { file: 'jielong.html', title: '成语接龙-帮小忙，腾讯QQ浏览器在线工具箱', marker: '开始接龙' },
  { file: 'markmap.html', title: '便捷思维导图-帮小忙，腾讯QQ浏览器在线工具箱', marker: '渲染导图' },
  { file: 'hanzifayin.html', title: '汉字标准发音-帮小忙，腾讯QQ浏览器在线工具箱', marker: '标准发音' },
  { file: 'periodic.html', title: '元素周期表-帮小忙，腾讯QQ浏览器在线工具箱', marker: '氢qīng' },
  { file: 'translate.html', title: '翻译-帮小忙，腾讯QQ浏览器在线工具箱', marker: '搜狗翻译' },
  { file: 'radical.html', title: '汉字偏旁-帮小忙，腾讯QQ浏览器在线工具箱', marker: '汉字偏旁' },
  { file: 'allegory.html', title: '歇后语-帮小忙，腾讯QQ浏览器在线工具箱', marker: '歇后语查询' },
  { file: 'explain.html', title: '词语注解-帮小忙，腾讯QQ浏览器在线工具箱', marker: '注解查询' },
  { file: 'chengyujielong.html', title: '成语大全-帮小忙，腾讯QQ浏览器在线工具箱', marker: '成语查询' }
] as const;

function fileUrl(file: string) {
  return pathToFileURL(path.resolve(file)).toString();
}

test.describe('本地页面 smoke', () => {
  for (const item of cases) {
    test(item.file, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(String(error)));
      await page.setViewportSize({ width: 1440, height: 1200 });
      await page.goto(fileUrl(item.file));
      await page.waitForTimeout(1500);
      await expect(page).toHaveTitle(item.title);
      if (item.file === 'handwriting_erasure.html') {
        await expect(page.locator('iframe#tool-frame')).toHaveAttribute('src', 'https://tool.browser.qq.com/handwriting_erasure.html');
        await expect(page.locator('#fallback')).toBeHidden();
      } else {
        await expect(page.locator('body')).toContainText(item.marker);
      }
      expect(pageErrors).toEqual([]);
    });
  }
});
