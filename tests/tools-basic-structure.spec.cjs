const { test, expect } = require('@playwright/test');

const { loadBasicStructureScenarios } = require('./helpers/baseline.cjs');

async function countVisible(locator) {
  const n = await locator.count();
  let visible = 0;
  for (let i = 0; i < n; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await locator.nth(i).isVisible()) visible += 1;
  }
  return visible;
}

for (const scenario of loadBasicStructureScenarios()) {
  const { routeId, expected } = scenario;

  test(`${routeId}:basic-structure`, async ({ page }) => {
    await page.goto(scenario.remotePath, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(expected.pageTitle);
    await expect(page.getByText(expected.toolTitle, { exact: true })).toBeVisible();

    // Remote pages include these two sections.
    await expect(page.getByRole('heading', { name: '工具介绍及使用方法' })).toBeVisible();
    await expect(page.getByText('更多推荐', { exact: true })).toBeVisible();
    await expect(page.getByText(expected.firstRecommend, { exact: true })).toBeVisible();

    for (const btnText of expected.buttonTexts) {
      await expect(page.getByText(btnText, { exact: true })).toBeVisible();
    }

    const scope = (await page.locator('main').count())
      ? page.locator('main').first()
      : page.locator('body');

    const inputs = scope.locator('input:not([type=\"hidden\"]):not(.search-input), textarea');
    await expect
      .poll(async () => countVisible(inputs), { timeout: 5_000 })
      .toBe(expected.inputCount);
  });
}

