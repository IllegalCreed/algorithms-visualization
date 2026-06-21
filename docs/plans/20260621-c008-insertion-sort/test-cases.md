# 测试用例：插入排序动画

> Status: draft
> Stable ID: C-20260621-008
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-21
> Last reviewed: 2026-06-21
> Progress: 0%
> Blocked by: none
> Next action: 随实现逐 Task 落地后置 active，并登记进全局测试索引
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**一批 L3/L4/L5 用例（下表 status=planned）。每个 Task 落地后把对应 Case 登记进 `docs/test-cases/{index,by-layer,by-module}.md` 并置 active，两处保持一致。

测试分层裁剪为 L3（前端单元）/ L4（前端组件）/ L5（端到端）。

**向后兼容回归（非新增、但必须验证）**：`types.ts` 加 `InsertionExecPoint` + `keyIndex?`、`Bar`/`BarsView` 加 `key` 态后，冒泡侧与选择侧全量 Case（`TC-BUBBLE-MOD-*`、`TC-SELECTION-MOD-*`、`TC-VIZ-BAR-*`、`TC-VIZ-BARSVIEW-*`、`TC-CODEPANEL-*`、`TC-VIEW-BUBBLE-*`、`TC-VIEW-SELECTION-*`、`TC-E2E-PLAYER-01`、`TC-E2E-SELECTION-01`）必须保持绿——这是「纯加法、零回归」的硬验收，列入 Task 1 关卡。

## 汇总统计（计划）

| 层级 | 测试文件 | 新增 Case 数 | 运行命令         |
| ---- | -------- | ------------ | ---------------- |
| L3   | 2        | 17           | `pnpm test:unit` |
| L4   | 3        | 6            | `pnpm test:unit` |
| L5   | 1        | 1            | `pnpm test:e2e`  |
| 合计 | 6        | 24           | —                |

> L4 的 3 个文件中，`Bar.spec.ts`、`BarsView.spec.ts` 是**向现有文件追加** Case；`InsertionSort.spec.ts` 为新建。

## 全量 Case 清单（计划）

### L3 — 插入排序 oracle（`src/algorithms/insertion-sort.spec.ts`，新建）

| Case ID        | 标题                                    |
| -------------- | --------------------------------------- |
| TC-INS-ALGO-01 | 空数组与单元素不产生步骤                |
| TC-INS-ALGO-02 | 最终数组升序排列                        |
| TC-INS-ALGO-03 | 含重复元素结果正确且不越界              |
| TC-INS-ALGO-04 | 不修改入参                              |
| TC-INS-ALGO-05 | 已升序输入：每轮零移位（最佳情况 O(n)） |

### L3 — 插入排序模块（`src/algorithms/insertion-sort.module.spec.ts`，新建）

| Case ID             | 标题                                                  |
| ------------------- | ----------------------------------------------------- |
| TC-INSERTION-MOD-01 | 空/单元素也产出至少一个 done 步                       |
| TC-INSERTION-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验，升序）      |
| TC-INSERTION-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）          |
| TC-INSERTION-MOD-04 | 不修改入参                                            |
| TC-INSERTION-MOD-05 | 每步 point 合法；shift 步必带数值型 keyIndex          |
| TC-INSERTION-MOD-06 | 每个 insert 步后，`[0, i]` 前缀升序（插入核心不变量） |
| TC-INSERTION-MOD-07 | 一轮内 keyIndex 单调不增（key 只向左滑）              |
| TC-INSERTION-MOD-08 | sortedUpTo 单调不减、末步为 n                         |
| TC-INSERTION-MOD-09 | 稳定性：相等元素的原始相对顺序保持不变                |
| TC-INSERTION-MOD-10 | 四门语言齐备                                          |
| TC-INSERTION-MOD-11 | 每门语言每个 InsertionExecPoint 行号落在源码行范围内  |
| TC-INSERTION-MOD-12 | 实际出现的 point 都能在每门语言映射到行               |

### L4 — 可视化扩展（`src/components/`，向现有文件追加）

| Case ID            | 标题                                                      | 文件               |
| ------------------ | --------------------------------------------------------- | ------------------ |
| TC-VIZ-BAR-05      | state='key' 时柱体加 key class                            | `Bar.spec.ts`      |
| TC-VIZ-BARSVIEW-09 | keyIndex 指向的 Bar 进入 key 态                           | `BarsView.spec.ts` |
| TC-VIZ-BARSVIEW-10 | key 优先级压过 sorted：keyIndex 落在已排序区仍取 key      | `BarsView.spec.ts` |
| TC-VIZ-BARSVIEW-11 | 比较帧：keyIndex 那根取 key、comparing 另一根取 comparing | `BarsView.spec.ts` |

### L4 — 插入视图（`src/views/Article/SortAlgorithm/InsertionSort.spec.ts`，新建）

| Case ID              | 标题                              |
| -------------------- | --------------------------------- |
| TC-VIEW-INSERTION-01 | 挂载渲染 AlgorithmPlayer          |
| TC-VIEW-INSERTION-02 | 初始渲染 10 根柱子且默认停第 0 步 |

### L5 — 端到端（`e2e/insertion-sort.e2e.ts`，新建）

| Case ID             | 标题                                              |
| ------------------- | ------------------------------------------------- |
| TC-E2E-INSERTION-01 | 插入排序播放器：默认暂停 / 单步 / 跳末升序 / 重置 |

## 全量 Case 列表（落地后）

落地后登记进 `docs/test-cases/index.md`（主索引）、`by-layer.md`（分层）、`by-module.md`（模块；新增 Case 归入 `algorithms` / `viz-engine` / `article-sort` 现有组）。
