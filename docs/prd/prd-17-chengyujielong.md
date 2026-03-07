# PRD-17 成语大全页面恢复

## 目标
- 以 `chengyujielong.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/chengyujielong.html` 一致的布局、交互和功能。
- 将 `chengyujielong.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/chengyujielong.html`
- 页面标题：`成语大全-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `chengyujielong.html`
- `assets/legacy/css/chengyujielong.css`
- `assets/legacy/js/chengyujielong.js`
- `docs/audit/dom/chengyujielong.html`
- `docs/audit/network/chengyujielong.json`
- `docs/audit/screenshots/live/chengyujielong.png`

## 交互流程
- 默认使用“汉字”查询模式。
- 输入首字后点击“查询”，结果区输出匹配成语列表。

## 本地恢复策略
- 本地镜像恢复，保留汉字/拼音/笔画数三种查询模式。

## 风险/例外
- 拼音/笔画模式保留但本次自动化只覆盖汉字模式。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `chengyujielong.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/chengyujielong.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
