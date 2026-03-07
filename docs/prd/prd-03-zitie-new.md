# PRD-03 字帖生成页面恢复

## 目标
- 以 `zitie_new.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/zitie_new.html` 一致的布局、交互和功能。
- 将 `zitie_new.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/zitie_new.html`
- 页面标题：`字帖生成-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `zitie_new.html`
- `assets/legacy/css/zitie_new.css`
- `assets/legacy/js/zitie_new.js`
- `docs/audit/dom/zitie_new.html`
- `docs/audit/network/zitie_new.json`
- `docs/audit/screenshots/live/zitie_new.png`

## 交互流程
- 默认展示“小学一年级（上）”字帖内容与模板 A。
- 支持切换年级/模板、重置和打印。

## 本地恢复策略
- 本地镜像恢复，保留默认年级、模板和打印入口。

## 风险/例外
- 打印动作依赖浏览器打印能力，自动化仅校验默认状态与入口显示。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `zitie_new.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/zitie-new.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
