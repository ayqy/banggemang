# 历史朝代查询测试用例

## 页面范围
- 本地页面：`dynasties.html`
- 线上基线：`https://tool.browser.qq.com/dynasties.html`
- 页面标题：`历史朝代查询-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `dynasties.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认内容
- 操作：打开 `dynasties.html`。
- 线上预期：表格前部包含“夏朝 公元前2070-公元前1600”“秦朝 公元前221-公元前207”等条目。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
