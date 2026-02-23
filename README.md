# 自动测评评分

分支：claude-opus-4-6
总分：24/100
路由通过：4/17
用例通过：5/18

| Route | Case | 结果 | 备注 |
| --- | --- | --- | --- |
| education-home | education-home:tool-links | PASS |  |
| education-home | education-home:search-suggestion | PASS |  |
| handwriting_erasure | handwriting_erasure:upload-flow | FAILED | Test timeout of 15000ms exceeded. |
| zitie_new | zitie_new:render-on-input | FAILED | Error: expect(received).toBeGreaterThan(expected) Expected: > 0 Received: 0 Call Log: - Timeout 5000ms exceeded while waiting on the predicate |
| relatives_name | relatives_name:calc | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByText('弟妹', { exact: true }) Expected: visible Timeout: 5000ms Error: element(s) not found Call log: -  |
| school | school:filter-985 | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('row', { name: /南京信息工程大学/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not foun |
| wordcount | wordcount:calc-total | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByText('确认', { exact: true }).first() Expected: visible Timeout: 5000ms Error: element(s) not found Call |
| dynasties | dynasties:contains-yuan | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('row', { name: /元朝/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not found Call |
| capital | capital:contains-china-beijing | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('row', { name: /中华人民共和国/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not found |
| jielong | jielong:chain-starts-with-last-char | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('button', { name: '开始接龙' }).first() Expected: visible Timeout: 5000ms Error: element(s) not found |
| markmap | markmap:render-updates-preview | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByText('测试标题A', { exact: true }).first() Expected: visible Timeout: 5000ms Error: element(s) not found C |
| hanzifayin | hanzifayin:speak-or-audio | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('button', { name: /标准发音/ }).first() Expected: visible Timeout: 5000ms Error: element(s) not found |
| periodic | periodic:contains-hydrogen | PASS |  |
| translate | translate:switch-provider | FAILED | TimeoutError: locator.click: Timeout 10000ms exceeded. Call log: - waiting for getByRole('link', { name: '有道翻译' })  |
| radical | radical:query | PASS |  |
| allegory | allegory:query | PASS |  |
| explain | explain:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByText('守信用') Expected: visible Timeout: 5000ms Error: element(s) not found Call log: - Expect "toBeVisi |
| chengyujielong | chengyujielong:query-hanzi | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByRole('textbox', { name: '成语查询' }).first() Expected: visible Timeout: 5000ms Error: element(s) not foun |
