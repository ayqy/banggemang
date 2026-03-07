# PRD-09 成语接龙页面恢复

## 目标
- 以 `jielong.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/jielong.html` 一致的布局、交互和功能。
- 将 `jielong.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/jielong.html`
- 页面标题：`成语接龙-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `jielong.html`
- `assets/legacy/css/jielong.css`
- `assets/legacy/js/jielong.js`
- `docs/audit/dom/jielong.html`
- `docs/audit/network/jielong.json`
- `docs/audit/screenshots/live/jielong.png`

## 交互流程
- 默认输入值为 `开天辟地`。
- 点击“开始接龙”后返回任一以 `地` 开头的四字成语，并支持继续接龙/换一换。

## 本地恢复策略
- 本地镜像恢复，保留默认词“开天辟地”、接龙与换一换逻辑。

## 风险/例外
- 首个接龙结果具有随机性，测试按“地字开头四字成语”规则校验，而不是固定某一个成语。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `jielong.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/jielong.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/tool-behaviors.spec.ts`
