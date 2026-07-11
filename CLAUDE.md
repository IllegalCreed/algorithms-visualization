# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

数据结构和算法可视化 —— 一个交互式的数据结构与算法可视化单页应用（SPA）。技术栈：Vue 3（`<script setup>`）+ TypeScript + Vite + Vue Router（HTML5 history 模式）+ Pinia + Less。界面文案、菜单标题及大部分代码注释均为中文。线上采用 GitHub Pages + 自有域名双轨部署。

## Claude 项目记忆

本仓库内的持久项目记忆以 `CLAUDE.md` 为主，配合 `docs/overview.md`、`docs/roadmap.md`、`docs/plans/index.md`、`docs/plans/completion-backlog.md`、`docs/marketing/execution-backlog.md` 和 `docs/test-cases/` 使用。不同文档冲突时，以当前源码与测试、最新 plan 和当前领域事实源为准。

## 开发规范（必须遵循）

仓库 `docs/` 下有两份强制规范，**动手任何开发、修复、重构、测试前先读相关章节**：

- [docs/通用分层文档规范.md](docs/通用分层文档规范.md) —— AI 协作的分层文档体系。复杂变更建 `docs/plans/YYYYMMDD-cNNN-short-name/` 四文档（`requirements.md` / `design.md` / `implementation.md` / `test-cases.md`），并回写 `docs/plans/index.md` 主索引和 `docs/test-cases/` 全局索引。每份文档带状态元信息块（状态机：draft→approved→…→verified / superseded / obsolete）。行为变化时旧文档标 `superseded` 并做双向链接，**不静默改写历史需求**。
- [docs/通用测试规范.md](docs/通用测试规范.md) —— 自测→自测报告→测试准入制度；五层测试模型 L1-L5；缺陷修复铁律「先写能复现的失败用例，再改代码，再验证通过」；分级覆盖率门槛（安全类 100% / 业务核心 ≥85% / 业务一般 ≥70%）。

### 本项目适配要点

- 该测试规范以「Spring Boot 后端 + Vue 前端」为底座，但**本项目是纯 Vue 前端、无后端**：L1（后端单元）、L2（后端集成）不适用；实际适用 **L3**（前端单元，纯函数/composable/store，Vitest 不 mount）、**L4**（前端组件，Vitest + `@vue/test-utils` mount）、**L5**（端到端，需另装 Playwright/Cypress）。
- 现状：`docs/` 分层文档体系已建立（`overview.md` / `roadmap.md` / `documentation-adapter.md` / `plans/`(每变更四文档 + 三表 `index.md`) / `test-cases/`(三索引 `index`/`by-layer`/`by-module`)）；L3/L4 单元/组件测试 + L5 Playwright e2e + 覆盖率均已就位。按规范「碰到再做、新变更先规范」**渐进落地**，不为补规范一次性重写历史文档。
- 提交前对照检查清单：文档规范 §11、测试规范 §9。

## 常用命令

包管理器是 **pnpm**（通过 corepack 提供，版本锁在 `package.json` 的 `packageManager` 字段；CI 也用 pnpm）。不要用 npm/yarn，否则会生成多余 lockfile。

- `pnpm dev` —— 启动 Vite 开发服务器
- `pnpm build` —— 通过 `npm-run-all` 并行执行 `type-check` 和 `build-only`；任何类型错误都会导致构建失败
- `pnpm build-only` —— production base 构建后用 Playwright 预渲染并验证当前 190 页，再复制 `404.html`（GitHub Pages）
- `pnpm build:selfhost` —— selfhost base=`/` 构建，同样预渲染并验证当前 190 页，再复制 `404.html`
- `pnpm type-check` —— `vue-tsc --build --force`
- `pnpm lint` —— `eslint . --fix`；CI 用只读的 `pnpm lint:check`
- `pnpm format` —— Prettier 写入项目源码、文档、e2e、public、workflow 与根部配置/HTML/MD/JSON/TS；CI 用只读的 `pnpm format:check`
- `pnpm preview` —— 预览已构建的 `dist/`
- `pnpm test:unit` —— Vitest（jsdom + `@vue/test-utils`）监听模式；单次运行用 `pnpm test:unit:run` 或加 `run`（`pnpm test:unit run <file>`），按名称过滤 `-t "<name>"`，覆盖率用 `pnpm coverage`。2026-07-11 本地现状：299 个测试文件 / 2131 个 L3/L4 用例全绿。
- `pnpm exec playwright test [<name>]` —— L5 端到端（真机 Chromium），用例在 `e2e/*.e2e.ts`（2026-07-11 本地 104 个文件 / 118 个用例全绿）。
- `pnpm verify` —— 本地复现 Pages build job 门禁：`format:check` → `lint:check` → `type-check` → `test:unit:run` → `build-only`；不含 coverage/e2e。
- `pnpm marketing:dry-run -- --spec <campaign.json>` —— 校验/规范化 CampaignSpec，输出渠道候选、UTM、capability/runtime gate 与 `sideEffects=[]`；可选 `--runtime <status.json>` 只接受非敏感布尔状态。

**门禁：** ESLint 10（flat config，`eslint.config.ts`，用 `eslint-plugin-vue` + `@vue/eslint-config-typescript`）+ Prettier（`.prettierrc.json`，`skip-formatting` 让两者不冲突）。`vue/multi-word-component-names` 已关闭（项目单字组件名惯例）。pre-commit 由 husky（`.husky/pre-commit`）+ lint-staged 触发，对暂存的 JS/TS/Vue 跑 `eslint --fix`、对更多类型跑 `prettier --write`。CI（`deploy.yml`）在构建前卡 `lint:check` + `format:check` + `type-check` + `test:unit:run`，Build 前安装 Chromium，`build-only` 再执行 SEO 产物门禁。

## 单看一个文件不易察觉的约定

**路径别名：** `@` → `src/`（在 `vite.config.ts` 和 `tsconfig.app.json` 中均有定义）；`~` → 项目根目录（仅 Vite 生效，不参与类型检查）。优先使用 `@/...`。

**Less 全局注入：** `vite.config.ts` 通过 `additionalData` 把 `src/styles/common.less` 自动注入到每一个 `<style lang="less">` 块中。因此所有颜色变量（`@neumorphis-background`、`@font-color` 等）、新拟物（neumorphism）混入（`.neumorphism-flat()`、`.neumorphism-btn()` 等）、布局混入（`.row()`、`.center()`）和断点（`@screen-max-width`）在任何组件中**都无需 import 即可使用**。不要重复 import 这些内容。

**每个视图的目录结构：** 每个视图把 `*.vue` + `hooks.ts`（组合式逻辑，导出为 `useXxx()` 函数）+ `types.ts`（局部接口）放在同一目录下。`.vue` 文件保持轻量，逻辑写进 `hooks.ts`。

## 架构

### 布局与路由层级（`src/router/index.ts`、`src/views/`）

- `/` → `Master.vue`（带全局 `Header` 的外壳）包裹：
  - ``→`Home.vue`（Splash + 分类网格 + Footer）
  - `/docs` → `Docs.vue`（侧边 `Menu` + `Main` 内容区）包裹懒加载的文章页
- 中文文章页位于 `src/views/Article/{DataStructure,SortAlgorithm,Algorithm}/*.vue`；C131 的 95 页英文目录位于 `src/views/English/`，94 个内容路由由 `src/views/English/pages.ts` 的显式静态 loader map 与 locale catalog 共同生成。页面以**懒加载** `() => import()` 的方式注册路由。中文 route `name` 必须等于菜单的 `url` slug（例如 `bubble-sort`），英文 route 使用 `en-*`；`Docs/Menu/hooks.ts` 中的 `useMenuSelect` 读取当前路由名来高亮菜单项。

**SEO/静态入口：** `src/seo/site.ts` 管理 95 个中文页与 95 个 `/en` 页面，共 190 个可索引页面；`useRouteSeo.ts` 管理路由级 head、JSON-LD 与 95 组双向 `hreflang`。构建后 `scripts/prerender.mjs` 用 Playwright 输出 `dist/<route>/index.html`、sitemap、llms 与 manifest，`scripts/verify-seo.mjs` 用 JSDOM 逐页验证；页面总数和成对集合从 catalog/manifest 动态发现，不维护 pilot slug 或固定页数常量。内容页 canonical、sitemap 和预渲染内链统一使用尾斜杠，以命中目录静态入口；Vue Router 内部 path 仍保持原有无尾斜杠形式。

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

### 算法播放器与可插拔轨（`src/components/player/`）—— 现在的主力范式

早期页（如 `BubbleSort.vue`）用 `reactive` + `async delay` 手写动画；**后续绝大多数页改用 `AlgorithmPlayer.vue`**：module 产出一串「胖步骤」`Step[]`（含数组快照 + 各轨快照 + `vars` + 执行点 `point` + 字幕），播放器负责逐步回放、进度条 `.scrub`、代码同步高亮（Shiki，`point` 经 `lineMap` 查每语言行号）。

- **可插拔轨**：`Step` 上每条轨是一个可选字段（`array`/`aux`/`stack`/`tree`/`count`/`bucket`/`graph`/`matrix`/`board`/`decisionTree`/`maze`/`kmp`/`manacher`/`sudoku`/`suffixArray`…），`AlgorithmPlayer` 里一行 `<XxxView v-if="current.xxx" :.../>` 条件渲染。**某算法不设某字段 → 该轨不渲染**，天然零回归。
- **复用优先**：一个 View 常服务多个算法（MatrixView 服务 7 个 DP、GraphView 服务图算法、MazeView 服务迷宫/岛屿/单词搜索、KmpView 服务 KMP/RK/BM）。新算法**先看能否复用/additive 扩展已有轨**（加可选字段、旧消费者不传即不受影响），复用不了再新建 View。
- **module 三件套**：`src/algorithms/<name>.{ts(oracle),module.ts(buildSteps),sources.ts(TS/Python/Go/Rust 四语言 + lineMap)}`；oracle 独立算真值，module.spec 末步与 oracle 对拍。

**新增一个页面（涉及多文件）**：① 需要新轨则先 T0（types.ts 加 `XxxTrack`/`XxxExecPoint`/`Step.xxx?` + 新建 `XxxView.vue` + `AlgorithmPlayer` 加一行 v-if + spec）；② module 三件套 + spec；③ 新页 `src/views/Article/<Cat>/<Name>.vue`（`<Article>` 正文 + `<AlgorithmPlayer :module>`）；④ `src/router/index.ts` 懒加载路由（`name`=slug）；⑤ `src/views/Docs/Menu/hooks.ts` 侧边菜单条目；⑥ `src/views/Home/Main/hooks.ts` 首页网格条目（图标 svg + 描述）；⑦ 改对应 `TC-HOOK`（菜单/首页 children 断言）。

当前状态：九大类（数据结构 / 排序 / 图算法 / 动态规划 / 回溯与搜索 / 字符串 / 数学与数论 / 计算几何 / 查找）各有 92 个中英学习条目；中文/英文 Docs 侧栏均为 10 组、94 个非 Home 入口，首组是复杂度与学习路径工具；`src/algorithms` 下有 77 个 `*.module.ts`；播放器可插拔轨约 20 条。C131 `/en` 95 页目录（Home、2 个工具页、15 个数据结构页、77 个算法页）与 190 页静态产物已双轨上线；C132 已补齐中文侧栏工具组；本地 299 个 L3/L4 测试文件 / 2131 个用例、104 个 L5 文件 / 118 个用例、coverage 与双 base 全绿。C127 为 in-progress/79%，T1/T2/T3-A/T3-B/T3-C/T3-D1-A 已完成：公开仓库有七工具 MCP v2 contract 和 renderer payload bridge，本机 personal plugin 位于 `~/plugins/marketing-ops`，已有 stdio、一次性 setup/status/doctor、Keychain/Profile、队列、receipt、共享 adapter contract、固定 GitHub CLI、Release/Issue/traffic collector 及 MCP status/feedback/report/delete。T3-C 提交 `60feaff` 与 `github-release@1.2.0` 已完成 Owner 授权的 create/read/delete/tag-cleanup smoke，临时 Release `352517542`、receipt 与 tag 均已清理，GitHub activation 保持 ready/enabled。T3-D1-A 提交 `3858b56` 建立官方 `@weibo-ai/weibo-cli@0.8.3` 固定无写边界与注入式 `weibo-text@0.1.0` contract；T3-D1-B 已完成固定版本安装和 device OAuth，真实 null subscription 兼容修复提交 `088229d`，plugin 25 文件 / 111 用例、coverage 与 verify 全绿。Owner 个人开发者认证正在微博官方审核；production adapter 仍 disabled，未读账号 commands catalog、未冻结 action、未发帖。审核通过后完成零费用 Free/试用 gate 与 action 冻结，matching campaign 未授权前不写入，随后推进 Bluesky、DEV、Mastodon。C125 已由 C129 撤销，当前不加载 tracker、不发送事件，只保留 UTM。Header 搜索入口紧跟站点标题，语言与外链保留右侧。Owner 硬约束为零新增费用、无企业主体，宣传首期只做 GitHub、微博 Free、Bluesky、DEV、Mastodon，Reddit 后备，微信/B站/X 禁用；首次接入由 Codex 带向导，日常只需自然语言 campaign。执行事实源是 `docs/marketing/execution-backlog.md`，C131 事实源是 `docs/plans/20260711-c131-en-full-parity/`，C132 导航修复见 `docs/plans/20260711-c132-zh-learning-tools-menu/`；C-034 与 C125 均已 superseded。

## 部署（双轨，两步都要做）

线上有**两个独立部署**，发版必须两步做全，否则自有域名滞后旧版：

1. **GitHub Pages**（`/algorithms-visualization/` 子路径）：`git push` 到 `main` 后 `.github/workflows/deploy.yml` **自动**部署——`pnpm install --frozen-lockfile` → 门禁（`lint:check` + `format:check` + `type-check` + `test:unit:run`）→ `pnpm build-only`（base=`/algorithms-visualization/`）→ 上传 `dist/` → Pages（Node 22 + `pnpm/action-setup`）。
2. **自有域名 algo.illegalscreed.cn**（自有域，用户主用）：本地**手动**跑 `./scripts/deploy.sh`（`build:selfhost` + 当前 190 页 SEO 门禁 → tar → scp → 远程原子切换，旧版备份 `/var/www/algorithms/dist.old`）。**deploy.yml 不碰这台服务器。**

发版验证：两个域名各 `curl` 一下目标页 200，且 Pages 部署 SHA = HEAD；不要只看一个域名就下结论（C-007 只 push、自有域滞留旧版，因新路由未上线表现为「跳转静默失败」，排查绕弯）。

**⚠ 已知问题：GitHub Pages 部署反复卡死。** build job 绿、但 "Deploy to GitHub Pages" 步 ~6s 快失败报 `Deployment failed, try again later`（`gh api .../pages` 的 `status` 为 `null`）。非全站故障、非限流；单纯 rerun / 重推 / 冷却均无效。**已验证解卡三步**（几乎每次部署都可能复发，直接套用）：

```
gh api --method DELETE repos/IllegalCreed/algorithms-visualization/pages
sleep 3; gh api --method POST repos/IllegalCreed/algorithms-visualization/pages -f build_type=workflow
sleep 8; gh run rerun <失败runId> --failed   # build 已绿，只重跑 Deploy job
```

重置**不动 cname**（始终 `null`），故自有域走独立自托管、完全不受影响。属外部基础设施操作，套用前一句话告知用户即可。

**SPA 路由：** 应用用 `createWebHistory`；当前 190 个可索引 URL 已有目录式预渲染入口，未知路径与无尾斜杠客户端深链仍由 [spa-github-pages](https://github.com/rafgraph/spa-github-pages) 的 `404.html` + `index.html` 还原逻辑兜底。改动路由时预渲染发现、SEO registry 与 fallback 都要保持一致。`VITE_BASE_URL` 同驱 Vite `base` 与路由 base：开发 `/`（`.env.development`）、生产 `/algorithms-visualization/`（`.env.production`）。换仓库/Pages 路径需同步改 `.env.production`。

## 仓库工作流与变更交付流程

- **单人仓库：直接在 `main` 提交开发，不开 feature 分支 / PR。** 提交时机仍遵循「用户明确要求时才提交」。只 `git add` 本次变更自己的文件（不用 `-A`）；提交前三查（`git fetch` + `rev-list --count` 确认与 origin/main 同步）。
- **每个变更（复杂/新页）走固定 7 步**：① 简述设计要点（让用户能随时拦）→ ② 建 `docs/plans/YYYYMMDD-cNNN-<name>/` 四文档 + 注册 `docs/plans/index.md`(3 表) → ③ TDD 先红后绿，按层推进（T0 可视化轨 + 播放器接线 / T1 module+oracle+sources / T2 页+接线+改 TC-HOOK）→ ④ 全门禁（`format` 后 `pnpm verify` + `pnpm coverage` + `pnpm exec playwright test`）+ 真机自检 → ⑤ 回写（四档翻 `verified` + 自测报告、`roadmap.md`、三索引 `docs/test-cases/{index,by-layer,by-module}.md`、双向链接）→ ⑥ 两提交（feat + docs，中文 msg，直接 main）→ ⑦ 双轨部署 + 验证。
- 提交信息 footer 用户会指定协作者署名行（历史为 `Co-Authored-By: Claude ... <noreply@anthropic.com>`）。
