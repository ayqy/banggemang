# PRD-07 历史朝代查询页面恢复

## 目标
- 以 `dynasties.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/dynasties.html` 一致的布局、交互和功能。
- 将 `dynasties.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/dynasties.html`
- 页面标题：`历史朝代查询-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `dynasties.html`
- `assets/legacy/css/dynasties.css`
- `assets/legacy/js/dynasties.js`
- `docs/audit/dom/dynasties.html`
- `docs/audit/network/dynasties.json`
- `docs/audit/screenshots/live/dynasties.png`

## 交互流程
- 页面打开后直接展示从夏朝到后续朝代的表格信息。

## 本地恢复策略
- 本地镜像恢复，保留完整朝代表格。

## 风险/例外
- 历史表数据为快照恢复，如需新增注释或新字段应在后续版本评估。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `dynasties.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/dynasties.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
