# 翻译测试用例

## 页面范围
- 本地页面：`translate.html`
- 线上基线：`https://tool.browser.qq.com/translate.html`
- 页面标题：`翻译-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `translate.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认 vendor
- 操作：打开 `translate.html`。
- 线上预期：默认 iframe 地址为 `https://fanyi.sogou.com/text`。

### 用例 2：切换 vendor
- 操作：依次点击 5 个 vendor 标签。
- 线上预期：iframe 地址依次切换到搜狗、腾讯、有道、微软、CNKI 对应站点。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
- 相关自动化：`tests/e2e/tool-behaviors.spec.ts`
- 相关自动化：`tests/e2e/file-mode.spec.ts`
- 相关自动化：`tests/e2e/visual-parity.spec.ts`
