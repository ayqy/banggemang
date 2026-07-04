const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('https://tool.browser.qq.com/zitie_new.html', { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(6000);
  await p.click('.pc-content [role="combobox"] >> nth=0');
  await p.waitForTimeout(800);
  const menuHtml = await p.$eval('.MuiPopover-root, .MuiModal-root', el => el.outerHTML.slice(0, 2500)).catch(() => 'no menu el');
  const css = await p.evaluate(() => { const out = []; for (const ss of document.styleSheets) { if (ss.href) continue; try { for (const r of ss.cssRules) out.push(r.cssText); } catch(e){} } return out.join('\n'); });
  fs.writeFileSync('styles/zitie_new-menuopen.css', css);
  console.log('zitie menu css:', css.length, 'menu html head:', menuHtml.replace(/\s+/g,' ').slice(0, 1200));
  const p2 = await ctx.newPage();
  await p2.goto('https://tool.browser.qq.com/markmap.html', { waitUntil: 'networkidle', timeout: 45000 });
  await p2.waitForTimeout(2500);
  const svgInfo = await p2.evaluate(() => {
    const svg = document.querySelector('.pc-content svg, .main-content svg');
    const wrap = svg.parentElement;
    return { svgAttrs: [...svg.attributes].map(a => a.name + '=' + a.value).join(' '), wrapClass: wrap.className, wrapHTML: wrap.outerHTML.replace(svg.innerHTML, '...INNER...').slice(0, 800) };
  });
  console.log('markmap svg:', JSON.stringify(svgInfo).slice(0, 900));
  await b.close();
})();
