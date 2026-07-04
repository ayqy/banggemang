const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  p.on('requestfailed', r => console.log('FAILED:', r.url()));
  await p.goto('file:///home/seat2036/work/banggemang/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  await b.close();
})();
