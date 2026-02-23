# 自动测评用例集合（benchmark 分支）

本用例集合用于对照线上页面（`https://tool.browser.qq.com/category/education` 及其 16 个二级工具页）做自动化一致性校验与打分。

## 基线数据来源

- 截图基线（备用）：`artifacts/baseline/screenshots/*-remote.png`

## 用例列表（Playwright）

### 教育工具首页（index.html）

- `education-home:tool-links`
  - 期望：16 个工具卡片均存在，并且链接到对应的 `*.html`
- `education-home:search-suggestion`
  - 期望：在搜索框输入“字数”后出现“字数计算”建议项，链接指向 `wordcount.html`（若存在 `target` 属性则应为 `_blank`）

### 16 个二级工具页（功能校验为主）

- `handwriting_erasure:upload-flow`
  - 输入：上传 `tests/fixtures/sample.pdf`
  - 期望：出现“开始去除/开始处理”按钮；点击后出现“去除成功/去除失败/处理成功/处理失败”状态或可见下载入口（更偏重流程可用性）
- `zitie_new:render-on-input`
  - 输入：在“请输入汉字…”输入框中填入短文本与长文本
  - 期望：字帖渲染区域（优先 `#print-container`）的可渲染单元数量随输入长度变化（更偏重“输入驱动生成”）
- `relatives_name:calc`
  - 输入：`弟弟的老婆`
  - 期望输出：`弟妹`
- `school:filter-985`
  - 操作：选择筛选项“985”
  - 期望：非 985 学校（例如“南京信息工程大学”）不再显示；“清华大学”仍存在且双一流为 A
- `wordcount:calc-total`
  - 输入：`天地玄黄\nabc`
  - 操作：点击“确认”
  - 期望输出：包含“总字数：5”
- `dynasties:contains-yuan`
  - 期望：表格中存在“元朝”行且包含“北京”“大都”等关键信息
- `capital:contains-china-beijing`
  - 期望：表格中“中华人民共和国”对应首都包含“北京”
- `jielong:chain-starts-with-last-char`
  - 输入：`开天辟地`
  - 操作：点击“开始接龙”
  - 期望：结果链中至少有一个成语以输入最后一个字开头（例如“地大物博”以“地”开头）
- `markmap:render-updates-preview`
  - 输入：`# 测试标题A\n## 子标题B`
  - 操作：点击“渲染导图”
  - 期望：预览区域出现“测试标题A / 子标题B”
- `hanzifayin:speak-or-audio`
  - 输入：`你好`
  - 操作：点击“标准发音”
  - 期望：触发发音动作（优先通过 `speechSynthesis.speak` 调用次数判定，或存在音频输出）
- `periodic:contains-hydrogen`
  - 期望：周期表中包含氢元素单元（例如“1 H 氢 …”）
- `translate:switch-provider`
  - 操作：在“搜狗翻译/有道翻译”之间切换
  - 期望：iframe 的 `src` 跟随切换并包含对应域名（`sogou` / `youdao`）
- `radical:query`
  - 输入：`明`
  - 操作：点击“查询”
  - 期望输出：`日`
- `allegory:query`
  - 输入：`八仙过海`
  - 操作：点击“歇后语查询”
  - 期望：结果中包含“各显神通”
- `explain:query`
  - 输入：`一诺千金`
  - 操作：点击“注解查询”
  - 期望：结果中包含“守信用”
- `chengyujielong:query-hanzi`
  - 输入：`五十`
  - 操作：选择“汉字”并点击“查询”
  - 期望：结果中包含“`五十步笑百步`”
