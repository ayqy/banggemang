# prd-9: 便捷思维导图（markmap.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/markmap.html ｜截图 research/shots/markmap-*.png ｜DOM research/dom/markmap*.html
> 卡片标签：无

## 功能简述
markdown 转思维导图

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- 左：markdown textarea（默认示例文本，见 research/rendered/markmap.html）+ 蓝色宽按钮“渲染导图”
- 右：SVG 导图（markmap 渲染，彩色分支/节点圈可折叠/链接可点）；右上“全屏”按钮（frame 图标+文字）
- 默认加载即渲染示例导图

## 实现要点
- 库：markmap-lib + markmap-view + d3 UMD 本地化
- 全屏：requestFullscreen 导图容器
