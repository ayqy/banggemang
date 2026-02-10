# 架构设计文档

## 技术栈
- 纯 HTML5 + CSS3 + JavaScript (与原站一致，无框架依赖)
- 每个页面为独立 HTML 文件
- 共享 CSS 用于通用布局组件
- 每个工具页面有独立 JS 逻辑
- 图片/图标引用原站 CDN: https://static.res.qq.com/qbtool/

## 文件结构
```
banggemang/
├── index.html              # 主页（教育工具分类）
├── css/
│   └── common.css          # 共享样式（头部、底部、侧边栏、搜索框等）
├── js/
│   └── common.js           # 共享 JS 功能
├── data/                   # 数据文件
│   ├── periodic.json       # 元素周期表数据
│   ├── idioms.json         # 成语数据
│   ├── capitals.json       # 各国首都数据
│   ├── dynasties.json      # 历史朝代数据
│   ├── allegory.json       # 歇后语数据
│   ├── radicals.json       # 汉字偏旁数据
│   ├── relatives.json      # 亲戚关系数据
│   ├── schools.json        # 高校数据
│   └── zitie-chars.json    # 字帖字符数据
├── handwriting_erasure.html # 去手写
├── zitie_new.html          # 字帖生成
├── relatives_name.html     # 亲戚关系计算
├── school.html             # 高校查询
├── wordcount.html          # 字数计算
├── dynasties.html          # 历史朝代查询
├── capital.html            # 各国首都
├── jielong.html            # 成语接龙
├── markmap.html            # 便捷思维导图
├── hanzifayin.html         # 汉字标准发音 (重定向到字帖生成)
├── periodic.html           # 元素周期表
├── translate.html          # 翻译
├── radical.html            # 汉字偏旁
├── allegory.html           # 歇后语
├── explain.html            # 词语注解
└── chengyujielong.html     # 成语大全
```

## 共享组件

### 1. 全局头部 (Header)
- Logo: "帮小忙 腾讯QQ浏览器在线工具箱" → 链接到 /
- 分类导航栏 (11个分类项):
  全部、图片工具、PDF转换工具、数据换算工具、生活娱乐工具、教育工具、文本工具、文档转换工具、开发工具、视频工具、浏览器插件

### 2. 搜索栏
- 搜索图标 + 输入框
- 使用计数器: "工具箱已累计帮助了 XXX 人次"

### 3. 右侧浮动工具栏
- 返回顶部按钮
- QQ 群链接
- 共建反馈链接
- 反馈链接

### 4. 更多推荐区域
- 2个推荐卡片

### 5. 全局底部 (Footer)
- Logo + 标语: "轻松办公，工具助你一臂之力"
- 隐私政策、数据处理规则链接
- 版权信息

### 6. 工具介绍区域
- h3 标题: "工具介绍及使用方法"
- 工具描述 + 使用步骤

## 16个工具页面复杂度分级

### 低复杂度 (简单查询模式)
| 页面 | 输入 | 输出 | 核心逻辑 |
|------|------|------|----------|
| radical.html | 单字输入+查询按钮 | 偏旁信息(disabled输入框) | 字典查找 |
| allegory.html | 关键词输入+查询按钮 | 段落结果 | 文本匹配搜索 |
| explain.html | 词语输入+查询按钮 | 列表(3个结果槽) | 字典查找 |
| wordcount.html | 文本区域 | 字数/字符/单词/句子统计 | 纯计算 |

### 中复杂度 (数据展示+交互)
| 页面 | 输入 | 输出 | 核心逻辑 |
|------|------|------|----------|
| capital.html | 搜索/浏览 | 国家首都表格 | 数据展示+搜索 |
| dynasties.html | 浏览/点击 | 朝代信息卡片 | 数据展示+筛选 |
| chengyujielong.html | 多模式搜索(汉字/拼音/笔画) | 成语结果列表 | 多条件搜索 |
| jielong.html | 成语输入 | 接龙结果 | 成语匹配算法 |
| school.html | 搜索+筛选 | 高校信息卡片 | 数据搜索+展示 |

### 高复杂度 (复杂交互/外部依赖)
| 页面 | 输入 | 输出 | 核心逻辑 |
|------|------|------|----------|
| periodic.html | 浏览/点击 | 118元素周期表 | 复杂表格布局+数据 |
| relatives_name.html | 按钮交互 | 关系计算结果 | 关系链算法 |
| zitie_new.html | 文字+模板+年级选择 | 可打印字帖 | 模板渲染+打印 |
| handwriting_erasure.html | 图片上传 | 处理后图片 | 图像处理(可能需API) |
| translate.html | 文本输入(iframe) | 翻译结果(iframe) | 5个翻译服务嵌入 |
| markmap.html | Markdown编辑 | SVG思维导图 | markmap.js渲染 |
| hanzifayin.html | - | 重定向到zitie_new | 重定向 |

## 实施顺序
1. **Phase 1**: 共享组件 + index.html 主页
2. **Phase 2**: 低复杂度工具 (4个)
3. **Phase 3**: 中复杂度工具 (5个)
4. **Phase 4**: 高复杂度工具 (7个)
5. **Phase 5**: 全面测试

## 进度追踪
- [x] 共享组件 (common.css, common.js)
- [x] index.html 主页
- [x] radical.html 汉字偏旁
- [x] allegory.html 歇后语
- [x] explain.html 词语注解
- [x] wordcount.html 字数计算
- [x] capital.html 各国首都
- [x] dynasties.html 历史朝代查询
- [x] chengyujielong.html 成语大全
- [x] jielong.html 成语接龙
- [x] school.html 高校查询
- [x] periodic.html 元素周期表
- [x] relatives_name.html 亲戚关系计算
- [x] zitie_new.html 字帖生成
- [x] handwriting_erasure.html 去手写
- [x] translate.html 翻译
- [x] markmap.html 便捷思维导图
- [x] hanzifayin.html 汉字标准发音(重定向)
