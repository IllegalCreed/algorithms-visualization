# 实现记录：英文目录扩展到 30 页

> Status: draft
> Stable ID: C-20260711-130
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 10%
> Blocked by: Owner 确认 30 页目标与二十页清单
> Next action: 批准范围后先写 registry/route/SEO 红测
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-124、C-20260711-126、C-20260711-127
> Related tests: TC-I18N-CATALOG-130-_、TC-I18N-MODULE-130-_、TC-I18N-CONTENT-130-_、TC-SEO-I18N-130-_、TC-I18N-UI-130-_、TC-I18N-BUILD-130-_、TC-E2E-I18N-130-\_
> Related design: design.md

## 当前状态

只完成只读审计和方案草案，尚未修改 `src/`、router、测试、构建脚本、依赖或线上页面。C127 同期只更新方案并后置，没有开始宣传自动化代码。

## 审计证据

- `PILOT_PAGE_PAIRS` 固定 10 条，`pilot.spec.ts` 固定断言 10/7/2/1。
- router 手写 9 个英文内容 child route，Home 独立。
- `homeCatalog.ts` 维护 icon map 与四组 route name；Complexity 和 Paths 各有独立算法集合。
- `englishAlgorithmModules.ts` 集中七个 adapter，当前超过 450 行。
- 二十个候选页均有真实 module；其中七个 slug 与 module basename 不同：`topo`、`editdist`、`queens`、`rabinkarp`、`sieve`、`closestpair`、`bbound`，实现时必须显式映射。
- C126 已有 registry、module、UI、build、L5 与 105 页双 base 守护，可作为迁移安全网。

## 计划执行清单

### T0 结构测试

- [ ] 以现有 10 组页面、7/2/1 类型、9 个内容 route 和 105 页 SEO 为 oracle，先写新 catalog/loader/派生视图等价性红测。
- [ ] 先写 catalog/loader/router/Home/Menu/Search 双向全集红测；T1 不提前断言尚未实现的二十页。
- [ ] 先写 10 组 alternate 与 85 个未翻译中文页无假映射红测，锁定迁移不改变线上集合。

### T1 十页无行为重构

- [ ] 新建 locale catalog，并让 `pilot.ts` 提供兼容导出。
- [ ] 建 typed loader map，router 从 catalog 派生英文 route records。
- [ ] Home、Complexity、Paths 移除页面集合硬编码。
- [ ] 七个英文 module adapter 拆文件，C126 module 结构测试保持全绿。
- [ ] 新建英文 style guide，固定术语、大小写、复杂度表达、播放器状态词和交叉链接文风。
- [ ] T1 完成时产物仍为 105 页，单独运行全回归确认纯重构。

### T2 二十页内容

- [ ] Batch A：Bubble Sort、Merge Sort、Heap Sort、Counting Sort、Binary Bounds；预期推进到 15 英文/110 总页。
- [ ] Batch B：Kruskal、Prim、Bellman-Ford、Topological Sort、Closest Pair；预期推进到 20 英文/115 总页。
- [ ] Batch C：Edit Distance、LCS、LIS、N-Queens、Subsets；预期推进到 25 英文/120 总页。
- [ ] Batch D：Maze、Rabin-Karp、Manacher、Sieve of Eratosthenes、Euclidean GCD；预期推进到 30 英文/125 总页。
- [ ] 每批完成 module adapter、英文 SFC、metadata、complexity、path tags、术语 QA 和定向 L3/L4。
- [ ] 每批先改该批预期使测试变红，再实现到全绿；不得让红测跨批次悬挂。

### T3 导航与构建

- [ ] 英文 Home/Menu/Search 均覆盖 29 个内容页。
- [ ] Complexity 27 行，Paths 覆盖全部 27 个算法。
- [ ] registry/prerender/sitemap/llms/manifest/verifier 扩到 125 页。

### T4 交付

- [ ] `pnpm format`、`pnpm verify`、coverage、全量 Playwright、selfhost build 全绿。
- [ ] 桌面和 900px 窄视口抽查九大类代表页、Home、Complexity、Paths。
- [ ] 回写四文档、plan/test 三索引、roadmap、marketing 与 agent 记忆。
- [ ] 两次精确提交（feature + docs）、push、Pages/selfhost 双轨部署和 125 页线上抽查。

## 设计偏差

尚未实现，无偏差。

## 验证记录

- 2026-07-11：只读审计确认 20 个候选 slug 均同时存在于 Home catalog 与 router，且对应 module 均存在。
- 未运行代码测试；本计划批准并进入 T0 前不声称任何新增页面可用。

## 变更历史

- 2026-07-11：创建 draft，实现尚未开始。
