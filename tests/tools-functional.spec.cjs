const { test, expect } = require('@playwright/test');
const path = require('path');

async function getMain(page) {
  const main = page.locator('main');
  return (await main.count()) ? main.first() : page;
}

test('handwriting_erasure:upload-flow', async ({ page }) => {
  await page.goto('/handwriting_erasure.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const samplePdf = path.join(__dirname, 'fixtures', 'sample.pdf');

  const fileInput = main.locator('input[type="file"]').first();
  if (await fileInput.count()) {
    await fileInput.setInputFiles(samplePdf);
  } else {
    const uploadTrigger = main.getByText(/点击上传文件|上传文件/, { exact: false }).first();
    await expect(uploadTrigger).toBeVisible();

    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      uploadTrigger.click()
    ]);
    await chooser.setFiles(samplePdf);
  }

  const start = main.getByText(/开始(去除|处理)/).first();
  await expect(start).toBeVisible();

  // Some implementations may not actually process; we only require that clicking starts a flow and yields a status or a download entry.
  await start.click();

  const status = main.getByText(/去除(成功|失败)|处理(成功|失败)/).first();
  try {
    await expect(status).toBeVisible({ timeout: 10_000 });
  } catch {
    // Fallback: accept a visible download action.
    await expect(main.getByText(/下载/).first()).toBeVisible();
  }
});

test('zitie_new:render-on-input', async ({ page }) => {
  await page.goto('/zitie_new.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input =
    (await main.getByRole('textbox', { name: /请输入汉字/ }).count())
      ? main.getByRole('textbox', { name: /请输入汉字/ }).first()
      : main.locator('textarea').first();

  await expect(input).toBeVisible();

  const container = (await main.locator('#print-container').count())
    ? main.locator('#print-container').first()
    : main;

  await input.fill('一二三');
  // Remote initial content renders a lot of SVGs; we wait for it to react to a short input.
  await expect.poll(async () => await container.locator('svg').count()).toBeLessThan(500);
  const countShort = await container.locator('svg').count();

  await input.fill('一二三四五六七八九十');
  await expect.poll(async () => await container.locator('svg').count()).toBeGreaterThan(countShort);
  const countLong = await container.locator('svg').count();

  // Ensure output reacts to input length (remote: 33 -> 110).
  expect(countLong).toBeGreaterThan(countShort);
});

test('relatives_name:calc', async ({ page }) => {
  await page.goto('/relatives_name.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input =
    (await main.getByRole('textbox', { name: '要找的称谓' }).count())
      ? main.getByRole('textbox', { name: '要找的称谓' }).first()
      : main.locator('input[type="text"], textarea').first();

  await expect(input).toBeVisible();
  await input.fill('弟弟的老婆');

  await expect(main.getByText('弟妹', { exact: true })).toBeVisible();
});

test('school:filter-985', async ({ page }) => {
  await page.goto('/school.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const nju = main.getByRole('row', { name: /南京信息工程大学/ }).first();
  await expect(nju).toBeVisible();

  const radio985 = main.getByRole('radio', { name: '985' }).first();
  await expect(radio985).toBeVisible();
  await radio985.click();

  await expect(nju).toBeHidden();

  const qinghua = main.getByRole('row', { name: /清华大学/ }).first();
  await expect(qinghua).toBeVisible();
  await expect(qinghua).toContainText('双一流A');
});

test('wordcount:calc-total', async ({ page }) => {
  await page.goto('/wordcount.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input =
    (await main.getByPlaceholder('请输入').count())
      ? main.getByPlaceholder('请输入').first()
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

test('dynasties:contains-yuan', async ({ page }) => {
  await page.goto('/dynasties.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const row = main.getByRole('row', { name: /元朝/ }).first();
  await expect(row).toBeVisible();
  await expect(row).toContainText('大都');
  await expect(row).toContainText('北京');
});

test('capital:contains-china-beijing', async ({ page }) => {
  await page.goto('/capital.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const row = main.getByRole('row', { name: /中华人民共和国/ }).first();
  await expect(row).toBeVisible();
  await expect(row).toContainText('北京');
});

test('jielong:chain-starts-with-last-char', async ({ page }) => {
  await page.goto('/jielong.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input = main.getByRole('textbox').first();
  await expect(input).toBeVisible();
  await input.fill('开天辟地');

  const startBtn = main.getByRole('button', { name: '开始接龙' }).first();
  await expect(startBtn).toBeVisible();

  const lastChar = (await input.inputValue()).trim().slice(-1);
  await startBtn.click();

  const table = main.getByRole('table').first();
  await expect(table).toBeVisible();
  await expect(table.getByRole('cell', { name: new RegExp(`^${lastChar}`) }).first()).toBeVisible();
});

test('markmap:render-updates-preview', async ({ page }) => {
  await page.goto('/markmap.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const editor = (await main.locator('textarea').count())
    ? main.locator('textarea').first()
    : main.getByRole('textbox').first();
  await expect(editor).toBeVisible();
  await editor.fill('# 测试标题A\n## 子标题B');

  const renderBtn = main.getByRole('button', { name: '渲染导图' }).first();
  await expect(renderBtn).toBeVisible();
  await renderBtn.click();

  await expect(main.getByText('测试标题A', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('子标题B', { exact: true }).first()).toBeVisible();
});

test('hanzifayin:speak-or-audio', async ({ page }) => {
  await page.addInitScript(() => {
    // Instrument speechSynthesis.speak so we can assert the click triggers a pronunciation action.
    window.__speakCalls = 0;
    const synth = window.speechSynthesis;
    if (synth && typeof synth.speak === 'function') {
      const orig = synth.speak.bind(synth);
      synth.speak = (...args) => {
        window.__speakCalls += 1;
        try {
          return orig(...args);
        } catch {
          return undefined;
        }
      };
    } else {
      // Minimal stub for headless environments.
      window.speechSynthesis = {
        speak: () => {
          window.__speakCalls += 1;
        },
        cancel: () => {},
        getVoices: () => []
      };
    }
  });

  await page.goto('/hanzifayin.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input =
    (await main.getByRole('textbox', { name: /练习发音/ }).count())
      ? main.getByRole('textbox', { name: /练习发音/ }).first()
      : main.locator('textarea, input[type="text"]').first();
  await expect(input).toBeVisible();
  await input.fill('你好');

  const btn = main.getByRole('button', { name: /标准发音/ }).first();
  await expect(btn).toBeVisible();
  await btn.click();

  const calls = await page.evaluate(() => window.__speakCalls || 0);
  const audioCount = await main.locator('audio[src], audio source[src]').count();
  expect(calls > 0 || audioCount > 0).toBeTruthy();
});

test('periodic:contains-hydrogen', async ({ page }) => {
  await page.goto('/periodic.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  // The periodic table is large; match the Hydrogen cell by its accessible name.
  await expect(main.getByRole('cell', { name: /1\s*H\s*氢/ }).first()).toBeVisible({
    timeout: 10_000
  });
});

test('translate:switch-provider', async ({ page }) => {
  await page.goto('/translate.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const iframe = main.locator('iframe').first();
  await expect(iframe).toBeVisible();
  await expect(iframe).toHaveAttribute('src', /sogou/);

  await main.getByRole('link', { name: '有道翻译' }).click();
  await expect(iframe).toHaveAttribute('src', /youdao/);

  await main.getByRole('link', { name: '搜狗翻译' }).click();
  await expect(iframe).toHaveAttribute('src', /sogou/);
});

test('radical:query', async ({ page }) => {
  await page.goto('/radical.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input = main.getByRole('textbox', { name: /偏旁/ }).first();
  const query = main.getByRole('button', { name: '查询' }).first();
  const output = main.locator('textarea, input[type="text"]').nth(1);

  await expect(input).toBeVisible();
  await input.fill('明');

  await expect(query).toBeVisible();
  await query.click();

  // Remote renders the result in a disabled textbox.
  await expect(main.getByRole('textbox', { disabled: true }).first()).toHaveValue('日');
});

test('allegory:query', async ({ page }) => {
  await page.goto('/allegory.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input =
    (await main.getByRole('textbox', { name: '歇后语' }).count())
      ? main.getByRole('textbox', { name: '歇后语' }).first()
      : main.locator('input[type="text"], textarea').first();

  await expect(input).toBeVisible();
  await input.fill('八仙过海');

  const btn = main.getByRole('button', { name: '歇后语查询' }).first();
  await expect(btn).toBeVisible();
  await btn.click();

  await expect(main.getByText('各显神通')).toBeVisible();
});

test('explain:query', async ({ page }) => {
  await page.goto('/explain.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input = main.getByRole('textbox', { name: /查询汉词/ }).first();
  await expect(input).toBeVisible();
  await input.fill('一诺千金');

  const btn = main.getByRole('button', { name: '注解查询' }).first();
  await expect(btn).toBeVisible();
  await btn.click();

  await expect(main.getByText('守信用')).toBeVisible();
});

test('chengyujielong:query-hanzi', async ({ page }) => {
  await page.goto('/chengyujielong.html', { waitUntil: 'domcontentloaded' });
  const main = await getMain(page);

  const input = main.getByRole('textbox', { name: '成语查询' }).first();
  await expect(input).toBeVisible();
  await input.fill('五十');

  const btn = main.getByRole('button', { name: '查询' }).first();
  await expect(btn).toBeVisible();
  await btn.click();

  await expect(main.getByText('五十步笑百步', { exact: true })).toBeVisible();
});
