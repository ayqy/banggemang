# prd-6: 历史朝代查询（dynasties.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/dynasties.html ｜截图 research/shots/dynasties-*.png ｜DOM research/dom/dynasties*.html
> 卡片标签：无

## 功能简述
静态朝代总表

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- 表格列：朝代/时间/都城/都城今址/开国皇帝（22 行，含 ①②③ 注号与“西周/东周”式子行名）
- 首行：夏朝 约前2070-约前1600 阳城… 禹
- 数据已提取 data/dynasties.js（name/time[起,止]/capital/capital_now/founder）

## 实现要点
- 时间列格式化：负数→“约前N”样式按线上渲染 DOM 逐行核对（research/dom/dynasties.html）
