const { chromium } = require('playwright');
const ROOT = 'file:///home/seat2036/work/banggemang/';
const T = s => `.pc-content ${s}`;
let pass = 0, fail = 0;
const failures = [];
function check(id, cond, detail) {
  if (cond) { pass++; console.log(`  PASS ${id}`); }
  else { fail++; failures.push(id + ' :: ' + detail); console.log(`  FAIL ${id} :: ${String(detail).slice(0, 220)}`); }
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const open = async (n, wait) => {
    const p = await ctx.newPage();
    await p.goto(ROOT + n + '.html', { waitUntil: 'load', timeout: 30000 });
    await p.waitForTimeout(wait || 900);
    return p;
  };

  // ---------- T1 index ----------
  {
    const p = await open('index');
    const cards = await p.$$eval('.tool-item', els => els.map(e => ({ href: e.getAttribute('href'), name: e.querySelector('.tool-name').textContent.trim(), label: (e.querySelector('.label_font') || {}).textContent || '' })));
    check('T1-1 16cards', cards.length === 16, 'got ' + cards.length);
    const lbl = Object.fromEntries(cards.map(c => [c.name, c.label.trim()]));
    check('T1-2 labels', lbl['去手写'] === 'new' && lbl['字帖生成'] === '推荐' && lbl['亲戚关系计算'] === 'hot', JSON.stringify(lbl));
    check('T1-3 local links', cards.every(c => /^\.\/[a-z_]+\.html$/.test(c.href)), JSON.stringify(cards.slice(0, 3)));
    // T0-2 statistics
    const stat = await p.$eval('.statistics-container', el => el.textContent);
    check('T0-2 stats', /工具箱已累计帮助了\s*\d+\s*人次/.test(stat.replace(/\n/g, '')), stat);
    // T0-3 search hit
    await p.fill('.search-input', '成语');
    await p.waitForTimeout(400);
    const hits = await p.$$eval('.search-panel .search-panel-item span', els => els.map(e => e.textContent.trim()));
    check('T0-3 search 成语', hits.includes('成语接龙') && hits.includes('成语大全'), JSON.stringify(hits));
    // T0-4 empty search
    await p.fill('.search-input', 'xyzabc123');
    await p.waitForTimeout(400);
    const empty = await p.$eval('.search-panel .search-panel-empty', el => ({ t: el.textContent, h: el.href })).catch(() => null);
    check('T0-4 empty search', empty && empty.t.indexOf('没有找到相关工具') >= 0 && empty.h === 'https://sogou.com/web?query=xyzabc123', JSON.stringify(empty));
    // T0-5 share
    const share = await p.$eval('.share-btn .modal', el => el.textContent);
    check('T0-5 share', share.indexOf('复制链接') >= 0 && share.indexOf('QQ 微信扫码分享') >= 0, share);
    // T0-1 nav
    const active = await p.$eval('.category-entry-item[data-actived="true"] span, li[data-actived="true"] span', el => el.textContent.trim()).catch(() => '');
    check('T0-1 nav active', active.indexOf('教育') >= 0, active);
    await p.close();
  }

  // ---------- T2 wordcount ----------
  {
    const p = await open('wordcount');
    const cases = [['帮小忙工具箱 Hello World! 测试，123。', '总字数：11'], ['abc def', '总字数：2'], ['Hello 世界！ab, cd。123 456', '总字数：7']];
    for (const [inp, exp] of cases) {
      await p.fill(T('textarea:not([aria-hidden]) >> nth=0'), inp);
      await p.click(T('button:has-text("确认")'));
      await p.waitForTimeout(200);
      const vals = await p.$$eval(T('textarea:not([aria-hidden])'), ts => ts.map(t => t.value));
      check(`T2 wordcount "${inp.slice(0, 12)}"`, vals[1] === exp, JSON.stringify(vals));
    }
    const tip = await p.$eval('.pc-content', el => el.innerText);
    check('T2-4 tip', tip.indexOf('空格、换行不计入字数') >= 0, tip.slice(0, 80));
    await p.close();
  }

  // ---------- T2 radical ----------
  {
    const p = await open('radical');
    for (const [inp, exp] of [['好帮忙', '女,巾,忄'], ['好a1，中', '女,a,1,,丨']]) {
      await p.fill(T('textarea:not([aria-hidden]) >> nth=0'), inp);
      await p.click(T('button:has-text("查询")'));
      await p.waitForTimeout(300);
      const vals = await p.$$eval(T('textarea:not([aria-hidden])'), ts => ts.map(t => t.value));
      check(`T2 radical "${inp}"`, vals[1] === exp, JSON.stringify(vals));
    }
    await p.close();
  }

  // ---------- T2 allegory ----------
  {
    const p = await open('allegory');
    await p.fill(T('input.MuiInputBase-input'), '泥菩萨过江');
    await p.click(T('button:has-text("歇后语查询")'));
    await p.waitForTimeout(400);
    let lis = await p.$$eval(T('ul li'), els => els.map(e => e.textContent));
    check('T2-7 泥菩萨过江', lis.length === 1 && lis[0] === '1、泥菩萨过江-自身难保', JSON.stringify(lis));
    await p.fill(T('input.MuiInputBase-input'), '猫');
    await p.click(T('button:has-text("歇后语查询")'));
    await p.waitForTimeout(600);
    lis = await p.$$eval(T('ul li'), els => els.map(e => e.textContent));
    check('T2-8 猫', lis.length >= 49 && lis[0] === '1、钻进鸟笼里的猫-嘴馋上了当', `n=${lis.length} first=${lis[0]}`);
    await p.close();
  }

  // ---------- T2 explain ----------
  {
    const p = await open('explain');
    await p.fill(T('input.MuiInputBase-input'), '一心一意');
    await p.click(T('button:has-text("注解查询")'));
    await p.waitForTimeout(4000);
    let txt = await p.$eval('.pc-content ul', el => el.textContent.trim());
    check('T2-9 一心一意', txt === '只有一个心眼儿，没有别的考虑。', txt);
    await p.fill(T('input.MuiInputBase-input'), '好帮忙测试词');
    await p.click(T('button:has-text("注解查询")'));
    await p.waitForTimeout(3000);
    txt = await p.$eval('.pc-content ul', el => el.textContent.trim());
    check('T2-10 无结果', txt === '词汇还没合适注解', txt);
    await p.fill(T('input.MuiInputBase-input'), '');
    await p.click(T('button:has-text("注解查询")'));
    await p.waitForTimeout(300);
    const tip = await p.$eval('.pc-content', el => el.innerText);
    check('T2-11 空输入', tip.indexOf('请输入查询汉词') >= 0, tip.slice(0, 120));
    await p.close();
  }

  // ---------- T2 chengyujielong ----------
  {
    const p = await open('chengyujielong');
    await p.fill(T('input.MuiInputBase-input'), '一');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(800);
    let items = await p.$eval('.pc-content', el => el.innerText);
    check('T2-12 汉字一', items.indexOf('一把死拿') >= 0 && items.indexOf('一百二十行') >= 0 && items.indexOf('一败如水') >= 0, items.slice(0, 200));
    await p.click('.pc-content label:has-text("拼音")');
    await p.waitForTimeout(200);
    const hint1 = await p.$eval('.pc-content', el => el.innerText);
    check('T2-14 拼音提示', hint1.indexOf('guang3') >= 0, hint1.slice(0, 160));
    await p.fill(T('input.MuiInputBase-input'), 'yi4');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(800);
    items = await p.$eval('.pc-content', el => el.innerText);
    check('T2-13 拼音yi4', items.indexOf('亿万斯年') >= 0 && items.indexOf('弋人何篡') >= 0, items.slice(0, 300));
    await p.click('.pc-content label:has-text("笔画数")');
    await p.fill(T('input.MuiInputBase-input'), '1');
    await p.click(T('button:has-text("查询")'));
    await p.waitForTimeout(1500);
    items = await p.$eval('.pc-content', el => el.innerText);
    check('T2 笔画1', items.indexOf('一把死拿') >= 0, items.slice(0, 260));
    await p.close();
  }

  // ---------- T2 jielong ----------
  {
    const p = await open('jielong');
    await p.fill(T('input.MuiInputBase-input'), '一心一意');
    await p.click(T('button:has-text("开始接龙")'));
    await p.waitForTimeout(600);
    const chain1 = await p.$$eval('.pc-content td:first-child', tds => tds.map(t => t.textContent));
    check('T2-15 chain', chain1.length === 5 && chain1[0][0] === '意', JSON.stringify(chain1));
    // 接续规则：同字，或同音回退（与线上一致），在页面上下文用 cnchar 校验
    const linkOk = await p.evaluate(chain => chain.every((x, i) => {
      if (i === 0) return true;
      const tail = chain[i - 1].match(/[一-龥](?=[^一-龥]*$)/)[0];
      if (x[0] === tail) return true;
      try { return window.cnchar.spell(x[0], 'low') === window.cnchar.spell(tail, 'low'); } catch (e) { return false; }
    }), chain1);
    check('T2-15b linking', linkOk, JSON.stringify(chain1));
    await p.click('.pc-content a.jielong >> nth=0');
    await p.waitForTimeout(500);
    const inputVal = await p.$eval(T('input.MuiInputBase-input'), i => i.value);
    const chain2 = await p.$$eval('.pc-content td:first-child', tds => tds.map(t => t.textContent));
    const tail1 = chain1[0].match(/[一-龥](?=[^一-龥]*$)/)[0];
    const cont = chain2.length === 5 && (chain2[0][0] === tail1 || await p.evaluate(([a, b]) => {
      try { return window.cnchar.spell(a, 'low') === window.cnchar.spell(b, 'low'); } catch (e) { return false; }
    }, [chain2[0][0], tail1]));
    check('T2-16 row jielong', inputVal === chain1[0] && cont, `input=${inputVal} chain2=${JSON.stringify(chain2)}`);
    await p.click(T('button:has-text("换一换")'));
    await p.waitForTimeout(500);
    const chain3 = await p.$$eval('.pc-content td:first-child', tds => tds.map(t => t.textContent));
    check('T2-17 换一换', chain3.length === 5 && JSON.stringify(chain3) !== JSON.stringify(chain2), JSON.stringify(chain3));
    await p.close();
  }

  // ---------- T2 relatives ----------
  {
    const p = await open('relatives_name');
    await p.click(T('button:has-text("父")'));
    await p.click(T('button:has-text("父")'));
    await p.waitForTimeout(300);
    let iv = await p.$eval(T('input[type="text"]'), i => i.value);
    let res = await p.$eval('.pc-content', el => el.innerText);
    check('T2-18 父父', iv === '爸爸的爸爸' && res.indexOf('爷爷') >= 0, `input=${iv} text=${res.slice(-60)}`);
    // 重置：退格两次
    await p.click(T('button:has-text("<")'));
    await p.click(T('button:has-text("<")'));
    await p.click(T('button:has-text("兄")'));
    await p.click(T('button:has-text("子")'));
    await p.waitForTimeout(300);
    iv = await p.$eval(T('input[type="text"]'), i => i.value);
    res = await p.$eval('.pc-content', el => el.innerText);
    check('T2-19 兄子', iv === '哥哥的儿子' && res.indexOf('侄子') >= 0, `input=${iv} tail=${res.slice(-60)}`);
    await p.click('.pc-content input[type="checkbox"]', { force: true });
    await p.waitForTimeout(300);
    res = await p.$eval('.pc-content', el => el.innerText);
    check('T2-20 对方称呼我', res.indexOf('小姑') >= 0, res.slice(-80));
    await p.close();
  }

  // ---------- T2 school ----------
  {
    const p = await open('school');
    let rows = await p.$$eval('.pc-content tbody tr', trs => trs.length);
    check('T2-21 141行', rows === 141, rows);
    await p.click('.pc-content label:has-text("985")');
    await p.waitForTimeout(400);
    const first = await p.$eval('.pc-content tbody tr', tr => tr.innerText.replace(/\s+/g, ' '));
    const all985 = await p.$$eval('.pc-content tbody tr', trs => trs.every(tr => tr.children[1].textContent === '是'));
    check('T2-22 985筛选', first.indexOf('清华大学') >= 0 && all985, first);
    await p.close();
  }

  // ---------- T2 capital/dynasties/periodic ----------
  {
    const p = await open('capital');
    const rows = await p.$$eval('.pc-content tbody tr', trs => trs.map(tr => tr.innerText.replace(/\s+/g, ' ')));
    check('T2-23 capital', rows.length === 193 && rows[0].indexOf("中华人民共和国_People's Republic of China") >= 0 && rows[0].indexOf('北京_Beijing') >= 0, `n=${rows.length} first=${rows[0]}`);
    await p.close();
    const p2 = await open('dynasties');
    const rows2 = await p2.$$eval('.pc-content tbody tr', trs => trs.map(tr => tr.innerText.replace(/\s+/g, '|')));
    check('T2-24 dynasties', rows2.length === 39 && rows2[0].indexOf('夏朝') >= 0 && rows2[0].indexOf('公元前2070-公元前1600') >= 0 && rows2[0].indexOf('禹') >= 0, `n=${rows2.length} first=${rows2[0]}`);
    await p2.close();
    const p3 = await open('periodic');
    const txt = await p3.$eval('.pc-content', el => el.innerText.replace(/\s+/g, '|'));
    const has118 = (txt.match(/\|118\|/) || txt.indexOf('118') >= 0);
    check('T2-25 periodic', txt.indexOf('氢') >= 0 && txt.indexOf('qīng') >= 0 && txt.indexOf('1.0079') >= 0 && txt.indexOf('(294)') >= 0 && has118, txt.slice(0, 150));
    await p3.close();
  }

  // ---------- T2 translate ----------
  {
    const p = await open('translate');
    const EXP = { '搜狗翻译': 'https://fanyi.sogou.com/text', '腾讯翻译': 'https://fanyi.qq.com', '有道翻译': 'https://fanyi.youdao.com', '微软翻译': 'https://www.bing.com/translator', 'CNKI学术翻译': 'https://dict.cnki.net/index' };
    let ok = true, detail = [];
    for (const [tab, src] of Object.entries(EXP)) {
      await p.click(`.main-content ul.nav li:has-text("${tab}") a`);
      await p.waitForTimeout(250);
      const got = await p.$eval('#navFrame', f => f.getAttribute('src'));
      if (got !== src) { ok = false; detail.push(`${tab}:${got}`); }
    }
    check('T2-26 translate tabs', ok, detail.join(' '));
    await p.close();
  }

  // ---------- T2 hanzifayin ----------
  {
    const p = await open('hanzifayin');
    await p.evaluate(() => { window.__spoke = []; const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__spoke.push({ text: u.text, lang: u.lang }); orig(u); }; });
    await p.fill(T('textarea:not([aria-hidden]) >> nth=0'), '你好');
    await p.click(T('button:has-text("标准发音")'));
    await p.waitForTimeout(500);
    const spoke = await p.evaluate(() => window.__spoke);
    check('T2-27 发音', spoke.length === 1 && spoke[0].text === '你好' && spoke[0].lang === 'zh-CN', JSON.stringify(spoke));
    await p.close();
  }

  // ---------- T2 markmap ----------
  {
    const p = await open('markmap');
    await p.waitForTimeout(1500);
    const nodes = await p.$$eval('.pc-content svg.markmap g', gs => gs.length).catch(() => 0);
    const txt = await p.$eval('.pc-content svg.markmap', el => el.textContent).catch(() => '');
    check('T2-28 markmap render', nodes > 3 && txt.indexOf('一级标题') >= 0, `nodes=${nodes} txt=${txt.slice(0, 60)}`);
    await p.close();
  }

  // ---------- T2 zitie ----------
  {
    const p = await open('zitie_new');
    await p.waitForTimeout(12000);
    const info = await p.evaluate(() => {
      const pc = document.querySelector('.print-content');
      if (!pc || !pc.children.length) return null;
      const rows = pc.children.length;
      const first = pc.firstElementChild;
      const svgs = first.querySelectorAll('svg');
      const border = svgs[0] ? svgs[0].getAttribute('style') : '';
      const fills = [...first.querySelectorAll('path')].slice(0, 3).map(x => x.getAttribute('style'));
      return { rows, cells: first.children.length, border, fills };
    });
    check('T2-29 zitie render', info && info.rows === 100 && info.cells === 11 && info.border.indexOf('#11a45e') >= 0 && info.fills[0].indexOf('#000') >= 0, JSON.stringify(info));
    const combos = await p.$$('.pc-content [role="combobox"]');
    await combos[0].click();
    await p.waitForTimeout(400);
    let opts = await p.$$eval('li[role="option"]', ls => ls.map(l => l.textContent.replace(/\s+/g, '')));
    check('T2-30 年级12', opts.length === 12 && opts[0].indexOf('小学一年级') >= 0 && opts[11].indexOf('小学六年级') >= 0, JSON.stringify(opts));
    await p.keyboard.press('Escape');
    await p.waitForTimeout(300);
    await combos[1].click();
    await p.waitForTimeout(400);
    opts = await p.$$eval('li[role="option"]', ls => ls.map(l => l.textContent.replace(/\s+/g, '')));
    check('T2-30b 模板ABC', JSON.stringify(opts) === JSON.stringify(['模板A', '模板B', '模板C']), JSON.stringify(opts));
    await p.close();
  }

  // ---------- T2 handwriting ----------
  {
    const p = await open('handwriting_erasure');
    const txt = await p.$eval('.main-content', el => el.innerText);
    check('T2-31 上传区', txt.indexOf('将文件拖拽到虚框内') >= 0 && txt.indexOf('点击上传文件(小于8M)') >= 0 && txt.indexOf('效果预览') >= 0, txt.slice(0, 200));
    await p.close();
  }

  console.log(`\n===== RESULT: ${pass} passed, ${fail} failed =====`);
  failures.forEach(f => console.log('  ✗ ' + f));
  await b.close();
  process.exit(fail ? 1 : 0);
})();
