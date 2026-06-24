# 需求：计数排序动画（接入算法播放器框架，M3 第七个、收官排序，首个非比较排序）

> Status: verified
> Stable ID: C-20260624-014
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Progress: 100%
> Blocked by: none
> Next action: 已完成（37 Case 全绿，全门禁通过，待提交 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供「算法播放器」框架）；C-20260620-007（选择排序，`sortedUpTo` 连续前缀已排序——计数回写阶段复用）；C-20260622-010（希尔排序，`groupMembers/dimmed` 淡化机制——计数回写阶段淡化「已作废」尾部的同款思路，但本次用新增 `dimFrom` 表达连续后缀淡化）；C-20260623-011（归并排序，首扩外壳「双轨」`Step.aux` + `AuxView`）；C-20260623-012（快速排序，第二条轨 `Step.stack` + `StackView`）；C-20260623-013（堆排序，第三条轨 `Step.tree` + `TreeView`；计数排序照此范式新增**第四条轨** `Step.count` + `CountView` 计数桶轨）
> Related tests: 计划新增 `TC-COUNT-ALGO-*`（oracle）/ `TC-COUNT-MOD-*`（插桩 + 四语言源码）/ `TC-VIZ-COUNTVIEW-*`（计数桶轨组件）/ `TC-VIEW-COUNT-*`（薄壳视图）/ `TC-E2E-COUNT-*`（端到端），并扩展 `TC-VIZ-BARSVIEW-*`（新增 `dimFrom` 连续后缀淡化分支）、`TC-PLAYER-*`（外壳条件渲染计数桶轨）；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起通用「算法播放器」框架；M3 用它逐个补齐菜单中尚缺的排序动画。已落地六个 M3 算法（选择 / 插入 / 希尔 / 归并 / 快速 / 堆），可视化轨经历三次扩展：

- 归并（C-011）首扩**双轨**：`Step.aux` + `AuxView`（辅助**数组**轨，按位置索引）。
- 快速（C-012）加**第二条轨**：`Step.stack` + `StackView`（区间**栈**轨）。
- 堆排（C-013）加**第三条轨**：`Step.tree` + `TreeView`（完全**二叉树**轨，首个非线性结构）。

本变更是 roadmap **M3「算法补全」的第七个、也是排序系列的收官 plan**：接入**计数排序**。它与前六个有一个根本不同——**前六者都是「比较排序」**（靠两两比较决定次序），而计数排序是**非比较排序**：它不做任何元素间比较，而是利用「值本身就是下标」在已知值域上**统计每个值出现的次数**，再按值域顺序把元素还原。这是它最强的教学价值——展示「比较不是排序的唯一手段」，以及 O(n+k) 线性时间的来源。

前六者的可视化都围绕「位置」展开（主轨、辅助数组轨、区间栈轨、二叉树轨都是**按位置/下标**索引）。计数排序引入一条**全新维度的轨**——**按「值」索引的计数桶轨 `CountView`**：桶 `v` 的高度 = 值 `v` 在输入中出现的次数。这是「值→下标」映射的直接可视化，也是计数排序区别于前六者的核心可视诉求。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:75-78` 已列 `counting-sort`（标题「计数排序」）。
- 首页网格 `src/views/Home/Main/hooks.ts:120-125` 已有计数排序条目（`CountingIcon` 已在 `:16` import；desc「在已知取值范围的情况下，按照一种萝卜一个坑的思想进行排序」与本次「简单计数 + 走桶回写」实现一致，**无需改文案**）。
- **但 `src/router/index.ts` 只注册到 `heap-sort`，`counting-sort` 路由缺失——点击菜单/首页会 404。** 这正是本变更要补的入口。
- 桶排序 / 基数排序在首页网格中仍被注释（`src/views/Home/Main/hooks.ts:126-137`），**不在本次范围**——计数排序落地后，M3 排序系列即收官。

## 三个地基决策（brainstorming + 交互原型已确认）

1. **算法版本 = 简单计数排序「萝卜一个坑」**（不稳定、原地覆盖回写）。两阶段：① **计数** `count`——遍历输入，`count[a[i]-min]++`；② **走桶回写** `bucketStart`/`writeBack`——按值域从左到右走桶，当前桶有货就把值 `v` 写回主数组 `a[w++]`、`count[v]--`，直到桶空。放弃「前缀和 + 输出数组」的稳定版（归入「不做」），因为简单版最贴合首页已写的「萝卜一个坑」描述、核心洞见（值即下标 / 零比较）完全可见、只需新增一条轨。代价：回写不稳定、主轨是「原地覆盖」而非「飞行搬移」——但这正好表达计数排序「不搬元素、按计数重建数组」的本质。
2. **演示数据 = `[3,1,4,1,6,2,3,6,4,1]`（值域 1..6，n=10，含空桶）**。与前六者「1..10 无重复排列」不同——计数排序的精髓在**重复值 + 小值域**（桶才有高低、才看得出「萝卜堆进坑」）。值 5 计数为 0（**空桶**），用于展示「空桶自然写回 0 次、直接跳过」的教学点。`min=1`（非 0）保留与其他排序一致的值域，同时展示**桶下标 = 值 − min 的偏移**。建堆…（无）；计数后桶快照 = `[3,1,2,2,0,2]`，回写结果 = `[1,1,1,2,3,3,4,4,6,6]`。
3. **计数桶轨 `CountView` = 按值索引的「单元格堆叠」**（萝卜一个坑直译）。每个桶是一列从底向上堆叠的单元格（一格 = 一颗萝卜 / 一次计数），底部标值（`min..max`）、顶部标当前计数；当前活动桶高亮。计数阶段桶顶弹入一格；回写阶段当前桶倒出顶格、主轨写游标处柱**原地形变**为该值、`[0,w)` 转绿。代价：新增 `CountView` 外壳组件 + 一条 `dimFrom` 淡化字段；但桶轨布局纯数据、可单测。

## 计数排序与前六种排序的可视化本质差异

计数排序引入两个全新角色：

1. **按「值」索引的计数桶轨（第四条轨）**：桶 `b`（下标 `v-min`）的高度 = 值 `v` 出现次数。`CountView` 把「值域」画成一排桶，计数阶段填桶、回写阶段倒桶。这是计数排序区别于前六者的核心可视——必须画出桶，否则计数排序退化成「看不懂的数组突变」，失去教学价值。它也是首条**按值（而非位置）索引**的轨。
2. **两阶段 + 零比较**：① **计数** `count`（读游标 `i` 扫输入，对应桶 +1，主轨柱不动）；② **回写** `bucketStart`/`writeBack`（桶游标 `v` 走值域，写游标 `w` 扫主轨，柱**原地形变**、`[0,w)` 连续前缀转绿）。已排序区是数组**连续前缀** `[0, w)` → 复用选择排序的 `sortedUpTo`（不像快排的离散 `sortedIndices`、堆排的连续后缀 `sortedFrom`）；回写「已作废尾部」`[w, n)` 淡化用新增 `dimFrom`（连续后缀淡化，区别于希尔的离散集合 `groupMembers`）。

复用关系一句话：**已写回前缀复用 `sortedUpTo`（连续区，与选择排序同）；读/写游标用 `pointers` 箭头（蓝读 / 绿写）；已作废尾部用新增 `dimFrom` 淡化；并新增 `CountView` 把值域画成计数桶轨。全程不新增 `Bar` 态、不动 `BarsView` 既有判定分支。**

## 要做什么

1. **计数排序算法模块**（`src/algorithms/`）
   - `counting-sort.ts`：纯算法 oracle，返回 `{ counts, min, max, result }`（按值索引计数 + 值域 + 升序结果），正确性交叉校验用，对标 `heap-sort.ts`/`merge-sort.ts`。
   - `counting-sort.module.ts`：插桩重走「简单计数 + 走桶回写」，产出逐行粒度的胖步骤 `Step<CountingExecPoint>[]` + `countingSortModule`（每步带 `count` 桶轨快照）。
   - `counting-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言「简单计数排序」源码 + `lineMap`。
2. **框架的向后兼容扩展（加法为主，外壳新增一处条件渲染 + BarsView 一条淡化分支）**
   - `types.ts`：新增 `CountingExecPoint`（4 个执行点）；新增 `CountTrack` 接口（`{ min, buckets, activeBucket? }`）；`Step` 增 `count?: CountTrack`；`StepEmphasis` 增 `dimFrom?: number`（连续后缀 `[dimFrom, n)` 淡化）。
   - `BarsView.vue`：`stateOf` 在 `groupMembers` 淡化之后、`idle` 之前新增一条 `dimFrom` 分支（`index >= dimFrom → dimmed`）。前六算法不设 `dimFrom`，判定**不变**。**`Bar.vue` 零改动**（复用既有 `dimmed` 态）。
   - **新增 `CountView.vue`**：计数桶轨——一排按值索引的桶（`div`），每桶单元格堆叠 = 计数、底部值标签、顶部计数；`activeBucket` 高亮。纯数据驱动、可单测。
   - `AlgorithmPlayer.vue`：在 `BarsView` 之下加 `<CountView v-if="current.count" … />`——**仅计数排序这类带 `count` 的算法渲染，前六算法 `count` 恒 `undefined`，不渲染、零回归**。这是唯一一处外壳改动（与 AuxView/StackView/TreeView 的 `v-if` 同构、并列）。
3. **可视化语义**
   - 计数阶段：读游标 `i` 蓝箭头扫输入；当前读到的 `a[i]` 对应桶 `activeBucket=a[i]-min` 高亮 +1；主轨柱全 idle（计数不动数组）。
   - 回写阶段：桶游标走值域，`activeBucket=v`；写游标 `w` 绿箭头扫主轨；`writeBack` 步把 `a[w]` 形变为 `v+min`、写游标落在该格（活跃 idle）、其左 `[0,w)` 转绿（`sortedUpTo`）、其右 `[w+1,n)` 淡化（`dimFrom`）、当前桶倒出一格；空桶（值 5）`bucketStart` 高亮即过、无 `writeBack`。
   - 收官 `done`：主轨全绿（升序）、所有桶清空、无游标。
4. **接入框架**
   - `CountingSort.vue`：薄壳，`<AlgorithmPlayer :module="countingSortModule" />`。
   - `src/router/index.ts`：在 `heap-sort` 之后新增 `counting-sort` 懒加载路由（`name` = slug）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 排序系列收官 + 「外壳新增第四条轨 `CountView`（首条按值索引）」记录）。

## 不做什么（边界）

- **不做稳定计数排序（前缀和 + 输出数组）**：固定「简单计数 + 走桶原地回写」。稳定版的「前缀和 / 倒序回填 / 输出数组轨（复用 AuxView）」归 roadmap 后续若有需要再评估，本次不做。
- **不做桶排序 / 基数排序**：首页网格中两者仍注释；它们是计数排序的推广，归 roadmap 后续 plan。计数排序落地后 M3 排序系列收官。
- **不做负数 / 浮点 / 大值域优化**：固定「非负小整数、已知值域 `[min,max]`、`min` 由数据求出」；超大值域的空间问题不在演示范围。
- **不改冒泡 / 选择 / 插入 / 希尔 / 归并 / 快速 / 堆的展现与测试**：本次对七者是**零行为变化**——它们的 `Step` 不带 `count`、不设 `dimFrom`、`CountView` 不渲染、`BarsView` 新分支短路（`dimFrom===undefined`）；所有现有 Case 行为不变、不标 superseded。
- **不重构数据契约 / 外壳状态机**：`usePlayer` / `TransportControls` / `VariablePanel` / `CodePanel` / `AuxView` / `StackView` / `TreeView` / `Bar` 逻辑零改动；`AlgorithmPlayer` 仅加一行条件渲染、`BarsView` 仅加一条淡化分支。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源（`counting.svg`）均已就位；计数桶轨用原生 `div`，不引图形库。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：扩展后前七算法侧（各 `*.module.ts` / `*.sources.ts` / `*.module.spec.ts` / `Bar.spec.ts` / `BarsView.spec.ts` / `AlgorithmPlayer.spec.ts` / `AuxView.spec.ts` / `StackView.spec.ts` / `TreeView.spec.ts`）**零行为变化**，全部现有 Case 照常通过。`CountView` 仅在 `current.count` 为真时渲染；`BarsView` 的 `dimFrom` 分支仅在设了 `dimFrom` 时生效。
- 柱态优先级（**不变**）：`pivot > key > sorted > heapNode > swapped > min > comparing > dimmed > idle`。计数排序复用 `sortedUpTo`（→ sorted）、`pointers`（箭头，不参与柱态）、新增 `dimFrom`（→ dimmed，与 `groupMembers` 淡化同档、并列，最低有效档之一）。**不新增任何柱态**。
- **计数排序性质**：值域 `[min, max]`，`min=min(a)`、`max=max(a)`，桶数 `k=max-min+1`；桶 `b` 对应值 `v=b+min`，`counts[b]` = 值 `v` 出现次数；`sum(counts)=n`；回写按 `b=0..k-1` 升序、每桶写 `counts[b]` 次，结果严格升序。零比较；时间 O(n+k)。
- **初始数据用 `[3,1,4,1,6,2,3,6,4,1]`**：带重复 + 小值域（区别于前六者的 1..10 排列），`n=10`、`min=1`、`max=6`、`k=6`。计数后桶 = `[3,1,2,2,0,2]`（值 5 空桶），回写后 `[1,1,1,2,3,3,4,4,6,6]`（见 design §3）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 自动部署 GitHub Pages；自有域名 `algo.illegalscreed.cn` 需手动 `./scripts/deploy.sh`。
- 缺陷修复遵循铁律：先写能复现的失败用例，再改代码，再验证通过。

## 验收口径

- [ ] 进计数排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮；`count / bucketStart / writeBack / done` 四个执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / min / max / k / 阶段 / i / v / w`（具体集合见 design），变化时高亮。
- [ ] **主轨 + 计数桶双视图**：下方计数桶轨——一排按值索引的桶、桶高 = 计数、底部值标签、顶部计数；计数阶段对应桶逐格填入、回写阶段当前桶逐格倒出、空桶（值 5）显 0 格。主轨——计数阶段读游标蓝箭头扫动、柱不动；回写阶段写游标绿箭头领着绿色前缀走、柱原地形变、尾部淡化。
- [ ] **正确性**：计数阶段末桶快照 = oracle `counts` = `[3,1,2,2,0,2]`；末步数组严格升序 = oracle `result` = `[1,1,1,2,3,3,4,4,6,6]`；含逆序 / 重复 / 已序 / 单元素 / 空输入 / 全等值均正确。
- [ ] **框架可复用 + 向后兼容（硬验收）**：新增算法靠「实现一个带 `count` 的 `AlgorithmModule` + 一条路由 + 一个薄壳 + `CountView` + 一条 `dimFrom` 淡化分支 + 一行外壳条件渲染」完成；**前七算法全部现有 Case 仍绿**，且七者页面不渲染 `CountView`。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- 计数桶轨位置：暂定放主轨**下方**（与 AuxView/StackView 同侧）；若观感更宜放上方（如 TreeView）实现期可调。
- 桶单元格上限：`n=10` 时最高桶 3 格，固定单元格高即可；超大计数的滚动/封顶暂不处理（本数据足够）。
- 计数阶段是否标记被读的 `a[i]`：暂定**只用读游标蓝箭头**（主轨柱不变色），避免误用 `comparing`（计数零比较）；若观感需要再评估加轻量高亮（但倾向不加新柱态）。
- `count` 步是否拆「读」与「桶+1」两步：暂定**一步**（读 `a[i]` 同时对应桶 +1），减少步数；实现期视清晰度可调。
- 空桶 `bucketStart` 是否需要专门停顿强调：暂定靠 caption 文案（「空桶，跳过」）+ 高亮即过；实现期看 e2e 视觉是否够明显。
- 步骤总数：计数 `n` 步 + 回写（`k` 个 bucketStart + `n` 个 writeBack）+ 1 done = `2n+k+1`，本数据 = 27 步；`usePlayer` 按 index 回放无性能/竞态问题。

## 变更历史

- 2026-06-24：创建。brainstorming + 交互原型确认三大地基决策——① 算法采用**简单计数排序「萝卜一个坑」**（计数 + 走桶原地回写，不稳定）；② 演示数据 **`[3,1,4,1,6,2,3,6,4,1]`**（值域 1..6、含值 5 空桶）；③ 计数桶轨 `CountView` 用**按值索引的单元格堆叠**。原型另确认两处回写语义：写游标领着绿色前缀走（活跃格不提前转绿）、已作废尾部淡化（新增 `dimFrom`）。
