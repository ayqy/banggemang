# PRD-02 去手写壳页恢复

## 目标
- 以 `handwriting_erasure.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/handwriting_erasure.html` 一致的布局、交互和功能。
- 将 `handwriting_erasure.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/handwriting_erasure.html`
- 页面标题：`去手写-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `handwriting_erasure.html`
- `scripts/mirror-assets.mjs`
- `assets/shims/link-map.js`
- `docs/audit/dom/handwriting_erasure.html`
- `docs/audit/network/handwriting_erasure.json`
- `docs/audit/screenshots/live/handwriting_erasure.png`

## 交互流程
- 本地页打开后立即加载远端 `https://tool.browser.qq.com/handwriting_erasure.html` iframe。
- iframe 成功加载时不展示任何额外按钮。
- 仅在 iframe 失败时显示“直接打开线上页”兜底入口。

## 本地恢复策略
- 本地壳页 + 全屏远端 iframe；加载失败时再显示兜底链接。

## 风险/例外
- 上传、鉴权和处理链路仍依赖远端服务，无法在纯本地静态资源中复刻。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `handwriting_erasure.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/handwriting-erasure.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/file-mode.spec.ts`
