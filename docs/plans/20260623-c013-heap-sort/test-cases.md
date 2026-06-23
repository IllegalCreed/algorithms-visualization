# 测试用例：堆排序动画

> Status: verified
> Stable ID: C-20260623-013
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级                              | 文件                                                     | 编号区间                 | 数量 |
| --------------------------------- | -------------------------------------------------------- | ------------------------ | ---- |
| L3 oracle                         | `src/algorithms/heap-sort.spec.ts`                       | `TC-HEAP-ALGO-01..07`    | 7    |
| L3 module（buildSteps + sources） | `src/algorithms/heap-sort.module.spec.ts`                | `TC-HEAP-MOD-01..15`     | 15   |
| L4 Bar 态                         | `src/components/Bar.spec.ts`（扩展）                     | `TC-VIZ-BAR-09`          | 1    |
| L4 BarsView 判定                  | `src/components/BarsView.spec.ts`（扩展）                | `TC-VIZ-BARSVIEW-18..20` | 3    |
| L4 TreeView 组件                  | `src/components/TreeView.spec.ts`（新）                  | `TC-VIZ-TREEVIEW-01..06` | 6    |
| L4 外壳条件渲染                   | `src/components/player/AlgorithmPlayer.spec.ts`（扩展）  | `TC-PLAYER-TREE-01..03`  | 3    |
| L4 视图薄壳                       | `src/views/Article/SortAlgorithm/HeapSort.spec.ts`（新） | `TC-VIEW-HEAP-01..02`    | 2    |
| L5 e2e                            | `e2e/heap-sort.e2e.ts`（新）                             | `TC-E2E-HEAP-01`         | 1    |

**回归（不新增、必须仍绿）**：冒泡 / 选择 / 插入 / 希尔 / 归并 / 快速的全部现有 Case（含 `Bar.spec` / `BarsView.spec` / `AlgorithmPlayer.spec` / `AuxView.spec` / `StackView.spec`）—— 由全门禁 `pnpm test:unit run` 证明向后兼容。

## L3 — oracle（`TC-HEAP-ALGO-*`）

| TC              | 描述                     | 预期                            |
| --------------- | ------------------------ | ------------------------------- |
| TC-HEAP-ALGO-01 | result 升序              | === 内置 sort                   |
| TC-HEAP-ALGO-02 | built 是大顶堆           | `isMaxHeap(built)`              |
| TC-HEAP-ALGO-03 | BASE 建堆后快照          | `[10,9,8,6,7,5,4,3,2,1]`        |
| TC-HEAP-ALGO-04 | 不修改入参               | 入参不变                        |
| TC-HEAP-ALGO-05 | 空 / 单元素              | result 原样                     |
| TC-HEAP-ALGO-06 | 重复 / 已序 / 逆序均升序 | === 内置 sort                   |
| TC-HEAP-ALGO-07 | isMaxHeap 识别非堆       | `[1,2,3]`→false、`[3,2,1]`→true |

## L3 — module buildSteps（`TC-HEAP-MOD-01..12`）

| TC             | 描述                                    | 预期                         |
| -------------- | --------------------------------------- | ---------------------------- |
| TC-HEAP-MOD-01 | 空 / 单元素只产 done、sortedFrom=0      | done + sortedFrom=0          |
| TC-HEAP-MOD-02 | 末步升序 = oracle result                | `[1..10]`                    |
| TC-HEAP-MOD-03 | 每步 id 集合恒等初始（FLIP）            | 一致                         |
| TC-HEAP-MOD-04 | 不修改入参                              | 入参不变                     |
| TC-HEAP-MOD-05 | point 合法；compare 带 comparing        | 一致                         |
| TC-HEAP-MOD-06 | 建堆末步 = oracle built 且大顶堆        | === built + isMaxHeap        |
| TC-HEAP-MOD-07 | extract 步 sortedFrom=heapSize 且单调减 | 一致递减                     |
| TC-HEAP-MOD-08 | extract 堆顶取出序列                    | `[10,9,8,7,6,5,4,3,2]`       |
| TC-HEAP-MOD-09 | heapify 步 heapNode=i                   | number                       |
| TC-HEAP-MOD-10 | done 步 sortedFrom=0、tree.heapSize=0   | 一致                         |
| TC-HEAP-MOD-11 | 每步带 tree 快照                        | `typeof heapSize==='number'` |
| TC-HEAP-MOD-12 | 堆用节点高亮、无指针箭头                | `pointers===[]`              |

## L3 — module sources（`TC-HEAP-MOD-13..15`）

| TC             | 描述                            | 预期                  |
| -------------- | ------------------------------- | --------------------- |
| TC-HEAP-MOD-13 | 四门语言齐备                    | {ts,python,go,rust}   |
| TC-HEAP-MOD-14 | 每门语言每个 point 行号在范围内 | 1 ≤ lineMap[p] ≤ 行数 |
| TC-HEAP-MOD-15 | 实际出现的 point 都能映射到行   | number                |

## L4 — Bar / BarsView（扩展现有 spec）

| TC                 | 描述                                    | 预期                     |
| ------------------ | --------------------------------------- | ------------------------ |
| TC-VIZ-BAR-09      | `state='heapNode'` 渲染 `.bar.heapNode` | DOM 带 heapNode 类、深紫 |
| TC-VIZ-BARSVIEW-18 | heapNode 指向的 Bar 进入 heapNode 态    | stateOf==='heapNode'     |
| TC-VIZ-BARSVIEW-19 | heapNode 让位 sorted（就位后缀优先）    | 同 index 取 sorted       |
| TC-VIZ-BARSVIEW-20 | heapNode 压过 comparing                 | 同 index 取 heapNode     |

## L4 — TreeView（`TC-VIZ-TREEVIEW-*`，新组件）

| TC                 | 描述                      | 预期                         |
| ------------------ | ------------------------- | ---------------------------- |
| TC-VIZ-TREEVIEW-01 | 渲染节点数 = array.length | `.tree-node` 数              |
| TC-VIZ-TREEVIEW-02 | 完全二叉树布局坐标        | k=0 顶层中央；k=1 左、k=2 右 |
| TC-VIZ-TREEVIEW-03 | 父子边数 = n-1            | SVG line 数                  |
| TC-VIZ-TREEVIEW-04 | heapNode / sorted 节点态  | 对应 class                   |
| TC-VIZ-TREEVIEW-05 | heapSize 区分就位         | k≥heapSize 节点 sorted       |
| TC-VIZ-TREEVIEW-06 | comparing/swapped 节点态  | comparing 黄、swapped 橙     |

## L4 — AlgorithmPlayer 条件渲染（扩展）

| TC                | 描述                               | 预期                    |
| ----------------- | ---------------------------------- | ----------------------- |
| TC-PLAYER-TREE-01 | 带 tree 的 module → 渲染 TreeView  | 存在 TreeView           |
| TC-PLAYER-TREE-02 | 不带 tree（冒泡）→ 不渲染          | 无 TreeView             |
| TC-PLAYER-TREE-03 | 带 aux 不带 tree → 不渲染 TreeView | 无 TreeView、有 AuxView |

## L4 — 视图薄壳（`TC-VIEW-HEAP-*`）

| TC              | 描述                                      | 预期                          |
| --------------- | ----------------------------------------- | ----------------------------- |
| TC-VIEW-HEAP-01 | 挂载渲染 AlgorithmPlayer + heapSortModule | 标题「堆排序」、默认停第 0 步 |
| TC-VIEW-HEAP-02 | 页面存在 TreeView 轨                      | TreeView 渲染                 |

## L5 — e2e（`TC-E2E-HEAP-01`）

| TC             | 描述                                                                          | 预期       |
| -------------- | ----------------------------------------------------------------------------- | ---------- |
| TC-E2E-HEAP-01 | 导航 / 默认暂停 / 树轨可见 / heapNode 深紫 / 拖末升序全绿 / 重置 / 四语言切换 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。新增算法模块（oracle + module + sources）纯函数/纯数据，目标行覆盖 ≥90%；TreeView 布局（多层/就位/高亮分支）全覆盖。

## 变更历史

- 2026-06-23：创建并落地。实际新增 38 个 Case（oracle 7 + module 15 + Bar 1 + BarsView 3 + TreeView 6 + Player 3 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.47%/91.53%/88.83%/92.48%。
