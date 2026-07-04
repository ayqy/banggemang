# prd-12: 翻译（translate.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/translate.html ｜截图 research/shots/translate-*.png ｜DOM research/dom/translate*.html
> 卡片标签：无

## 功能简述
五家翻译站 iframe 聚合

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- ul.nav 标签栏：搜狗翻译/腾讯翻译/有道翻译/微软翻译/CNKI学术翻译（favicon img height=25px + 文字；active 类；微软无 favicon src）
- iframe#navFrame width=100% height=600
- tab→src：搜狗 https://fanyi.sogou.com/text；腾讯 https://fanyi.qq.com；有道 https://fanyi.youdao.com；微软 https://www.bing.com/translator；CNKI https://dict.cnki.net/index

## 实现要点
- 第三方站 X-Frame-Options 行为与线上一致（照实复刻，测试记录实际表现）
