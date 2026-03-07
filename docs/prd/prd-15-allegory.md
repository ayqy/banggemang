# PRD-15 歇后语页面恢复

## 目标
- 以 `allegory.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/allegory.html` 一致的布局、交互和功能。
- 将 `allegory.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/allegory.html`
- 页面标题：`歇后语-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `allegory.html`
- `assets/legacy/css/allegory.css`
- `assets/legacy/js/allegory.js`
- `docs/audit/dom/allegory.html`
- `docs/audit/network/allegory.json`
- `docs/audit/screenshots/live/allegory.png`

## 交互流程
- 输入关键词后点击“歇后语查询”。
- 结果区按编号输出匹配项。

## 本地恢复策略
- 本地镜像恢复，保留关键词查询和结果列表。

## 风险/例外
- 歇后语数据库按线上 bundle 镜像恢复。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `allegory.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/allegory.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
