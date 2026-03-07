# PRD-18 回归与交付收尾

## 目标
- 汇总教育分类首页与 16 个二级页的恢复结果，形成可继续迭代的本地源码基线。
- 通过 Playwright 回归确认 `file://` 打开场景、动态交互和视觉采样均可用。

## 线上基线
- 基线总文档：`docs/audit/live-baseline-2026-03-06.md`
- 基线截图目录：`docs/audit/screenshots/live`
- 基线 DOM 目录：`docs/audit/dom`
- 基线网络目录：`docs/audit/network`

## 资源清单
- 根目录本地页面：`index.html` + 16 个二级页。
- 恢复脚本：`scripts/recover-pages.mjs`、`scripts/mirror-assets.mjs`、`scripts/extract-media.mjs`、`scripts/capture-fixtures.mjs`、`scripts/beautify-bundles.mjs`。
- 运行时兼容：`assets/shims/link-map.js`、`assets/shims/runtime-bootstrap.js`。
- 自动化测试：`tests/e2e/*.spec.ts`。

## 交互流程
- 运行 `npm run build` 或分步脚本可重建页面、资源和审计产物。
- 运行 `npm run test:e2e` 执行 smoke、首页搜索、工具行为、视觉采样、file 模式回归。

## 本地恢复策略
- 15 个可静态镜像页面采用本地 HTML/CSS/JS 直接恢复。
- `handwriting_erasure.html` 采用本地壳页 + 远端 iframe。
- `translate.html` 保留第三方翻译站点 iframe。
- `explain.html` 通过运行时代理补齐 `cnchar-data` explanation 词库请求。

## 风险/例外
- 去手写、翻译、汉字标准发音等能力仍依赖远端服务或浏览器能力。
- 首页搜索建议中未恢复的工具保持线上跳转。

## 进度
- 2026-03-06：已生成 17 个本地 HTML 交付页。
- 2026-03-06：已补齐 `docs/prd/*` 与 `docs/tests/*` 文档。
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 当前状态：完成。

## 测试用例
- 自动化：`tests/e2e/smoke.spec.ts`、`tests/e2e/index-search.spec.ts`、`tests/e2e/tool-behaviors.spec.ts`、`tests/e2e/visual-parity.spec.ts`、`tests/e2e/file-mode.spec.ts`。
- 文档：`docs/tests/index.md` 到 `docs/tests/chengyujielong.md`。
