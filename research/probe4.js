const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://tool.browser.qq.com';
const PAGES = ['index','handwriting_erasure','zitie_new','relatives_name','school','wordcount','dynasties','capital','jielong','markmap','hanzifayin','periodic','translate','radical','allegory','explain','chengyujielong'];
const T = s => `.pc-content ${s}`;
const log = (...a) => { console.log(...a); fs.appendFileSync('probe4.log', a.join(' ') + '\n'); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });

  // 1) full rendered HTML + emotion styles for every page
  for (const name of PAGES) {
    const url = name === 'index' ? `${BASE}/category/education` : `${BASE}/${name}.html`;
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(name === 'zitie_new' ? 9000 : 2000);
      const html = await page.evaluate(() => document.documentElement.outerHTML);
      fs.writeFileSync(`rendered/${name}.html`, html);
      const styles = await page.evaluate(() => [...document.querySelectorAll('style')].map(s => s.textContent).join('\n/*==STYLE==*/\n'));
      fs.writeFileSync(`styles/${name}-inline.css`, styles);
      log(`render ${name}: html=${html.length} styles=${styles.length}`);
    } catch (e) { log(`render ${name}: ERR ${e.message.split('\n')[0]}`); }
    await page.close();
  }

  // 2) zitie: select options + print-content structure
  {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/zitie_new.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(8000);
      const combos = await page.$$('.pc-content [role="combobox"]');
      log('zitie combos:', combos.length);
      for (let i = 0; i < combos.length; i++) {
        await combos[i].click();
        await page.waitForTimeout(600);
        const opts = await page.$$eval('li[role="option"]', ls => ls.map(l => l.textContent.trim()));
        log(`zitie select#${i} options: ${JSON.stringify(opts)}`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
      const row = await page.evaluate(() => {
        const pc = document.querySelector('.print-content');
        if (!pc) return 'no print-content';
        const first = pc.firstElementChild;
        return { rows: pc.children.length, rowTag: first.tagName, rowClass: first.className,
                 cells: first.children.length, cellHTML: first.firstElementChild ? first.firstElementChild.outerHTML.slice(0, 1200) : '',
                 cell2HTML: first.children[1] ? first.children[1].outerHTML.slice(0, 600) : '' };
      });
      log('zitie print-content:', JSON.stringify(row).slice(0, 2200));
      const wrap = await page.evaluate(() => {
        const pc = document.querySelector('.print-content');
        const cs = getComputedStyle(pc); const rowEl = pc.firstElementChild; const rs = getComputedStyle(rowEl);
        return { pcw: cs.width, disp: cs.display, rowDisp: rs.display, rowW: rs.width, rowH: rs.height };
      });
      log('zitie layout:', JSON.stringify(wrap));
    } catch (e) { log('zitie probe ERR', e.message.split('\n')[0]); }
    await page.close();
  }

  // 3) chengyu: radio modes UI text
  {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/chengyujielong.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1500);
      for (const mode of ['汉字', '拼音', '笔画数']) {
        await page.click(`.pc-content label:has-text("${mode}")`);
        await page.waitForTimeout(400);
        const txt = await page.$eval('.pc-content', el => el.innerText.replace(/\n+/g, '|').slice(0, 200));
        const ph = await page.$eval(T('input'), i => i.placeholder || '(none)').catch(() => '-');
        log(`chengyu mode=${mode}: placeholder=${ph} text=${txt}`);
      }
      await page.click('.pc-content label:has-text("汉字")');
      await page.fill(T('input'), '一心');
      await page.click(T('button:has-text("查询")'));
      await page.waitForTimeout(1200);
      const res = await page.$eval('.pc-content', el => el.innerText.split('查询')[1]?.slice(0, 200));
      log('chengyu prefix 一心 result:', JSON.stringify(res));
    } catch (e) { log('chengyu probe ERR', e.message.split('\n')[0]); }
    await page.close();
  }

  // 4) jielong: 接龙 link + 换一换 behavior
  {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/jielong.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1500);
      await page.fill(T('input'), '一心一意');
      await page.click(T('button:has-text("开始接龙")'));
      await page.waitForTimeout(1000);
      const t1 = await page.$$eval('.pc-content td:first-child', tds => tds.map(t => t.textContent));
      log('jielong chain1:', JSON.stringify(t1));
      await page.click('.pc-content a.jielong >> nth=0');
      await page.waitForTimeout(1000);
      const t2 = await page.$$eval('.pc-content td:first-child', tds => tds.map(t => t.textContent));
      const inputVal = await page.$eval(T('input'), i => i.value);
      log('jielong after row-link click:', JSON.stringify(t2), 'input=', inputVal);
      await page.click(T('button:has-text("换一换")'));
      await page.waitForTimeout(1000);
      const t3 = await page.$$eval('.pc-content td:first-child', tds => tds.map(t => t.textContent));
      const inputVal3 = await page.$eval(T('input'), i => i.value);
      log('jielong after 换一换:', JSON.stringify(t3), 'input=', inputVal3);
    } catch (e) { log('jielong probe ERR', e.message.split('\n')[0]); }
    await page.close();
  }

  // 5) relatives: 兄+子, reverse checkbox, sex radio
  {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/relatives_name.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1500);
      await page.click(T('button:has-text("兄")'));
      await page.click(T('button:has-text("子")'));
      let st = await page.evaluate(() => ({ inputs: [...document.querySelectorAll('.pc-content input')].map(i => ({ t: i.type, v: i.value, ck: i.checked })), txt: document.querySelector('.pc-content').innerText.replace(/\n+/g,'|') }));
      log('relatives 兄子:', JSON.stringify(st).slice(0, 500));
      await page.click('.pc-content label:has-text("对方称呼我")').catch(()=>page.click('.pc-content input[type=checkbox]'));
      await page.waitForTimeout(500);
      st = await page.evaluate(() => document.querySelector('.pc-content').innerText.replace(/\n+/g,'|'));
      log('relatives reversed:', JSON.stringify(st).slice(0, 400));
      await page.click('.pc-content label:has-text("我是女的")').catch(()=>0);
      await page.waitForTimeout(500);
      st = await page.evaluate(() => document.querySelector('.pc-content').innerText.replace(/\n+/g,'|'));
      log('relatives female:', JSON.stringify(st).slice(0, 400));
    } catch (e) { log('relatives probe ERR', e.message.split('\n')[0]); }
    await page.close();
  }

  // 6) translate: all 5 tab iframe srcs
  {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/translate.html`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);
      for (const tab of ['搜狗翻译', '腾讯翻译', '有道翻译', '微软翻译', 'CNKI学术翻译']) {
        await page.click(`.main-content :text("${tab}")`).catch(e => log(`tab ${tab} click fail`));
        await page.waitForTimeout(1500);
        const src = await page.$eval('#navFrame', f => f.getAttribute('src')).catch(() => 'no-frame');
        log(`translate tab ${tab} -> ${src}`);
      }
      const tabsHtml = await page.evaluate(() => { const el = document.querySelector('.main-content'); const m = el.innerHTML.match(/<ul[^>]*>[\s\S]{0,3000}?<\/ul>/); return m ? m[0].slice(0, 2500) : 'no ul'; });
      log('translate tabs html:', tabsHtml.replace(/\n/g,' ').slice(0, 2200));
    } catch (e) { log('translate probe ERR', e.message.split('\n')[0]); }
    await page.close();
  }

  // 7) handwriting upload via filechooser, capture requests+responses
  {
    const page = await ctx.newPage();
    const lines = [];
    page.on('request', r => { const t = r.resourceType();
      if (t==='xhr'||t==='fetch'||r.method()!=='GET') { const pd = r.postData(); lines.push(`>> ${r.method()} ${r.url().slice(0,200)} ${pd ? 'BODY:'+pd.slice(0,300) : ''}`); } });
    page.on('response', async r => { const u = r.url();
      if (u.includes('qq.com') && (u.includes('api')||u.includes('cgi')||u.includes('cos'))) { try { lines.push(`<< ${r.status()} ${u.slice(0,160)} ${(await r.text()).slice(0,400)}`); } catch(e){} } });
    try {
      await page.goto(`${BASE}/handwriting_erasure.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1500);
      const [fc] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 10000 }),
        page.click('.main-content button:has-text("选择本地图片"), .main-content :text("选择本地图片")')
      ]);
      await fc.setFiles('test-upload.jpg');
      await page.waitForTimeout(12000);
      await page.screenshot({ path: 'shots/handwriting-upload.png', fullPage: true });
      const txt = await page.$eval('.main-content', el => el.innerText.replace(/\n+/g,'|').slice(0,400));
      log('handwriting after upload:', txt);
      fs.writeFileSync('net/handwriting-upload.txt', lines.join('\n'));
      log('handwriting reqs:\n' + lines.filter(l=>!l.includes('beacon')&&!l.includes('galileo')&&!l.includes('analytics')).slice(0,25).join('\n'));
    } catch (e) { log('handwriting probe ERR', e.message.split('\n')[0]); }
    await page.close();
  }

  // 8) misc goldens: allegory 猫, radical mixed, wordcount eng, index card hover styles
  {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/allegory.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.fill(T('input'), '猫');
      await page.click(T('button:has-text("查询")'));
      await page.waitForTimeout(1200);
      const res = await page.$eval('.pc-content', el => el.innerText.slice(0, 800));
      log('allegory 猫:', JSON.stringify(res).slice(0, 800));
    } catch (e) { log('allegory2 ERR', e.message.split('\n')[0]); }
    await page.close();
    const p2 = await ctx.newPage();
    try {
      await p2.goto(`${BASE}/radical.html`, { waitUntil: 'networkidle', timeout: 45000 });
      await p2.fill(T('textarea >> nth=0'), '好a1，中');
      await p2.click(T('button:has-text("查询")'));
      await p2.waitForTimeout(800);
      const vals = await p2.$$eval(T('textarea'), ts => ts.map(t => t.value));
      log('radical mixed:', JSON.stringify(vals));
    } catch (e) { log('radical2 ERR', e.message.split('\n')[0]); }
    await p2.close();
    const p3 = await ctx.newPage();
    try {
      await p3.goto(`${BASE}/wordcount.html`, { waitUntil: 'networkidle', timeout: 45000 });
      for (const s of ['abc def', 'Hello 世界！ab, cd。123 456']) {
        await p3.fill(T('textarea >> nth=0'), s);
        await p3.click(T('button:has-text("确认")'));
        await p3.waitForTimeout(500);
        const vals = await p3.$$eval(T('textarea'), ts => ts.map(t => t.value));
        log(`wordcount "${s}":`, JSON.stringify(vals));
      }
    } catch (e) { log('wordcount2 ERR', e.message.split('\n')[0]); }
    await p3.close();
  }

  await browser.close();
  log('PROBE4 DONE');
})();
