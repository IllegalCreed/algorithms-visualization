# 需求：选择排序动画（接入算法播放器框架，M3 首个算法）

> Status: draft
> Stable ID: C-20260620-007
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-20
> Last reviewed: 2026-06-20
> Progress: 0%
> Blocked by: none
> Next action: 用户审 spec → writing-plans
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（提供并复用「算法播放器」框架；本变更对其类型契约做向后兼容扩展）
> Related tests: 新增 `TC-SEL-ALGO-*` / `TC-SELECTION-MOD-*` / `TC-VIEW-SELECTION-*` / `TC-E2E-SELECTION-*`，并扩展 `TC-VIZ-BAR-*` / `TC-VIZ-BARSVIEW-*`；**不改写任何现有 Case**
> Related requirement: —

## 背景

M2（C-20260619-006）建起了通用「算法播放器」框架：外壳（传输控制 / 代码面板 / 变量面板 / 柱状可视化）与算法专属部分（`AlgorithmModule` = 步骤模型 + 多语言源码与行映射）解耦，冒泡排序是**唯一**接入的算法。用户对冒泡的展现形式表示满意，提出下一步做**选择排序**。

本变更是 roadmap **M3「算法补全」的首个 plan**：既补上一个算法，也是**第一次拿这套框架接入新算法**，实地验证其可复用性——「沿用冒泡展现形式」的答案，就落在「能复用多少」上。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts` 已列 `selection-sort`（标题「选择排序」、描述「每次循环找出目前数组中最小的数，放在当前数组头部」）。
- 首页网格 `src/views/Home/Main/hooks.ts` 已有选择排序条目（图标 `selection.svg` 已存在）。
- **但 `src/router/index.ts` 只注册了 `bubble-sort`，`selection-sort` 路由缺失——点击菜单/首页会 404。**

## 选择排序与冒泡的可视化本质差异

选择排序每一帧的核心是一个冒泡里**不存在**的游标——**当前已知最小值 `minIdx`**。它带来三处差异：

1. 多一个「当前最小值」角色（除 `i`、`j` 外的第三个指针 / 状态）。
2. 已排序区在**左侧** `[0, i)`（冒泡在右侧 `[sortedFrom, n)`）。
3. 执行点语义不同：选择排序有「发现更小值、更新 `minIdx`」这一步（`newMin`），冒泡没有。

## 要做什么

1. **选择排序算法模块**（`src/algorithms/`）
   - `selection-sort.ts`：纯算法 oracle（正确性交叉校验用，对标 `bubble-sort.ts`）。
   - `selection-sort.module.ts`：插桩重走标准选择排序，产出逐行粒度的胖步骤 `Step[]`。
   - `selection-sort.sources.ts`：TypeScript / Python / Go / Rust 四语言源码 + `lineMap`。
2. **框架的向后兼容扩展**（不改变冒泡任何已验收行为）
   - `types.ts`：执行点**泛型化**——`Step<P>` / `LangSource<P>` / `AlgorithmModule<P>` 带类型参数；保留 `ExecPoint`（冒泡 union）原名，冒泡显式标注 `<ExecPoint>`，新增 `SelectionExecPoint`。`StepEmphasis` 增 `minIndex?` 与 `sortedUpTo?` 两个可选字段。
   - `Bar.vue`：`state` 增加常驻态 `'min'`，新增 `.bar.min` 配色。
   - `BarsView.vue`：`stateOf` 支持 `minIndex`（→ `min` 态）与 `sortedUpTo`（→ 左侧 `sorted` 态），并定义状态优先级。
   - `CodePanel.vue`：`point` 类型由写死的 `ExecPoint` 放宽到 `string`（消费端只查 `lineMap`，行为不变）。
3. **可视化语义**（沿用冒泡观感 + 选择特有元素）
   - 三指针：`i` 红（待填位）/ `j` 蓝（扫描）/ `min` 黄（当前最小），分别取 `colors[0/1/2]`，`ArrowTrack` 零改动。
   - `minIdx` **双重编码**：黄色 `min` 雪佛龙指针 + 当前最小柱子染专属高亮色（柔紫）。
   - 比较 `a[j]` vs `a[minIdx]` 的那一帧**保留高亮**：`min` 柱紫、`j` 柱黄，两根异色。
   - 已排序区在**左侧** `[0, i)`，染 `sorted` 绿。
4. **接入框架**
   - `SelectionSort.vue`：薄壳，`<AlgorithmPlayer :module="selectionSortModule" />`。
   - `src/router/index.ts`：新增 `selection-sort` 懒加载路由（`name` = slug）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 进入进行中）。

## 不做什么（边界）

- **不改播放器外壳行为**：`usePlayer` / `TransportControls` / `AlgorithmPlayer` / `VariablePanel` 逻辑零改动，仅作为复用件。
- **不改冒泡的展现与测试**：`ExecPoint` 泛型化是**向后兼容**扩展，冒泡的代码、`lineMap`、所有现有 Case 行为不变、不标 superseded。
- **不补其他排序 / 数据结构**：插入、希尔、归并……仍归 M3 后续各自的 plan。
- **不引入新依赖**：Shiki / 四语言高亮 / 图标资源均已就位。
- **不为非线性结构做可视化插槽扩展**：外壳仍静态渲染 `BarsView`，仅覆盖「线性数组 + 指针」类；树 / 图留 M3 后续。
- **不改路由 / 部署结构**：仅新增一条懒加载文章页路由，沿用现有 base / Pages / 自有域名方案。

## 业务规则 / 约束

- 沿用 C-006 全部约束：多语言仅展示、动画唯一真相源是内置 TS 步骤流；单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，无异步 `delay`、无竞态；Shiki 随算法页懒加载；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：泛型化后冒泡侧（`bubble-sort.module.ts` / `bubble-sort.sources.ts` / `bubble-sort.module.spec.ts`）**零行为变化**，`EXEC_POINTS: ExecPoint[]` 等断言照常通过。
- 柱态优先级：`sorted > swapped > min > comparing > idle`（保证比较帧里 `min` 柱保持专属色、`j` 柱才是 comparing 黄）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

## 验收口径

- [ ] 进选择排序页默认暂停在第 0 步；播放 / 暂停 / 单步前进 / 单步后退 / 重置 / 调速 / 进度条均可用，边界正确。
- [ ] 代码视图四语言 Tab 可切换；当前执行行随步高亮，与动画、变量面板同步；`newMin` 等选择特有执行点能在四语言正确定位行。
- [ ] 变量面板随步显示 `n / i / j / minIdx / a[j] / a[minIdx] / swapCount / sortedUpTo`，变化时高亮。
- [ ] 可视化：三指针（i/j/min）；`minIdx` 双重编码（黄箭头 + 紫柱）；比较帧 `min` 柱紫 + `j` 柱黄；左侧 `[0,i)` 已排序绿；交换走 FLIP。
- [ ] **框架可复用（硬验收）**：新增算法仅靠「实现一个 `AlgorithmModule` + 加一条路由 + 一个薄壳」完成；外壳零改动；**冒泡的全部现有 Case 仍绿**（向后兼容的证明）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- `min` 柱专属色暂定柔紫 `#9d8df0`，实现期可微调（须与 idle 青绿 / comparing 黄 / swapped 橙 / sorted 绿 都拉开区分度）。
- `compare` 结果「不更小」时是否出独立帧：暂定**不出**（只在真正更新 `minIdx` 时出 `newMin` 帧，画面上对应「min 指针跳动」），实现期视观感可调。
- 初始数据暂定沿用冒泡同款 `[7,6,5,10,9,8,4,3,2,1]`，便于两个算法横向对比。

## 变更历史

- 2026-06-20：创建。brainstorming 确认三大决策——① `minIdx` 双重编码（黄箭头 + 紫柱）；② 比较帧保留 comparing 高亮（柱态 = 冒泡四态 + `min` 常驻）；③ 执行点泛型化（`AlgorithmModule<P>`，向后兼容保留 `ExecPoint`）。
