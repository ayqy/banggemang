# prd-7: 各国首都（capital.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/capital.html ｜截图 research/shots/capital-*.png ｜DOM research/dom/capital*.html
> 卡片标签：无

## 功能简述
静态国家-首都对照表

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- 表格两列：国家名称（中文_英文）/首都（中文_英文），193 行
- 首行：中华人民共和国_People's Republic of China / 北京_Beijing
- 数据已提取 data/capital.js

## 实现要点
- 显示格式 `中文_English` 下划线连接，与线上一致
