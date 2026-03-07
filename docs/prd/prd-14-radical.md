# PRD-14 汉字偏旁页面恢复

## 目标
- 以 `radical.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/radical.html` 一致的布局、交互和功能。
- 将 `radical.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/radical.html`
- 页面标题：`汉字偏旁-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `radical.html`
- `assets/legacy/css/radical.css`
- `assets/legacy/js/radical.js`
- `docs/audit/dom/radical.html`
- `docs/audit/network/radical.json`
- `docs/audit/screenshots/live/radical.png`

## 交互流程
- 输入汉字并点击“查询”。
- 输出文本框显示对应偏旁。

## 本地恢复策略
- 本地镜像恢复，保留查询输入与结果输出。

## 风险/例外
- 偏旁查询由原始 bundle 数据与逻辑提供。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `radical.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/radical.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
