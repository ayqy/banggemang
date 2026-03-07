# PRD-11 汉字标准发音页面恢复

## 目标
- 以 `hanzifayin.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/hanzifayin.html` 一致的布局、交互和功能。
- 将 `hanzifayin.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/hanzifayin.html`
- 页面标题：`汉字标准发音-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `hanzifayin.html`
- `assets/legacy/css/hanzifayin.css`
- `assets/legacy/js/hanzifayin.js`
- `docs/audit/dom/hanzifayin.html`
- `docs/audit/network/hanzifayin.json`
- `docs/audit/screenshots/live/hanzifayin.png`

## 交互流程
- 输入需要练习的汉字。
- 点击“标准发音”触发浏览器/页面朗读能力。

## 本地恢复策略
- 本地镜像恢复，保留文字输入与标准发音按钮。

## 风险/例外
- 发音输出依赖浏览器音频/语音环境，自动化以页面稳定加载和入口可用为准。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `hanzifayin.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/hanzifayin.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
