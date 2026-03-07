# 高校查询测试用例

## 页面范围
- 本地页面：`school.html`
- 线上基线：`https://tool.browser.qq.com/school.html`
- 页面标题：`高校查询-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `school.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认表格
- 操作：打开 `school.html`。
- 线上预期：默认表格前部包含“清华大学”“北京大学”“北京工业大学”等院校行。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
