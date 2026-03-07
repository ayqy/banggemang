# PRD-06 字数计算页面恢复

## 目标
- 以 `wordcount.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/wordcount.html` 一致的布局、交互和功能。
- 将 `wordcount.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/wordcount.html`
- 页面标题：`字数计算-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `wordcount.html`
- `assets/legacy/css/wordcount.css`
- `assets/legacy/js/wordcount.js`
- `docs/audit/dom/wordcount.html`
- `docs/audit/network/wordcount.json`
- `docs/audit/screenshots/live/wordcount.png`

## 交互流程
- 输入文本后点击“确认”，结果区显示“总字数：N”。
- 点击“清空”清除输入与输出。

## 本地恢复策略
- 本地镜像恢复，保留输入/确认/清空和结果输出逻辑。

## 风险/例外
- 结果定义沿用线上逻辑：空格、换行不计入字数。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `wordcount.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/wordcount.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
- 自动化覆盖：`tests/e2e/visual-parity.spec.ts`
