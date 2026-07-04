# prd-11: 元素周期表（periodic.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/periodic.html ｜截图 research/shots/periodic-*.png ｜DOM research/dom/periodic*.html
> 卡片标签：无

## 功能简述
118 元素周期表

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- 网格布局周期表（主表 7 行 + 镧系锕系两行），格内：序号/符号/中文名+拼音/原子量
- 双绿配色（深绿=非金属系，浅绿=金属系，与线上截图一致），无点击交互
- 数据已提取 data/periodic.js（118 条：num/symbol/name/pinyin/mass）

## 实现要点
- 布局与配色对照 research/shots/periodic-viewport.png 与 periodic.00b6f.css
