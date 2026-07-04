# prd-13: 汉字偏旁（radical.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/radical.html ｜截图 research/shots/radical-*.png ｜DOM research/dom/radical*.html
> 卡片标签：无

## 功能简述
逐字查部首

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- textarea 占位“请输入查询的汉字”+ 蓝“查询”按钮 + 只读结果 textarea
- 逐字符输出部首，逗号分隔；非汉字原样返回；标点返回空串
- 金标准：好帮忙→“女,巾,忄”；“好a1，中”→“女,a,1,,丨”

## 实现要点
- cnchar + cnchar-radical UMD
