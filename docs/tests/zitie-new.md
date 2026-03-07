# 字帖生成测试用例

## 页面范围
- 本地页面：`zitie_new.html`
- 线上基线：`https://tool.browser.qq.com/zitie_new.html`
- 页面标题：`字帖生成-帮小忙，腾讯QQ浏览器在线工具箱`

## 前置条件
- 使用浏览器以 `file://` 方式打开 `zitie_new.html`。
- 视口基线为 1440 × 1200。

## 用例清单
### 用例 1：默认状态
- 操作：打开 `zitie_new.html`。
- 线上预期：显示“小学一年级（上）”“模板A”，输入区前缀内容为“一 二 三 十 …”。

## 执行结果
- 2026-03-06 运行 `npm run test:e2e`，36 个 E2E 用例全部通过。
- 相关自动化：`tests/e2e/smoke.spec.ts`
