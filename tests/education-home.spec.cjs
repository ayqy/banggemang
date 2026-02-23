const { test, expect } = require('@playwright/test');

const { loadEducationHomeDom } = require('./helpers/baseline.cjs');
const tools = require('./fixtures/tools.json');

test('education-home:basic-structure', async ({ page }) => {
  const baseline = loadEducationHomeDom();

  await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(baseline.title);

  for (const label of baseline.navLabels) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }

  for (const name of baseline.toolNames) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }

  // Footer should exist on the remote page; we check for the copyright keyword.
  await expect(page.getByText('Copyright')).toBeVisible();
});

test('education-home:tool-links', async ({ page }) => {
  await page.goto('/index.html', { waitUntil: 'domcontentloaded' });

  for (const tool of tools) {
    const absHref = tool.href;
    const relHref = absHref.replace(/^\//, '');

    const link = page.locator(`a[href="${absHref}"], a[href="${relHref}"]`).first();
    await expect(link, `missing link for ${tool.name} (${tool.href})`).toBeVisible();

    // Tool card should contain the tool name (text could be in child nodes).
    await expect(link, `link text mismatch for ${tool.name}`).toContainText(tool.name);
  }
});

test('education-home:search-suggestion', async ({ page }) => {
  await page.goto('/index.html', { waitUntil: 'domcontentloaded' });

  const searchInput =
    (await page.locator('input.search-input').count())
      ? page.locator('input.search-input').first()
      : page.getByRole('textbox').first();

  await expect(searchInput).toBeVisible();
  await searchInput.fill('字数');

  // Prefer matching inside the suggestion panel if it exists.
  const panel = page.locator('.search-panel');
  const suggestionScope = (await panel.count()) ? panel : page;
  const suggestion = suggestionScope.locator('a', { hasText: '字数计算' }).first();

  await expect(suggestion).toBeVisible();
  const href = (await suggestion.getAttribute('href')) || '';
  expect(href, 'suggestion href should point to wordcount').toContain('wordcount.html');

  // Remote uses target=_blank; local implementations should match, but we don't hard-fail if missing.
  const target = await suggestion.getAttribute('target');
  if (target !== null) {
    expect(target).toBe('_blank');
  }
});
