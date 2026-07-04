const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://tool.browser.qq.com';

async function probe(ctx, name, url, fn) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1200);
    const out = await fn(page);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `shots/${name}-after2.png`, fullPage: true });
    const dom = await page.evaluate(() => (document.querySelector('.tool-content-container') || document.querySelector('.main-content') || document.body).outerHTML);
    fs.writeFileSync(`dom/${name}-after2.html`, dom);
    console.log(`${name}: OK ${out ? JSON.stringify(out).slice(0,600) : ''}`);
  } catch (e) { console.log(`${name}: ERR ${e.message.split('\n')[0]}`); }
  await page.close();
}

const T = (sel) => `.pc-content ${sel}`;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });

  await probe(ctx, 'jielong', `${BASE}/jielong.html`, async p => {
    await p.fill(T('input'), '一心一意');
    await p.click(T('button:has-text("开始接龙")'));
    await p.waitForTimeout(1500);
    const items = await p.$$eval(T('*'), els => {
      const t = els.map(e => e.className && String(e.className).includes && (String(e.className).match(/jielong|result|item|chain/i)) ? e.className + '::' + e.textContent.slice(0,40) : null).filter(Boolean);
      return [...new Set(t)].slice(0, 12);
    });
    return items;
  });

  await probe(ctx, 'chengyu-hanzi', `${BASE}/chengyujielong.html`, async p => {
    await p.fill(T('input'), '一');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(1500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 500));
  });

  await probe(ctx, 'chengyu-pinyin', `${BASE}/chengyujielong.html`, async p => {
    await p.click('text=拼音');
    await p.fill(T('input'), 'yi4');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(1500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 400));
  });

  await probe(ctx, 'chengyu-bihua', `${BASE}/chengyujielong.html`, async p => {
    await p.click('text=笔画数');
    await p.fill(T('input'), '1');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(1500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 400));
  });

  await probe(ctx, 'allegory', `${BASE}/allegory.html`, async p => {
    await p.fill(T('input'), '泥菩萨过江');
    await p.click(T('button:has-text("歇后语查询"), button:has-text("查询")'));
    await p.waitForTimeout(1500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 500));
  });

  await probe(ctx, 'explain', `${BASE}/explain.html`, async p => {
    await p.fill(T('input'), '高兴');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(1500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 600));
  });

  await probe(ctx, 'wordcount', `${BASE}/wordcount.html`, async p => {
    await p.fill(T('textarea:not([readonly]) >> nth=0'), '帮小忙工具箱 Hello World! 测试，123。');
    await p.click(T('button:has-text("确认")'));
    await p.waitForTimeout(800);
    return await p.$$eval(T('textarea'), ts => ts.map(t => t.value));
  });

  await probe(ctx, 'relatives', `${BASE}/relatives_name.html`, async p => {
    await p.click(T('button:has-text("父")'));
    await p.click(T('button:has-text("父")'));
    const v1 = await p.$$eval(T('input'), ins => ins.map(i => i.value));
    const res = await p.$eval('.pc-content', el => el.innerText.slice(0, 300));
    return { v1, res };
  });

  await probe(ctx, 'periodic-click', `${BASE}/periodic.html`, async p => {
    const cell = await p.$('.pc-content :text("qīng")');
    if (cell) await cell.click();
    await p.waitForTimeout(1200);
    const dialog = await p.$('[role=dialog], .MuiDialog-root, .MuiModal-root');
    return { hasDialog: !!dialog, dialogText: dialog ? (await dialog.innerText()).slice(0, 400) : null };
  });

  await probe(ctx, 'school-985', `${BASE}/school.html`, async p => {
    await p.click('.pc-content label:has-text("985") input, .pc-content input[value="985"]').catch(async () => { await p.click('text=985'); });
    await p.waitForTimeout(800);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 300));
  });

  await probe(ctx, 'hanzifayin', `${BASE}/hanzifayin.html`, async p => {
    await p.fill(T('textarea >> nth=0'), '你好世界');
    await p.click(T('button:has-text("标准发音")'));
    await p.waitForTimeout(2500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 300));
  });

  await probe(ctx, 'index-search2', `${BASE}/category/education`, async p => {
    await p.click('.search-input');
    await p.waitForTimeout(800);
    const panel1 = await p.$eval('.search-panel', el => el.innerText.slice(0,300)).catch(()=>null);
    await p.fill('.search-input', '成语');
    await p.waitForTimeout(1000);
    const panel2 = await p.$eval('.search-panel', el => el.innerText.slice(0,400)).catch(()=>null);
    return { focus: panel1, typed: panel2 };
  });

  await probe(ctx, 'share-btn', `${BASE}/category/education`, async p => {
    await p.click('.share-btn');
    await p.waitForTimeout(800);
    return await p.$eval('body', () => {
      const el = document.querySelector('.share-panel, [class*=share]');
      return el ? el.innerText.slice(0, 200) : document.body.innerText.match(/复制链接[\s\S]{0,100}/)?.[0];
    });
  });

  await browser.close();
})();
