# 自动测评用例集合（benchmark 分支）

本用例集合用于对照线上页面（`https://tool.browser.qq.com/category/education` 及其 16 个二级工具页）做自动化一致性校验与打分。

## 基线数据来源

- 结构基线：`artifacts/baseline/dom/*-remote.json`
- 用例基线：`artifacts/baseline/scenarios/*`
- 截图基线（备用）：`artifacts/baseline/screenshots/*-remote.png`

## 用例列表（Playwright）

### 教育工具首页（index.html）

- `education-home:basic-structure`
  - 期望：页面标题为“帮小忙，腾讯QQ浏览器在线工具箱平台”
  - 期望：左侧分类导航包含全部 11 个分类（全部/图片工具/…/浏览器插件）
  - 期望：主内容区包含 16 个教育工具名称
  - 期望：存在底部版权（包含“Copyright”）
- `education-home:tool-links`
  - 期望：16 个工具卡片均存在，并且链接到对应的 `*.html`
- `education-home:search-suggestion`
  - 期望：在搜索框输入“字数”后出现“字数计算”建议项，链接指向 `wordcount.html`（若存在 `target` 属性则应为 `_blank`）

### 16 个二级工具页（基础结构）

对每个 `artifacts/baseline/scenarios/*-basic-structure.json` 自动生成一个用例：

- `${routeId}:basic-structure`
  - 期望：页面标题、工具标题与基线一致
  - 期望：存在“工具介绍及使用方法”“更多推荐”“历史朝代查询”等区块文本
  - 期望：页面内（优先 main 区域）可见输入框数量与基线 `inputCount` 一致
  - 期望：基线 `buttonTexts` 中列出的按钮/文本可见

### 二级工具页（功能校验）

- `wordcount:calc-total`
  - 输入：`天地玄黄\nabc`
  - 操作：点击“确认”
  - 期望输出：包含“总字数：5”
- `relatives_name:calc`
  - 输入：`弟弟的老婆`
  - 期望输出：`弟妹`
- `jielong:start`
  - 操作：点击“开始接龙”
  - 期望：出现结果表格（或至少出现可见“接龙”结果项）

