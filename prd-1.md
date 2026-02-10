# PRD-1 页面调查与拆解

## 目标
完成首页（教育分类）与 16 个二级页面的线上结构、资源、交互行为调查，并形成可复刻证据。

## 页面范围
- 首页：`/category/education`
- 二级页：`/handwriting_erasure.html` ~ `/chengyujielong.html`（共16个）

## 调查项
1. 页面 DOM 结构（导航、搜索、卡片、正文、推荐、footer）
2. 静态资源入口（CSS、JS、图片）
3. 链接行为（同页跳转/新标签）
4. 基础交互（搜索建议、卡片跳转）

## 进度
| 子任务 | 状态 | 说明 | 证据 |
|---|---|---|---|
| 路由清单固化 | 已完成 | `config/routes.json` 包含17条页面映射 | `config/routes.json` |
| 线上HTML抓取 | 已完成 | 已抓取17个页面原始HTML | `artifacts/baseline/raw-html` |
| 结构调查记录 | 已完成 | 关键结构与行为已记录 | 本文档“调查结论” |

## 调查结论
### 1）通用结构（首页 + 二级页）
- 左侧分类导航：logo、分类列表、教育分类高亮。
- 右侧固定工具条：回到顶部、QQ群、共建、反馈。
- 顶部搜索区：搜索输入、搜索建议面板、累计帮助人次。
- 底部：版权、隐私政策、免责声明、二维码。

### 2）首页（教育分类）行为
- 页面为工具卡片列表（16个教育工具）。
- 卡片链接使用 `target="_blank"` 新标签打开。
- 搜索框输入关键字并回车后，出现建议项（如“字数计算”），点击后新标签打开对应工具页。

### 3）二级页行为
- 二级页均包含：工具信息头、工具主区域、使用说明、更多推荐。
- 二级页主逻辑由对应 `xxx.[hash].js` 驱动，依赖线上接口。
- 以 `wordcount` 为样例：输入文本后点击“确认”会输出统计结果。

### 4）资源入口规律
- 首页资源：`pchome.c673b.css` + `pchome.1b724347.js`。
- 二级页资源：`<toolid>.c673b.css` + `<toolid>.[hash].js`。
- 通用运行时：`manifest.5150f596.js` + `vendors.e58e88ef.js`。
- 图片资源主要来自 `m4.publicimg.browser.qq.com`。

### 5）证据
- 原始HTML：`artifacts/baseline/raw-html/*.raw.html`（17份）
- 元信息：`artifacts/baseline/raw-html/*.meta.json`
