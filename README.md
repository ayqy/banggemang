# 自动测评评分

分支：qwen-3-5-plus-30min
总分：3/100
路由通过：0/17
用例通过：1/18

| Route | Case | 结果 | 备注 |
| --- | --- | --- | --- |
| education-home | education-home:tool-links | FAILED | Error: missing link for 去手写 (/handwriting_erasure.html) expect(locator).toBeVisible() failed Locator: locator('a[href="/handwriting_erasure.html"], a[href="hand |
| education-home | education-home:search-suggestion | PASS |  |
| handwriting_erasure | handwriting_erasure:upload-flow | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByText(/点击上传文件|上传文件/).first() Expected: visible Timeout: 5000ms Error: element(s) not found Call log: -  |
| zitie_new | zitie_new:render-on-input | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('textarea').first() Expected: visible Timeout: 5000ms Error: element(s) not found Call log: - Expec |
| relatives_name | relatives_name:calc | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('input[type="text"], textarea').first() Expected: visible Timeout: 5000ms Error: element(s) not fou |
| school | school:filter-985 | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('row', { name: /南京信息工程大学/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not foun |
| wordcount | wordcount:calc-total | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('textarea, input[type="text"]').first() Expected: visible Timeout: 5000ms Error: element(s) not fou |
| dynasties | dynasties:contains-yuan | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('row', { name: /元朝/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not found Call |
| capital | capital:contains-china-beijing | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('row', { name: /中华人民共和国/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not found |
| jielong | jielong:chain-starts-with-last-char | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('textbox').first() Expected: visible Timeout: 5000ms Error: element(s) not found Call log: - Expe |
| markmap | markmap:render-updates-preview | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('textbox').first() Expected: visible Timeout: 5000ms Error: element(s) not found Call log: - Expe |
| hanzifayin | hanzifayin:speak-or-audio | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('textarea, input[type="text"]').first() Expected: visible Timeout: 5000ms Error: element(s) not fou |
| periodic | periodic:contains-hydrogen | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('cell', { name: /1\s*H\s*氢/ }).first() Expected: visible Timeout: 10000ms Error: element(s) not f |
| translate | translate:switch-provider | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('iframe').first() Expected: visible Timeout: 5000ms Error: element(s) not found Call log: - Expect  |
| radical | radical:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('textbox', { name: /偏旁/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not found  |
| allegory | allegory:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('input[type="text"], textarea').first() Expected: visible Timeout: 5000ms Error: element(s) not fou |
| explain | explain:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('textbox', { name: /查询汉词/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not foun |
| chengyujielong | chengyujielong:query-hanzi | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('textbox', { name: '成语查询' }).first() Expected: visible Timeout: 5000ms Error: element(s) not foun |
