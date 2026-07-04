# prd-3: 亲戚关系计算（relatives_name.html）

> 状态：☑ 调研完成 → ☑ 规格固化 → ☑ 实现 → ☑ 自测通过（验收 42/42，布局对比 MATCH）
> 线上参照：https://tool.browser.qq.com/relatives_name.html ｜截图 research/shots/relatives_name-*.png ｜DOM research/dom/relatives_name*.html
> 卡片标签：hot

## 功能简述
按键组合亲属链，实时计算称谓

## 通用骨架（所有二级页一致）
左侧导航（教育工具高亮）/顶部搜索框（统计占位、实时过滤、空态全网搜索→sogou）/分享按钮（复制链接+扫码面板）/右下浮动按钮组/工具卡头部（icon+名称）/“工具介绍及使用方法”/“更多推荐”卡片×2/页脚。规格详见 prd-0.md §3。

## 页面规格与交互
- checkbox“对方称呼我”（默认不勾）；radio“我是女的/我是男的”（默认：我是女的）
- 只读输入框“要找的称谓”，占位“点击添加关系”
- 按键：父 母 夫 妻 子 女 兄 弟 姐 妹（蓝色）+ 红色“<”退格
- 点击按键→输入框追加“爸爸/的爸爸”式链条，实时显示结果
- 金标准：父父→“爸爸的爸爸”→爷爷；兄子→“哥哥的儿子”→侄子；勾选“对方称呼我”后（兄子、我是女的）→小姑

## 实现要点
- 算法：assets/vendor/relationship.min.js（relationship.js 开源库，线上同源算法）
- 映射：父→爸爸 母→妈妈 夫→老公 妻→老婆 子→儿子 女→女儿 兄→哥哥 弟→弟弟 姐→姐姐 妹→妹妹
- relationship({text, sex:0女/1男, reverse}) 多候选时的展示格式实现时以线上补测为准
