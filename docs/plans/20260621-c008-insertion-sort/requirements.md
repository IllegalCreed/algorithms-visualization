# 需求：插入排序动画（接入算法播放器框架，M3 第二个算法）

> Status: draft
> Stable ID: C-20260621-008
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-21
> Last reviewed: 2026-06-21
> Progress: 0%
> Blocked by: none
> Next action: 用户复审需求 + 设计，通过后转 writing-plans 出实现计划
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供「算法播放器」框架）；C-20260620-007（选择排序，已完成执行点泛型化、CodePanel 放宽 `string`、柱态优先级与左侧已排序语义——本变更直接受益，无需再重构）
> Related tests: 计划新增 `TC-INS-ALGO-*` / `TC-INSERTION-MOD-*` / `TC-VIEW-INSERTION-*` / `TC-E2E-INSERTION-*`，并扩展 `TC-VIZ-BAR-*` / `TC-VIZ-BARSVIEW-*`；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起通用「算法播放器」框架；M3 首个算法选择排序（C-20260620-007）第一次拿框架接入新算法，**验证了可复用性**，并顺带完成了三件地基工程：① 执行点**泛型化**（`Step<P>` / `LangSource<P>` / `AlgorithmModule<P>`）；② `CodePanel.vue` 的 `point` 放宽为 `string`；③ 柱态**优先级**与**左侧已排序区** `sortedUpTo` 语义。

本变更是 roadmap **M3「算法补全」的第二个 plan**：接入**插入排序**。因为地基已由 C-007 铺好，本次框架侧改动是**纯加法**（加一个执行点 union + 一个可选 emphasis 字段 + 一个柱态），不再有任何重构。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:56-58` 已列 `insertion-sort`（标题「插入排序」）。
- 首页网格 `src/views/Home/Main/hooks.ts:90-95` 已有插入排序条目（描述「顺序遍历数组每一个数字，然后和该数字前面的数组比较，将其放在适当的位置」，图标 `insertion.svg` 已 import 并存在）。
- **但 `src/router/index.ts` 只注册到 `selection-sort`，`insertion-sort` 路由缺失——点击菜单/首页会 404。** 这正是本变更要补的入口。

## 插入排序与冒泡 / 选择的可视化本质差异

插入排序的核心是一个前两者都没有的角色——**被取出暂存的待插入元素 `key`**，以及「已排序区为它腾位（右移）」的过程：

1. **新角色 `key`**：每轮取出 `a[i]` 暂存，它不固定在某个下标，而是随移位**一路向左滑动**到插入点（像手里的一张牌找位置插回）。
2. **核心动作是「移位」而非「交换 / 选最小」**：已排序区中比 `key` 大的元素逐个**右移**腾位，`key` 最后落入空出的位置。
3. **已排序区在左侧** `[0, i)`（与选择排序同侧，可复用 `sortedUpTo`），但语义不同：选择排序左侧是「全局最终就位」，插入排序左侧是「**相对有序、最终才全局有序**」。
4. **稳定排序**：`a[j] > key` 才移、相等不移，故相等元素相对顺序不变——这是插入排序区别于选择排序（不稳定）的教学亮点。

## 要做什么

1. **插入排序算法模块**（`src/algorithms/`）
   - `insertion-sort.ts`：纯算法 oracle（正确性交叉校验用，对标 `selection-sort.ts`）。
   - `insertion-sort.module.ts`：插桩重走标准插入排序，产出逐行粒度的胖步骤 `Step<InsertionExecPoint>[]` + `insertionSortModule`。
   - `insertion-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言源码 + `lineMap`。
2. **框架的向后兼容扩展（纯加法，无重构）**
   - `types.ts`：新增 `InsertionExecPoint = 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done'`；`StepEmphasis` 增 `keyIndex?: number` 一个可选字段。**泛型化与 `CodePanel` 放宽已在 C-007 完成，本次不动。**
   - `Bar.vue`：`state` 增加常驻态 `'key'`，新增 `.bar.key` 配色（玫红 `#e07b9a`）。
   - `BarsView.vue`：`stateOf` 支持 `keyIndex`（→ `key` 态），并置于**最高优先级**（压过 `sorted`）。
3. **可视化语义**（沿用既定观感 + 插入特有元素）
   - 两指针：`i` 红（本轮边界 / 已排序区右界）/ `j` 蓝（左探位置），取 `colors[0/1]`，`ArrowTrack` 零改动。
   - `key` 柱染玫红 `key` 态高亮，**不单独给箭头**（它紧贴 `j+1`，再加箭头会与 `j` 重叠）。
   - 比较 `a[j]` vs `key` 的那一帧**保留高亮**：`key` 柱玫红、`j` 柱黄，两根异色（对称选择排序「min 紫 + j 黄」）。
   - 移位 = 相邻交换 `work` 元素，靠稳定 key + `<TransitionGroup>` 产生 FLIP：`key` 一路左滑、被越过的大元素右让；**每步 id 集合恒定**。
   - 已排序区在**左侧** `[0, i)`，染 `sorted` 绿。
4. **接入框架**
   - `InsertionSort.vue`：薄壳，`<AlgorithmPlayer :module="insertionSortModule" />`。
   - `src/router/index.ts`：在 `selection-sort` 之后新增 `insertion-sort` 懒加载路由（`name` = slug）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 进度推进）。

## 不做什么（边界）

- **不改播放器外壳行为**：`usePlayer` / `TransportControls` / `AlgorithmPlayer` / `VariablePanel` / `CodePanel` 逻辑零改动，仅作为复用件。
- **不改冒泡 / 选择的展现与测试**：本次是**纯加法**扩展，冒泡与选择的代码、`lineMap`、所有现有 Case 行为不变、不标 superseded。
- **不重构数据契约**：泛型化（`Step<P>` 等）与 `CodePanel` 的 `point: string` 已由 C-007 完成，本次只「加」不「改」。
- **不补其他排序 / 数据结构**：希尔、归并、快排……仍归 M3 后续各自的 plan。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源（`insertion.svg`）均已就位。
- **不为非线性结构做可视化插槽扩展**：外壳仍静态渲染 `BarsView`，仅覆盖「线性数组 + 指针」类。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由，沿用现有 base / Pages / 自有域名方案。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步 `delay`、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：加法扩展后冒泡侧与选择侧（`*.module.ts` / `*.sources.ts` / `*.module.spec.ts` / `Bar.spec.ts` / `BarsView.spec.ts` / `CodePanel.spec.ts`）**零行为变化**，全部现有 Case 照常通过。
- 柱态优先级：`key > sorted > swapped > min > comparing > idle`（保证 `key` 柱即使滑入左侧已排序区也保持玫红，而非被 `sorted` 绿覆盖）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

## 验收口径

- [ ] 进插入排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮，与动画、变量面板同步；`shift` / `insert` 等插入特有执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / i / key / j / a[j] / shiftCount / sortedUpTo`，变化时高亮。
- [ ] 可视化：两指针（i 红 / j 蓝）；`key` 柱玫红；比较帧 `key` 柱玫红 + `j` 柱黄；移位时 `key` 左滑、大元素右让走 FLIP；左侧 `[0,i)` 已排序绿。
- [ ] **稳定性**：相等元素相对顺序在排序后不变（L3 oracle 用例验证）。
- [ ] **框架可复用（硬验收）**：新增算法仅靠「实现一个 `AlgorithmModule` + 加一条路由 + 一个薄壳 + 纯加法柱态」完成；外壳零改动；**冒泡与选择的全部现有 Case 仍绿**（向后兼容的证明）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- `key` 柱专属色暂定玫红 `#e07b9a`，实现期在明 / 暗主题下肉眼复核，须与 idle 青绿 / comparing 黄 / swapped 橙 / sorted 绿 / min 紫 都拉开区分度。
- `shift` 帧是否高亮「正在右移的那根大元素」：暂定**只设 `keyIndex`**（玫红 key），被移动元素靠 FLIP 滑动体现，实现期视观感可调。
- 初始数据沿用选择 / 冒泡同款 `[7,6,5,10,9,8,4,3,2,1]`，便于三个算法横向对比（已与用户确认）。

## 变更历史

- 2026-06-21：创建。brainstorming 确认两大决策——① **移位插入**风格（取出 `key` + 右移腾位 + 插入，执行点 `outerLoop` / `compare` / `shift` / `insert` / `done`）；② **原位滑动让位**（`key` 柱玫红，相邻交换 `work` 元素产生 FLIP，每步 id 集合恒定，不破坏现有约定）。
