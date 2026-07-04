# prd-15: 词语注解（explain.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/explain.html ｜截图 research/shots/explain-*.png ｜DOM research/dom/explain*.html
> 卡片标签：无

## 功能简述
查词语释义（cnchar-data CDN）

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- TextField（label/占位“请输入查询汉词”）+ 全宽蓝按钮“注解查询”+ 结果区（ul>li.initialize）
- 查询：fetch https://unpkg.com/cnchar-data@latest/explanation/<首字>.json（CORS *）→ 取词条全文显示
- 空输入提示“请输入查询汉词”；查无→“词汇还没合适注解”；使用说明红色样式
- 金标准：一心一意→“只有一个心眼儿，没有别的考虑。”

## 实现要点
- 词典 JSON 为 {词:释义} 平面映射，词条文本即最终显示文本
