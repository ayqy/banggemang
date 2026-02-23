# 自动测评评分

分支：gpt-5-3-codex-xhigh
总分：97/100
路由通过：16/17
用例通过：17/18

| Route | Case | 结果 | 备注 |
| --- | --- | --- | --- |
| education-home | education-home:tool-links | PASS |  |
| education-home | education-home:search-suggestion | FAILED | Error: expect(locator).toBeVisible() failed Locator: locator('.search-panel').locator('a').filter({ hasText: '字数计算' }).first() Expected: visible Timeout: 5000ms |
| handwriting_erasure | handwriting_erasure:upload-flow | PASS |  |
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
| translate | translate:switch-provider | PASS |  |
| radical | radical:query | PASS |  |
| allegory | allegory:query | PASS |  |
| explain | explain:query | PASS |  |
| chengyujielong | chengyujielong:query-hanzi | PASS |  |
