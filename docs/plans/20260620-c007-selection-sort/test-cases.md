# 测试用例：选择排序动画

> Status: verified
> Stable ID: C-20260620-007
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-20
> Last reviewed: 2026-06-20
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**一批 L3/L4/L5 用例（下表 status=planned）。每个 Task 落地后把对应 Case 登记进 `docs/test-cases/{index,by-layer,by-module}.md` 并置 active，两处保持一致。

测试分层裁剪为 L3（前端单元）/ L4（前端组件）/ L5（端到端）。

**向后兼容回归（非新增、但必须验证）**：`types.ts` 泛型化后，冒泡侧全量 Case（`TC-BUBBLE-MOD-*`、`TC-VIZ-BAR-*`、`TC-VIZ-BARSVIEW-*`、`TC-CODEPANEL-*`、`TC-VIEW-BUBBLE-*`、`TC-E2E-PLAYER-01`）必须保持绿——这是「框架可复用」的硬验收，列入推进顺序第①步关卡。

## 汇总统计（计划）

| 层级 | 测试文件 | 新增 Case 数 | 运行命令         |
| ---- | -------- | ------------ | ---------------- |
| L3   | 2        | 16           | `pnpm test:unit` |
| L4   | 3        | 6            | `pnpm test:unit` |
| L5   | 1        | 1            | `pnpm test:e2e`  |
| 合计 | 6        | 23           | —                |

> L4 的 3 个文件中，`Bar.spec.ts`、`BarsView.spec.ts` 是**向现有文件追加** Case；`SelectionSort.spec.ts` 为新建。

## 汇总统计（实测，2026-06-20）

| 层级 | 测试文件 | 新增 Case 数 | 通过数 | 运行命令         |
| ---- | -------- | ------------ | ------ | ---------------- |
| L3   | 2        | 16           | 16     | `pnpm test:unit` |
| L4   | 3        | 6            | 6      | `pnpm test:unit` |
| L5   | 1        | 1            | 1      | `pnpm test:e2e`  |
| 合计 | 6        | 23           | 23     | —                |

全部通过。全量回归：单测 31 文件 155 通过、e2e 4 文件全过（含冒泡向后兼容全绿）；lint/format/type-check 三门禁绿。

## 全量 Case 清单（计划）

### L3 — 选择排序 oracle（`src/algorithms/selection-sort.spec.ts`，新建）

| Case ID        | 标题                               |
| -------------- | ---------------------------------- |
| TC-SEL-ALGO-01 | 空数组与单元素不产生交换、结果原样 |
| TC-SEL-ALGO-02 | 最终数组升序排列                   |
| TC-SEL-ALGO-03 | 含重复元素结果正确且不越界         |
| TC-SEL-ALGO-04 | 不修改入参                         |

### L3 — 选择排序模块（`src/algorithms/selection-sort.module.spec.ts`，新建）

| Case ID             | 标题                                                               |
| ------------------- | ------------------------------------------------------------------ |
| TC-SELECTION-MOD-01 | 空/单元素也产出至少一个 done 步                                    |
| TC-SELECTION-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验，升序）                   |
| TC-SELECTION-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）                       |
| TC-SELECTION-MOD-04 | 不修改入参                                                         |
| TC-SELECTION-MOD-05 | 每步 point 合法；swap 步 swapped 为真、noSwap 步不交换             |
| TC-SELECTION-MOD-06 | newMin 步 minIndex 更新为更小值的下标                              |
| TC-SELECTION-MOD-07 | 每轮内层结束时 minIdx 为 `[i, n)` 区间最小值下标（选择核心不变量） |
| TC-SELECTION-MOD-08 | sortedUpTo 单调不减、末步为 n                                      |
| TC-SELECTION-MOD-09 | 交换次数 ≤ n−1                                                     |
| TC-SELECTION-MOD-10 | 四门语言齐备                                                       |
| TC-SELECTION-MOD-11 | 每门语言每个 SelectionExecPoint 行号落在源码行范围内               |
| TC-SELECTION-MOD-12 | 实际出现的 point 都能在每门语言映射到行                            |

### L4 — 可视化扩展（`src/components/`，向现有文件追加）

| Case ID            | 标题                                                  | 文件               |
| ------------------ | ----------------------------------------------------- | ------------------ |
| TC-VIZ-BAR-04      | state='min' 时柱体加 min class                        | `Bar.spec.ts`      |
| TC-VIZ-BARSVIEW-06 | minIndex 指向的 Bar 进入 min 态                       | `BarsView.spec.ts` |
| TC-VIZ-BARSVIEW-07 | sortedUpTo 左侧的 Bar 进入 sorted 态                  | `BarsView.spec.ts` |
| TC-VIZ-BARSVIEW-08 | 比较帧优先级：minIndex 那根取 min、另一根取 comparing | `BarsView.spec.ts` |

### L4 — 选择视图（`src/views/Article/SortAlgorithm/SelectionSort.spec.ts`，新建）

| Case ID              | 标题                              |
| -------------------- | --------------------------------- |
| TC-VIEW-SELECTION-01 | 挂载渲染 AlgorithmPlayer          |
| TC-VIEW-SELECTION-02 | 初始渲染 10 根柱子且默认停第 0 步 |

### L5 — 端到端（`e2e/selection-sort.e2e.ts`，新建）

| Case ID             | 标题                                              |
| ------------------- | ------------------------------------------------- |
| TC-E2E-SELECTION-01 | 选择排序播放器：默认暂停 / 单步 / 跳末升序 / 重置 |

## 全量 Case 列表（落地后）

落地后登记进 `docs/test-cases/index.md`（主索引）、`by-layer.md`（分层）、`by-module.md`（模块；新增 Case 归入 `algorithms` / `viz-engine` / `article-sort` 现有组）。
