# 实现记录：英文目录扩展到 30 页

> Status: verified
> Stable ID: C-20260711-130
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 已由 C131 完成 95 英文 / 190 总页全量对齐
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-124、C-20260711-126、C-20260711-127、C-20260711-131
> Related tests: TC-I18N-CATALOG-130-_、TC-I18N-MODULE-130-_、TC-I18N-CONTENT-130-_、TC-SEO-I18N-130-_、TC-I18N-UI-130-_、TC-I18N-BUILD-130-_、TC-E2E-I18N-130-\_
> Related design: design.md

## 当前状态

C130 的代码、内容、测试、双 base 构建、视觉检查和双轨发布均已完成：英文目录为 Home + 2 个工具页 + 27 个算法页，和 95 个中文页共同形成 125 个索引页。C127 同期只更新方案并后置，没有开始宣传自动化代码；C130 verified 后，工程主线已切回 C127 T1。

## 审计证据

- `PILOT_PAGE_PAIRS` 固定 10 条，`pilot.spec.ts` 固定断言 10/7/2/1。
- router 手写 9 个英文内容 child route，Home 独立。
- `homeCatalog.ts` 维护 icon map 与四组 route name；Complexity 和 Paths 各有独立算法集合。
- `englishAlgorithmModules.ts` 集中七个 adapter，当前超过 450 行。
- 二十个候选页均有真实 module；其中七个 slug 与 module basename 不同：`topo`、`editdist`、`queens`、`rabinkarp`、`sieve`、`closestpair`、`bbound`，实现时必须显式映射。
- C126 已有 registry、module、UI、build、L5 与 105 页双 base 守护，可作为迁移安全网。

## 计划执行清单

### T0 结构测试

- [x] 以现有 10 组页面、7/2/1 类型、9 个内容 route 和 105 页 SEO 为 oracle，先写新 catalog/loader/派生视图等价性红测。
- [x] 先写 catalog/loader/router/Home/Menu/Search 双向全集红测；T1 不提前断言尚未实现的二十页。
- [x] 先写 10 组 alternate 与 85 个未翻译中文页无假映射红测，锁定迁移不改变线上集合。

### T1 十页无行为重构

- [x] 新建 locale catalog；消费者迁移完成后删除 `pilot.ts`，不保留旧语义入口。
- [x] 建 typed loader map，router 从 catalog 派生英文 route records。
- [x] Home、Complexity、Paths 移除页面集合硬编码。
- [x] 七个英文 module adapter 拆文件，C126 module 结构测试保持全绿。
- [x] 新建英文 style guide，固定术语、大小写、复杂度表达、播放器状态词和交叉链接文风。
- [x] T1 完成时产物仍为 105 页，单独运行全回归确认纯重构。

### T2 二十页内容

- [x] Batch A：Bubble Sort、Merge Sort、Heap Sort、Counting Sort、Binary Bounds；推进到 15 英文/110 总页。
- [x] Batch B：Kruskal、Prim、Bellman-Ford、Topological Sort、Closest Pair；推进到 20 英文/115 总页。
- [x] Batch C：Edit Distance、LCS、LIS、N-Queens、Subsets；推进到 25 英文/120 总页。
- [x] Batch D：Maze、Rabin-Karp、Manacher、Sieve of Eratosthenes、Euclidean GCD；推进到 30 英文/125 总页。
- [x] 每批完成 module adapter、英文 SFC、metadata、complexity、path tags、术语 QA 和定向 L3/L4。
- [x] 每批先改该批预期使测试变红，再实现到全绿；没有红测跨批次悬挂。

### T3 导航与构建

- [x] 英文 Home/Menu/Search 均覆盖 29 个内容页。
- [x] Complexity 27 行，Paths 的 8 条路线覆盖全部 27 个算法。
- [x] registry/prerender/sitemap/llms/manifest/verifier 扩到 125 页。

### T4 交付

- [x] `pnpm format`、lint、type-check、全量 Vitest、coverage、全量 Playwright、production/selfhost build 全绿。
- [x] 桌面和 900px 窄视口抽查 Home、Complexity 与代表性算法播放器，无新增溢出或遮挡。
- [x] 回写四文档、plan/test 三索引、roadmap、marketing 与 agent 记忆。
- [x] 两次精确提交（feature + docs）、push、Pages/selfhost 双轨部署和 125 页线上抽查。

## 设计偏差

- 原设计允许迁移期保留 `pilot.ts` 兼容导出；实际在所有消费者切换后直接删除，避免继续维护第二套命名。
- 构建脚本没有把目标常量从 105 改成 125，而是由英文 Home 和 manifest 动态发现数量，并与 registry、sitemap、静态内链交叉验证。
- 部分轨道存在中文展示标签，采用可选英文 labels/status props 做 additive 本地化；中文调用方不传时行为不变。

## 验证记录

- 2026-07-11：只读审计确认 20 个候选 slug 均同时存在于 Home catalog 与 router，且对应 module 均存在。
- T0/T1：catalog、loader、派生视图和 adapter 拆分按先红后绿完成，105 页纯迁移构建通过。
- T2：四批均先得到 11 个预期失败，再补齐五页到全绿；阶段规模依次为 110、115、120、125 页。
- L3/L4：286 个测试文件、2073 个用例全绿。
- Coverage：Statements 95.24%、Branches 87.02%、Functions 91.46%、Lines 95.54%。
- L5：104 个 Playwright 文件、115 个用例全绿；C130 定向 5 个用例覆盖目录、工具、代表轨、切换、搜索/播放器和 900px 窄屏。
- 构建：production 与 selfhost 均预渲染并验证 125 页；桌面/900px 视觉抽查无控制台错误、页面横向溢出或控件遮挡。
- 发布：功能提交 `5dca6c4`；Pages run `29136875578` 成功且 latest deployment SHA 匹配；selfhost 原子切换成功。两域 `/en/`、`/en/docs/gcd/`、`/en/docs/manacher/` 与 sitemap 均返回 200，sitemap 为 125 URL。

## 变更历史

- 2026-07-11：创建 draft，实现尚未开始。
- 2026-07-11：Owner 批准 C130；状态转 implementing，开始 T0 迁移红测。
- 2026-07-11：T0-T4 本地实现与验证完成，状态转 implemented；等待精确提交和双轨发布。
- 2026-07-11：功能提交、Pages/selfhost 双轨发布与线上产物抽查完成，状态转 verified；工程主线回到 C127。
- 2026-07-11：Owner 后续将全量英文对齐置于 C127 前；C131 继续扩展本实现，C130 维持 verified 历史。
- 2026-07-11：C131 verified；当前线上已从本计划的 30 英文/125 总页扩为 95 英文/190 总页。
