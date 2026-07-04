const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('https://tool.browser.qq.com/category/education', { waitUntil: 'networkidle', timeout: 45000 });
  await p.fill('.search-input', '成语');
  await p.waitForTimeout(1200);
  console.log('PANEL_HTML:', await p.$eval('.search-panel', el => el.innerHTML.replace(/\s+/g, ' ').slice(0, 1800)));
  const disp0 = await p.$eval('.share-btn .modal', el => getComputedStyle(el).display).catch(() => 'none-el');
  await p.hover('.share-btn');
  await p.waitForTimeout(600);
  const disp1 = await p.$eval('.share-btn .modal', el => getComputedStyle(el).display).catch(() => 'none-el');
  const cls = await p.$eval('.share-btn', el => el.className);
  console.log('MODAL display before/after hover:', disp0, disp1, 'share-btn class:', cls);
  await b.close();
})();
