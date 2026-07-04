const { chromium } = require('playwright');
const fs = require('fs');
const pages = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  for (const p of pages) {
    const name = p === 'index' ? 'index' : p;
    const url = p === 'index' ? 'https://tool.browser.qq.com/category/education' : `https://tool.browser.qq.com/${p}.html`;
    const page = await ctx.newPage();
    const reqs = [];
    page.on('request', r => {
      const u = r.url();
      if (r.resourceType() === 'xhr' || r.resourceType() === 'fetch' || u.includes('/api/'))
        reqs.push(`${r.method()} ${u}`);
    });
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) { console.log(`${name}: goto ${e.message.split('\n')[0]}`); }
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `shots/${name}-viewport.png` });
    await page.screenshot({ path: `shots/${name}-full.png`, fullPage: true }).catch(e => console.log(`${name} fullshot err`));
    // dump rendered main content DOM (excluding left-nav which is identical everywhere)
    const dom = await page.evaluate(() => {
      const el = document.querySelector('.main-content') || document.querySelector('main') || document.body;
      return el.outerHTML;
    });
    fs.writeFileSync(`dom/${name}.html`, dom);
    fs.writeFileSync(`net/${name}.txt`, reqs.join('\n'));
    const title = await page.title();
    console.log(`${name}: OK title="${title}" dom=${dom.length}b reqs=${reqs.length}`);
    await page.close();
  }
  await browser.close();
})();
