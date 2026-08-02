# 项目概览

> Status: active
> Last reviewed: 2026-08-02
> Owner: IllegalCreed

## 项目简介

数据结构和算法可视化（algorithms-visualization）：一个交互式的数据结构与算法可视化单页应用（SPA），用动画、文章、复杂度速查、学习路径和测验模式帮助用户学习数据结构与算法。纯前端，无后端，线上采用 GitHub Pages + 自有域名双轨部署。

## 当前事实

| 项       | 当前值                                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 形态     | 纯前端 SPA（Vue 3 + TypeScript + Vite + Vue Router + Pinia + Less）                                                                                                                                                                   |
| 包管理器 | pnpm（`packageManager` 锁定在 `package.json`；见 `docs/plans/20260618-c001-deps-and-gates/`）                                                                                                                                         |
| 主要用户 | 学习数据结构、算法、面试/竞赛入门知识的人                                                                                                                                                                                             |
| 内容规模 | 中英文各 95 个索引页；每种语言均为 Home、2 个工具页、15 个数据结构页与 77 个算法页；首页为 9 大类 92 个学习条目，Docs 侧栏为 10 组 94 项                                                                                              |
| 核心能力 | 分类导航、文章页、AlgorithmPlayer 多轨动画、四语言代码高亮、自定义输入、播放控制、测验模式、全站搜索、复杂度速查、学习路径、中英显式切换                                                                                              |
| 算法引擎 | `src/algorithms` 下 77 个 `*.module.ts`，大多遵循 oracle / module / sources 三件套；播放器按可选轨道渲染对应视图                                                                                                                      |
| 部署     | GitHub Pages（`/algorithms-visualization/`，`main` push 自动部署）+ 自有域名 `https://algo.illegalscreed.cn`（`scripts/deploy.sh` 手动）                                                                                              |
| 测试     | 2026-07-30：Vitest L3/L4 303 个文件、2156 个用例全绿；Playwright L5 105 个文件、119 个用例全绿；coverage 与双 base 190 页构建门禁通过                                                                                                 |
| 当前阶段 | C136 四站 GA4 标签失败后的安全重试与个人站 hydration 修复已验证并部署；个人站、算法站、Quiz、Type Pal 第一阶段均已在自有域上线；`content-studio` V0.1 后续实现通用 Playwright 录制器并接 FFmpeg                                       |
| 增长现状 | 95 中文 + 95 英文与 190 页静态产物已上线；C135/C136 仍只允许同意后的清洗页面浏览；四站受控验证均得到 `g/collect` 204，Owner 已在四站 Realtime 看到活跃用户；Home 顶部初始化 banner 可能滞后，Baidu 统计不在本轮范围；渠道写入仍需授权 |
| 主要入口 | `AGENTS.md` / `CLAUDE.md`、`docs/roadmap.md`、`docs/marketing/execution-backlog.md`、`docs/plans/index.md`、`docs/test-cases/index.md`                                                                                                |

## 模块地图

| 模块           | 说明                                                                                                | 代码位置                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 布局外壳       | 顶层 Master + Header；Home/Docs/About 路由                                                          | `src/views/Master`、`src/views/Home`、`src/views/Docs`                           |
| 内容页         | 中文数据结构/算法文章与完整 `/en` 对应目录                                                          | `src/views/Article/{DataStructure,SortAlgorithm,Algorithm}`、`src/views/English` |
| 播放器         | AlgorithmPlayer、播放控制、代码高亮、变量面板、自定义输入、测验卡                                   | `src/components/player`                                                          |
| 可视化轨道     | Bars/Graph/Matrix/Board/Maze/Kmp/Sieve/Gcd/Power/Hull/Network 等可插拔轨道组件                      | `src/components`                                                                 |
| 算法模块       | oracle、步骤构建、四语言 sources 与 lineMap                                                         | `src/algorithms`                                                                 |
| 产品数据资产   | 首页/菜单分类、复杂度速查、学习路径                                                                 | `src/views/Home/Main/hooks.ts`、`src/views/Docs/Menu/hooks.ts`、`src/data`       |
| 多语言目录     | 95 组 typed 页面映射、94 个静态内容 loader、15 个共享 Viz locale 与 77 个英文算法 adapter           | `src/i18n`、`src/views/English/pages.ts`                                         |
| SEO/静态产物   | 190 页 registry、route head/JSON-LD/95 组 hreflang、Playwright 预渲染、JSDOM/HTTP 产物门禁          | `src/seo`、`scripts/prerender.mjs`、`scripts/verify-seo.mjs`                     |
| 广告接入       | 公开 publisher 常量、build-only AdSense head、根级 ads.txt 与双语隐私入口                           | `src/monetization`、`vite.config.ts`、`public/ads.txt`、`src/views/Home/Footer`  |
| 分析与渠道链接 | basic consent 后的 GA4 标准 page_view、URL 清洗、UTM 校验与链接 CLI；无搜索/输入/播放/测验/分享事件 | `src/analytics`、`src/components/AnalyticsConsent.vue`                           |
| 宣传规划       | CampaignSpec、19 渠道能力/runtime gate、MCP v3 bridge、事实快照、renderer 与零副作用 dry-run        | `scripts/marketing`                                                              |
| 状态           | Pinia system store（暗色模式、Header 阴影、搜索面板、标准配色等）                                   | `src/store`                                                                      |
| 部署与门禁     | Vite 配置、GitHub Pages workflow、自有域名部署脚本、Vitest/Playwright 配置、本地 `pnpm verify`      | `vite.config.ts`、`.github/workflows`、`scripts`、`*.config.ts`                  |
| 分层文档       | 需求/设计/实现/测试用例索引，记录每次复杂变更的过程和验证结果                                       | `docs`                                                                           |

## 边界

- 本系统负责：算法/数据结构的前端可视化演示。
- 本系统不负责：后端服务、数据持久化、用户账号。
- 外部依赖：无自有运行时后端服务；生产页面会加载 Google AdSense，广告展示与同意状态依赖 Google 服务，核心学习功能仍可独立运行。

## AI 阅读提示

新任务优先阅读：`AGENTS.md`（Codex）或 `CLAUDE.md`（Claude）→ `docs/roadmap.md` → 当前领域事实源（增长任务读 `docs/marketing/execution-backlog.md`）→ `docs/plans/index.md` → 相关 plan → 代码。`docs/plans/completion-backlog.md` 只保留 M9-M12 封版历史。开发前务必先读 `docs/通用分层文档规范.md` 与 `docs/通用测试规范.md`，以及本项目适配说明 `docs/documentation-adapter.md`。

若文档之间事实冲突，优先级为：当前源码与测试结果 > 最新 plan / completion backlog > agent 记忆文件（`AGENTS.md` / `CLAUDE.md`）> 本概览。发现过期事实时，按本文件这种方式小步校正，不静默沿用旧状态。
