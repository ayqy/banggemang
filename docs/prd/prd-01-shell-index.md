# PRD-01 首页壳页与入口恢复

## 目标
- 以 `index.html` 为交付入口，恢复与线上 `https://tool.browser.qq.com/category/education` 一致的布局、交互和功能。
- 将 `index.html` 纳入后续教育工具版本迭代的本地源码基线。

## 线上基线
- 线上地址：`https://tool.browser.qq.com/category/education`
- 页面标题：`帮小忙，腾讯QQ浏览器在线工具箱平台`
- 基线审计：`docs/audit/live-baseline-2026-03-06.md`

## 资源清单
- `index.html`
- `assets/legacy/css/pchome.css`
- `assets/legacy/js/pchome.js`
- `assets/data/tool-list.js`
- `assets/data/shared-stubs.js`
- `assets/data/statistics-fallback.js`
- `assets/shims/link-map.js`
- `assets/shims/runtime-bootstrap.js`
- `docs/audit/dom/index.html`
- `docs/audit/network/index.json`
- `docs/audit/screenshots/live/index.png`

## 交互流程
- 页面加载后展示教育分类首页、左侧导航、搜索框、16 个工具卡片和分享/反馈入口。
- 点击 16 个工具卡片均以新窗口方式打开对应本地 HTML。
- 搜索框输入“翻译”时展示 5 条线上同款建议，并将本地已恢复页面重写到 `file://` 本地地址。

## 本地恢复策略
- 本地镜像恢复 + 运行时链接重写 + 统计/工具列表本地桩数据。

## 风险/例外
- 搜索结果中未恢复的站点入口保持线上地址。
- 累计帮助人次在 `file://` 下使用本地快照，避免跨域报错。

## 进度
- 2026-03-06：已完成线上 DOM / 网络 / 截图基线采集。
- 2026-03-06：已完成 `index.html` 本地恢复、资源接管和运行时兼容层接入。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 用例文档：`docs/tests/index.md`
- 自动化覆盖：`tests/e2e/smoke.spec.ts`
- 自动化覆盖：`tests/e2e/index-search.spec.ts`
- 自动化覆盖：`tests/e2e/file-mode.spec.ts`
- 自动化覆盖：`tests/e2e/visual-parity.spec.ts`
