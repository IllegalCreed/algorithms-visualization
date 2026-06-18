# 项目概览

> Status: active
> Last reviewed: 2026-06-18
> Owner: IllegalCreed

## 项目简介

数据结构和算法可视化（algorithms-visualization）：一个交互式的数据结构与算法可视化单页应用（SPA），用动画演示数组、链表、排序算法等的执行过程。纯前端，无后端，部署到 GitHub Pages。

## 当前事实

| 项       | 当前值                                                          |
| -------- | --------------------------------------------------------------- |
| 形态     | 纯前端 SPA（Vue 3 + TS + Vite + Vue Router + Pinia + Less）     |
| 包管理器 | pnpm（见 `docs/plans/20260618-c001-deps-and-gates/`）           |
| 主要用户 | 学习数据结构与算法的人                                          |
| 核心能力 | 首页分类导航、文档/文章页、可视化动画（当前仅冒泡排序完整实现） |
| 部署     | GitHub Pages，`main` 推送自动发布                               |
| 测试     | 暂无自动化测试（见 `docs/test-cases/index.md`）                 |
| 主要入口 | `docs/roadmap.md`、`docs/plans/index.md`                        |

## 模块地图

| 模块       | 说明                                       | 代码位置                                               |
| ---------- | ------------------------------------------ | ------------------------------------------------------ |
| 布局外壳   | 顶层 Master + Header；Home/Docs/About 路由 | `src/views/Master`、`src/views/Home`、`src/views/Docs` |
| 文章页     | 数据结构与排序算法的讲解 + 动画            | `src/views/Article/{DataStructure,SortAlgorithm}`      |
| 可视化引擎 | List/Block/Arrow/ArrowTrack 等复用动画组件 | `src/components`                                       |
| 状态       | Pinia system store（暗色模式、配色等）     | `src/store`                                            |

## 边界

- 本系统负责：算法/数据结构的前端可视化演示。
- 本系统不负责：后端服务、数据持久化、用户账号。
- 外部依赖：无运行时外部服务。

## AI 阅读提示

新任务优先阅读：`docs/roadmap.md` → `docs/plans/index.md` → 相关 plan → 代码。开发前务必先读 `docs/通用分层文档规范.md` 与 `docs/通用测试规范.md`，以及本项目适配说明 `docs/documentation-adapter.md`。
