# 顶尖AI编程能力测评

测评方法：复刻腾讯帮小忙完整功能（布局、交互、功能） https://tool.browser.qq.com/category/education

测评环境：codex + playwright MCP（必须安装） + RIPER-5规则

2026/02/10结论：
* gpt 5.3 codex xhigh跑40分钟**效果惊艳**
  * 页面和二级页完全还原，直接从腾讯现在的js、css、icon图等等
  * 二级页的几个功能是可用的，翻译、字数计算，其他的应该还有能用的，不完全统计
  * 全程无人参与，AI自己跑40分钟
* claude 4.6 opus high跑26分钟效果一般
  * 模型智商不如gpt：思路错了，在重写而不是直接下载线上资源
  * claude code不如codex：开启了auto compact后，仍然会超出上下文导致报错无法继续，手动继上了
  * 工程完整性不如codex：最后让自己执行python命令启动本地服务，codex甚至把全套扒站流程都做成了npm脚本，支持过两天再扒拉一遍同步更新
  * 工具+模型对长任务的支持不如codex：中断2次，一次是因为MCP截图超大（可能是模型中间商封装问题）；另一次是因为上下文超出报错，接下来所有操作全都报错，手动compact之后继续干完（也可能与模型中间商封装有关）

测试结果，在对应的分支，也欢迎提交更多上来

---

以下是gpt 5.3 codex xhigh过程，暂时作为标准答案：
```
› prd.md 帮我实现这些需求 PLAN

─ Worked for 6m 15s ────────────────────────────────────────────────────────────────────────────────────────────────────

• [MODE: PLAN]
  实施方案采用“线上页面镜像恢复 + 本地同源运行 + 基线对比验收”，目标是在本地产出可直接作为后续迭代基础的完整代码，并确保
  index.html 与 16 个二级页面在布局、样式、图标、图片、交互、输入输出上与线上一致。

  一、范围与页面清单（固定）

  - 首页（本地入口）：/index.html，对应线上 https://tool.browser.qq.com/category/education
  - 二级页面（16个）：
      - /handwriting_erasure.html（去手写）
      - /zitie_new.html（字帖生成）
      - /relatives_name.html（亲戚关系计算）
      - /school.html（高校查询）
      - /wordcount.html（字数计算）
      - /dynasties.html（历史朝代查询）
      - /capital.html（各国首都）
      - /jielong.html（成语接龙）
      - /markmap.html（便捷思维导图）
      - /hanzifayin.html（汉字标准发音）
      - /periodic.html（元素周期表）
      - /translate.html（翻译）
      - /radical.html（汉字偏旁）
      - /allegory.html（歇后语）
      - /explain.html（词语注解）
      - /chengyujielong.html（成语大全）
  - 首页卡片与搜索建议点击行为必须保持 target="_blank"（新标签打开）。

  二、项目结构（固定）

  - /index.html 与 16 个二级 HTML 文件（最终可访问页面）
  - /assets/mirror/static.res.qq.com/qbtool/...（CSS/JS/运行时代码镜像）
  - /assets/mirror/m4.publicimg.browser.qq.com/...（图片资源镜像）
  - /assets/mirror/tool.browser.qq.com/...（必要静态资源镜像）
  - /config/routes.json（17个目标路由元数据）
  - /config/proxy-rules.json（API 代理规则）
  - /scripts/recovery/fetch-pages.mjs
  - /scripts/recovery/download-assets.mjs
  - /scripts/recovery/rewrite-html.mjs
  - /scripts/recovery/patch-runtime.mjs
  - /scripts/baseline/capture-baseline.mjs
  - /scripts/baseline/capture-scenarios.mjs
  - /server/dev-server.mjs
  - /docs/prd-1.md（页面调查与拆解）
  - /docs/prd-2.md（恢复方案与资源映射）
  - /docs/prd-3.md（开发进度）
  - /docs/prd-4.md（测试用例与结果）
  - /tests/e2e/parity.spec.ts
  - /tests/e2e/playwright.config.ts
  - /artifacts/baseline/...（线上基线证据）
  - /artifacts/test-results/...（本地测试证据）

  三、核心实现规范（固定）

  - 页面恢复
      - 从线上抓取 17 个页面完整 HTML。
      - 保留原始 DOM 结构、类名、data-* 属性、内联脚本变量（如 window.__curCategory__、window.__toolInfo__）。
  - 资源本地化
      - 下载页面引用的 JS/CSS/图片资源到 assets/mirror。
      - 重写 HTML 内绝对资源地址至本地镜像路径。
      - 修补运行时代码公共路径（webpack runtime a.p）到本地镜像前缀，确保动态 chunk 本地加载。
  - 链接重写
      - 将首页与二级页之间链接统一为本地可达路径（/index.html、/xxx.html），且保持打开新标签行为。
  - 同源接口运行
      - 本地服务由 server/dev-server.mjs 提供：
          - 静态文件服务（页面与镜像资源）
          - API 反向代理（至少覆盖 /api/**、/cgi-bin/**）
      - 代理保留请求方法、query、body、header，响应透传；失败时写日志并可回退到缓存 fixture。
  - 文档与进度
      - 按阶段维护 prd-1 到 prd-4，每完成一个子阶段更新状态、证据路径、阻塞项（若无则标“无”）。
  - 测试基线
      - 先采集线上基线（截图、DOM 关键片段、交互结果、网络请求关键返回），再对本地实现做逐项比对。
      - 二级页面每页至少 1 个“功能输入-输出”用例，首页必须覆盖搜索建议、卡片跳转、悬浮工具条、分类导航高亮。

  四、函数级技术规格（固定命名）

  - scripts/recovery/fetch-pages.mjs
      - loadRouteConfig()
      - fetchRouteHtml(route)
      - saveRawHtml(route, html)
  - scripts/recovery/download-assets.mjs
      - extractAssetUrls(html)
      - normalizeAssetUrl(url, route)
      - downloadAsset(url, localPath)
  - scripts/recovery/rewrite-html.mjs
      - rewriteAssetLinks(html)
      - rewritePageLinks(html)
      - writeRecoveredHtml(route, html)
  - scripts/recovery/patch-runtime.mjs
      - patchWebpackPublicPath(filePath, localBase)
      - patchAbsoluteHostReferences(filePath, hostMap)
  - server/dev-server.mjs
      - createStaticServer(rootDir)
      - createReverseProxy(upstream)
      - startServer(port)
  - scripts/baseline/capture-baseline.mjs
      - capturePageScreenshot(route)
      - captureDomSignature(route)
      - captureNetworkSignature(route)
  - scripts/baseline/capture-scenarios.mjs
      - runScenario(route, caseId)
      - saveScenarioExpected(route, caseId, expected)
  - tests/e2e/parity.spec.ts
      - assertVisualParity(route, threshold)
      - assertDomParity(route)
      - assertScenarioParity(route, caseId)

  五、验收标准（完成判定）

  - index.html 视觉结构、文案、图标、图片与线上一致。
  - 首页 16 个功能入口均可点击并打开对应本地 HTML 页面。
  - 二级页核心交互在既定测试输入下与线上输出一致。
  - 全量测试报告通过，无阻塞级偏差。
  - docs/prd-1.md ~ docs/prd-4.md 与 docs/test-cases 完整且进度闭环。

  IMPLEMENTATION CHECKLIST:
  1. 创建目录骨架（assets/config/scripts/server/docs/tests/artifacts）。
  2. 新建 `config/routes.json`，写入首页+16二级页路由与名称映射。
  3. 新建 `docs/prd-1.md`，建立“页面调查”章节与进度表。
  4. 新建 `docs/prd-2.md`，建立“资源恢复与重写规则”章节与进度表。
  5. 新建 `docs/prd-3.md`，建立“开发执行进度”章节与进度表。
  6. 新建 `docs/prd-4.md`，建立“测试用例与执行结果”章节与进度表。
  7. 在 `scripts/recovery/fetch-pages.mjs` 实现 `loadRouteConfig()`。
  8. 在 `scripts/recovery/fetch-pages.mjs` 实现 `fetchRouteHtml(route)`。
  9. 在 `scripts/recovery/fetch-pages.mjs` 实现 `saveRawHtml(route, html)`。
  10. 执行页面抓取并保存17个原始HTML快照到 `artifacts/baseline/raw-html`。
  11. 在 `docs/prd-1.md` 记录17个页面抓取结果与证据路径。
  12. 在 `scripts/recovery/download-assets.mjs` 实现 `extractAssetUrls(html)`。
  13. 在 `scripts/recovery/download-assets.mjs` 实现 `normalizeAssetUrl(url, route)`。
  14. 在 `scripts/recovery/download-assets.mjs` 实现 `downloadAsset(url, localPath)`。
  15. 执行资源下载并填充 `assets/mirror/static.res.qq.com`。
  16. 执行资源下载并填充 `assets/mirror/m4.publicimg.browser.qq.com`。
  17. 在 `docs/prd-2.md` 记录资源总量与目录结构。
  18. 在 `scripts/recovery/rewrite-html.mjs` 实现 `rewriteAssetLinks(html)`。
  19. 在 `scripts/recovery/rewrite-html.mjs` 实现 `rewritePageLinks(html)`。
  20. 在 `scripts/recovery/rewrite-html.mjs` 实现 `writeRecoveredHtml(route, html)`。
  21. 生成最终页面文件：`index.html` + 16个二级HTML。
  22. 在 `scripts/recovery/patch-runtime.mjs` 实现 `patchWebpackPublicPath(filePath, localBase)`。
  23. 在 `scripts/recovery/patch-runtime.mjs` 实现 `patchAbsoluteHostReferences(filePath, hostMap)`。
  24. 对 manifest/vendor/页面脚本执行公共路径与域名修补。
  25. 校验页面脚本与样式均从本地镜像加载。
  26. 在 `server/dev-server.mjs` 实现 `createStaticServer(rootDir)`。
  27. 在 `server/dev-server.mjs` 实现 `createReverseProxy(upstream)`。
  28. 在 `server/dev-server.mjs` 实现 `startServer(port)`。
  29. 配置代理规则覆盖 `/api/**` 与 `/cgi-bin/**`。
  30. 启动本地服务并验证 `index.html` 可访问。
  31. 验证首页16个卡片点击均可打开对应二级页。
  32. 验证搜索建议显示与点击跳转行为一致。
  33. 在 `docs/prd-3.md` 更新“首页与路由联通”进度为完成。
  34. 在 `scripts/baseline/capture-baseline.mjs` 实现截图/DOM/网络签名采集函数。
  35. 采集线上17个页面基线证据到 `artifacts/baseline`。
  36. 在 `docs/prd-4.md` 写入每页至少1条功能测试用例与期望结果。
  37. 在 `scripts/baseline/capture-scenarios.mjs` 实现场景执行与期望保存。
  38. 采集16个二级页功能场景期望输出。
  39. 在 `tests/e2e/playwright.config.ts` 配置本地与线上对比运行参数。
  40. 在 `tests/e2e/parity.spec.ts` 实现视觉、DOM、场景三类对比测试。
  41. 执行全量Playwright测试并输出报告到 `artifacts/test-results`。
  42. 在 `docs/prd-4.md` 记录测试执行结果、偏差处理与最终通过结论。
  43. 复核 `docs/prd-1.md` 到 `docs/prd-4.md` 进度项全部为完成。
  44. 产出最终交付：可运行页面、恢复脚本、代理服务、测试用例文档、测试报告。

> EXECUTE

─ Worked for 27m 11s ───────────────────────────────────────────────────────────────────────────────────────────────────

• [MODE: EXECUTE]
  已按你批准的 PLAN 完整执行并落地，首页+16个二级页、恢复脚本、基线与自动化对比测试均已完成。

  - 已实现页面与路由清单（17页）：config/routes.json:1，并生成 index.html + 16 个二级页面（根目录）。
  - 已实现页面抓取脚本：scripts/recovery/fetch-pages.mjs:12（loadRouteConfig）、scripts/recovery/fetch-
    pages.mjs:21（fetchRouteHtml）、scripts/recovery/fetch-pages.mjs:34（saveRawHtml）。
  - 已实现资源镜像脚本：scripts/recovery/download-assets.mjs:94（extractAssetUrls）、scripts/recovery/download-
    assets.mjs:78（normalizeAssetUrl）、scripts/recovery/download-assets.mjs:106（downloadAsset），资源落地到 assets/
    mirror。
  - 已实现 HTML 重写脚本：scripts/recovery/rewrite-html.mjs:66（rewriteAssetLinks）、scripts/recovery/rewrite-
    html.mjs:102（rewritePageLinks）、scripts/recovery/rewrite-html.mjs:128（writeRecoveredHtml）。
  - 已实现运行时修补脚本：scripts/recovery/patch-runtime.mjs:10（patchWebpackPublicPath）、scripts/recovery/patch-
    runtime.mjs:20（patchAbsoluteHostReferences）。
  - 已实现本地服务与代理：server/dev-server.mjs:46（静态服务）、server/dev-server.mjs:76（反向代理）、server/dev-
    server.mjs:109（startServer）；代理规则在 config/proxy-rules.json:1（覆盖 /api/**、/cgi-bin/**）。
  - 已实现基线采集脚本：scripts/baseline/capture-baseline.mjs:17（截图）、scripts/baseline/capture-baseline.mjs:24（DOM
    签名）、scripts/baseline/capture-baseline.mjs:45（网络签名）。
  - 已实现场景采集脚本：scripts/baseline/capture-scenarios.mjs:23（runScenario）、scripts/baseline/capture-
    scenarios.mjs:82（saveScenarioExpected）。
  - 已实现对比测试：tests/e2e/parity.spec.ts:105（视觉）、tests/e2e/parity.spec.ts:141（DOM）、tests/e2e/
    parity.spec.ts:156（场景）；配置在 tests/e2e/playwright.config.ts:1。
  - 已完成阶段文档与进度更新：docs/prd-1.md:1、docs/prd-2.md:1、docs/prd-3.md:1、docs/prd-4.md:1，并同步生成 prd-1.md ~
    prd-4.md。

  执行与验证结果：

  - npm run recover:all：通过（抓取/镜像/重写/修补流水线可重复执行）。
  - npm run baseline:capture：通过（17页基线截图+DOM+网络）。
  - npm run baseline:scenarios：通过（17页场景期望）。
  - npm run test:e2e：通过，17 passed（报告：artifacts/test-results/playwright-report/index.html）。

  关键产物统计：

  - 原始HTML快照：17（artifacts/baseline/raw-html）
  - 基线截图：17（artifacts/baseline/screenshots）
  - 场景期望：17（artifacts/baseline/scenarios）
  - 镜像资源文件：118（assets/mirror）

› 怎么启动本地服务，我要验收效果

• [MODE: EXECUTE]
  在项目根目录（/Users/pocket/Downloads/banggemang）按这个顺序来：

  1. 安装依赖（首次或依赖有变更时）

  npm install

  2. 启动本地服务（脚本在 package.json:12）

  npm run dev

  3. 浏览器打开入口页

  http://127.0.0.1:8080/index.html

  你可以重点验收这几项：

  - 首页 16 个工具卡片点击后是否新开标签进入对应二级页
  - 搜索框输入“字数”后回车，是否出现“字数计算”建议并可跳转
  - 二级页功能是否可用（例如 wordcount.html 的“确认/清空”）

  如果 8080 端口被占用，改端口启动：

  PORT=8081 npm run dev

  然后访问 http://127.0.0.1:8081/index.html。

  停止服务：终端里按 Ctrl + C。
```
