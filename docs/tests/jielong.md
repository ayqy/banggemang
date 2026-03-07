# 成语接龙测试用例

## 页面范围
- 本地页面：`jielong.html`
- 线上基线：`https://tool.browser.qq.com/jielong.html`
- 页面标题：`成语接龙-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `jielong.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认接龙
- 操作：保持默认词 `开天辟地`，点击“开始接龙”。
- 线上预期：首个结果为任一 `地` 字开头四字成语，例如 `地动山摧` 或 `地网天罗`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/tool-behaviors.spec.ts`
