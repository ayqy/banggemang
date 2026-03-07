# 首页测试用例

## 页面范围
- 本地页面：`index.html`
- 线上基线：`https://tool.browser.qq.com/category/education`
- 页面标题：`帮小忙，腾讯QQ浏览器在线工具箱平台`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `index.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：16 个工具卡片
- 操作：打开 `index.html`。
- 线上预期：页面中展示 16 个 `.tool-item`，包含“去手写”“翻译”“成语大全”等入口。

### 用例 2：卡片跳转
- 操作：点击“字数计算”卡片。
- 线上预期：在新窗口打开本地 `wordcount.html`，标题为“字数计算-帮小忙，腾讯QQ浏览器在线工具箱”。

### 用例 3：搜索建议
- 操作：输入 `翻译`。
- 线上预期：出现 5 条建议：英语识别、搜狗百宝箱、英文创业公司/项目名生成、火星文翻译器、翻译；点击“翻译”打开本地 `translate.html`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/index-search.spec.ts`
- 相关自动化：`tests/e2e/file-mode.spec.ts`
- 相关自动化：`tests/e2e/visual-parity.spec.ts`
