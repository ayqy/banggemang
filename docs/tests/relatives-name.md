# 亲戚关系计算测试用例

## 页面范围
- 本地页面：`relatives_name.html`
- 线上基线：`https://tool.browser.qq.com/relatives_name.html`
- 页面标题：`亲戚关系计算-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `relatives_name.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：弟弟称谓
- 操作：点击 `弟`。
- 线上预期：结果输入框显示 `弟弟`。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/tool-behaviors.spec.ts`
- 相关自动化：`tests/e2e/visual-parity.spec.ts`
