# 各国首都测试用例

## 页面范围
- 本地页面：`capital.html`
- 线上基线：`https://tool.browser.qq.com/capital.html`
- 页面标题：`各国首都-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `capital.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认内容
- 操作：打开 `capital.html`。
- 线上预期：列表首部包含“中华人民共和国_People's Republic of China -> 北京_Beijing”。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
