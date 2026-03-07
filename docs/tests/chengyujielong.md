# 成语大全测试用例

## 页面范围
- 本地页面：`chengyujielong.html`
- 线上基线：`https://tool.browser.qq.com/chengyujielong.html`
- 页面标题：`成语大全-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `chengyujielong.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：汉字查询
- 操作：输入 `美` 并点击“查询”。
- 线上预期：结果前列包含 `美不胜收`、`美轮美奂`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/tool-behaviors.spec.ts`
