# PRD-12 元素周期表页面恢复

## 目标
- 以 `periodic.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/periodic.html` 一致的布局、交互和功能。
- 将 `periodic.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/periodic.html`
- 页面标题：`元素周期表-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `periodic.html`
- `assets/legacy/css/periodic.css`
- `assets/legacy/js/periodic.js`
- `docs/audit/dom/periodic.html`
- `docs/audit/network/periodic.json`
- `docs/audit/screenshots/live/periodic.png`

## 交互流程
- 页面打开后展示周期表网格及元素编号、符号、中文名、拼音和原子量。

## 本地恢复策略
- 本地镜像恢复，保留周期表布局与元素信息。

## 风险/例外
- 化学元素数据按线上快照恢复。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `periodic.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/periodic.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
