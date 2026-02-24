const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const basePath = `file://${path.resolve(__dirname, '..')}`;
    
    console.log('Testing index.html...');
    await page.goto(`${basePath}/index.html`);
    const links = await page.$$eval('.tools-grid a', els => els.map(a => a.href));
    console.log(`Found ${links.length} tool links on index page.`);

    let passed = 0;
    for (const link of links) {
        console.log(`Testing ${link}...`);
        const response = await page.goto(link, { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        console.log(`  Title: ${title}`);
        
        // Ensure standard sidebar is there
        const sidebar = await page.$('.sidebar');
        if (sidebar) passed++;
    }

    console.log(`
Test Summary: ${passed} out of 16 pages passed basic layout check.`);

    await browser.close();
})();
