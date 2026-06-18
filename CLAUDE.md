# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

数据结构和算法可视化 —— 一个交互式的数据结构与算法可视化单页应用（SPA）。技术栈：Vue 3（`<script setup>`）+ TypeScript + Vite + Vue Router（HTML5 history 模式）+ Pinia + Less。界面文案、菜单标题及大部分代码注释均为中文。部署到 GitHub Pages。

## 开发规范（必须遵循）

仓库 `docs/` 下有两份强制规范，**动手任何开发、修复、重构、测试前先读相关章节**：

- [docs/通用分层文档规范.md](docs/通用分层文档规范.md) —— AI 协作的分层文档体系。复杂变更建 `docs/plans/YYYYMMDD-cNNN-short-name/` 四文档（`requirements.md` / `design.md` / `implementation.md` / `test-cases.md`），并回写 `docs/plans/index.md` 主索引和 `docs/test-cases/` 全局索引。每份文档带状态元信息块（状态机：draft→approved→…→verified / superseded / obsolete）。行为变化时旧文档标 `superseded` 并做双向链接，**不静默改写历史需求**。
- [docs/通用测试规范.md](docs/通用测试规范.md) —— 自测→自测报告→测试准入制度；五层测试模型 L1-L5；缺陷修复铁律「先写能复现的失败用例，再改代码，再验证通过」；分级覆盖率门槛（安全类 100% / 业务核心 ≥85% / 业务一般 ≥70%）。

### 本项目适配要点

- 该测试规范以「Spring Boot 后端 + Vue 前端」为底座，但**本项目是纯 Vue 前端、无后端**：L1（后端单元）、L2（后端集成）不适用；实际适用 **L3**（前端单元，纯函数/composable/store，Vitest 不 mount）、**L4**（前端组件，Vitest + `@vue/test-utils` mount）、**L5**（端到端，需另装 Playwright/Cypress）。
- 现状基线：`docs/` 分层文档体系已建立（`overview.md` / `roadmap.md` / `documentation-adapter.md` / `plans/` / `test-cases/`）；首个变更 C-20260618-001（工具链现代化）见 `docs/plans/index.md`。仍无任何业务测试文件、无覆盖率配置、无 e2e 框架（归 M1）。按规范「碰到再做、新变更先规范」**渐进落地**，不要为补规范一次性重写历史文档。
- 提交前对照检查清单：文档规范 §11、测试规范 §9。

## 常用命令

包管理器是 **pnpm**（通过 corepack 提供，版本锁在 `package.json` 的 `packageManager` 字段；CI 也用 pnpm）。不要用 npm/yarn，否则会生成多余 lockfile。

- `pnpm dev` —— 启动 Vite 开发服务器
- `pnpm build` —— 通过 `npm-run-all` 并行执行 `type-check` 和 `build-only`；任何类型错误都会导致构建失败
- `pnpm build-only` —— 先 `vite build`，再把 `404.html` 复制进 `dist/`（GitHub Pages SPA 路由所必需，见下文）
- `pnpm type-check` —— `vue-tsc --build --force`
- `pnpm lint` —— `eslint . --fix`；CI 用只读的 `pnpm lint:check`
- `pnpm format` —— `prettier --write src/`；CI 用只读的 `pnpm format:check`
- `pnpm preview` —— 预览已构建的 `dist/`
- `pnpm test:unit` —— Vitest（jsdom + `@vue/test-utils`）监听模式。**目前还没有任何测试文件。** 单次运行某个文件用 `pnpm test:unit run <file>`，按名称过滤加 `-t "<name>"`。

**门禁：** ESLint 10（flat config，`eslint.config.ts`，用 `eslint-plugin-vue` + `@vue/eslint-config-typescript`）+ Prettier（`.prettierrc.json`，`skip-formatting` 让两者不冲突）。`vue/multi-word-component-names` 已关闭（项目单字组件名惯例）。pre-commit 由 husky（`.husky/pre-commit`）+ lint-staged 触发，对暂存的 `*.{ts,vue}` 跑 `eslint --fix`、对更多类型跑 `prettier --write`。CI（`deploy.yml`）在构建前卡 `lint:check` + `format:check` + `type-check`。

## 单看一个文件不易察觉的约定

**路径别名：** `@` → `src/`（在 `vite.config.ts` 和 `tsconfig.app.json` 中均有定义）；`~` → 项目根目录（仅 Vite 生效，不参与类型检查）。优先使用 `@/...`。

**Less 全局注入：** `vite.config.ts` 通过 `additionalData` 把 `src/styles/common.less` 自动注入到每一个 `<style lang="less">` 块中。因此所有颜色变量（`@neumorphis-background`、`@font-color` 等）、新拟物（neumorphism）混入（`.neumorphism-flat()`、`.neumorphism-btn()` 等）、布局混入（`.row()`、`.center()`）和断点（`@screen-max-width`）在任何组件中**都无需 import 即可使用**。不要重复 import 这些内容。

**每个视图的目录结构：** 每个视图把 `*.vue` + `hooks.ts`（组合式逻辑，导出为 `useXxx()` 函数）+ `types.ts`（局部接口）放在同一目录下。`.vue` 文件保持轻量，逻辑写进 `hooks.ts`。

## 架构

### 布局与路由层级（`src/router/index.ts`、`src/views/`）

- `/` → `Master.vue`（带全局 `Header` 的外壳）包裹：
  - ``→`Home.vue`（Splash + 分类网格 + Footer）
  - `/docs` → `Docs.vue`（侧边 `Menu` + `Main` 内容区）包裹懒加载的文章页
- 文章页位于 `src/views/Article/{DataStructure,SortAlgorithm}/*.vue`，以**懒加载** `() => import()` 的方式注册路由。路由的 `name` 必须等于菜单的 `url` slug（例如 `bubble-sort`）；`Docs/Menu/hooks.ts` 中的 `useMenuSelect` 读取当前路由名来高亮菜单项。

### 状态（`src/store/modules/system.ts`）

`useSystemStore`（Pinia setup 式写法）。值得注意的是它暴露了 `colors`（`['red','blue','yellow','green']`）—— 动画中按指针 id 索引使用的标准配色 —— 以及 `isDarkMode` / `isShowHeaderShadow` 开关。

### 可视化引擎（`src/components/`）—— 核心领域

所有算法动画共用的可复用积木：

- **`List.vue`** —— 在 `<TransitionGroup>` 内渲染一排 `Block.vue`。Prop `data: [string, number][]`，其中下标 `[0]` 是**稳定的 key（id）**，`[1]` 是数值。稳定 key + TransitionGroup 的组合正是数组重排时产生平滑 FLIP 交换动画的关键。它还会把每个值归一化为 0–1 的 `percent`（按数组的 min→max），传给每个 `Block`。
- **`Block.vue`** —— 单个数值格子；背景不透明度随 `percent` 变化（值越大颜色越深）。
- **`ArrowTrack.vue` + `Arrow.vue`** —— 画在列表下方的指针指示器。Prop `data: Pointer[]`（来自 `src/types/types.ts` 的 `{ id, index }`）；每个箭头由 store 中的 `colors[id]` 着色，并通过 `translateX(index * 60px)` 定位到对应槽位。

### 动画范式（参考：`Article/SortAlgorithm/BubbleSort.vue`）

- 用 `reactive` 数组保存状态。把算法写成 `async` 函数，**逐步修改这些 reactive 数组**，每步之间 await 一个本地的 `delay(ms)`（Promise + `setTimeout`），让 DOM 过渡有机会渲染。
- 移动指针 = 给 `pointerArray[n].index` 赋值；交换数值 = 交换 `[string,number][]` 数组中的元素（因为 key 保持稳定，会自动产生动画）。
- 提供 `getInitial*()` 工厂函数返回全新数据，以便重置状态。

### 新增一个算法 / 数据结构页面（涉及多个文件）

1. 在 `src/views/Article/{SortAlgorithm,DataStructure}/<Name>.vue` 下用上述组件/范式创建视图。
2. 在 `src/router/index.ts` 注册懒加载路由，`name` = slug。
3. 在 `src/views/Docs/Menu/hooks.ts`（`useCategoryData`）的侧边菜单中添加条目。
4. 在 `src/views/Home/Main/hooks.ts` 的首页网格中添加条目（图标 + 描述）。

当前状态：第 3 步的侧边菜单已经列出了许多尚无路由/视图的排序算法（selection-sort、merge-sort……）—— 点击这些会 404。冒泡排序是唯一完整实现的动画。首页网格（`Home/Main/hooks.ts`）中 bucket/radix 被注释掉了。

## 部署与 GitHub Pages SPA 路由

`.github/workflows/deploy.yml` 在推送到 `main` 时运行：`pnpm install --frozen-lockfile` → 门禁（`lint:check` + `format:check` + `type-check`）→ `pnpm build-only` → 上传 `dist/` → 部署到 Pages（Node 22 + `pnpm/action-setup`）。

由于应用使用 `createWebHistory`，深层链接需要 [spa-github-pages](https://github.com/rafgraph/spa-github-pages) 方案：`404.html`（由 `build-only` 复制进 `dist/`）把路径编码进 query string，`index.html` 里有一段内联脚本负责还原它。改动路由时要让两者保持一致。

`VITE_BASE_URL` 同时驱动 Vite 的 `base` 和路由的 base：开发环境为 `/`（`.env.development`），生产环境为 `/algorithms-visualization/`（`.env.production`）。更换仓库/Pages 路径时需要同步修改 `.env.production`。
