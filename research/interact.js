const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://tool.browser.qq.com';
const results = {};

async function probe(ctx, name, url, fn) {
  const page = await ctx.newPage();
  const reqs = [];
  page.on('request', r => {
    const t = r.resourceType();
    if (t === 'xhr' || t === 'fetch' || t === 'media' || r.url().includes('/api/') || r.url().includes('cgi-bin'))
      reqs.push(`${r.method()} ${r.url()}`);
  });
  page.on('response', async r => {
    const u = r.url();
    if ((u.includes('/api/') || u.includes('cgi-bin')) && !u.includes('report') && !u.includes('addToolPV') && !u.includes('Login') && !u.includes('Token') && !u.includes('statistics') && !u.includes('tool_list')) {
      try { const b = await r.text(); fs.appendFileSync(`net/${name}-resp.txt`, `\n### ${u}\n${b.slice(0,3000)}\n`); } catch(e){}
    }
  });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1500);
    const before = reqs.length;
    await fn(page);
    await page.waitForTimeout(3000);
    results[name] = { newReqs: reqs.slice(before) };
    await page.screenshot({ path: `shots/${name}-after.png`, fullPage: true });
    const dom = await page.evaluate(() => (document.querySelector('.main-content') || document.body).outerHTML);
    fs.writeFileSync(`dom/${name}-after.html`, dom);
    console.log(`${name}: OK, ${results[name].newReqs.length} new reqs`);
    results[name].newReqs.slice(0, 8).forEach(r => console.log(`   ${r.slice(0,150)}`));
  } catch (e) {
    console.log(`${name}: ERR ${e.message.split('\n')[0]}`);
  }
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });

  await probe(ctx, 'jielong', `${BASE}/jielong.html`, async p => {
    await p.fill('.main-content input[type="text"], .main-content input:not([type])', '一心一意');
    await p.click('button:has-text("开始接龙")');
  });

  await probe(ctx, 'chengyujielong', `${BASE}/chengyujielong.html`, async p => {
    await p.fill('.main-content input[type="text"], .main-content input:not([type])', '一');
    await p.click('button:has-text("查询")');
  });

  await probe(ctx, 'allegory', `${BASE}/allegory.html`, async p => {
    await p.fill('.main-content input', '泥菩萨过江');
    await p.click('button:has-text("查询")');
  });

  await probe(ctx, 'explain', `${BASE}/explain.html`, async p => {
    await p.fill('.main-content input', '高兴');
    await p.click('button:has-text("查询")');
  });

  await probe(ctx, 'radical', `${BASE}/radical.html`, async p => {
    await p.fill('.main-content textarea:visible', '好帮忙');
    await p.click('button:has-text("查询")');
  });

  await probe(ctx, 'hanzifayin', `${BASE}/hanzifayin.html`, async p => {
    await p.fill('.main-content textarea:visible', '你好');
    await p.click('button:has-text("标准发音")');
    await p.waitForTimeout(4000);
  });

  await probe(ctx, 'wordcount', `${BASE}/wordcount.html`, async p => {
    await p.fill('.main-content textarea:visible >> nth=0', '帮小忙工具箱 Hello World! 测试文本，共几个字？');
    await p.waitForTimeout(500);
    const btns = await p.$$eval('.main-content button', bs => bs.map(b => b.textContent));
    console.log('   wordcount buttons:', JSON.stringify(btns));
    const b = await p.$('.main-content button:has-text("计算"), .main-content button:has-text("统计")');
    if (b) await b.click();
  });

  await probe(ctx, 'relatives_name', `${BASE}/relatives_name.html`, async p => {
    await p.click('.main-content button:has-text("爸")');
    await p.click('.main-content button:has-text("妈")');
    const eq = await p.$('.main-content button:has-text("=")');
    if (eq) await eq.click();
  });

  await probe(ctx, 'periodic', `${BASE}/periodic.html`, async p => {
    await p.click('.main-content td:has-text("H"), .main-content div:has-text("氢") >> nth=0').catch(()=>{});
  });

  await probe(ctx, 'school', `${BASE}/school.html`, async p => {
    await p.click('text=985 >> nth=0');
  });

  await probe(ctx, 'translate', `${BASE}/translate.html`, async p => {
    const tabs = await p.$$eval('.main-content [class*=tab], .main-content li, .main-content [role=tab]', els => els.map(e => e.textContent.trim()).filter(Boolean).slice(0,10));
    console.log('   translate tabs:', JSON.stringify(tabs));
    await p.click('text=腾讯交互翻译').catch(e => console.log('   tab click fail'));
    await p.waitForTimeout(2000);
    const src = await p.$eval('#navFrame', f => f.src).catch(() => 'no-frame');
    console.log('   iframe src now:', src);
    await p.click('text=有道翻译').catch(()=>{});
    await p.waitForTimeout(1500);
    console.log('   iframe src now:', await p.$eval('#navFrame', f => f.src).catch(() => 'no-frame'));
  });

  await probe(ctx, 'zitie_new', `${BASE}/zitie_new.html`, async p => {
    const btns = await p.$$eval('.main-content button', bs => bs.map(b => b.textContent));
    console.log('   zitie buttons:', JSON.stringify(btns));
    await p.click('.main-content button:has-text("确定")');
    await p.waitForTimeout(5000);
  });

  await probe(ctx, 'markmap', `${BASE}/markmap.html`, async p => {
    await p.click('button:has-text("生成导图")');
  });

  await probe(ctx, 'index-search', `${BASE}/category/education`, async p => {
    await p.fill('.search-input', '成语');
    await p.waitForTimeout(1500);
  });

  await browser.close();
  fs.writeFileSync('interact-results.json', JSON.stringify(results, null, 2));
})();
