const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://tool.browser.qq.com';
const PAGES = ['index','handwriting_erasure','zitie_new','relatives_name','school','wordcount','dynasties','capital','jielong','markmap','hanzifayin','periodic','translate','radical','allegory','explain','chengyujielong'];
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  for (const name of PAGES) {
    const url = name === 'index' ? `${BASE}/category/education` : `${BASE}/${name}.html`;
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(name === 'zitie_new' ? 8000 : 2500);
      const css = await page.evaluate(() => {
        const out = [];
        for (const ss of document.styleSheets) {
          if (ss.href) continue; // external files already downloaded
          try { for (const r of ss.cssRules) out.push(r.cssText); } catch (e) {}
        }
        return out.join('\n');
      });
      fs.writeFileSync(`styles/${name}.css`, css);
      console.log(`${name}: ${css.length}b, rules with css- prefix: ${(css.match(/\.css-/g)||[]).length}`);
    } catch (e) { console.log(`${name}: ERR ${e.message.split('\n')[0]}`); }
    await page.close();
  }
  await browser.close();
})();
