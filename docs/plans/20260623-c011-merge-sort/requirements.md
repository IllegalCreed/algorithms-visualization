# 需求：归并排序动画（接入算法播放器框架，M3 第四个算法，首个双数组可视化）

> Status: draft
> Stable ID: C-20260623-011
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Progress: 0%
> Blocked by: none
> Next action: 待用户审阅本设计 → 进入 writing-plans / TDD 实现
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供「算法播放器」框架）；C-20260620-007（选择排序，执行点泛型化 `Step<P>`）；C-20260621-008（插入排序，`keyIndex`/`key` 玫红态 + 移位插桩）；C-20260622-010（希尔排序，新增 `groupMembers`/`dimmed` 分组淡化——**归并直接复用它做「聚焦当前合并段」**）
> Related tests: 计划新增 `TC-MERGE-ALGO-*` / `TC-MERGE-MOD-*` / `TC-VIZ-AUXVIEW-*` / `TC-VIEW-MERGE-*` / `TC-E2E-MERGE-*`，并扩展 `TC-VIZ-BAR-*`（新增 `empty` 空槽态）、`TC-PLAYER-*`（外壳条件渲染辅助轨）；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起通用「算法播放器」框架；M3 用它逐个补齐菜单中尚缺的排序动画。前三个 M3 算法都是**原地、单数组**排序，框架侧改动均为纯加法、外壳零改动：

- 选择排序（C-007）完成三件地基：执行点**泛型化**（`Step<P>`/`LangSource<P>`/`AlgorithmModule<P>`）、`CodePanel` 的 `point: string`、柱态优先级与左侧已排序区。
- 插入排序（C-008）加**纯加法**的 `keyIndex`/`key` 玫红态与「移位插桩」范式。
- 希尔排序（C-010）加 `groupMembers` + `dimmed` 淡化态，实现「聚焦当前子序列、淡出其余」。

本变更是 roadmap **M3「算法补全」的第四个 plan**：接入**归并排序**。它与前三个有一个根本不同——**归并排序不是原地排序**：合并两个有序子段时，标准实现需要一块与原数组等长的**辅助数组 `temp`**。这正是 roadmap 早已记录的风险点：

> 「当前外壳静态渲染 `BarsView`，仅覆盖线性数组类可视化……接入树/图/链表等非线性结构前，需先为 `AlgorithmPlayer` 的可视化做插槽扩展。」

归并排序虽仍是**线性数组类**，但它是第一个需要「第二条数据轨」的算法——因此成为外壳「双轨可视化」扩展的**首个、最小触发点**：在主柱状轨之下增设一条**辅助数组轨 `AuxView`**。这个扩展为后续真正的非线性结构（树/图）插槽化探了路，但本次只做「双数组」这一最小必要扩展，不做通用插槽框架。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:64-66` 已列 `merge-sort`（标题「归并排序」）。
- 首页网格 `src/views/Home/Main/hooks.ts:102-107` 已有归并排序条目（描述「通过递归构建二叉树结构，然进行左右两个节点的有序数组合并」，图标 `merge.svg` 已 import 并存在）。
- **但 `src/router/index.ts` 只注册到 `shell-sort`，`merge-sort` 路由缺失——点击菜单/首页会 404。** 这正是本变更要补的入口。

## 两个地基决策（brainstorming 已确认）

1. **可视化方案 = 双数组·辅助区**：上排原数组（当前合并的左右段高亮、其余 `dimmed`），下排辅助轨 `temp`（逐格填入、空槽虚框、`k` 写入指针）。最能体现归并「借助 O(n) 额外空间，把两段有序合并为一段有序」的本质。代价是首次扩展外壳（新增可选 `Step.aux` + `AuxView` 组件 + `AlgorithmPlayer` 条件渲染），均为**向后兼容加法**。
2. **分治策略 = 自底向上迭代**：`width` 从 1 倍增（1→2→4→…），每轮从左到右合并相邻的两段。不走递归。理由：
   - `buildSteps` 结构**与希尔 `gap` 循环同构**（外层步长循环 + 内层逐段），最易插桩、无递归栈回放难题；
   - 步骤序列天然线性（从左到右、从小到大），不会出现自顶向下递归「深度优先跳来跳去」的迷失；
   - 与希尔形成漂亮的结构对照：**希尔 = `gap` 减半的「分组插入」；归并自底向上 = `width` 倍增的「相邻合并」**。
   - 代价：放弃教科书经典的「递归分治树」形象（归入「不做什么」，留待未来若做快排时再评估树可视化）。

## 归并排序与前三种排序的可视化本质差异

归并排序在前三种之上引入三个全新角色：

1. **辅助数组 `temp`（第二条轨）**：合并 `[lo,mid)` 与 `[mid,hi)` 时，用三指针 `i`（左段游标）、`j`（右段游标）、`k`（temp 写入位）把较小者依次搬进 `temp`，再整段拷回原数组。`temp` 的存在与逐格填充是归并区别于前三者的**核心可视诉求**——必须显式画出来，否则学习者看不到「为什么归并需要额外空间」。
2. **「合并」的 FLIP 重排**：拷回（`writeBack`）那一步，原数组 `[lo,hi)` 段的元素按合并结果重新排列——稳定 id + `<TransitionGroup>` 会让这些柱子**同时平移到各自新位置**，这就是「两段有序流汇成一段有序」的动画高潮。
3. **「段宽倍增」的层次推进**：每轮 `width` 翻倍，合并的段越来越大、对数越来越少（`n=10`：width=1 有 5 对、width=2 有 2 对+1 残段、width=4 有 1 对+1 残段、width=8 有 1 对）。直观体现 `O(log n)` 趟、每趟 `O(n)` 的归并复杂度结构。

复用关系一句话：**希尔用 `groupMembers`/`dimmed` 聚焦「当前子序列」；归并复用同一套机制聚焦「当前合并的两段」，再在主轨之下新增一条 `temp` 辅助轨表达「合并产出」。**

## 要做什么

1. **归并排序算法模块**（`src/algorithms/`）
   - `merge-sort.ts`：纯算法 oracle（自底向上，返回每趟 `width` 后快照，正确性交叉校验用，对标 `shell-sort.ts`）。
   - `merge-sort.module.ts`：插桩重走自底向上归并，产出逐行粒度的胖步骤 `Step<MergeExecPoint>[]` + `mergeSortModule`（每步带 `aux` 辅助轨快照）。
   - `merge-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言**自底向上**源码 + `lineMap`。
2. **框架的向后兼容扩展（加法为主，外壳新增一处条件渲染）**
   - `types.ts`：新增 `MergeExecPoint`（9 个执行点）；新增 `AuxTrack` 接口；`Step` 增 `aux?: AuxTrack` 一个**可选**字段。`StepEmphasis` **不新增字段**（聚焦当前段复用希尔已有的 `groupMembers`）。
   - `Bar.vue`：`state` 增加 `'empty'` 态（虚线框空槽，不显示数值），新增 `.bar.empty` 样式。
   - **新增 `AuxView.vue`**：渲染辅助数组轨——一排槽（已填实心 `sorted` 绿 / 未填 `empty` 虚框）+ `k` 写入指针（`ArrowTrack`，`colors[2]`）。内部复用 `Bar` 与 `ArrowTrack`，percent 以主数组 min/max 为基准（两轨柱高同尺度可比）。
   - `AlgorithmPlayer.vue`：在主 `BarsView` 之下加 `<AuxView v-if="current.aux" … />`——**仅归并这类带 `aux` 的算法渲染，前四个算法 `aux` 恒 `undefined`，不渲染、零回归**。这是唯一一处外壳改动。
3. **可视化语义**
   - 主轨三态沿用 + 复用：当前合并段 `[lo,hi)` 全下标进 `groupMembers` → 段外 `dimmed` 淡出；`compare` 步用 `comparing:[i,j]` 标黄；`writeBack` 步该段元素 FLIP 重排（稳定 id）。中间阶段**不标 `sorted`**（部分有序非数组前缀），仅 `done` 时整体转绿。
   - 主轨两指针：`i` 红（左段游标，`colors[0]`）/ `j` 蓝（右段游标，`colors[1]`），`ArrowTrack` 零改动。
   - 辅助轨：`temp` 槽逐格点亮（`takeLeft`/`takeRight`/`drain*` 时 `filled` 增长，已填 `sorted` 绿、未填 `empty` 虚框）；`k` 黄箭头（`colors[2]`）指示下一写入位。`temp` 全程常驻（`widthChange`/`done` 等非合并步显示为整排空虚框，提醒「辅助空间始终存在」）。
4. **接入框架**
   - `MergeSort.vue`：薄壳，`<AlgorithmPlayer :module="mergeSortModule" />`。
   - `src/router/index.ts`：在 `shell-sort` 之后新增 `merge-sort` 懒加载路由（`name` = slug）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 进度推进 + 「外壳双轨扩展已落地」风险更新）。

## 不做什么（边界）

- **不做自顶向下递归 / 递归分治树可视化**：本次固定自底向上迭代；经典递归树形象留待未来（若做快排时一并评估树/区间栈可视化的通用插槽）。
- **不做通用「可视化插槽」框架**：只为「双数组」加最小必要的 `AuxView` + 一处条件渲染；树/图/链表的通用插槽化仍归 roadmap 后续。
- **不改冒泡 / 选择 / 插入 / 希尔的展现与测试**：本次对四者是**零行为变化**——它们的 `Step` 不带 `aux`、`AuxView` 不渲染、`Bar` 只是多一个合法态；所有现有 Case 行为不变、不标 superseded。
- **不重构数据契约 / 外壳状态机**：`usePlayer` / `TransportControls` / `VariablePanel` / `CodePanel` / `BarsView` 逻辑零改动；`AlgorithmPlayer` 仅加一行条件渲染，不改交互模型。
- **不补其他排序 / 数据结构**：快排、堆排、计数……仍归 M3 后续各自的 plan。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源（`merge.svg`）均已就位。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由，沿用现有 base / Pages / 自有域名方案。
- **不做原地归并 / 不做链表归并**：固定「数组 + 等长 `temp` + 拷回」的标准自底向上写法（与四语言源码、`temp` 可视化一致），不引入原地归并的复杂指针腾挪。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步 `delay`、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：扩展后冒泡 / 选择 / 插入 / 希尔侧（各 `*.module.ts` / `*.sources.ts` / `*.module.spec.ts` / `Bar.spec.ts` / `BarsView.spec.ts` / `CodePanel.spec.ts` / `AlgorithmPlayer.spec.ts`）**零行为变化**，全部现有 Case 照常通过。`AuxView` 仅在 `current.aux` 为真时渲染。
- 柱态优先级（扩展后）：`key > sorted > swapped > min > comparing > dimmed > idle`，主轨**不变**；`empty` 仅用于辅助轨（不进主轨 `stateOf` 优先级链）。
- **`width` 序列**：`width = 1`，逐次 `width *= 2`，当 `width < n` 时继续；非 2 的幂长度由 `mid = min(lo+width, n)`、`hi = min(lo+2*width, n)` 自然处理（残段 `mid >= hi` 时无需合并、跳过）。
- **初始数据沿用 `[7,6,5,10,9,8,4,3,2,1]`**：与插入 / 希尔同款，便于「插入 vs 希尔 vs 归并」在同一数据上横向对比；`n=10` 非 2 的幂，正好真实展示「末段不足、留到更大 `width` 再合并」（已验算，见 design §3）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 自动部署 GitHub Pages；自有域名 `algo.illegalscreed.cn` 需手动 `./scripts/deploy.sh`。
- 缺陷修复遵循铁律：先写能复现的失败用例，再改代码，再验证通过（适用本次实现期）。

## 验收口径

- [ ] 进归并排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮，与动画、变量面板同步；`widthChange` / `mergeStart` / `compare` / `takeLeft` / `takeRight` / `drainLeft` / `drainRight` / `writeBack` / `done` 九个执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / width / lo / mid / hi / i / j / k / a[i] / a[j] / writeCount`，变化时高亮。
- [ ] **双轨可视化**：上排主数组——当前合并段 `[lo,hi)` 高亮、其余 `dimmed`；`i` 红 / `j` 蓝指针在左右段游走；`compare` 步比较两柱标黄；`writeBack` 步该段柱子 FLIP 平移到合并后位置。下排辅助轨——`temp` 槽随取数逐格点亮（已填绿 / 未填虚框），`k` 黄指针指向下一写入位；非合并步整排空虚框常驻。
- [ ] **正确性**：末步主数组严格升序，且与 oracle 交叉校验一致（含逆序 / 重复 / 已序 / 单元素 / 空输入）；各趟 `width` 边界快照与 oracle 一致。
- [ ] **框架可复用 + 向后兼容（硬验收）**：新增算法靠「实现一个带 `aux` 的 `AlgorithmModule` + 一条路由 + 一个薄壳 + `AuxView` + 纯加法 `empty` 态 + 一行外壳条件渲染」完成；**冒泡 / 选择 / 插入 / 希尔的全部现有 Case 仍绿**（向后兼容的证明），且四者页面不渲染 `AuxView`。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- `AuxView` 的空槽样式（虚线框 + 透明底）在明 / 暗主题下的辨识度：暂定虚线边框 + 固定矮高占位，实现期肉眼复核「空槽明显是『待填』而非『值为 0』」。
- 辅助轨是否需要在 `writeBack` 后短暂保留「填满」状态再于下一对 `mergeStart` 清空：暂定 `writeBack` 步 `temp` 仍显示该段填满（强化「照着 temp 拷回」），下一对 `mergeStart` 清空该段。实现期视观感可调。
- `drain`（一侧耗尽、拷另一侧剩余）是否逐元素出步：暂定**逐元素**出 `drainLeft`/`drainRight` 步（每搬一个一帧，与 `take*` 节奏一致、便于行映射到收尾 `while`），若步数过多再评估合并为一步。
- 步骤总数：自底向上 + 双轨快照，`n=10` 总步数比希尔略多但仍 `O(n log n)` 量级；`usePlayer` 按 `index` 回放无性能 / 竞态问题，规模可控。

## 变更历史

- 2026-06-23：创建。brainstorming 确认两大地基决策——① 可视化方案采用**双数组·辅助区**（主轨 + 新增 `AuxView` 辅助轨，首次扩展外壳为「双轨」，向后兼容加法）；② 分治策略采用**自底向上迭代**（`width` 倍增、相邻合并，结构与希尔 `gap` 循环同构，放弃递归树形象）。
