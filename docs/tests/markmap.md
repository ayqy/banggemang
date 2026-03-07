# 便捷思维导图测试用例

## 页面范围
- 本地页面：`markmap.html`
- 线上基线：`https://tool.browser.qq.com/markmap.html`
- 页面标题：`便捷思维导图-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `markmap.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认示例
- 操作：打开 `markmap.html`。
- 线上预期：页面默认显示“一级标题 / 二级标题1 / 三级标题1”等渲染结果与“渲染导图”按钮。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
