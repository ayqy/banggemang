# prd-10: 汉字标准发音（hanzifayin.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/hanzifayin.html ｜截图 research/shots/hanzifayin-*.png ｜DOM research/dom/hanzifayin*.html
> 卡片标签：无

## 功能简述
文本朗读（speechSynthesis）

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- textarea 占位“请输入需要练习发音文字”+ 全宽蓝按钮“标准发音”
- 点击→speechSynthesis 中文朗读（无网络请求、无 UI 状态切换）

## 实现要点
- utterance lang=zh-CN；重复点击先 cancel 再 speak
