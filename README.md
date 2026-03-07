# 自动测评评分

分支：gpt-5-4-codex-xhigh
总分：85/100
路由通过：14/17
用例通过：15/18

| Route | Case | 结果 | 备注 |
| --- | --- | --- | --- |
| education-home | education-home:tool-links | FAILED | Error: missing link for 去手写 (/handwriting_erasure.html) expect(locator).toBeVisible() failed Locator: locator('a[href="/handwriting_erasure.html"], a[href="hand |
| education-home | education-home:search-suggestion | PASS |  |
| handwriting_erasure | handwriting_erasure:upload-flow | FAILED | Error: expect(locator).toBeVisible() failed Locator: getByText(/点击上传文件|上传文件/).first() Expected: visible Timeout: 5000ms Error: element(s) not found Call log: -  |
| zitie_new | zitie_new:render-on-input | PASS |  |
| relatives_name | relatives_name:calc | PASS |  |
| school | school:filter-985 | PASS |  |
| wordcount | wordcount:calc-total | PASS |  |
| dynasties | dynasties:contains-yuan | PASS |  |
| capital | capital:contains-china-beijing | PASS |  |
| jielong | jielong:chain-starts-with-last-char | PASS |  |
| markmap | markmap:render-updates-preview | PASS |  |
| hanzifayin | hanzifayin:speak-or-audio | PASS |  |
| periodic | periodic:contains-hydrogen | PASS |  |
| translate | translate:switch-provider | FAILED | Error: expect(locator).toHaveAttribute(expected) failed Locator: locator('main').first().locator('iframe').first() Expected pattern: /sogou/ Received string: "h |
| radical | radical:query | PASS |  |
| allegory | allegory:query | PASS |  |
| explain | explain:query | PASS |  |
| chengyujielong | chengyujielong:query-hanzi | PASS |  |
