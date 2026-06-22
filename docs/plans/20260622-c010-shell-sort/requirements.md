# 需求：希尔排序动画（接入算法播放器框架，M3 第三个算法）

> Status: draft
> Stable ID: C-20260622-010
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 0%
> Blocked by: none
> Next action: 待用户 review 本 spec（requirements + design）→ writing-plans 产出 implementation + test-cases
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供「算法播放器」框架）；C-20260620-007（选择排序，完成执行点泛型化、`CodePanel` 放宽 `string`、柱态优先级）；C-20260621-008（插入排序，新增 `keyIndex`/`key` 玫红态、移位插桩范式——**希尔直接复用并把步长从 1 泛化为 gap**）
> Related tests: 计划新增 `TC-SHELL-ALGO-*` / `TC-SHELL-MOD-*` / `TC-VIEW-SHELL-*` / `TC-E2E-SHELL-*`，并扩展 `TC-VIZ-BAR-*` / `TC-VIZ-BARSVIEW-*`（新增 `dimmed` 淡化态）；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起通用「算法播放器」框架；M3 用它逐个补齐菜单中尚缺的排序动画——选择排序（C-007）第一次接入新算法并完成三件地基工程（执行点**泛型化** `Step<P>`/`LangSource<P>`/`AlgorithmModule<P>`、`CodePanel` 的 `point: string`、柱态**优先级**与左侧已排序区）；插入排序（C-008）再加**纯加法**的 `keyIndex`/`key` 玫红态与「移位插桩」范式（取出 `key` → 相邻交换让位产生 FLIP → 落定）。

本变更是 roadmap **M3「算法补全」的第三个 plan**：接入**希尔排序**。希尔排序的算法本质就是**「把插入排序的相邻步长 1 换成可变步长 gap」**——所以它能**最大限度复用 C-008 的移位插桩范式**，框架侧改动仍是纯加法（加一个执行点 union、一个可选 emphasis 字段 `groupMembers`、一个淡化柱态 `dimmed`），不再有任何重构。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:60-62` 已列 `shell-sort`（标题「希尔排序」）。
- 首页网格 `src/views/Home/Main/hooks.ts:96-101` 已有希尔排序条目（描述「核心是一个插入排序，步进数 1 改为数组长度的一半，每完成一次步进都减小一半」，图标 `shell.svg` 已 import 并存在）。
- **但 `src/router/index.ts` 只注册到 `insertion-sort`，`shell-sort` 路由缺失——点击菜单/首页会 404。** 这正是本变更要补的入口。

> 首页既有描述已**写定 gap 序列 = 数组长度的一半、每次减半**（即 `gap = ⌊n/2⌋`，逐次 `/2` 到 1）。本变更据此实现，保持文案与动画一致。

## 希尔排序与插入排序的可视化本质差异

希尔排序 = **分组的插入排序**。它在插入排序之上引入两个前三种排序都没有的角色：

1. **步长 `gap`（增量）**：把数组按下标间隔 `gap` 切成 `gap` 个**子序列**（下标 `i ≡ start (mod gap)` 的元素同组）。对每个子序列做插入排序，然后 `gap` 减半，直到 `gap = 1`（退化为一次「数组已接近有序」的普通插入排序）。
2. **「当前正在排序的那一组」**：任一时刻，动画聚焦**一个**子序列在做插入排序；其余元素是「旁观者」，应当**淡出**以突出焦点。这就是希尔独有的可视化诉求——**分组的视觉表达**。
3. **gap 跨距的「长跳」**：插入排序的 `key` 只能一格一格左滑；希尔的 `key` 每次跨 `gap` 个位置跳，能把远处的小元素**快速拉到左边**，这是希尔比插入排序快的根因，可视化上表现为 `key` 柱的**跨距跳跃**。
4. **「预排序」红利**：大 `gap` 阶段已把数组整理得接近有序，到 `gap = 1` 时几乎不用移动——这点用**与插入排序同款的初始数据**做横向对比最有说服力（见「业务规则」）。

复用关系一句话：**插入排序 module 把「相邻交换 + `j--`」做了一遍；希尔 module 把它升级成「跨 gap 交换 + `j -= gap`」，外面再套两层循环（`gap` 减半 + 逐组 `start`），并为每组打上 `groupMembers` 让非当前组淡化。**

## 要做什么

1. **希尔排序算法模块**（`src/algorithms/`）
   - `shell-sort.ts`：纯算法 oracle（正确性交叉校验用，对标 `insertion-sort.ts`）。
   - `shell-sort.module.ts`：插桩重走「按组显式三层」希尔排序，产出逐行粒度的胖步骤 `Step<ShellExecPoint>[]` + `shellSortModule`。
   - `shell-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言源码 + `lineMap`。
2. **框架的向后兼容扩展（纯加法，无重构）**
   - `types.ts`：新增 `ShellExecPoint = 'gapChange' | 'groupStart' | 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done'`；`StepEmphasis` 增 `groupMembers?: number[]` 一个可选字段。**泛型化、`CodePanel` 放宽、`keyIndex`/`key` 态均已由 C-007/C-008 完成，本次不动。**
   - `Bar.vue`：`state` 增加 `'dimmed'` 态，新增 `.bar.dimmed` 样式（降透明度淡出非当前组）。
   - `BarsView.vue`：`stateOf` 支持 `groupMembers`（不在当前组、且无其它强调 → `dimmed`），优先级置于 `comparing` 之后、`idle` 之前（**最低有效优先级**，绝不掩盖任何活跃强调）。
3. **可视化语义**（沿用既定观感 + 希尔特有的「分组聚焦」）
   - 两指针沿用：`i` 红（本轮取出元素的原始下标，固定）/ `j` 蓝（左探位置，按 `gap` 跳），取 `colors[0/1]`，`ArrowTrack` 零改动。
   - `key` 柱沿用 C-008 玫红 `key` 态（`keyIndex`），跨 `gap` 跳跃式左滑、被越过元素右让（相邻 → 跨距交换，FLIP 仍成立）。
   - 比较 `a[j]` vs `key` 的那一帧沿用 C-008：`key` 柱玫红、`j` 柱黄。
   - **当前组之外的柱子 `dimmed` 淡出**；`groupMembers` 由 `groupStart` 步打上、贯穿该组排序的所有步，到 `done` 清除并整体转 `sorted` 绿。
   - 希尔**中间阶段不标 `sorted`**（部分有序不是数组前缀，标了会误导），仅 `done` 时全数组转绿。
4. **接入框架**
   - `ShellSort.vue`：薄壳，`<AlgorithmPlayer :module="shellSortModule" />`。
   - `src/router/index.ts`：在 `insertion-sort` 之后新增 `shell-sort` 懒加载路由（`name` = slug）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 进度推进）。

## 不做什么（边界）

- **不改播放器外壳行为**：`usePlayer` / `TransportControls` / `AlgorithmPlayer` / `VariablePanel` / `CodePanel` 逻辑零改动，仅作为复用件。
- **不改冒泡 / 选择 / 插入的展现与测试**：本次是**纯加法**扩展，三者的代码、`lineMap`、所有现有 Case 行为不变、不标 superseded。
- **不重构数据契约**：泛型化（`Step<P>` 等）、`CodePanel` 的 `point: string`、`keyIndex`/`key` 态均已由 C-007/C-008 完成，本次只「加」不「改」。
- **不补其他排序 / 数据结构**：归并、快排、堆排、计数……仍归 M3 后续各自的 plan。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源（`shell.svg`）均已就位。
- **不为非线性结构做可视化插槽扩展**：希尔是线性数组类，外壳仍静态渲染 `BarsView`，落在其覆盖范围内（roadmap M3 风险所述的「插槽扩展」留给树/图/链表）。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由，沿用现有 base / Pages / 自有域名方案。
- **不引入可配置增量序列**：gap 序列固定为 `⌊n/2⌋` 减半（与首页文案一致），不做 Knuth / Sedgewick 等可选序列。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步 `delay`、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：加法扩展后冒泡 / 选择 / 插入侧（`*.module.ts` / `*.sources.ts` / `*.module.spec.ts` / `Bar.spec.ts` / `BarsView.spec.ts` / `CodePanel.spec.ts`）**零行为变化**，全部现有 Case 照常通过。
- 柱态优先级（扩展后）：`key > sorted > swapped > min > comparing > dimmed > idle`。`dimmed` 处于**最低有效档**——只淡化「既不在当前组、又无任何其它强调」的旁观柱；当前组内的活跃柱（`key`/`comparing`）与已完成态（`sorted`）一律压过它。
- **gap 序列**：`gap = ⌊n/2⌋`，逐次 `gap = ⌊gap/2⌋` 直到 `gap = 1`（含），与首页描述一致。
- **初始数据沿用插入排序同款 `[7,6,5,10,9,8,4,3,2,1]`**：便于「插入 vs 希尔」在同一数据上横向对比。实测该数据跑希尔：`gap=5` 阶段 4 次移位、`gap=2` 阶段多次移位、`gap=1` 阶段**仅 2 次微调**即完成——直观体现「大 gap 预排序后末轮几乎不动」的希尔红利（已验算，见 design §3）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 自动部署 GitHub Pages；自有域名 `algo.illegalscreed.cn` 需手动 `./scripts/deploy.sh`。

## 验收口径

- [ ] 进希尔排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮，与动画、变量面板同步；`gapChange` / `groupStart` / `shift` / `insert` 等希尔执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / gap / group / i / key / j / a[j] / shiftCount`，变化时高亮。
- [ ] 可视化：两指针（i 红 / j 蓝，j 按 gap 跳）；`key` 柱玫红、跨 gap 跳跃左滑；**当前组高亮、其余柱 dimmed 淡出**；逐组完成后 gap 减半、组变少变大；`gap=1` 收尾后整体转 sorted 绿。
- [ ] **正确性**：末步数组严格升序，且与 oracle 交叉校验一致（含逆序 / 重复 / 已序 / 单元素 / 空输入）。
- [ ] **框架可复用（硬验收）**：新增算法仅靠「实现一个 `AlgorithmModule` + 加一条路由 + 一个薄壳 + 纯加法柱态」完成；外壳零改动；**冒泡 / 选择 / 插入的全部现有 Case 仍绿**（向后兼容的证明）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- `dimmed` 淡化用「降透明度」（暂定 `opacity: 0.28`）还是叠加灰度滤镜：暂定纯降透明度（最简、不引入新色），实现期在明 / 暗主题下肉眼复核，确保淡出明显但仍能看清柱形与数值。
- `gapChange` 帧（刚进入新 gap、尚未进组）是否设 `groupMembers`：暂定**不设**（全亮，表达「新一轮即将分组」），由随后的 `groupStart` 打上当前组并淡化其余。实现期视观感可调。
- 步骤总数：希尔比单纯插入排序多了 `gapChange`/`groupStart` 标记步，10 元素下总步数偏多但仍 O(n²) 量级；`usePlayer` 按 `index` 回放无性能/竞态问题，规模可控。

## 变更历史

- 2026-06-22：创建。brainstorming 确认三大决策——① 接入**希尔排序**（M3 第三个，菜单顺序下一个）；② 分组可视化采用**「聚焦当前组 + 淡化其余」**（按组逐个完成，新增 `groupMembers` + `dimmed` 态）；③ 代码面板用**「按组显式三层」写法**（`gap` 减半 → 逐组 `start` → 组内插入），保证每个执行点都能逐行映射、代码与动画完全对应。
