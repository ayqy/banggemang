# PRD-08 各国首都页面恢复

## 目标
- 以 `capital.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/capital.html` 一致的布局、交互和功能。
- 将 `capital.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/capital.html`
- 页面标题：`各国首都-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `capital.html`
- `assets/legacy/css/capital.css`
- `assets/legacy/js/capital.js`
- `docs/audit/dom/capital.html`
- `docs/audit/network/capital.json`
- `docs/audit/screenshots/live/capital.png`

## 交互流程
- 页面打开后直接展示国家名称与首都列表。

## 本地恢复策略
- 本地镜像恢复，保留国家/首都双列表格。

## 风险/例外
- 国家与首都数据按线上快照恢复，不在本次任务中做现实世界校验更新。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `capital.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/capital.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
