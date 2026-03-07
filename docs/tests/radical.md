# 汉字偏旁测试用例

## 页面范围
- 本地页面：`radical.html`
- 线上基线：`https://tool.browser.qq.com/radical.html`
- 页面标题：`汉字偏旁-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `radical.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：偏旁查询
- 操作：输入 `明` 并点击“查询”。
- 线上预期：结果输出为 `日`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/tool-behaviors.spec.ts`
