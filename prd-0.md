# prd-0: 「帮小忙·教育工具」复刻总览与进度

线上参照：https://tool.browser.qq.com/category/education
目标：本地纯静态多页站（file:// 双击可用），index.html + 16 个工具页，显示与交互与线上完全一致，作为后续迭代的源码基础。

## 1. 架构结论（调研已固化，产物在 research/）

- 线上为 SSR 壳 + React 17 + MUI v5(emotion)；教育工具核心全部纯前端，基于开源库 cnchar（idiom/xhy/radical/explain/voice/draw）
- 词语注解词典按首字懒加载自 `unpkg.com/cnchar-data@latest/explanation/<字>.json`（CORS *）
- 字帖笔画数据 `static.res.qq.com/qbtool/char/<字>.json`（CORS *）
- 翻译页 = iframe 聚合 5 家翻译站；去手写 = 唯一必须云端 API 的工具（无 CORS 头）
- 内置数据已全部提取至 research/data/（成语库+双拼音索引/歇后语/高校141/朝代22/国家193/周期表118/字帖12年级字表）

## 2. 技术方案

纯静态手写多页站，零构建链。样式 = 本地化原站 CSS（pchome.css/各工具 css）+ 按页 dump 的 emotion 规则（research/styles/*.css）。MUI 交互组件以 mui-lite 手写等价实现（保持 DOM 结构与类名一致）。功能库用与线上一致的开源 UMD：cnchar 全家、markmap、relationship.js。数据以 data/*.js（变量赋值）加载以兼容 file://。图片全部本地化。

```
index.html + 16×<tool>.html
assets/css/base.css assets/css/<tool>.css
assets/js/common.js assets/js/mui-lite.js assets/js/<tool>.js
assets/vendor/{cnchar,markmap,relationship,qrcode}/
assets/img/  data/*.js  serve.py（可选代理模式）
```

## 3. 通用骨架规格（每页一致）

- 左导航：logo（帮小忙/腾讯QQ浏览器在线工具箱）+ 11 分类（全部/图片/PDF转换/数据换算/生活娱乐/教育/文本/文档转换/开发/视频/浏览器插件），本页所属“教育工具”高亮（data-actived）；分类链接指向线上绝对 URL，16 工具卡指向本地页
- 搜索框：占位显示“工具箱已累计帮助了 N 人次”（N 本地模拟递增）；输入→按 名称+keyword 过滤（数据 data/tools-meta.js，源自线上 get_tool_list，166 工具全量）；命中→列表卡片；空态→“没有找到相关工具，试试搜全网”+“全网搜索”→ `https://sogou.com/web?query=<词>`
- 分享按钮：面板“复制链接”（clipboard）+“QQ 微信扫码分享”（本页 URL 二维码，qrcode 库生成）
- 右下浮动：回顶（smooth）/QQ群（hover 提示 QQ群：459317399，链接线上入群地址）/共建/反馈（线上绝对链接）
- 工具页头：icon+工具名；正文下方“工具介绍及使用方法”（文案照抄线上）；“更多推荐”2 卡片（教育分类内工具，与线上每页实际显示一致）；页脚（口号/隐私政策/免责声明/Copyright © 1998 - 2026 Tencent. All Rights Reserved./二维码）

## 4. 十六工具索引

| # | 页面 | 名称 | 标签 | 规格文档 |
|---|------|------|------|---------|
| 1 | handwriting_erasure.html | 去手写 | new | prd-1.md |
| 2 | zitie_new.html | 字帖生成 | 推荐 | prd-2.md |
| 3 | relatives_name.html | 亲戚关系计算 | hot | prd-3.md |
| 4 | school.html | 高校查询 | | prd-4.md |
| 5 | wordcount.html | 字数计算 | | prd-5.md |
| 6 | dynasties.html | 历史朝代查询 | | prd-6.md |
| 7 | capital.html | 各国首都 | | prd-7.md |
| 8 | jielong.html | 成语接龙 | | prd-8.md |
| 9 | markmap.html | 便捷思维导图 | | prd-9.md |
| 10 | hanzifayin.html | 汉字标准发音 | | prd-10.md |
| 11 | periodic.html | 元素周期表 | | prd-11.md |
| 12 | translate.html | 翻译 | | prd-12.md |
| 13 | radical.html | 汉字偏旁 | | prd-13.md |
| 14 | allegory.html | 歇后语 | | prd-14.md |
| 15 | explain.html | 词语注解 | | prd-15.md |
| 16 | chengyujielong.html | 成语大全 | | prd-16.md |

## 5. 进度

- [x] 阶段A-调研与探测（截图/DOM/样式/API/数据全量产出 research/）
- [x] 阶段A-需求文档 prd-0~16、test-cases.md
- [x] 阶段A-资产：图片本地化（36 图 + css 引用 6 图）/ vendor UMD（cnchar×6/markmap×3/relationship/qrcode）/ data/*.js（8 个数据文件 + tools-meta + usage-html）
- [x] 阶段B-公共骨架：pchome.css+emotion dump+site-extra.css / common.js（统计模拟/搜索/分享/回顶）/ mui-lite（ripple/TextField/Radio/Checkbox/Select）/ index.html
- [x] 阶段C-16 工具页全部完成（含 tools/build_pages.py 页面装配器：以线上渲染快照为模板，保证 DOM/类名/文案一致）
- [x] 阶段D-验收：功能回归 42/42 通过；17 页关键元素几何对比全部 MATCH（容差 3px，实际 0 差异）；file:// 冒烟通过。详见 test-cases.md 执行记录

## 6. 关键实现备忘

- 线上页面无 DOCTYPE（quirks 模式）：构建产物同样不加 DOCTYPE，否则 textarea 盒模型差 6px、iframe 基线差 4px
- 亲戚页 checkbox/radio 无 label 包裹（文本为兄弟节点），radio value：0=我是女的（默认）、1=我是男的
- 接龙生成含 1 步前瞻，避免随机选中无后继的“死角”成语导致断链
- 字帖三模板：A=黑字+10 描红(#ddd)/行；B=黑字+红字(#f00) 2 格/行；C=单行连排 描红+空格 交替
- CNKI favicon 源站反爬，保留线上直链；其余 3 家翻译 favicon 已本地化
- 页面重建：修改 research/rendered/ 快照或构建规则后运行 `python3 tools/build_pages.py`
