# 项目概览

> Status: active
> Last reviewed: 2026-07-09
> Owner: IllegalCreed

## 项目简介

数据结构和算法可视化（algorithms-visualization）：一个交互式的数据结构与算法可视化单页应用（SPA），用动画、文章、复杂度速查、学习路径和测验模式帮助用户学习数据结构与算法。纯前端，无后端，线上采用 GitHub Pages + 自有域名双轨部署。

## 当前事实

| 项       | 当前值                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 形态     | 纯前端 SPA（Vue 3 + TypeScript + Vite + Vue Router + Pinia + Less）                                                                      |
| 包管理器 | pnpm（`packageManager` 锁定在 `package.json`；见 `docs/plans/20260618-c001-deps-and-gates/`）                                            |
| 主要用户 | 学习数据结构、算法、面试/竞赛入门知识的人                                                                                                |
| 内容规模 | 首页/菜单 9 大类、92 个算法与数据结构条目；另有复杂度速查表与学习路径页                                                                  |
| 核心能力 | 分类导航、文章页、AlgorithmPlayer 多轨动画、四语言代码高亮、自定义输入、播放控制、测验模式、全站搜索、复杂度速查、学习路径               |
| 算法引擎 | `src/algorithms` 下 77 个 `*.module.ts`，大多遵循 oracle / module / sources 三件套；播放器按可选轨道渲染对应视图                         |
| 部署     | GitHub Pages（`/algorithms-visualization/`，`main` push 自动部署）+ 自有域名 `https://algo.illegalscreed.cn`（`scripts/deploy.sh` 手动） |
| 测试     | Vitest L3/L4 已落地：277 个测试文件、2012 个用例在 2026-07-09 本地全绿；Playwright L5 端到端目录已有 102 个 `*.e2e.ts`                   |
| 当前阶段 | `docs/plans/completion-backlog.md` 标记 M9-M12 全清单完成，项目进入 1.0 封版后的营销执行与维护期                                         |
| 主要入口 | `AGENTS.md` / `CLAUDE.md`、`docs/plans/completion-backlog.md`、`docs/roadmap.md`、`docs/plans/index.md`、`docs/test-cases/index.md`      |

## 模块地图

| 模块         | 说明                                                                           | 代码位置                                                                   |
| ------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 布局外壳     | 顶层 Master + Header；Home/Docs/About 路由                                     | `src/views/Master`、`src/views/Home`、`src/views/Docs`                     |
| 内容页       | 数据结构、排序、图算法、动态规划、搜索、字符串、数论、几何、查找等文章页       | `src/views/Article/{DataStructure,SortAlgorithm,Algorithm}`                |
| 播放器       | AlgorithmPlayer、播放控制、代码高亮、变量面板、自定义输入、测验卡              | `src/components/player`                                                    |
| 可视化轨道   | Bars/Graph/Matrix/Board/Maze/Kmp/Sieve/Gcd/Power/Hull/Network 等可插拔轨道组件 | `src/components`                                                           |
| 算法模块     | oracle、步骤构建、四语言 sources 与 lineMap                                    | `src/algorithms`                                                           |
| 产品数据资产 | 首页/菜单分类、复杂度速查、学习路径                                            | `src/views/Home/Main/hooks.ts`、`src/views/Docs/Menu/hooks.ts`、`src/data` |
| 状态         | Pinia system store（暗色模式、Header 阴影、搜索面板、标准配色等）              | `src/store`                                                                |
| 部署与门禁   | Vite 配置、GitHub Pages workflow、自有域名部署脚本、Vitest/Playwright 配置     | `vite.config.ts`、`.github/workflows`、`scripts`、`*.config.ts`            |
| 分层文档     | 需求/设计/实现/测试用例索引，记录每次复杂变更的过程和验证结果                  | `docs`                                                                     |

## 边界

- 本系统负责：算法/数据结构的前端可视化演示。
- 本系统不负责：后端服务、数据持久化、用户账号。
- 外部依赖：无运行时后端服务；仅依赖静态资源、浏览器环境与部署基础设施。

## AI 阅读提示

新任务优先阅读：`AGENTS.md`（Codex）或 `CLAUDE.md`（Claude）→ `docs/plans/completion-backlog.md` → `docs/roadmap.md` → `docs/plans/index.md` → 相关 plan → 代码。开发前务必先读 `docs/通用分层文档规范.md` 与 `docs/通用测试规范.md`，以及本项目适配说明 `docs/documentation-adapter.md`。

若文档之间事实冲突，优先级为：当前源码与测试结果 > 最新 plan / completion backlog > agent 记忆文件（`AGENTS.md` / `CLAUDE.md`）> 本概览。发现过期事实时，按本文件这种方式小步校正，不静默沿用旧状态。
