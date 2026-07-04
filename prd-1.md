# prd-1: 去手写（handwriting_erasure.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/handwriting_erasure.html ｜截图 research/shots/handwriting_erasure-*.png ｜DOM research/dom/handwriting_erasure*.html
> 卡片标签：new

## 功能简述
上传图片→云端AI擦除手写→结果对比展示

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- 主体两栏：左侧虚线上传框（文案“将文件拖拽到虚框内”“或者”，蓝色按钮“点击上传文件(小于8M)”，支持拖拽），右侧结果区（“效果预览”）
- 上传后：调用腾讯云流程 getcoscredential→COS PUT→网关 HandwritingErasure（报文含 cos_image_name/request_id/max_long_edge:1536，需 accessToken）
- 该 API 无 CORS 头：file:// 或异源下浏览器直调必败
- 处理成功：右侧显示去手写结果图，可下载

## 实现要点
- UI/布局/文案 100% 复刻（样式取 handwriting_erasure.00b6f.css）
- 上传交互本地实现（input[type=file] + 8M 校验 + 预览）
- 双模式：①直连线上 API（跨域失败时右侧显示明确错误提示条）②serve.py 代理模式（/api、COS 转发）→ 与线上完全一致
- 金标准：上传区/结果区文案与布局同截图 research/shots/handwriting_erasure-viewport.png
