# PRD-05 高校查询页面恢复

## 目标
- 以 `school.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/school.html` 一致的布局、交互和功能。
- 将 `school.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/school.html`
- 页面标题：`高校查询-帮小忙，腾讯QQ浏览器在线工具箱`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `school.html`
- `assets/legacy/css/school.css`
- `assets/legacy/js/school.js`
- `docs/audit/dom/school.html`
- `docs/audit/network/school.json`
- `docs/audit/screenshots/live/school.png`

## 交互流程
- 默认展示全部高校数据表，包含 985/211/双一流标签。
- 支持按“全部 / 985 / 211 / 双一流A / 双一流B / 一流学科”筛选。

## 本地恢复策略
- 本地镜像恢复，保留静态院校表格与分类筛选。

## 风险/例外
- 当前院校数据为线上基线快照，后续如有院校名录变更需单独更新数据源。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `school.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/school.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
