const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = [
    '/handwriting_erasure.html', '/zitie_new.html', '/relatives_name.html',
    '/school.html', '/wordcount.html', '/dynasties.html', '/capital.html',
    '/jielong.html', '/markmap.html', '/hanzifayin.html', '/periodic.html',
    '/translate.html', '/radical.html', '/allegory.html', '/explain.html',
    '/chengyujielong.html'
  ];
  const baseUrl = 'https://tool.browser.qq.com';
  const results = {};

  for (const url of urls) {
    try {
      await page.goto(baseUrl + url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const title = await page.title();
      // just grab the main container text to get an idea of the inputs/outputs
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
      results[url] = { title, bodyText };
    } catch (e) {
      results[url] = { error: e.message };
    }
  }

  fs.writeFileSync('docs/pages_info.json', JSON.stringify(results, null, 2));
  await browser.close();
})();
