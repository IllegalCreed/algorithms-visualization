# 测试用例：堆 Heap 知识页（大顶堆）

> Status: verified
> Stable ID: C-20260625-020
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级            | 文件                                           | 编号区间                 | 数量 |
| --------------- | ---------------------------------------------- | ------------------------ | ---- |
| L3 大顶堆逻辑   | `src/components/structures/useHeap.spec.ts`    | `TC-HEAPDS-LOGIC-01..10` | 10   |
| L4 HeapViz 互动 | `src/components/structures/HeapViz.spec.ts`    | `TC-VIZ-HEAPVIZ-01..10`  | 10   |
| L4 堆页         | `src/views/Article/DataStructure/Heap.spec.ts` | `TC-VIEW-HEAPDS-01..02`  | 2    |
| L5 e2e          | `e2e/heap.e2e.ts`                              | `TC-E2E-HEAPDS-01`       | 1    |

**合计新增 23 个 Case。命名空间 `HEAPDS`/`HEAPVIZ` 避让堆排序 `TC-HEAP-ALGO/MOD/E2E/VIEW-*`。**

**回归（不新增、必须仍绿）**：8 排序（**含堆排序 `TC-HEAP-*`**）+ 栈 + 队列 + 数组 + 链表 + 树（含骨架与各 `use*`/`*Viz`）+ 播放器 + `TreeView` 全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明零改动、零回归。

## L3 — useHeap（`TC-HEAPDS-LOGIC-*`）

| TC                 | 描述                                                       | 预期                           |
| ------------------ | ---------------------------------------------------------- | ------------------------------ |
| TC-HEAPDS-LOGIC-01 | 初始大顶堆 [90,70,80,40,60,30,50]、peek 90、边界           | 一致、isMaxHeap、can 标志      |
| TC-HEAPDS-LOGIC-02 | insert 末尾追加（不 sift）、返回新下标                     | 7、items[7]=95、8 元素         |
| TC-HEAPDS-LOGIC-03 | siftUpStep 单步上浮                                        | 7→3、items[3]=95、根→-1        |
| TC-HEAPDS-LOGIC-04 | 完整插入后仍大顶堆、root 最大                              | peek 95、isMaxHeap、8 元素     |
| TC-HEAPDS-LOGIC-05 | extractRoot 取根（最大）、末位补根                         | 90、items[0]=50、6 元素        |
| TC-HEAPDS-LOGIC-06 | 完整弹出后仍大顶堆、返回最大、新堆顶                       | 90、isMaxHeap、peek 80、6 元素 |
| TC-HEAPDS-LOGIC-07 | siftDownStep 单步下沉                                      | 0→2、items[0]=80               |
| TC-HEAPDS-LOGIC-08 | 不变量：连续插入/弹出后仍大顶堆、peek=max                  | isMaxHeap 恒真、peek=Math.max  |
| TC-HEAPDS-LOGIC-09 | 边界：满 15 insert null、空 extractRoot/peek null、id 唯一 | null/false、Set.size==len      |
| TC-HEAPDS-LOGIC-10 | reset 复位初始堆                                           | [90,70,80,40,60,30,50]         |

## L4 — HeapViz 互动（`TC-VIZ-HEAPVIZ-*`）

| TC                | 描述                                        | 预期                             |
| ----------------- | ------------------------------------------- | -------------------------------- |
| TC-VIZ-HEAPVIZ-01 | 初始 7 格 + 7 节点 + 6 边 + 输入框 + 3 按钮 | 7 cell/7 node/6 edge/input/3 btn |
| TC-VIZ-HEAPVIZ-02 | insert 双视图各 +1                          | 8 cell、8 node                   |
| TC-VIZ-HEAPVIZ-03 | insert 出现新值 95                          | cell/node 含「95」               |
| TC-VIZ-HEAPVIZ-04 | extract 双视图各 -1                         | 6 cell、6 node                   |
| TC-VIZ-HEAPVIZ-05 | extract 解说弹出 + 最大值 90                | status 含「弹出」「90」          |
| TC-VIZ-HEAPVIZ-06 | 双视图同步：格数 == 节点数                  | 初始 7=7、insert 后 8=8          |
| TC-VIZ-HEAPVIZ-07 | 边数 = 节点数 - 1                           | 初始 6、insert 后 7              |
| TC-VIZ-HEAPVIZ-08 | 非法值提示、不增                            | status 含「请输入」、7 格        |
| TC-VIZ-HEAPVIZ-09 | reset 复位 7 格                             | 7 cell                           |
| TC-VIZ-HEAPVIZ-10 | insert 解说含「上浮」                       | status 含「上浮」                |

## L4 — 堆页（`TC-VIEW-HEAPDS-*`）

| TC                | 描述                       | 预期                     |
| ----------------- | -------------------------- | ------------------------ |
| TC-VIEW-HEAPDS-01 | 挂载渲染 Article + HeapViz | 两组件存在               |
| TC-VIEW-HEAPDS-02 | 含「堆」标题与 Playground  | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-HEAPDS-01`）

| TC               | 描述                                                                                          | 预期       |
| ---------------- | --------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-HEAPDS-01 | 导航 / 正文 + Playground / 初始 7 格+7 节点 / 输入 95 插入见 8 格+8 节点含值 95 / 重置回 7 格 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useHeap` 纯逻辑（insert/siftUpStep/extractRoot/siftDownStep/peek）L3 全覆盖；HeapViz 同步分支（insert/extract/reset/非法值/双视图同步）L4 覆盖，**上浮/下沉 setTimeout 分步动画循环体由 `TC-E2E-HEAPDS-01` 真机覆盖**（故 HeapViz 单文件行 ~68%/分支 ~56%，聚合门槛达标）。

## 变更历史

- 2026-06-25：创建并落地。实际新增 23 个 Case（useHeap 10 + HeapViz 10 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.45%/90.09%/91.75%/93.24%（stmts/branch/funcs/lines，聚合均过门槛）；HeapViz 单文件偏低（动画循环 e2e 覆盖）；单测 484 passed（75 文件）+ e2e 16 passed，骨架/TreeView/堆排序零改动、8 排序 + 栈 + 队列 + 数组 + 链表 + 树零回归。
