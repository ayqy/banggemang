# PRD-2 资源恢复与重写方案

## 目标
将线上页面的 JS/CSS/图片资源镜像到本地，并完成 HTML/运行时路径改写，使页面在本地同源可运行。

## 执行结果
1. 已下载并镜像首页+16二级页所需静态资源。
2. 已将页面资源链接重写至 `/assets/mirror/...`。
3. 已修补 webpack runtime publicPath，支持本地加载动态 chunk。
4. 已修补资源脚本中的绝对域名引用，避免关键静态资源回源。

## 进度
| 子任务 | 状态 | 说明 | 证据 |
|---|---|---|---|
| 资源下载脚本 | 已完成 | `scripts/recovery/download-assets.mjs` | 脚本文件 |
| HTML重写脚本 | 已完成 | `scripts/recovery/rewrite-html.mjs` | 脚本文件 |
| 运行时修补脚本 | 已完成 | `scripts/recovery/patch-runtime.mjs` | 脚本文件 |
| 资源镜像结果 | 已完成 | 本地镜像文件共118个 | `assets/mirror` |

## 资源映射规则
- `https://static.res.qq.com/...` -> `/assets/mirror/static.res.qq.com/...`
- `https://m4.publicimg.browser.qq.com/...` -> `/assets/mirror/m4.publicimg.browser.qq.com/...`
- `https://tool.browser.qq.com/...` 静态资源 -> `/assets/mirror/tool.browser.qq.com/...`

## 脚本说明
- `scripts/recovery/fetch-pages.mjs`
  - `loadRouteConfig()`
  - `fetchRouteHtml(route)`
  - `saveRawHtml(route, html)`
- `scripts/recovery/download-assets.mjs`
  - `extractAssetUrls(html)`
  - `normalizeAssetUrl(url, route)`
  - `downloadAsset(url, localPath)`
- `scripts/recovery/rewrite-html.mjs`
  - `rewriteAssetLinks(html)`
  - `rewritePageLinks(html)`
  - `writeRecoveredHtml(route, html)`
- `scripts/recovery/patch-runtime.mjs`
  - `patchWebpackPublicPath(filePath, localBase)`
  - `patchAbsoluteHostReferences(filePath, hostMap)`

## 关键产物
- 资源清单：`artifacts/baseline/asset-manifest.json`
- 镜像目录：`assets/mirror`
- 最终页面：`index.html` + 16 个二级页 HTML
