# PRD-04 亲戚关系计算页面恢复

## 目标
- 以 `relatives_name.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/relatives_name.html` 一致的布局、交互和功能。
- 将 `relatives_name.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/relatives_name.html`
- 页面标题：`亲戚关系计算-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `relatives_name.html`
- `assets/legacy/css/relatives_name.css`
- `assets/legacy/js/relatives_name.js`
- `docs/audit/dom/relatives_name.html`
- `docs/audit/network/relatives_name.json`
- `docs/audit/screenshots/live/relatives_name.png`

## 交互流程
- 默认展示“对方称呼我”“要找的称谓”等输入区与亲属按钮。
- 点击 `弟` 后将结果输入框更新为 `弟弟`。

## 本地恢复策略
- 本地镜像恢复，保留按钮式亲属链路拼接与称谓输出。

## 风险/例外
- 关系链较长时结果完全依赖原始 bundle 算法，当前按线上镜像保留。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `relatives_name.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/relatives-name.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
- 自动化覆盖：`tests/e2e/visual-parity.spec.ts`
