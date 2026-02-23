# 自动测评评分

分支：glm-5-qoder
总分：12/100
路由通过：2/17
用例通过：3/18

| Route | Case | 结果 | 备注 |
| --- | --- | --- | --- |
| education-home | education-home:tool-links | PASS |  |
| education-home | education-home:search-suggestion | PASS |  |
| handwriting_erasure | handwriting_erasure:upload-flow | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByText(/开始(去除|处理)/).first() Expected: visible Timeout: 5000ms Error: element(s)  |
| zitie_new | zitie_new:render-on-input | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().locator('textarea').first() Expected: visible Timeout: 5000ms Error: element(s) not |
| relatives_name | relatives_name:calc | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().locator('input[type="text"], textarea').first() Expected: visible Timeout: 5000ms E |
| school | school:filter-985 | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('row', { name: /南京信息工程大学/ }).first() Expected: visible Timeout: 5000ms Er |
| wordcount | wordcount:calc-total | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByText('总字数：5') Expected: visible Timeout: 5000ms Error: element(s) not found Ca |
| dynasties | dynasties:contains-yuan | PASS |  |
| capital | capital:contains-china-beijing | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('row', { name: /中华人民共和国/ }).first() Expected: visible Timeout: 5000ms Err |
| jielong | jielong:chain-starts-with-last-char | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('table').first() Expected: visible Timeout: 5000ms Error: element(s) not  |
| markmap | markmap:render-updates-preview | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('button', { name: '渲染导图' }).first() Expected: visible Timeout: 5000ms Err |
| hanzifayin | hanzifayin:speak-or-audio | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('button', { name: /标准发音/ }).first() Expected: visible Timeout: 5000ms Err |
| periodic | periodic:contains-hydrogen | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('cell', { name: /1\s*H\s*氢/ }).first() Expected: visible Timeout: 10000ms |
| translate | translate:switch-provider | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().locator('iframe').first() Expected: visible Received: hidden Timeout: 5000ms Call l |
| radical | radical:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('textbox', { name: /偏旁/ }).first() Expected: visible Timeout: 5000ms Erro |
| allegory | allegory:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('button', { name: '歇后语查询' }).first() Expected: visible Timeout: 5000ms Er |
| explain | explain:query | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('textbox', { name: /查询汉词/ }).first() Expected: visible Timeout: 5000ms Er |
| chengyujielong | chengyujielong:query-hanzi | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('main').first().getByRole('textbox', { name: '成语查询' }).first() Expected: visible Timeout: 5000ms Er |
