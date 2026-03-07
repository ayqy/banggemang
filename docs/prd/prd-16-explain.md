# PRD-16 词语注解页面恢复

## 目标
- 以 `explain.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/explain.html` 一致的布局、交互和功能。
- 将 `explain.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/explain.html`
- 页面标题：`词语注解-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `explain.html`
- `assets/legacy/css/explain.css`
- `assets/legacy/js/explain.js`
- `assets/shims/runtime-bootstrap.js`
- `docs/audit/dom/explain.html`
- `docs/audit/network/explain.json`
- `docs/audit/screenshots/live/explain.png`

## 交互流程
- 输入词语后点击“注解查询”。
- 页面从 `cnchar-data` explanation 数据源读取释义并渲染到结果区。

## 本地恢复策略
- 本地镜像恢复 + 运行时代理 `cnchar-data` explanation 词库请求。

## 风险/例外
- 解释词库来自线上同源外部资源；本地通过运行时代理解决 `file://` 下 XHR 兼容问题。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `explain.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/explain.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
- 自动化覆盖：`tests/e2e/visual-parity.spec.ts`
