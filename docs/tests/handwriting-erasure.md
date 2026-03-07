# 去手写测试用例

## 页面范围
- 本地页面：`handwriting_erasure.html`
- 线上基线：`https://tool.browser.qq.com/handwriting_erasure.html`
- 页面标题：`去手写-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `handwriting_erasure.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认加载
- 操作：打开 `handwriting_erasure.html`。
- 线上预期：页面挂载远端 iframe，`#fallback` 保持隐藏。

### 用例 2：失败兜底
- 操作：模拟远端 iframe 加载失败。
- 线上预期：显示“直接打开线上页”链接作为兜底。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/file-mode.spec.ts`
