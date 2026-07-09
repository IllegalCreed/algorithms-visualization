# 项目适配说明

> Status: active
> Last reviewed: 2026-07-09
> Owner: IllegalCreed

本文件是本项目对两份通用规范的**适配层**，只记录本项目的命名与分层选择，不改写通用规范本身。
通用规范见 `docs/通用分层文档规范.md` 与 `docs/通用测试规范.md`。

## 1. 分层文档规范适配（§10.5）

| 适配项         | 本项目取值                                                                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change ID 规则 | `C-YYYYMMDD-NNN`；plan 目录 `YYYYMMDD-cNNN-short-name`                                                                                                                                  |
| Owner 命名     | 个人项目，统一用 `IllegalCreed`                                                                                                                                                         |
| 模块划分       | 按 `src/views` 区域：`home` / `docs-shell` / `article-datastructure` / `article-sort` / `master` / `about`；外加 `viz-engine`（`src/components` 可视化组件）、`infra`（构建/CI/工具链） |
| 历史文档兼容   | 无历史 `docs/` 体系，本次起全新建立，无需迁移                                                                                                                                           |
| 测试索引       | `docs/test-cases/index.md`、`by-layer.md`、`by-module.md` 已建立；新增/变更测试需同步回写对应索引                                                                                       |

## 2. 测试规范适配（§10.1）

本项目是**纯 Vue 3 前端、无 Spring Boot 后端**，因此通用测试规范的五层模型按下表裁剪：

| 层          | 通用定义                        | 本项目                                                                   |
| ----------- | ------------------------------- | ------------------------------------------------------------------------ |
| L1 后端单元 | JUnit + Mockito                 | **不适用**（无后端）                                                     |
| L2 后端集成 | SpringBootTest + DB             | **不适用**（无后端、无 DB）                                              |
| L3 前端单元 | Vitest，不 mount                | **适用**：纯函数 / `hooks.ts` composable / Pinia store                   |
| L4 前端组件 | Vitest + @vue/test-utils，mount | **适用**：`src/components` 可视化组件、各 `*.vue` 视图的渲染与交互       |
| L5 端到端   | Playwright / Cypress            | **适用**：Playwright，覆盖跨页面导航、播放器流程、站点质量与重点页面冒烟 |

| 占位项            | 本项目取值                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 测试环境          | 纯前端，无测试 DB / 缓存 / profile；无需环境隔离                                                                                                |
| 目录约定          | L3/L4 用 Vitest，测试文件置于 `src/**/*.spec.ts`；L5 用 Playwright，测试文件置于 `e2e/*.e2e.ts`                                                 |
| 跑测命令          | `pnpm test:unit run`（Vitest 单次）；`pnpm coverage`（覆盖率）；`pnpm exec playwright test`（L5 端到端）                                        |
| 安全类清单        | 本项目无认证 / 鉴权 / 金额 / 权限等安全敏感代码 → 安全类清单为空；如未来引入需在此登记                                                          |
| 覆盖率门槛        | Vitest 已配置全局阈值（lines/statements/functions 70%，branches 60%）；复杂变更按通用规范在 plan 中声明更高门槛                                 |
| 测试库重置与 seed | 不适用（无后端 / DB）                                                                                                                           |
| 外部依赖          | 无运行时外部依赖，无需 mock                                                                                                                     |
| CI 集成           | GitHub Pages workflow 当前卡 `lint:check` + `format:check` + `type-check` + `build-only`；本地交付门禁按变更风险补跑 Vitest/coverage/Playwright |

## 3. 当前缺口（如实披露）

- L1/L2 永久不适用，除非未来引入后端服务。
- Playwright L5 已落地，但未纳入当前 GitHub Pages workflow；需要发版或高风险改动时按 plan 记录本地/手动运行结果。
- 早期概览、路线图或 plan 索引中可能残留阶段性旧事实；若与源码、测试、`docs/plans/completion-backlog.md` 冲突，以后者为准并及时小步校正。
