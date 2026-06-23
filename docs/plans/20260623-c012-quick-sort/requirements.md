# 需求：快速排序动画（接入算法播放器框架，M3 第五个算法，首个原地分治 + 显式区间栈可视化）

> Status: verified
> Stable ID: C-20260623-012
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Progress: 100%
> Blocked by: none
> Next action: 已完成（37 Case 全绿，门禁通过，已落 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供「算法播放器」框架）；C-20260620-007（选择排序，执行点泛型化 `Step<P>` + `sortedUpTo` 左侧已排序区）；C-20260621-008（插入排序，`keyIndex`/`key` 玫红态 + 移位插桩）；C-20260622-010（希尔排序，新增 `groupMembers`/`dimmed` 分组淡化——**快排复用它聚焦「当前分区区间 [lo,hi]」**）；C-20260623-011（归并排序，首扩外壳为「双轨」——新增可选 `Step.aux` + `AuxView` 组件 + `AlgorithmPlayer` 一处条件渲染；**快排照此范式新增第二条轨 `Step.stack` + `StackView`**，并兑现归并 requirements 预告的「快排时一并评估区间栈可视化」）
> Related tests: 计划新增 `TC-QUICK-ALGO-*`（oracle）/ `TC-QUICK-MOD-*`（插桩 + 四语言源码）/ `TC-VIZ-STACKVIEW-*`（区间栈轨组件）/ `TC-VIEW-QUICK-*`（薄壳视图）/ `TC-E2E-QUICK-*`（端到端），并扩展 `TC-VIZ-BAR-*`（新增 `pivot` 态）、`TC-VIZ-BARSVIEW-*`（`pivotIndex` 接入优先级链 + `sortedIndices` 离散 sorted）、`TC-PLAYER-*`（外壳条件渲染区间栈轨）；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起通用「算法播放器」框架；M3 用它逐个补齐菜单中尚缺的排序动画。已落地四个 M3 算法：

- 选择排序（C-007）完成三件地基：执行点**泛型化**（`Step<P>`/`LangSource<P>`/`AlgorithmModule<P>`）、`CodePanel` 的 `point: string`、柱态优先级与 `sortedUpTo` 左侧已排序区。
- 插入排序（C-008）加**纯加法**的 `keyIndex`/`key` 玫红态与「移位插桩」范式。
- 希尔排序（C-010）加 `groupMembers` + `dimmed` 淡化态，实现「聚焦当前子序列、淡出其余」。
- 归并排序（C-011）首扩外壳为**双轨**：新增可选 `Step.aux` + `AuxView`（辅助数组轨）+ `AlgorithmPlayer` 一处 `v-if` 条件渲染，全部向后兼容加法。

本变更是 roadmap **M3「算法补全」的第五个 plan**：接入**快速排序**。它与前四个都不同——是**首个「原地、分治、显式栈管理子问题」**的排序。归并排序的 requirements 已为它埋下伏笔：

> 「经典递归树形象留待未来（若做快排时一并评估树/区间栈可视化的通用插槽）。」

快排正是兑现这一预告的时机：本次**不做递归树**（树形布局成本远高于线性轨，仍归后续），而是用**显式区间栈迭代**，并新增第二条可视化轨 `StackView`——把「待处理子区间栈」显式画出来。它沿用归并「双轨扩展」的范式（可选 `Step.stack` + 新组件 + 一处条件渲染），但表达的是**控制结构（栈）**而非**数据副本（temp 数组）**。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:69-70` 已列 `quick-sort`（标题「快速排序」）。
- 首页网格 `src/views/Home/Main/hooks.ts:108-113` 已有快速排序条目（`QuickIcon` = `quick.svg` 已 import 并存在）。**既有描述「将数组首位作为基准数……」中的「首位」与本次 Lomuto 末位 pivot 实现不符——本次将该 desc 措辞微调为不绑定具体取位（见「要做什么」§4）**，不改图标、不改 url。
- **但 `src/router/index.ts` 只注册到 `merge-sort`，`quick-sort` 路由缺失——点击菜单/首页会 404。** 这正是本变更要补的入口。

## 三个地基决策（brainstorming 已确认）

1. **分区策略 = Lomuto（末位 pivot）**。取区间末位 `a[hi]` 为 pivot；`i` 维护「小于 pivot 区」的右边界、`j` 单向扫描 `[lo, hi)`；遇 `a[j] < pivot` 则 `swap(a[i], a[j])` 并 `i++`，扫描完 `swap(a[i], a[hi])` 让 pivot **一步飞到最终位置**。理由：
   - 指针语义最清晰、最适配三色箭头（pivot 固定在末位 / `i` 小于区边界 / `j` 扫描游标）；
   - pivot 归位是「确定性事件」——每次 partition 后 pivot 落到它在全局有序数组里的**最终位置**且永不再动，这是快排区别于前四者最强的可视卖点（逐个点亮「已就位」绿格）；
   - 四语言源码最标准、最易横向对照。
   - 代价：放弃 Hoare 更少的交换次数（Hoare pivot 不归位到最终格、「已就位」语义弱，可视化更绕，归入「不做」）。

2. **控制流 = 显式区间栈迭代**。`stack = [(0, n-1)]`，循环 `pop` 一个区间、`partition`、再把两个子区间 `push` 回栈。理由：
   - 变量面板/栈轨能**显式展示「待处理区间栈」**，让学习者看到分治的全貌（还剩哪些子问题）；
   - 与归并「自底向上迭代」形成统一基调（M3 排序均为可线性回放的迭代结构，无递归栈回放难题）；
   - 兑现归并 requirements 预告的「区间栈可视化」。
   - 代价：放弃最经典的递归写法形象——但 `partition` 这一动画高潮在递归/迭代下完全一致，差异仅在「区间由谁管理」，故损失很小。

3. **可视化 = 主轨 + 新增「区间栈轨」`StackView`**（继归并 `AuxView` 之后第二次双轨扩展）。主轨复用希尔 `groupMembers`/`dimmed` 聚焦当前 `[lo,hi]`；新增一条 `StackView` 把栈里每个区间画成**对齐主轨下标坐标系的水平条**（`lo→hi` 跨度），竖直堆叠，栈顶高亮、刚 `pop` 的区间标记。理由：快排的「分治」若只靠主轨高亮，看起来仍像「另一个带 partition 的原地排序」；显式栈轨才让「分而治之、子问题入栈出栈」可见。代价：新增一个外壳组件 + 一处条件渲染 + 配套测试（与归并 `AuxView` 同量级）。

## 快速排序与前四种排序的可视化本质差异

快排在前四者之上引入三个全新角色：

1. **pivot（基准）与「一步归位」**：`pivotPlace` 那一步，pivot 从末位 `hi` 一步 `swap` 到它的全局最终位置 `i`——稳定 id + `<TransitionGroup>` 让这根柱子**平移**到新槽位，并立刻转「已就位」绿。这是快排最强的动画瞬间：**每做完一次 partition，就钉死一个元素的最终位置**。

2. **「已就位」是离散集合，不是连续前后缀**：冒泡/选择的已排序区是数组的连续前缀或后缀（`sortedFrom`/`sortedUpTo` 足矣）；快排逐个钉死的最终位置**散落各处**（先钉中间、再钉两侧）。因此需要新增 `sortedIndices: number[]`（离散已就位下标集），渲染为 `sorted` 绿。

3. **显式区间栈（控制结构可视化）**：`pop`/`push` 操作一个 `(lo,hi)` 区间栈。栈轨把它画出来——每个栈帧是主轨上的一段，栈顶是「下一个要 partition 的子问题」。这是首条表达**控制结构**（而非数据）的轨，与归并 `temp`（数据副本）形成对照。

复用关系一句话：**希尔用 `groupMembers`/`dimmed` 聚焦「当前子序列」、归并复用它聚焦「当前合并段」；快排再复用它聚焦「当前分区区间 [lo,hi]」，并照归并「双轨」范式新增一条 `StackView` 表达「待处理区间栈」。**

## 要做什么

1. **快速排序算法模块**（`src/algorithms/`）
   - `quick-sort.ts`：纯算法 oracle（Lomuto + 显式栈，与 module 同栈序），返回**每次 partition 完成后的事件** `PartitionEvent[]`（`{ lo, hi, pivotIndex, array 快照 }`），正确性交叉校验用，对标 `merge-sort.ts`。
   - `quick-sort.module.ts`：插桩重走 Lomuto 显式栈快排，产出逐行粒度的胖步骤 `Step<QuickExecPoint>[]` + `quickSortModule`（每步带 `stack` 区间栈快照）。
   - `quick-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言**显式栈 Lomuto** 源码 + `lineMap`。
2. **框架的向后兼容扩展（加法为主，外壳新增一处条件渲染）**
   - `types.ts`：新增 `QuickExecPoint`（8 个执行点）；新增 `StackTrack` 接口；`Step` 增 `stack?: StackTrack` 一个**可选**字段；`StepEmphasis` 增 `pivotIndex?: number`（pivot 玫红/品红态）与 `sortedIndices?: number[]`（离散已就位）两个**可选**字段。
   - `Bar.vue`：`state` 增加 `'pivot'` 态（品红 `#c2185b`，区别于插入 key 的浅玫红 `#e07b9a`），新增 `.bar.pivot` 样式。
   - `BarsView.vue`：`stateOf` 接入 `pivotIndex`（最高优先，压过 sorted/comparing）与 `sortedIndices`（并入 sorted 判定）。优先级链扩为 `pivot > key > sorted > swapped > min > comparing > dimmed > idle`，主轨现有四算法判定**不变**。
   - **新增 `StackView.vue`**：渲染区间栈轨——每个栈帧画成对齐主轨下标的水平条（`x = lo*slotWidth`、`width = (hi-lo+1)*slotWidth`），竖直堆叠（栈顶在上）；栈顶高亮、`popped` 区间另色标记；空栈显示占位提示。内部不复用 `Bar`（栈帧是区间条而非数值柱），自绘但复用新拟物混入与 `slotWidth` 对齐主轨。
   - `AlgorithmPlayer.vue`：在主 `BarsView` 之下加 `<StackView v-if="current.stack" … />`——**仅快排这类带 `stack` 的算法渲染，前五个算法 `stack` 恒 `undefined`，不渲染、零回归**。这是唯一一处外壳改动（与归并 `AuxView v-if` 同构、并列）。
3. **可视化语义**
   - 主轨：当前区间 `[lo,hi]` 全下标进 `groupMembers` → 区外 `dimmed` 淡出；pivot 下标进 `pivotIndex` → 品红；`compare` 步 `comparing:[j, hi]` → `j` 柱标黄（与 pivot 比较）；`i` 红箭头（`colors[0]`，小于区右边界）/ `j` 蓝箭头（`colors[1]`，扫描游标）；pivot 归位后该下标进 `sortedIndices` → `sorted` 绿（离散逐个点亮）；`done` 时全部进 `sortedIndices`（整体转绿）。
   - 栈轨：`StackView` 渲染 `current.stack.frames`（栈底→栈顶）；`pop` 步把弹出区间标 `popped`（淡出/移除动画）；`push` 步新栈帧入栈（栈顶高亮）；非分区结构步栈轨随之更新。
4. **接入框架 + 首页文案对齐**
   - `QuickSort.vue`：薄壳，`<AlgorithmPlayer :module="quickSortModule" />`。
   - `src/router/index.ts`：在 `merge-sort` 之后新增 `quick-sort` 懒加载路由（`name` = slug）。
   - `src/views/Home/Main/hooks.ts`：将快速排序 desc 由「将数组**首位**作为基准数,将比他小的放在前面,比他大的放在后面,前后两个数组重复这一过程」微调为不绑定取位的措辞（如「选取一个基准数,将比它小的放在前面,比它大的放在后面,左右两部分重复这一过程」），与 Lomuto 末位 pivot 不矛盾。仅改这一句 desc 文案。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 进度推进 + 「外壳新增第二条轨 `StackView`（控制结构栈）」记录）。

## 不做什么（边界）

- **不做递归 / 递归分治树可视化**：本次固定显式区间栈迭代；递归树形象与树形布局留待未来（堆排序的二叉树可视化时再统一评估通用插槽）。
- **不做 Hoare / 三数取中 / 随机 pivot / 双轴快排 / 小区间切插入排序**：固定标准 Lomuto 末位 pivot 的单轴写法，与四语言源码、栈轨可视化一致；其余 pivot 策略与工程优化归「不做」（避免分支爆炸、保持教学清晰）。
- **不做通用「可视化插槽」框架**：只为「区间栈」加最小必要的 `StackView` + 一处条件渲染；树/图/链表的通用插槽化仍归 roadmap 后续。
- **不改冒泡 / 选择 / 插入 / 希尔 / 归并的展现与测试**：本次对五者是**零行为变化**——它们的 `Step` 不带 `stack`、不设 `pivotIndex`/`sortedIndices`、`StackView` 不渲染、`Bar` 只是多一个合法态；所有现有 Case 行为不变、不标 superseded。
- **不重构数据契约 / 外壳状态机**：`usePlayer` / `TransportControls` / `VariablePanel` / `CodePanel` / `BarsView`（除新增两字段判定）/ `AuxView` 逻辑零改动；`AlgorithmPlayer` 仅加一行条件渲染，不改交互模型。
- **不补其他排序 / 数据结构**：堆排、计数……仍归 M3 后续各自的 plan。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源（`quick.svg`）均已就位。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由，沿用现有 base / Pages / 自有域名方案。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步 `delay`、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：扩展后冒泡 / 选择 / 插入 / 希尔 / 归并侧（各 `*.module.ts` / `*.sources.ts` / `*.module.spec.ts` / `Bar.spec.ts` / `BarsView.spec.ts` / `CodePanel.spec.ts` / `AlgorithmPlayer.spec.ts` / `AuxView.spec.ts`）**零行为变化**，全部现有 Case 照常通过。`StackView` 仅在 `current.stack` 为真时渲染。
- 柱态优先级（扩展后）：`pivot > key > sorted > swapped > min > comparing > dimmed > idle`。`pivot` 与 `key` 均为「单元素强调态」，但快排不产生 `keyIndex`、插入不产生 `pivotIndex`，二者不会在同一算法同一步并存；`pivot` 置于链首以保证「正在用作基准的柱」永远显形（即便它同时落在某个 `comparing`/`groupMembers` 中）。
- **栈序约束**：partition 后**先 push 右子区间 `(p+1, hi)`、后 push 左子区间 `(lo, p-1)`**，使下次 `pop` 先取左半 → 深度优先左侧、视觉从左到右推进。单元素子区间（`lo==hi`）不入栈、直接计入 `sortedIndices`；空区间（`lo>hi`）忽略。`oracle` 与 `module` 必须用**同一栈序**，否则 partition 事件序列对不上。
- **初始数据沿用 `[7,6,5,10,9,8,4,3,2,1]`**：与插入 / 希尔 / 归并同款，便于横向对比；`n=10`。Lomuto 末位 pivot 在此数据首次划分较不平衡（首个 pivot = `a[9] = 1` 为全局最小，划分点落在最左），**正好真实展示「快排对 pivot 选择敏感、坏 pivot 退化」**，有教育价值（已在 design §3 推演完整步序）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 自动部署 GitHub Pages；自有域名 `algo.illegalscreed.cn` 需手动 `./scripts/deploy.sh`。
- 缺陷修复遵循铁律：先写能复现的失败用例，再改代码，再验证通过（适用本次实现期）。

## 验收口径

- [ ] 进快速排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮，与动画、变量面板同步；`pop / pivotSelect / compare / swap / noSwap / pivotPlace / push / done` 八个执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / 栈深 / lo / hi / pivot / i / j / a[j] / swapCount`（具体集合见 design），变化时高亮。
- [ ] **双轨可视化**：上排主数组——当前区间 `[lo,hi]` 高亮、其余 `dimmed`；pivot 品红；`i` 红 / `j` 蓝指针游走；`compare` 步 `j` 柱标黄；`pivotPlace` 步 pivot 柱 FLIP 平移到最终位置并转绿；已就位下标离散逐个变绿。下排栈轨——每个待处理区间画成对齐主轨下标的水平条，栈顶高亮，`pop`/`push` 时栈帧增删。
- [ ] **正确性**：末步主数组严格升序，且与 oracle 交叉校验一致（含逆序 / 重复 / 已序 / 单元素 / 空输入）；每次 partition 后 pivot 落点与 oracle `PartitionEvent.pivotIndex` 一致、且该位置元素 = 其全局有序数组中该下标的值（钉死最终位置）。
- [ ] **框架可复用 + 向后兼容（硬验收）**：新增算法靠「实现一个带 `stack` 的 `AlgorithmModule` + 一条路由 + 一个薄壳 + `StackView` + 纯加法 `pivot` 态 / 两个 emphasis 字段 + 一行外壳条件渲染」完成；**冒泡 / 选择 / 插入 / 希尔 / 归并的全部现有 Case 仍绿**（向后兼容的证明），且五者页面不渲染 `StackView`。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- 栈轨栈帧的高度/堆叠上限：`n=10` 时栈深最坏 `O(n)`（链式退化），但本数据实际栈深较浅。栈帧若过多是否需要滚动/压缩——暂定固定矮条 + 竖直堆叠，实现期肉眼复核 `n=10` 不溢出；超深再评估。
- `pop` 与紧随的 `pivotSelect` 是否合并为一步：暂定**分开**（`pop` 先只展示「弹出区间、栈轨移除栈顶」，`pivotSelect` 再展示「选定末位为 pivot、品红点亮」），节奏更清晰；若步数过多再评估合并。
- `noSwap` 是否逐元素出步：暂定**逐元素**出 `compare`→(`swap`|`noSwap`) 两步一拍，与冒泡节奏一致、便于行映射；若步数过多再评估。
- `push` 步是否拆成「压左 / 压右」两步：暂定**一步**展示 partition 后整栈状态（caption 说明压入了哪些子区间、哪些单元素直接就位），减少步数；实现期视观感可调。
- 栈轨「水平区间条」在明 / 暗主题下与主轨下标的对齐辨识度：暂定复用 `slotWidth=60` 同坐标系，实现期肉眼复核「栈帧 [lo,hi] 与主轨对应段左右边界对齐」。

## 变更历史

- 2026-06-23：创建。brainstorming 确认三大地基决策——① 分区策略 **Lomuto（末位 pivot）**；② 控制流 **显式区间栈迭代**（兑现归并预告的区间栈）；③ 可视化 **主轨 + 新增 `StackView` 区间栈轨**（继归并 `AuxView` 之后第二次双轨扩展，首条表达控制结构而非数据的轨）。
