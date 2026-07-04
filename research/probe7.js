const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('https://tool.browser.qq.com/zitie_new.html', { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(7000);
  for (const tpl of ['模板B', '模板C']) {
    await p.click('.pc-content [role="combobox"] >> nth=1');
    await p.waitForTimeout(600);
    await p.click(`li[role="option"]:has-text("${tpl}")`);
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => {
      const row = document.querySelector('.print-content').firstElementChild;
      const cells = [...row.children];
      return { cells: cells.length, fills: cells.map(c => { const path = c.querySelector('path'); return path ? (path.getAttribute('style')||'').replace('fill: ','') : 'EMPTY'; }) };
    });
    console.log(tpl, JSON.stringify(info));
  }
  await b.close();
})();
