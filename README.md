# 自动测评评分

分支：gemini-3.1-pro-preview
总分：18/100
路由通过：3/17
用例通过：4/18

| Route | Case | 结果 | 备注 |
| --- | --- | --- | --- |
| education-home | education-home:tool-links | PASS |  |
| education-home | education-home:search-suggestion | PASS |  |
| handwriting_erasure | handwriting_erasure:upload-flow | FAILED | Test timeout of 15000ms exceeded. |
| zitie_new | zitie_new:render-on-input | FAILED | Error: expect(received).toBeGreaterThan(expected) Expected: > 0 Received: 0 Call Log: - Timeout 5000ms exceeded while waiting on the predicate |
| relatives_name | relatives_name:calc | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().locator('input[type="text"], textarea').first() Expected: visible Timeout: 5000ms E |
| school | school:filter-985 | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('row', { name: /南京信息工程大学/ }).first() Expected: visible Timeout: 5000ms Er |
| wordcount | wordcount:calc-total | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByText('总字数：5') Expected: visible Timeout: 5000ms Error: element(s) not found Ca |
| dynasties | dynasties:contains-yuan | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('row', { name: /元朝/ }).first() Expected: visible Timeout: 5000ms Error: e |
| capital | capital:contains-china-beijing | PASS |  |
| jielong | jielong:chain-starts-with-last-char | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('table').first() Expected: visible Timeout: 5000ms Error: element(s) not  |
| markmap | markmap:render-updates-preview | FAILED | TimeoutError: page.goto: Timeout 10000ms exceeded. Call log: - navigating to "http://127.0.0.1:54829/markmap.html", waiting until "domcontentloaded"  |
| hanzifayin | hanzifayin:speak-or-audio | PASS |  |
| periodic | periodic:contains-hydrogen | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('cell', { name: /1\s*H\s*氢/ }).first() Expected: visible Timeout: 10000ms |
| translate | translate:switch-provider | FAILED | TimeoutError: locator.click: Timeout 10000ms exceeded. Call log: - waiting for locator('main').first().getByRole('link', { name: '有道翻译' })  |
| radical | radical:query | FAILED | Error: expect(locator).toHaveValue(expected) failed Locator: locator('main').first().getByRole('textbox', { disabled: true }).first() Expected: "日" Timeout: 500 |
| allegory | allegory:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByText('各显神通') Expected: visible Timeout: 5000ms Error: element(s) not found Cal |
| explain | explain:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('textbox', { name: /查询汉词/ }).first() Expected: visible Timeout: 5000ms Er |
| chengyujielong | chengyujielong:query-hanzi | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('textbox', { name: '成语查询' }).first() Expected: visible Timeout: 5000ms Er |
