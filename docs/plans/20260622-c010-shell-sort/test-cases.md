# 测试用例：希尔排序动画

> Status: verified
> Stable ID: C-20260622-010
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 100%
> Blocked by: none
> Next action: 已完成（26 Case 已登记进全局测试索引并置 active）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007、C-20260621-008
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**一批 L3/L4/L5 用例（下表 status=planned）。每个 Task 落地后把对应 Case 登记进 `docs/test-cases/{index,by-layer,by-module}.md` 并置 active，两处保持一致。

测试分层裁剪为 L3（前端单元）/ L4（前端组件）/ L5（端到端）。

**向后兼容回归（非新增、但必须验证）**：`types.ts` 加 `ShellExecPoint` + `groupMembers?`、`Bar`/`BarsView` 加 `dimmed` 态后，冒泡 / 选择 / 插入三侧全量 Case（`TC-BUBBLE-MOD-*`、`TC-SELECTION-MOD-*`、`TC-INSERTION-MOD-*`、`TC-INS-ALGO-*`、`TC-VIZ-BAR-*`、`TC-VIZ-BARSVIEW-*`、`TC-CODEPANEL-*`、`TC-VIEW-BUBBLE-*`、`TC-VIEW-SELECTION-*`、`TC-VIEW-INSERTION-*`、`TC-E2E-PLAYER-01`、`TC-E2E-SELECTION-01`、`TC-E2E-INSERTION-01`）必须保持绿——这是「纯加法、零回归」的硬验收，列入 Task 1 关卡。

## 汇总统计（计划）

| 层级 | 测试文件 | 新增 Case 数 | 运行命令         |
| ---- | -------- | ------------ | ---------------- |
| L3   | 2        | 19           | `pnpm test:unit` |
| L4   | 3        | 6            | `pnpm test:unit` |
| L5   | 1        | 1            | `pnpm test:e2e`  |
| 合计 | 6        | 26           | —                |

> L4 的 3 个文件中，`Bar.spec.ts`、`BarsView.spec.ts` 是**向现有文件追加** Case；`ShellSort.spec.ts` 为新建。

## 汇总统计（实测，2026-06-22）

| 层级 | 测试文件 | 新增 Case 数 | 通过数 | 运行命令         |
| ---- | -------- | ------------ | ------ | ---------------- |
| L3   | 2        | 19           | 19     | `pnpm test:unit` |
| L4   | 3        | 6            | 6      | `pnpm test:unit` |
| L5   | 1        | 1            | 1      | `pnpm test:e2e`  |
| 合计 | 6        | 26           | 26     | —                |

全部通过。全量回归：单测 38 文件 209 通过、e2e 6 文件全过（含冒泡/选择/插入向后兼容全绿）；覆盖率 Stmts 88.6% / Branch 89.26% / Funcs 86.02% / Lines 88.67%（均达标，业务核心 ≥85%）；lint / format / type-check 三门禁绿。

## 全量 Case 清单（计划）

### L3 — 希尔排序 oracle（`src/algorithms/shell-sort.spec.ts`，新建）

| Case ID          | 标题                                         |
| ---------------- | -------------------------------------------- |
| TC-SHELL-ALGO-01 | 空数组与单元素不产生 pass                    |
| TC-SHELL-ALGO-02 | 最终 pass 升序排列                           |
| TC-SHELL-ALGO-03 | 含重复元素结果正确且不越界                   |
| TC-SHELL-ALGO-04 | 不修改入参                                   |
| TC-SHELL-ALGO-05 | gap 序列为 ⌊n/2⌋ 减半到 1                    |
| TC-SHELL-ALGO-06 | 已升序输入：最终仍升序、gap 序列不变（幂等） |

### L3 — 希尔排序模块（`src/algorithms/shell-sort.module.spec.ts`，新建）

| Case ID         | 标题                                                  |
| --------------- | ----------------------------------------------------- |
| TC-SHELL-MOD-01 | 空/单元素也产出至少一个 done 步                       |
| TC-SHELL-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验，升序）      |
| TC-SHELL-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）          |
| TC-SHELL-MOD-04 | 不修改入参                                            |
| TC-SHELL-MOD-05 | 每步 point 合法；shift 步必带数值型 keyIndex          |
| TC-SHELL-MOD-06 | gapChange 步的 gap 依次为 ⌊n/2⌋ 减半到 1              |
| TC-SHELL-MOD-07 | 各 gap-pass 边界数组与 oracle 快照一致（核心不变量）  |
| TC-SHELL-MOD-08 | 每个 groupStart 的 groupMembers = 该 gap 下子序列下标 |
| TC-SHELL-MOD-09 | 一轮内 keyIndex 单调不增（key 只向左跳）              |
| TC-SHELL-MOD-10 | done 步标 sortedFrom=0（全部有序）                    |
| TC-SHELL-MOD-11 | 四门语言齐备                                          |
| TC-SHELL-MOD-12 | 每门语言每个 ShellExecPoint 行号落在源码物理行范围内  |
| TC-SHELL-MOD-13 | 实际出现的 point 都能在每门语言映射到行               |

### L4 — 可视化扩展（`src/components/`，向现有文件追加）

| Case ID            | 标题                                                       | 文件               |
| ------------------ | ---------------------------------------------------------- | ------------------ |
| TC-VIZ-BAR-06      | state='dimmed' 时柱体加 dimmed class                       | `Bar.spec.ts`      |
| TC-VIZ-BARSVIEW-12 | groupMembers 内的柱保持 idle、外的柱 dimmed                | `BarsView.spec.ts` |
| TC-VIZ-BARSVIEW-13 | dimmed 是最低档：组外的 key/comparing 仍取本态（不被掩盖） | `BarsView.spec.ts` |
| TC-VIZ-BARSVIEW-14 | 空 groupMembers 不淡化任何柱                               | `BarsView.spec.ts` |

### L4 — 希尔视图（`src/views/Article/SortAlgorithm/ShellSort.spec.ts`，新建）

| Case ID          | 标题                              |
| ---------------- | --------------------------------- |
| TC-VIEW-SHELL-01 | 挂载渲染 AlgorithmPlayer          |
| TC-VIEW-SHELL-02 | 初始渲染 10 根柱子且默认停第 0 步 |

### L5 — 端到端（`e2e/shell-sort.e2e.ts`，新建）

| Case ID         | 标题                                              |
| --------------- | ------------------------------------------------- |
| TC-E2E-SHELL-01 | 希尔排序播放器：默认暂停 / 单步 / 跳末升序 / 重置 |

## 不变量覆盖映射（希尔特有，便于审阅）

| 不变量 / 风险                         | 兜底 Case                             |
| ------------------------------------- | ------------------------------------- |
| 最终结果正确（升序）                  | TC-SHELL-ALGO-02、TC-SHELL-MOD-02     |
| gap 序列 = ⌊n/2⌋ 减半                 | TC-SHELL-ALGO-05、TC-SHELL-MOD-06     |
| 各 gap-pass 子序列正确（不越组）      | TC-SHELL-MOD-07                       |
| 当前组成员标注正确                    | TC-SHELL-MOD-08                       |
| key 跨 gap 单调左跳                   | TC-SHELL-MOD-09                       |
| FLIP 前提（id 集合恒定）              | TC-SHELL-MOD-03                       |
| dimmed 不掩盖活跃强调（最大语义风险） | TC-VIZ-BARSVIEW-13                    |
| 行映射不漂移                          | TC-SHELL-MOD-12、TC-SHELL-MOD-13      |
| 向后兼容（冒泡/选择/插入零回归）      | Task 1 全量回归关卡（既有 Case 全绿） |

## 全量 Case 列表（落地后）

落地后登记进 `docs/test-cases/index.md`（主索引）、`by-layer.md`（分层）、`by-module.md`（模块；新增 Case 归入 `algorithms` / `viz-engine` / `article-sort` 现有组）。
