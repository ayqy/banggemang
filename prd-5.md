# prd-5: 字数计算（wordcount.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/wordcount.html ｜截图 research/shots/wordcount-*.png ｜DOM research/dom/wordcount*.html
> 卡片标签：无

## 功能简述
文本框输入，统计总字数

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- 顶部蓝色提示条（info 图标）：“空格、换行不计入字数”
- 大输入 textarea（占位“请输入”）+ 按钮“确认”（蓝 contained）“清空”（白 outlined）+ 只读结果 textarea
- 统计规则（实测破解）：总字数 = 中文字符逐字计 + 连续[A-Za-z0-9]串每段计1；空格/换行/中英文标点不计
- 输出格式：`总字数：N`

## 实现要点
- 金标准：“帮小忙工具箱 Hello World! 测试，123。”→总字数：11；“abc def”→总字数：2；“Hello 世界！ab, cd。123 456”→总字数：7
