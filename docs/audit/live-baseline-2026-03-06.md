# 线上基线审计（2026-03-06）

- 审计日期：2026-03-06
- 审计来源：`https://tool.browser.qq.com/category/education` 及 16 个教育工具二级页
- 恢复总策略：主页与 15 个可静态镜像页面采用本地镜像恢复；`handwriting_erasure.html` 采用本地壳页 + 全屏 iframe。

## 页面清单

- 页面：`index.html`；线上：https://tool.browser.qq.com/category/education；标题：帮小忙，腾讯QQ浏览器在线工具箱平台；恢复策略：本地镜像恢复
- 页面：`handwriting_erasure.html`；线上：https://tool.browser.qq.com/handwriting_erasure.html；标题：去手写-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地壳页 + 全屏 iframe
- 页面：`zitie_new.html`；线上：https://tool.browser.qq.com/zitie_new.html；标题：字帖生成-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`relatives_name.html`；线上：https://tool.browser.qq.com/relatives_name.html；标题：亲戚关系计算-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`school.html`；线上：https://tool.browser.qq.com/school.html；标题：高校查询-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`wordcount.html`；线上：https://tool.browser.qq.com/wordcount.html；标题：字数计算-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`dynasties.html`；线上：https://tool.browser.qq.com/dynasties.html；标题：历史朝代查询-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`capital.html`；线上：https://tool.browser.qq.com/capital.html；标题：各国首都-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`jielong.html`；线上：https://tool.browser.qq.com/jielong.html；标题：成语接龙-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`markmap.html`；线上：https://tool.browser.qq.com/markmap.html；标题：便捷思维导图-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复（保留 quirks mode）
- 页面：`hanzifayin.html`；线上：https://tool.browser.qq.com/hanzifayin.html；标题：汉字标准发音-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`periodic.html`；线上：https://tool.browser.qq.com/periodic.html；标题：元素周期表-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`translate.html`；线上：https://tool.browser.qq.com/translate.html；标题：翻译-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复 + 第三方 iframe
- 页面：`radical.html`；线上：https://tool.browser.qq.com/radical.html；标题：汉字偏旁-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`allegory.html`；线上：https://tool.browser.qq.com/allegory.html；标题：歇后语-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`explain.html`；线上：https://tool.browser.qq.com/explain.html；标题：词语注解-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复
- 页面：`chengyujielong.html`；线上：https://tool.browser.qq.com/chengyujielong.html；标题：成语大全-帮小忙，腾讯QQ浏览器在线工具箱；恢复策略：本地镜像恢复

## 例外说明

- `handwriting_erasure.html` 的上传与处理链路调用非 `file://` 可恢复的上传接口，因此本地交付采用线上 iframe 壳页。
