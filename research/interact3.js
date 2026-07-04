const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://tool.browser.qq.com';
const T = s => `.pc-content ${s}`;

async function probe(ctx, name, url, fn, capture=false) {
  const page = await ctx.newPage();
  const reqs = [];
  page.on('request', r => {
    const t = r.resourceType();
    if (t==='xhr'||t==='fetch'||r.url().includes('/api/')||r.url().includes('cgi')) reqs.push(`${r.method()} ${r.url().slice(0,180)}`);
  });
  if (capture) page.on('response', async r => {
    const u = r.url();
    if (u.includes('tool.browser.qq.com') && (u.includes('api')||u.includes('cgi'))) {
      try { fs.appendFileSync(`net/${name}-resp3.txt`, `\n### ${r.status()} ${u}\n${(await r.text()).slice(0,2000)}\n`); } catch(e){}
    }
  });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1200);
    const n0 = reqs.length;
    const out = await fn(page);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `shots/${name}-after3.png`, fullPage: true });
    console.log(`${name}: ${JSON.stringify(out).slice(0,700)}`);
    const nr = reqs.slice(n0).filter(r => !r.includes('beacon')&&!r.includes('galileo')&&!r.includes('analytics')&&!r.includes('trace.qq'));
    if (nr.length) console.log(`   REQS: ${nr.slice(0,10).join(' | ').slice(0,600)}`);
  } catch (e) { console.log(`${name}: ERR ${e.message.split('\n')[0]}`); }
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });

  await probe(ctx, 'wc-eng', `${BASE}/wordcount.html`, async p => {
    const r = {};
    for (const txt of ['abc def', '你好ab，。123', 'Hello 世界！\n\nab cd']) {
      await p.fill(T('textarea >> nth=0'), txt);
      await p.click(T('button:has-text("确认")'));
      await p.waitForTimeout(500);
      r[txt] = (await p.$$eval(T('textarea'), ts => ts.map(t=>t.value)))[1];
    }
    return r;
  });

  await probe(ctx, 'explain2', `${BASE}/explain.html`, async p => {
    await p.fill(T('input'), '一心一意');
    await p.click(T('button:has-text("注解查询")'));
    await p.waitForTimeout(2500);
    return await p.$eval('.pc-content', el => el.innerText.slice(0, 700));
  });

  await probe(ctx, 'fayin2', `${BASE}/hanzifayin.html`, async p => {
    await p.fill(T('textarea >> nth=0'), '你好');
    const before = await p.$$eval(T('button'), bs => bs.map(b=>b.textContent));
    await p.click(T('button:has-text("标准发音")'));
    await p.waitForTimeout(600);
    const during = await p.$$eval(T('button'), bs => bs.map(b=>b.textContent));
    const spoken = await p.evaluate(() => window.speechSynthesis ? window.speechSynthesis.speaking || window.speechSynthesis.pending : 'no-api');
    return { before, during, spoken };
  });

  await probe(ctx, 'zitie2', `${BASE}/zitie_new.html`, async p => {
    await p.waitForTimeout(9000);
    const info = await p.evaluate(() => {
      const pc = document.querySelector('.pc-content') || document.body;
      const svgs = pc.querySelectorAll('svg').length;
      const canv = pc.querySelectorAll('canvas').length;
      const cls = [...new Set([...pc.querySelectorAll('div')].map(d=>d.className).filter(c=>typeof c==='string'&&c&&!c.includes('Mui')))].slice(0,20);
      return { svgs, canv, cls, html: pc.innerHTML.length };
    });
    return info;
  });

  await probe(ctx, 'handwriting', `${BASE}/handwriting_erasure.html`, async p => {
    const inp = await p.$('input[type=file]');
    if (!inp) return 'no file input';
    await inp.setInputFiles('test-upload.jpg');
    await p.waitForTimeout(8000);
    return await p.$eval('.pc-content, .main-content', el => el.innerText.slice(0,300)).catch(()=>'-');
  }, true);

  await probe(ctx, 'search-empty', `${BASE}/category/education`, async p => {
    await p.fill('.search-input', 'xyzabc123');
    await p.waitForTimeout(1200);
    const panel = await p.$eval('.search-panel', el => ({ text: el.innerText, links: [...el.querySelectorAll('a')].map(a=>a.href+'|'+a.innerText.trim()).slice(0,5) })).catch(()=>null);
    return panel;
  });

  await browser.close();
})();
