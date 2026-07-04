const { chromium } = require('playwright');
const fs = require('fs');
const ROOT = 'file:///home/seat2036/work/banggemang/';
const PAGES = ['index','capital','dynasties','school','periodic','wordcount','radical','allegory','explain','chengyujielong','jielong','hanzifayin','relatives_name','markmap','zitie_new','translate','handwriting_erasure'];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  fs.mkdirSync('shots-local', { recursive: true });
  for (const n of PAGES) {
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message.split('\n')[0]));
    p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 120)); });
    try {
      await p.goto(ROOT + n + '.html', { waitUntil: 'load', timeout: 30000 });
      await p.waitForTimeout(n === 'zitie_new' ? 6000 : 1500);
      await p.screenshot({ path: `shots-local/${n}.png` });
      const nav = await p.$$eval('.category-entry-wrapper', els => els.length);
      const title = await p.title();
      console.log(`${n}: nav=${nav} title="${title.slice(0,30)}" ${errs.length ? 'ERRS: ' + errs.slice(0,3).join(' | ').slice(0, 300) : 'no-errors'}`);
    } catch (e) { console.log(`${n}: FAIL ${e.message.split('\n')[0]}`); }
    await p.close();
  }
  await b.close();
})();
