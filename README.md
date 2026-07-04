# benchmark 分支：自动测评基准与脚本说明

本分支用于**自动测评其他分支**的页面功能复刻情况：
- 测试框架：Playwright（功能测试为主）
- 测评脚本：`scripts/grade-remote-branches.mjs`

## 环境准备

- Node.js（建议 18+）
- 默认批量模式需要已配置好 `origin` 远程，并具备对被测分支和 `main` 的 push 权限
- `--path` / `--branch` 单次评分模式不需要 push 权限

安装依赖：

```bash
npm install
```

## 一键测评所有远程分支

在 `benchmark` 分支执行：

```bash
npm run grade
```

脚本会：
1. `git fetch origin --prune`
2. 枚举所有远程分支并**排除**：`main`、`benchmark`、`task`（以及 `origin/HEAD`）
3. 为每个待测分支创建/复用 worktree：`.worktrees/<branch>`
4. 启动该分支的本地静态服务（随机端口）
5. 对该分支的所有 HTML 页面跑完整测试用例集
6. 生成该分支的 `README.md`（清空原内容，仅保留：分数 + 用例通过情况表格）
7. 在该分支中提交并 `git push origin <branch>`
8. 合并更新 `main` 分支 `README.md` 中的自动测评排行榜，只覆盖本次分支的新分数，不删除原有未参与本次评分的表格行

## 对本地目录单独跑分

```bash
npm run grade -- --path .
```

或指定其他本地目录：

```bash
npm run grade -- --path ../some-project
```

该模式只会：
- 对指定目录跑分
- 在终端输出结果

该模式不会：
- 操作任何分支
- 切换到 `main`
- 更新任何 `README.md`
- 提交或推送

## 对指定分支单独跑分

```bash
npm run grade -- --branch fable-5
```

该模式只会：
- 对指定分支快照跑分
- 在终端输出结果

该模式不会：
- 操作任何分支
- 切换到 `main`
- 更新任何 `README.md`
- 提交或推送

## 分数计算口径

用例标题按 `routeId:caseName` 归类到各功能页（route）。每个 route 的通过率 = `passed/total`，最终分数为所有 route 通过率的平均值 × 100（四舍五入）。
