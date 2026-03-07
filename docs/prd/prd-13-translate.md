# PRD-13 翻译聚合页面恢复

## 目标
- 以 `translate.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/translate.html` 一致的布局、交互和功能。
- 将 `translate.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/translate.html`
- 页面标题：`翻译-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `translate.html`
- `assets/legacy/css/translate.css`
- `assets/legacy/js/translate.js`
- `assets/shims/link-map.js`
- `docs/audit/dom/translate.html`
- `docs/audit/network/translate.json`
- `docs/audit/screenshots/live/translate.png`

## 交互流程
- 默认展示“搜狗翻译”并加载 `https://fanyi.sogou.com/text`。
- 点击“腾讯翻译 / 有道翻译 / 微软翻译 / CNKI学术翻译”时切换 iframe 地址。

## 本地恢复策略
- 本地镜像恢复 + 第三方 iframe；保留 5 个 vendor 标签切换。

## 风险/例外
- 具体翻译能力依赖第三方站点 iframe。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `translate.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/translate.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
- 自动化覆盖：`tests/e2e/file-mode.spec.ts`
- 自动化覆盖：`tests/e2e/visual-parity.spec.ts`
