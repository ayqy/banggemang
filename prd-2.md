# prd-2: 字帖生成（zitie_new.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/zitie_new.html ｜截图 research/shots/zitie_new-*.png ｜DOM research/dom/zitie_new*.html
> 卡片标签：推荐

## 功能简述
选择年级字表/模板，生成绿色米字格描红字帖，可打印

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- textarea（当前字表内容，非汉字输入无效）
- “字帖类型”下拉：小学一~六年级（上/下）共 12 项，默认“小学一年级（上）”；旁边“重置”按钮
- “字体/模板”下拉：模板A/模板B/模板C；下方“打印”按钮
- 加载即自动渲染：.print-content 内每字一行（默认一年级上 100 字），每行 11 个 60×60 SVG 米字格（边框+虚线十字 #11a45e），格内字形 path 由 https://static.res.qq.com/qbtool/char/<字>.json 提供（CORS *），transform=translate(5,48.95) scale(0.0488,-0.0488)，首格黑色 #000，其余格浅色描红
- 打印：window.print，仅打印字帖区（@media print）

## 实现要点
- 数据：data/zitie-grades.js（12 年级字表，已提取自线上 bundle）
- 渲染器自写（fetch char json→SVG path），失败字降级空格
- 模板 A/B/C 差异在实现时按线上切换实测补记（探测脚本 research/probe4.js 可复用）
- 金标准：默认 100 行×11 格、#11a45e、60px、scale 0.048828125
