const { test, expect } = require('@playwright/test');

test('wordcount:calc-total', async ({ page }) => {
  await page.goto('/wordcount.html', { waitUntil: 'domcontentloaded' });

  const main = (await page.locator('main').count()) ? page.locator('main').first() : page;

  const input =
    (await main.getByRole('textbox', { name: '请输入' }).count())
      ? main.getByRole('textbox', { name: '请输入' }).first()
      : main.locator('textarea, input[type="text"]').first();

  await expect(input).toBeVisible();
  await input.fill('天地玄黄\nabc');

  const confirm =
    (await main.getByRole('button', { name: '确认' }).count())
      ? main.getByRole('button', { name: '确认' }).first()
      : main.getByText('确认', { exact: true }).first();

  await expect(confirm).toBeVisible();
  await confirm.click();

  await expect(main.getByText('总字数：5')).toBeVisible();
});

test('relatives_name:calc', async ({ page }) => {
  await page.goto('/relatives_name.html', { waitUntil: 'domcontentloaded' });

  const main = (await page.locator('main').count()) ? page.locator('main').first() : page;

  const input =
    (await main.getByRole('textbox', { name: '要找的称谓' }).count())
      ? main.getByRole('textbox', { name: '要找的称谓' }).first()
      : main.locator('input[type=\"text\"], textarea').first();

  await expect(input).toBeVisible();
  await input.fill('弟弟的老婆');

  // Remote output is "弟妹" for this input.
  await expect(main.getByText('弟妹', { exact: true })).toBeVisible();
});

test('jielong:start', async ({ page }) => {
  await page.goto('/jielong.html', { waitUntil: 'domcontentloaded' });

  const main = (await page.locator('main').count()) ? page.locator('main').first() : page;
  const startBtn = main.getByRole('button', { name: '开始接龙' }).first();

  await expect(startBtn).toBeVisible();
  await startBtn.click();

  // Remote renders a result table; we accept either a table or any visible "接龙" cell/button.
  const table = main.getByRole('table').first();
  if (await table.count()) {
    await expect(table).toBeVisible();
  } else {
    await expect(main.getByText('接龙', { exact: true }).first()).toBeVisible();
  }
});

