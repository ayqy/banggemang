# 歇后语测试用例

## 页面范围
- 本地页面：`allegory.html`
- 线上基线：`https://tool.browser.qq.com/allegory.html`
- 页面标题：`歇后语-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `allegory.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：关键词查询
- 操作：输入 `猫` 并点击“歇后语查询”。
- 线上预期：首条结果为 `1、钻进鸟笼里的猫-嘴馋上了当`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/tool-behaviors.spec.ts`
