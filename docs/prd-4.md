# PRD-4 测试用例与执行结果

## 目标
建立线上基线与本地对比测试，覆盖视觉结构、DOM关键节点、核心功能场景。

## 进度
| 子任务 | 状态 | 说明 | 证据 |
|---|---|---|---|
| 基线采集脚本 | 已完成 | `scripts/baseline/capture-baseline.mjs` | 脚本文件 |
| 场景采集脚本 | 已完成 | `scripts/baseline/capture-scenarios.mjs` | 脚本文件 |
| E2E 对比测试 | 已完成 | `tests/e2e/parity.spec.ts` | 测试文件 |
| 测试执行与报告 | 已完成 | 17/17 通过，报告已产出 | `artifacts/test-results` |

## 基线证据
- 截图：`artifacts/baseline/screenshots/*.png`（17张）
- DOM签名：`artifacts/baseline/dom/*.json`（17份）
- 网络签名：`artifacts/baseline/network/*.json`（17份）
- 场景期望：`artifacts/baseline/scenarios/*.json`（17份）

## 测试用例清单
| 页面 | caseId | 验证点 | 期望文件 |
|---|---|---|---|
| education-home | home-search-suggestion | 搜索“字数”建议项和链接一致 | `artifacts/baseline/scenarios/education-home-home-search-suggestion.json` |
| handwriting_erasure | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/handwriting_erasure-basic-structure.json` |
| zitie_new | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/zitie_new-basic-structure.json` |
| relatives_name | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/relatives_name-basic-structure.json` |
| school | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/school-basic-structure.json` |
| wordcount | wordcount-calc | 输入文本后输出结果一致 | `artifacts/baseline/scenarios/wordcount-wordcount-calc.json` |
| dynasties | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/dynasties-basic-structure.json` |
| capital | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/capital-basic-structure.json` |
| jielong | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/jielong-basic-structure.json` |
| markmap | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/markmap-basic-structure.json` |
| hanzifayin | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/hanzifayin-basic-structure.json` |
| periodic | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/periodic-basic-structure.json` |
| translate | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/translate-basic-structure.json` |
| radical | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/radical-basic-structure.json` |
| allegory | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/allegory-basic-structure.json` |
| explain | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/explain-basic-structure.json` |
| chengyujielong | basic-structure | 页面标题、工具区、基础结构一致 | `artifacts/baseline/scenarios/chengyujielong-basic-structure.json` |

## 自动化测试执行
- 命令：`npm run test:e2e`
- 结果：`17 passed`
- 报告：`artifacts/test-results/playwright-report/index.html`

## 结论
- 首页及16个二级页在视觉、DOM、场景用例层面与线上基线保持一致。
- 本地镜像可作为后续功能迭代基础代码。
