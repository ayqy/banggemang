# PRD-10 便捷思维导图页面恢复

## 目标
- 以 `markmap.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/markmap.html` 一致的布局、交互和功能。
- 将 `markmap.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/markmap.html`
- 页面标题：`便捷思维导图-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `markmap.html`
- `assets/legacy/css/markmap.css`
- `assets/legacy/js/markmap.js`
- `docs/audit/dom/markmap.html`
- `docs/audit/network/markmap.json`
- `docs/audit/screenshots/live/markmap.png`

## 交互流程
- 默认左侧文本框内预填一级/二级/三级标题示例。
- 点击“渲染导图”后在右侧展示层级结构。

## 本地恢复策略
- 本地镜像恢复并保留 quirks mode、默认 Markdown 示例和渲染导图入口。

## 风险/例外
- 思维导图渲染依赖浏览器 SVG/Canvas 能力，当前以默认示例及渲染按钮存在性作为自动化基线。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `markmap.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/markmap.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
