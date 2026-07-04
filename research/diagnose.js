const { chromium } = require('playwright');
const PAGES = process.argv.slice(2);
async function heights(p) {
  return p.evaluate(() => {
    function walk(el, path, depth, out) {
      if (depth > 7) return;
      const r = el.getBoundingClientRect();
      const cls = (typeof el.className === 'string' ? el.className : '').split(' ').filter(c => c && !c.startsWith('css-') && !c.startsWith('mm-')).slice(0, 2).join('.');
      const key = path + '>' + el.tagName + (cls ? '.' + cls : '');
      out.push([key, Math.round(r.height), Math.round(r.width)]);
      [...el.children].forEach((c, i) => walk(c, key + '[' + i + ']', depth + 1, out));
    }
    const out = [];
    const root = document.querySelector('.pc-content') || document.querySelector('.main-content');
    walk(root, '', 0, out);
    return out;
  });
}
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  for (const n of PAGES) {
    const po = await ctx.newPage(); 
    try { await po.goto(`https://tool.browser.qq.com/${n}.html`, { waitUntil: 'networkidle', timeout: 45000 }); } catch (e) {}
    await po.waitForTimeout(2500);
    const ho = await heights(po);
    const pl = await ctx.newPage();
    await pl.goto(`file:///home/seat2036/work/banggemang/${n}.html`, { waitUntil: 'load' });
    await pl.waitForTimeout(2500);
    const hl = await heights(pl);
    const mo = Object.fromEntries(ho.map(x => [x[0], x]));
    console.log(`===== ${n}`);
    let shown = 0;
    for (const [key, h, w] of hl) {
      const o = mo[key];
      if (!o) { if (shown < 8) { console.log(`  LOCAL-ONLY ${key} h=${h}`); shown++; } continue; }
      if (Math.abs(o[1] - h) > 2 && shown < 10) { console.log(`  ${key}\n    online h=${o[1]} w=${o[2]} | local h=${h} w=${w}`); shown++; }
    }
    await po.close(); await pl.close();
  }
  await b.close();
})();
