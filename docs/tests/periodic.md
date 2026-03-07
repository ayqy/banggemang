# 元素周期表测试用例

## 页面范围
- 本地页面：`periodic.html`
- 线上基线：`https://tool.browser.qq.com/periodic.html`
- 页面标题：`元素周期表-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `periodic.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认内容
- 操作：打开 `periodic.html`。
- 线上预期：顶部元素区包含 `1 H 氢qīng 1.0079` 与 `8 O 氧yǎng 15.999`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
