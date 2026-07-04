const { chromium } = require('playwright');
const fs = require('fs');
const PAGES = ['index','handwriting_erasure','zitie_new','relatives_name','school','wordcount','dynasties','capital','jielong','markmap','hanzifayin','periodic','translate','radical','allegory','explain','chengyujielong'];
const SELS = ['.left-nav', '.logo-container', '.category-container', '.search-container', '.share-btn',
  '.tool-info', '.tool-content-container', '.tool-useguide-modal', '.recommend-container',
  '.footer-pc', '.nav-button-wrap', '.tool-list-container', '.pc-content'];
const TOL = 3;

async function collect(ctx, base, name, shotDir) {
  const url = name === 'index'
    ? (base === 'online' ? 'https://tool.browser.qq.com/category/education' : 'file:///home/seat2036/work/banggemang/index.html')
    : (base === 'online' ? `https://tool.browser.qq.com/${name}.html` : `file:///home/seat2036/work/banggemang/${name}.html`);
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: base === 'online' ? 'networkidle' : 'load', timeout: 45000 });
  } catch (e) { /* iframe 第三方资源超时等，继续 */ }
  await p.waitForTimeout(name === 'zitie_new' ? 9000 : 2500);
  const rects = await p.evaluate(sels => {
    const out = {};
    for (const s of sels) {
      const el = document.querySelector(s);
      if (el) { const r = el.getBoundingClientRect(); out[s] = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }
    }
    return out;
  }, SELS);
  await p.screenshot({ path: `${shotDir}/${name}.png`, fullPage: false }).catch(() => {});
  await p.close();
  return rects;
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  fs.mkdirSync('shots-online2', { recursive: true });
  fs.mkdirSync('shots-local2', { recursive: true });
  let totalDiff = 0;
  const report = [];
  for (const n of PAGES) {
    const on = await collect(ctx, 'online', n, 'shots-online2');
    const lo = await collect(ctx, 'local', n, 'shots-local2');
    const diffs = [];
    for (const s of Object.keys(on)) {
      if (!lo[s]) { diffs.push(`${s}: missing locally`); continue; }
      const d = on[s].map((v, i) => Math.abs(v - lo[s][i]));
      if (Math.max(...d) > TOL) diffs.push(`${s}: online=[${on[s]}] local=[${lo[s]}]`);
    }
    for (const s of Object.keys(lo)) if (!on[s]) diffs.push(`${s}: extra locally`);
    totalDiff += diffs.length;
    console.log(`${n}: ${diffs.length ? 'DIFF x' + diffs.length : 'MATCH'}`);
    diffs.forEach(d => console.log('    ' + d));
    report.push({ page: n, diffs });
  }
  fs.writeFileSync('layout-compare.json', JSON.stringify(report, null, 1));
  console.log(`\nTOTAL diff items: ${totalDiff}`);
  await b.close();
})();
