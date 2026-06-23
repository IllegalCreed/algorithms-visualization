# 需求：堆排序动画（接入算法播放器框架，M3 第六个算法，首个非线性「树」可视化）

> Status: verified
> Stable ID: C-20260623-013
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Progress: 100%
> Blocked by: none
> Next action: 已完成（38 Case 全绿，门禁通过，已落 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供「算法播放器」框架）；C-20260620-007（选择排序，`sortedUpTo` 连续区已排序）；C-20260623-011（归并排序，首扩外壳「双轨」——`Step.aux` + `AuxView` 数组轨）；C-20260623-012（快速排序，第二条轨 `Step.stack` + `StackView` 区间栈轨；堆排序照此范式新增**第三条轨** `Step.tree` + `TreeView` 二叉树轨）
> Related tests: 计划新增 `TC-HEAP-ALGO-*`（oracle）/ `TC-HEAP-MOD-*`（插桩 + 四语言源码）/ `TC-VIZ-TREEVIEW-*`（二叉树轨组件）/ `TC-VIEW-HEAP-*`（薄壳视图）/ `TC-E2E-HEAP-*`（端到端），并扩展 `TC-VIZ-BAR-*`（新增 `heapNode` 态）、`TC-VIZ-BARSVIEW-*`（`heapNode` 接入优先级链）、`TC-PLAYER-*`（外壳条件渲染树轨）；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起通用「算法播放器」框架；M3 用它逐个补齐菜单中尚缺的排序动画。已落地五个 M3 算法（选择 / 插入 / 希尔 / 归并 / 快速），可视化轨经历两次扩展：

- 归并（C-011）首扩**双轨**：`Step.aux` + `AuxView`（辅助**数组**轨，表达 temp 副本）。
- 快速（C-012）加**第二条轨**：`Step.stack` + `StackView`（区间**栈**轨，表达控制结构）。

本变更是 roadmap **M3「算法补全」的第六个 plan**：接入**堆排序**。它与前五个有一个根本不同——**堆是数组表示的完全二叉树**。前五个算法的可视化都是**线性**结构（柱状主轨 / 辅助数组轨 / 区间栈轨），而堆排序的精髓是**树形结构**：父节点 `i` 与子节点 `2i+1`/`2i+2` 的堆序关系、`siftDown` 沿树向下的「下沉」路径。这正是 roadmap 与归并/快排 requirements 反复预留的「树/非线性结构可视化」首个真实触发点：

> 「树/图/链表等非线性结构的通用插槽化仍待后续。」（roadmap）
> 「经典递归树形象……若做快排时一并评估树/区间栈可视化的通用插槽。」（C-011）

堆排序新增**第三条可视化轨** `TreeView`（完全二叉树布局：节点定位 + 父子连线），与下方复用的 `BarsView` 数组轨**同步高亮**，直观展示「数组下标 ↔ 树节点」的映射——这是堆排序最强的教学价值。本次只做「完全二叉树」这一最小必要的树布局，不做通用图/任意树布局。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:73-74` 已列 `heap-sort`（标题「堆排序」）。
- 首页网格 `src/views/Home/Main/hooks.ts:115-119` 已有堆排序条目（`HeapIcon` 已 import；desc「利用大顶堆性质每次找出最大的数放在末尾，然后重复构造和维护大顶堆」与本次大顶堆+升序实现一致，**无需改文案**）。
- **但 `src/router/index.ts` 只注册到 `quick-sort`，`heap-sort` 路由缺失——点击菜单/首页会 404。** 这正是本变更要补的入口。

## 三个地基决策（brainstorming 已确认）

1. **可视化形态 = 二叉树 TreeView + 数组轨对照**。上方画完全二叉树（节点圆 + 父子连线），下方保留柱状数组轨；两者用同一 `array` + `emphasis` **同步高亮**，展示「堆其实是数组」。代价：新增 `TreeView` 外壳组件 + 完全二叉树布局逻辑（节点定位 + 边），是 roadmap 预告的树可视化首次落地，工作量比快排栈轨更大。
2. **建堆方式 = Floyd 自底向上 `siftDown`**。从最后一个非叶子节点 `⌊n/2⌋-1` 逆序逐个 `siftDown`，O(n) 建堆。与排序阶段的 `siftDown` 主操作**统一**——全算法只需实现**一个 `siftDown`**（建堆和排序共用）。代价：放弃「逐个 `siftUp` 插入」的直觉，但换来代码与执行点的统一（归入「不做」逐个插入建堆）。
3. **TreeView 实现 = 节点 div 绝对定位 + SVG 父子边**。节点用绝对定位 `div`（复用新拟物圆形样式、便于测试定位 class），父子边用一层 SVG `line`。代价：需算每个节点的 (x, y) 完全二叉树坐标；但布局纯函数、可单测。

## 堆排序与前五种排序的可视化本质差异

堆排序引入两个全新角色：

1. **树形结构（第三条轨）**：节点 `k` 的父 = `⌊(k-1)/2⌋`、左子 = `2k+1`、右子 = `2k+2`。`TreeView` 把数组按层序画成完全二叉树，`siftDown` 时高亮「当前父节点 → 较大子 → 交换下沉」的路径。这是堆区别于前五者的核心可视诉求——必须画出树，否则堆排序退化成「另一个每次选最大放末尾的选择排序」，失去教学价值。
2. **两阶段 + 单一 `siftDown`**：① **建堆** `heapify`（从 `⌊n/2⌋-1` 逆序 `siftDown`，把乱序数组变成大顶堆）；② **排序** `extract`（堆顶最大 `a[0]` 与堆末 `a[end]` 交换、`end` 脱离堆就位、缩小的堆上 `siftDown(0)` 恢复）。已排序区是数组**连续后缀** `[end+1, n)` → 复用选择/冒泡的 `sortedFrom`（不像快排的离散 `sortedIndices`）；堆边界恰好 = `sortedFrom`。

复用关系一句话：**已排序后缀复用 `sortedFrom`（连续区）；当前 `siftDown` 父节点用新增 `heapNode`、比较的子用 `comparing`、交换用 `swapped`；并新增 `TreeView` 把同一数组画成二叉树、与数组轨同步高亮。**

## 要做什么

1. **堆排序算法模块**（`src/algorithms/`）
   - `heap-sort.ts`：纯算法 oracle（Floyd 大顶堆），返回 `{ built, result }`（建堆后大顶堆快照 + 升序结果）+ `isMaxHeap` 辅助，正确性交叉校验用，对标 `merge-sort.ts`/`quick-sort.ts`。
   - `heap-sort.module.ts`：插桩重走 Floyd 堆排序，产出逐行粒度的胖步骤 `Step<HeapExecPoint>[]` + `heapSortModule`（每步带 `tree` 树轨快照）。
   - `heap-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言**Floyd siftDown** 源码 + `lineMap`。
2. **框架的向后兼容扩展（加法为主，外壳新增一处条件渲染）**
   - `types.ts`：新增 `HeapExecPoint`（6 个执行点）；新增 `TreeTrack` 接口（`{ heapSize: number }`）；`Step` 增 `tree?: TreeTrack`；`StepEmphasis` 增 `heapNode?: number`（当前 `siftDown` 活动父节点）。
   - `Bar.vue`：`state` 增加 `'heapNode'` 态（深紫 `#7e57c2`，区别于 min 浅紫 `#9d8df0`），新增 `.bar.heapNode` 样式。
   - `BarsView.vue`：`stateOf` 接入 `heapNode`。优先级链扩为 `pivot > key > sorted > heapNode > swapped > min > comparing > dimmed > idle`，前六算法判定**不变**。
   - **新增 `TreeView.vue`**：完全二叉树轨——节点 `div` 绝对定位（按层序坐标）+ SVG 父子边；节点态复用主轨同一套（`heapNode` 深紫 / `comparing` 黄 / `swapped` 橙 / `sortedFrom` 后缀绿 = 已脱离堆 / 堆内 idle）。`heapSize` 用于区分堆内/已就位节点。
   - `AlgorithmPlayer.vue`：在 `BarsView` 之上加 `<TreeView v-if="current.tree" … />`——**仅堆排序这类带 `tree` 的算法渲染，前六算法 `tree` 恒 `undefined`，不渲染、零回归**。这是唯一一处外壳改动（与 AuxView/StackView 的 `v-if` 同构、并列）。
3. **可视化语义**
   - 树轨与数组轨同源：同一 `array` + `emphasis`。当前 `siftDown` 父节点 `heapNode` 深紫；`compare` 步比较的子 `comparing` 黄；`swap` 步父子 `swapped` 橙、FLIP 交换（稳定 id）；`extract` 步堆顶与末尾交换、末尾节点转 `sorted` 绿并脱离堆（`heapSize` 减 1）；已就位后缀 `sortedFrom` 全绿。
   - 树布局：节点 `k` 在第 `⌊log₂(k+1)⌋` 层，层内按 `2^depth` 槽均分 x；父子边连 `k → ⌊(k-1)/2⌋`。
4. **接入框架**
   - `HeapSort.vue`：薄壳，`<AlgorithmPlayer :module="heapSortModule" />`。
   - `src/router/index.ts`：在 `quick-sort` 之后新增 `heap-sort` 懒加载路由（`name` = slug）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 进度推进 + 「外壳新增第三条轨 `TreeView`（首个非线性结构）」记录）。

## 不做什么（边界）

- **不做小顶堆 / 堆的独立插入·删除演示 / d 叉堆 / 索引堆**：固定「大顶堆 + 升序」的标准堆排序。
- **不做逐个 `siftUp` 建堆**：固定 Floyd 自底向上 `siftDown`（一个 siftDown 统一建堆与排序）。
- **不做通用图 / 任意树布局框架**：`TreeView` 只布局**完全二叉树**（堆的形态）；通用非线性插槽化仍归 roadmap 后续。
- **不改冒泡 / 选择 / 插入 / 希尔 / 归并 / 快速的展现与测试**：本次对六者是**零行为变化**——它们的 `Step` 不带 `tree`、不设 `heapNode`、`TreeView` 不渲染、`Bar` 只是多一个合法态；所有现有 Case 行为不变、不标 superseded。
- **不重构数据契约 / 外壳状态机**：`usePlayer` / `TransportControls` / `VariablePanel` / `CodePanel` / `AuxView` / `StackView` 逻辑零改动；`AlgorithmPlayer` 仅加一行条件渲染。
- **不补其他排序 / 数据结构**：计数排序仍归 M3 后续 plan。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源（`heap.svg`）均已就位；树轨用原生 SVG，不引图形库。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：扩展后前六算法侧（各 `*.module.ts` / `*.sources.ts` / `*.module.spec.ts` / `Bar.spec.ts` / `BarsView.spec.ts` / `AlgorithmPlayer.spec.ts` / `AuxView.spec.ts` / `StackView.spec.ts`）**零行为变化**，全部现有 Case 照常通过。`TreeView` 仅在 `current.tree` 为真时渲染。
- 柱态优先级（扩展后）：`pivot > key > sorted > heapNode > swapped > min > comparing > dimmed > idle`。`heapNode` 置于 `sorted` 之后（已就位节点脱离堆、显绿优先），高于 `swapped`/`comparing`（当前活动父节点始终显形）。前六算法不设 `heapNode`，判定不变。
- **堆性质**：大顶堆——任意节点 `a[i] ≥ a[2i+1]` 且 `a[i] ≥ a[2i+2]`（子存在时）。建堆从 `⌊n/2⌋-1` 逆序 `siftDown`；排序 `end` 从 `n-1` 递减到 `1`。
- **初始数据沿用 `[7,6,5,10,9,8,4,3,2,1]`**：与前几个同款，便于横向对比；`n=10`。建堆后大顶堆 = `[10,9,8,6,7,5,4,3,2,1]`（已验算满足堆性质，见 design §3），排序后 `[1..10]`。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 自动部署 GitHub Pages；自有域名 `algo.illegalscreed.cn` 需手动 `./scripts/deploy.sh`。
- 缺陷修复遵循铁律：先写能复现的失败用例，再改代码，再验证通过。

## 验收口径

- [ ] 进堆排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮；`heapify / compare / swap / settle / extract / done` 六个执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / 阶段 / heapSize / i / left / right / largest / swapCount`（具体集合见 design），变化时高亮。
- [ ] **树 + 数组双视图**：上方二叉树——节点按完全二叉树布局、父子连线；当前 `siftDown` 父节点深紫、比较的子标黄、交换橙、已就位（脱离堆）节点转绿。下方数组轨——同一数组同步高亮。建堆阶段后树满足大顶堆；排序阶段堆逐步缩小、数组后缀逐个变绿。
- [ ] **正确性**：建堆阶段末数组 = oracle `built` 且 `isMaxHeap` 为真；末步数组严格升序 = oracle `result` = `[1..10]`；含逆序 / 重复 / 已序 / 单元素 / 空输入均正确。
- [ ] **框架可复用 + 向后兼容（硬验收）**：新增算法靠「实现一个带 `tree` 的 `AlgorithmModule` + 一条路由 + 一个薄壳 + `TreeView` + 纯加法 `heapNode` 态 + 一行外壳条件渲染」完成；**前六算法全部现有 Case 仍绿**，且六者页面不渲染 `TreeView`。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- 树轨高度/层数：`n=10` 完全二叉树 4 层（深度 0-3），固定层高即可；超大 `n` 的滚动/缩放暂不处理（本数据足够）。
- 父子边的绘制：暂定单层 SVG `line`（坐标取节点中心）；实现期肉眼复核边与节点对齐、明暗主题下可见。
- `extract` 步是否拆「交换」与「缩堆」两步：暂定**一步**（swap(0,end) + heapSize 减 1 同帧），随后 `siftDown(0)` 的 compare/swap/settle 逐步出帧；若观感需要再拆。
- `siftDown` 内「选 largest」是否拆「比左子」「比右子」两次 compare：暂定**一步** compare（一次性确定 largest，caption 说明与左右子比较结果），减少步数；实现期视清晰度可调。
- 步骤总数：建堆 + 排序，`n=10` 为 `O(n log n)` 量级，`usePlayer` 按 index 回放无性能/竞态问题。

## 变更历史

- 2026-06-23：创建。brainstorming 确认三大地基决策——① 可视化采用**二叉树 `TreeView` + 数组轨对照**（外壳第三条轨、首个非线性结构）；② 建堆采用 **Floyd 自底向上 `siftDown`**（建堆与排序统一一个 siftDown）；③ TreeView 用**节点 div 绝对定位 + SVG 父子边**。
